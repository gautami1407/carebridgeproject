
-- 1) donations: forbid NULL donor_id bypass
DELETE FROM public.donations WHERE donor_id IS NULL;
ALTER TABLE public.donations ALTER COLUMN donor_id SET NOT NULL;
ALTER TABLE public.donations DROP CONSTRAINT donations_donor_id_fkey;
ALTER TABLE public.donations ADD CONSTRAINT donations_donor_id_fkey
  FOREIGN KEY (donor_id) REFERENCES auth.users(id) ON DELETE CASCADE;
DROP POLICY IF EXISTS "Authenticated users can donate" ON public.donations;
CREATE POLICY "Authenticated users can donate" ON public.donations
  FOR INSERT TO authenticated
  WITH CHECK (donor_id = auth.uid());

-- 2) profiles.phone: stop exposing PII to anonymous visitors
-- Move phone to a private table only the owner (and admins) can read.
CREATE TABLE IF NOT EXISTS public.profiles_private (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles_private TO authenticated;
GRANT ALL ON public.profiles_private TO service_role;
ALTER TABLE public.profiles_private ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner can read own private profile" ON public.profiles_private
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Owner can upsert own private profile" ON public.profiles_private
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Owner can update own private profile" ON public.profiles_private
  FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can read private profiles" ON public.profiles_private
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.profiles_private (id, phone)
SELECT id, phone FROM public.profiles WHERE phone IS NOT NULL
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.profiles DROP COLUMN phone;

-- Tighten public read of profiles to authenticated only (still no PII columns left)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- 3) Lock down SECURITY DEFINER functions: revoke EXECUTE from public/anon
REVOKE ALL ON FUNCTION public.bump_need_raised() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
-- has_role is used inside RLS policies; authenticated must be able to execute it
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
