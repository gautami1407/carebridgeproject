
-- 1) Revoke EXECUTE on trigger-only SECURITY DEFINER functions from public/anon/authenticated
REVOKE EXECUTE ON FUNCTION public.award_badge(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.on_application_award_badges() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.on_donation_award_badges() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.on_institution_verified_award_badge() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.on_impact_report_award_badge() FROM PUBLIC, anon, authenticated;

-- 2) Restrict donation.message column to hide from authenticated/anon reads.
REVOKE SELECT (message) ON public.donations FROM authenticated;
REVOKE SELECT (message) ON public.donations FROM anon;

-- Provide a secure accessor for donor / institution owner / admin to fetch a message
CREATE OR REPLACE FUNCTION public.get_donation_message(_donation_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_msg text;
  v_donor uuid;
  v_owner uuid;
BEGIN
  SELECT d.message, d.donor_id, i.owner_id
    INTO v_msg, v_donor, v_owner
  FROM public.donations d
  JOIN public.needs n ON n.id = d.need_id
  JOIN public.institutions i ON i.id = n.institution_id
  WHERE d.id = _donation_id;

  IF v_donor = auth.uid()
     OR v_owner = auth.uid()
     OR private.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN v_msg;
  END IF;
  RETURN NULL;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.get_donation_message(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_donation_message(uuid) TO authenticated;

-- 3) Fix institution-docs storage policies: use objects.name, not institutions.name
DROP POLICY IF EXISTS inst_docs_owner_select ON storage.objects;
DROP POLICY IF EXISTS inst_docs_owner_insert ON storage.objects;
DROP POLICY IF EXISTS inst_docs_owner_delete ON storage.objects;

CREATE POLICY inst_docs_owner_select ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'institution-docs'
  AND (
    private.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.institutions i
      WHERE i.id::text = (storage.foldername(storage.objects.name))[1]
        AND i.owner_id = auth.uid()
    )
  )
);

CREATE POLICY inst_docs_owner_insert ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'institution-docs'
  AND EXISTS (
    SELECT 1 FROM public.institutions i
    WHERE i.id::text = (storage.foldername(storage.objects.name))[1]
      AND i.owner_id = auth.uid()
  )
);

CREATE POLICY inst_docs_owner_delete ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'institution-docs'
  AND (
    private.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.institutions i
      WHERE i.id::text = (storage.foldername(storage.objects.name))[1]
        AND i.owner_id = auth.uid()
    )
  )
);

-- 4) Restrict user_badges reads to authenticated users (was public)
DROP POLICY IF EXISTS "User badges are public" ON public.user_badges;
CREATE POLICY "User badges viewable by authenticated" ON public.user_badges
FOR SELECT TO authenticated
USING (true);
REVOKE SELECT ON public.user_badges FROM anon;
