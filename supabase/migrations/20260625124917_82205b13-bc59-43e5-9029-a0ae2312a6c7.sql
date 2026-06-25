
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

-- Repoint all policies
DROP POLICY IF EXISTS "Non-anonymous donations viewable by authenticated" ON public.donations;
CREATE POLICY "Non-anonymous donations viewable by authenticated"
ON public.donations FOR SELECT TO authenticated
USING (
  (is_anonymous = false) OR (donor_id = auth.uid())
  OR private.has_role(auth.uid(), 'admin'::public.app_role)
  OR EXISTS (
    SELECT 1 FROM public.needs n
    JOIN public.institutions i ON i.id = n.institution_id
    WHERE n.id = donations.need_id AND i.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Verified institutions viewable by authenticated" ON public.institutions;
CREATE POLICY "Verified institutions viewable by authenticated"
ON public.institutions FOR SELECT TO authenticated
USING (
  (verification = 'verified'::public.verification_status)
  OR (owner_id = auth.uid())
  OR private.has_role(auth.uid(), 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Admins can delete institutions" ON public.institutions;
CREATE POLICY "Admins can delete institutions"
ON public.institutions FOR DELETE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Owners and admins can update institutions" ON public.institutions;
CREATE POLICY "Owners and admins can update institutions"
ON public.institutions FOR UPDATE TO authenticated
USING ((owner_id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Active needs viewable by authenticated" ON public.needs;
CREATE POLICY "Active needs viewable by authenticated"
ON public.needs FOR SELECT TO authenticated
USING (
  (status = ANY (ARRAY['active'::public.need_status, 'fulfilled'::public.need_status]))
  OR private.has_role(auth.uid(), 'admin'::public.app_role)
  OR EXISTS (
    SELECT 1 FROM public.institutions i
    WHERE i.id = needs.institution_id AND i.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Institution owners can manage needs" ON public.needs;
CREATE POLICY "Institution owners can manage needs"
ON public.needs FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.institutions i
  WHERE i.id = needs.institution_id
    AND ((i.owner_id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::public.app_role))
));

DROP POLICY IF EXISTS "Admins can read private profiles" ON public.profiles_private;
CREATE POLICY "Admins can read private profiles"
ON public.profiles_private FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- Now safe to drop the public-schema function
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
