
-- Restrict SECURITY DEFINER function to service_role only; not called from client
REVOKE EXECUTE ON FUNCTION public.get_donation_message(uuid) FROM PUBLIC, anon, authenticated;

-- Restrict user_badges reads to the owning user (admins already have separate access via role)
DROP POLICY IF EXISTS "User badges viewable by authenticated" ON public.user_badges;
CREATE POLICY "Users can view their own badges"
  ON public.user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
