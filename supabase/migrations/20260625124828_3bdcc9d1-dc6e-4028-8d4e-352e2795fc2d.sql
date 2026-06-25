
-- Restrict public-read policies to authenticated only
DROP POLICY IF EXISTS "Non-anonymous donations viewable by all" ON public.donations;
CREATE POLICY "Non-anonymous donations viewable by authenticated"
ON public.donations FOR SELECT TO authenticated
USING (
  (is_anonymous = false)
  OR (donor_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM needs n
    JOIN institutions i ON i.id = n.institution_id
    WHERE n.id = donations.need_id AND i.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Verified institutions viewable by all" ON public.institutions;
CREATE POLICY "Verified institutions viewable by authenticated"
ON public.institutions FOR SELECT TO authenticated
USING (
  (verification = 'verified'::verification_status)
  OR (owner_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Active needs viewable by all" ON public.needs;
CREATE POLICY "Active needs viewable by authenticated"
ON public.needs FOR SELECT TO authenticated
USING (
  (status = ANY (ARRAY['active'::need_status, 'fulfilled'::need_status]))
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM institutions i
    WHERE i.id = needs.institution_id AND i.owner_id = auth.uid()
  )
);

REVOKE SELECT ON public.donations FROM anon;
REVOKE SELECT ON public.institutions FROM anon;
REVOKE SELECT ON public.needs FROM anon;

-- Lock down SECURITY DEFINER trigger functions; keep has_role callable by authenticated (required by RLS policies)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bump_need_raised() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
