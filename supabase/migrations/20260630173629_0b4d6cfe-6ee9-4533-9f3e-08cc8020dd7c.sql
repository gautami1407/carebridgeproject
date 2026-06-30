
-- 1. beneficiaries_count on needs (nullable; UI defaults to 0)
ALTER TABLE public.needs ADD COLUMN IF NOT EXISTS beneficiaries_count integer;

-- 2. donation_certificates
CREATE TABLE IF NOT EXISTS public.donation_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id uuid NOT NULL UNIQUE REFERENCES public.donations(id) ON DELETE CASCADE,
  certificate_no text NOT NULL UNIQUE,
  issued_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.donation_certificates TO authenticated;
GRANT ALL ON public.donation_certificates TO service_role;

ALTER TABLE public.donation_certificates ENABLE ROW LEVEL SECURITY;

-- Donor sees their own; institution owner sees certificates for donations to their needs; admins see all.
CREATE POLICY "Donor reads own certificate"
  ON public.donation_certificates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.donations d
      WHERE d.id = donation_certificates.donation_id AND d.donor_id = auth.uid()
    )
  );

CREATE POLICY "Institution owner reads incoming certificates"
  ON public.donation_certificates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.donations d
      JOIN public.needs n ON n.id = d.need_id
      JOIN public.institutions i ON i.id = n.institution_id
      WHERE d.id = donation_certificates.donation_id AND i.owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins read all certificates"
  ON public.donation_certificates FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

-- Trigger: auto-issue certificate on donation insert
CREATE OR REPLACE FUNCTION public.issue_donation_certificate()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_no text;
BEGIN
  v_no := 'CB-' || to_char(now(), 'YYYY') || '-' || upper(substring(replace(NEW.id::text, '-', '') from 1 for 10));
  INSERT INTO public.donation_certificates(donation_id, certificate_no)
  VALUES (NEW.id, v_no)
  ON CONFLICT (donation_id) DO NOTHING;
  RETURN NEW;
END; $$;

REVOKE EXECUTE ON FUNCTION public.issue_donation_certificate() FROM PUBLIC, authenticated, anon;

DROP TRIGGER IF EXISTS trg_issue_donation_certificate ON public.donations;
CREATE TRIGGER trg_issue_donation_certificate
  AFTER INSERT ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.issue_donation_certificate();

-- Backfill existing donations
INSERT INTO public.donation_certificates(donation_id, certificate_no)
SELECT d.id, 'CB-' || to_char(d.created_at, 'YYYY') || '-' || upper(substring(replace(d.id::text, '-', '') from 1 for 10))
FROM public.donations d
LEFT JOIN public.donation_certificates c ON c.donation_id = d.id
WHERE c.id IS NULL
ON CONFLICT DO NOTHING;
