
-- Badge catalog
CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'award',
  tier text NOT NULL DEFAULT 'bronze',
  category text NOT NULL DEFAULT 'general',
  criteria jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.badges TO anon, authenticated;
GRANT ALL ON public.badges TO service_role;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are public" ON public.badges FOR SELECT USING (true);

-- Earned badges
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  meta jsonb DEFAULT '{}'::jsonb,
  UNIQUE (user_id, badge_id)
);
GRANT SELECT ON public.user_badges TO anon, authenticated;
GRANT ALL ON public.user_badges TO service_role;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User badges are public" ON public.user_badges FOR SELECT USING (true);

-- Helper: award a badge idempotently
CREATE OR REPLACE FUNCTION public.award_badge(_user_id uuid, _code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_badge_id uuid;
BEGIN
  SELECT id INTO v_badge_id FROM public.badges WHERE code = _code;
  IF v_badge_id IS NULL OR _user_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.user_badges(user_id, badge_id)
  VALUES (_user_id, v_badge_id)
  ON CONFLICT (user_id, badge_id) DO NOTHING;
END; $$;

-- Trigger: award donor badges after each donation
CREATE OR REPLACE FUNCTION public.on_donation_award_badges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count int;
  v_total numeric;
BEGIN
  SELECT count(*), COALESCE(sum(amount),0) INTO v_count, v_total
  FROM public.donations WHERE donor_id = NEW.donor_id;

  PERFORM public.award_badge(NEW.donor_id, 'first_donation');
  IF v_count >= 5 THEN PERFORM public.award_badge(NEW.donor_id, 'generous_giver'); END IF;
  IF v_count >= 20 THEN PERFORM public.award_badge(NEW.donor_id, 'champion'); END IF;
  IF v_total >= 10000 THEN PERFORM public.award_badge(NEW.donor_id, 'gold_supporter'); END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_donation_award_badges
AFTER INSERT ON public.donations
FOR EACH ROW EXECUTE FUNCTION public.on_donation_award_badges();

-- Trigger: volunteer application badges
CREATE OR REPLACE FUNCTION public.on_application_award_badges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count int;
BEGIN
  SELECT count(*) INTO v_count FROM public.volunteer_applications WHERE user_id = NEW.user_id;
  PERFORM public.award_badge(NEW.user_id, 'first_application');
  IF v_count >= 5 THEN PERFORM public.award_badge(NEW.user_id, 'volunteer_hero'); END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_application_award_badges
AFTER INSERT ON public.volunteer_applications
FOR EACH ROW EXECUTE FUNCTION public.on_application_award_badges();

-- Trigger: institution verified badge for owner
CREATE OR REPLACE FUNCTION public.on_institution_verified_award_badge()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.verification IS DISTINCT FROM OLD.verification AND NEW.verification = 'verified' AND NEW.owner_id IS NOT NULL THEN
    PERFORM public.award_badge(NEW.owner_id, 'verified_institution');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_institution_verified_award_badge
AFTER UPDATE ON public.institutions
FOR EACH ROW EXECUTE FUNCTION public.on_institution_verified_award_badge();

-- Trigger: impact report published badge
CREATE OR REPLACE FUNCTION public.on_impact_report_award_badge()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner uuid;
BEGIN
  SELECT owner_id INTO v_owner FROM public.institutions WHERE id = NEW.institution_id;
  IF v_owner IS NOT NULL THEN
    PERFORM public.award_badge(v_owner, 'impact_reporter');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_impact_report_award_badge
AFTER INSERT ON public.impact_reports
FOR EACH ROW EXECUTE FUNCTION public.on_impact_report_award_badge();

-- Seed catalog
INSERT INTO public.badges (code, name, description, icon, tier, category) VALUES
  ('first_donation', 'First Steps', 'Made your very first donation on CareBridge.', 'heart', 'bronze', 'donor'),
  ('generous_giver', 'Generous Giver', 'Completed 5 donations to causes you care about.', 'gift', 'silver', 'donor'),
  ('champion', 'Impact Champion', 'Made 20+ donations — a true CareBridge champion.', 'trophy', 'gold', 'donor'),
  ('gold_supporter', 'Gold Supporter', 'Contributed ₹10,000 or more in total.', 'star', 'gold', 'donor'),
  ('first_application', 'Willing Hands', 'Applied to your first volunteer opportunity.', 'hand-heart', 'bronze', 'volunteer'),
  ('volunteer_hero', 'Volunteer Hero', 'Applied to 5+ volunteer opportunities.', 'shield-check', 'silver', 'volunteer'),
  ('verified_institution', 'Verified Institution', 'Institution passed CareBridge verification.', 'badge-check', 'gold', 'institution'),
  ('impact_reporter', 'Impact Reporter', 'Published your first impact report.', 'file-text', 'silver', 'institution')
ON CONFLICT (code) DO NOTHING;
