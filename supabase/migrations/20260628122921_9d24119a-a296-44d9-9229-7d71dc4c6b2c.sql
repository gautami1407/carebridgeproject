
-- =========================================================
-- PHASE 3 MIGRATION: events, volunteering, notifications, activity, impact, feed, saves + storage policies
-- =========================================================

-- ENUMS
CREATE TYPE public.event_kind AS ENUM ('health_camp','education','birthday','festival','volunteer_drive','fundraiser','other');
CREATE TYPE public.registration_status AS ENUM ('registered','waitlisted','cancelled','attended');
CREATE TYPE public.opportunity_category AS ENUM ('teaching','healthcare','mentorship','event_support','technology','fundraising','other');
CREATE TYPE public.application_status AS ENUM ('pending','accepted','rejected','completed','withdrawn');
CREATE TYPE public.notification_type AS ENUM ('donation_received','need_completed','application_accepted','application_rejected','new_need_nearby','event_reminder','institution_verified','generic');
CREATE TYPE public.activity_type AS ENUM ('donation_made','donation_received','application_submitted','application_decided','event_registered','need_created','need_completed','institution_verified','profile_updated');
CREATE TYPE public.entity_kind AS ENUM ('need','institution','event','opportunity','application','donation','impact_report','post');
CREATE TYPE public.feed_kind AS ENUM ('success_story','need_update','event_update','volunteer_story','milestone');
CREATE TYPE public.saved_kind AS ENUM ('need','institution','event','opportunity');

-- =========================================================
-- EVENTS
-- =========================================================
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  kind public.event_kind NOT NULL DEFAULT 'other',
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  location text,
  capacity integer,
  banner_url text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT SELECT ON public.events TO anon;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_public_read" ON public.events FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "events_owner_all" ON public.events FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.institutions i WHERE i.id = institution_id AND i.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.institutions i WHERE i.id = institution_id AND i.owner_id = auth.uid()));
CREATE POLICY "events_admin_all" ON public.events FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE TRIGGER events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- EVENT REGISTRATIONS
CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.registration_status NOT NULL DEFAULT 'registered',
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_registrations TO authenticated;
GRANT ALL ON public.event_registrations TO service_role;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "evt_reg_self_select" ON public.event_registrations FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "evt_reg_self_write" ON public.event_registrations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "evt_reg_self_update" ON public.event_registrations FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "evt_reg_self_delete" ON public.event_registrations FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "evt_reg_owner_select" ON public.event_registrations FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.events e JOIN public.institutions i ON i.id = e.institution_id WHERE e.id = event_id AND i.owner_id = auth.uid())
);
CREATE POLICY "evt_reg_admin_all" ON public.event_registrations FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

-- =========================================================
-- VOLUNTEER OPPORTUNITIES + APPLICATIONS
-- =========================================================
CREATE TABLE public.volunteer_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category public.opportunity_category NOT NULL DEFAULT 'other',
  skills text[] NOT NULL DEFAULT '{}',
  location text,
  starts_at timestamptz,
  ends_at timestamptz,
  slots integer,
  is_open boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.volunteer_opportunities TO authenticated;
GRANT SELECT ON public.volunteer_opportunities TO anon;
GRANT ALL ON public.volunteer_opportunities TO service_role;
ALTER TABLE public.volunteer_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "opp_public_read" ON public.volunteer_opportunities FOR SELECT TO anon, authenticated USING (is_open = true);
CREATE POLICY "opp_owner_all" ON public.volunteer_opportunities FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.institutions i WHERE i.id = institution_id AND i.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.institutions i WHERE i.id = institution_id AND i.owner_id = auth.uid()));
CREATE POLICY "opp_admin_all" ON public.volunteer_opportunities FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE TRIGGER opp_updated_at BEFORE UPDATE ON public.volunteer_opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.volunteer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.volunteer_opportunities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.application_status NOT NULL DEFAULT 'pending',
  message text,
  hours_logged numeric(6,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (opportunity_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.volunteer_applications TO authenticated;
GRANT ALL ON public.volunteer_applications TO service_role;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_self_select" ON public.volunteer_applications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "app_self_insert" ON public.volunteer_applications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "app_self_update_withdraw" ON public.volunteer_applications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "app_owner_select" ON public.volunteer_applications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.volunteer_opportunities o JOIN public.institutions i ON i.id = o.institution_id WHERE o.id = opportunity_id AND i.owner_id = auth.uid())
);
CREATE POLICY "app_owner_update" ON public.volunteer_applications FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.volunteer_opportunities o JOIN public.institutions i ON i.id = o.institution_id WHERE o.id = opportunity_id AND i.owner_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.volunteer_opportunities o JOIN public.institutions i ON i.id = o.institution_id WHERE o.id = opportunity_id AND i.owner_id = auth.uid())
);
CREATE POLICY "app_admin_all" ON public.volunteer_applications FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE TRIGGER app_updated_at BEFORE UPDATE ON public.volunteer_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- NOTIFICATIONS
-- =========================================================
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL DEFAULT 'generic',
  title text NOT NULL,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_self_select" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notif_self_update" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notif_self_delete" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notif_admin_all" ON public.notifications FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE INDEX notifications_user_unread_idx ON public.notifications (user_id, read_at);

-- =========================================================
-- ACTIVITY LOG
-- =========================================================
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.activity_type NOT NULL,
  entity_type public.entity_kind,
  entity_id uuid,
  summary text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "act_self_select" ON public.activity_log FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "act_admin_select" ON public.activity_log FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'));
CREATE INDEX activity_log_user_idx ON public.activity_log (user_id, created_at DESC);

-- =========================================================
-- IMPACT REPORTS
-- =========================================================
CREATE TABLE public.impact_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id uuid REFERENCES public.needs(id) ON DELETE SET NULL,
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text,
  beneficiaries integer,
  photos text[] NOT NULL DEFAULT '{}',
  outcomes text,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impact_reports TO authenticated;
GRANT SELECT ON public.impact_reports TO anon;
GRANT ALL ON public.impact_reports TO service_role;
ALTER TABLE public.impact_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ir_public_read" ON public.impact_reports FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "ir_owner_all" ON public.impact_reports FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.institutions i WHERE i.id = institution_id AND i.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.institutions i WHERE i.id = institution_id AND i.owner_id = auth.uid()));
CREATE POLICY "ir_admin_all" ON public.impact_reports FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE TRIGGER ir_updated_at BEFORE UPDATE ON public.impact_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- FEED POSTS
-- =========================================================
CREATE TABLE public.feed_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id uuid REFERENCES public.institutions(id) ON DELETE SET NULL,
  kind public.feed_kind NOT NULL DEFAULT 'success_story',
  body text NOT NULL,
  media text[] NOT NULL DEFAULT '{}',
  related_entity public.entity_kind,
  related_id uuid,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.feed_posts TO authenticated;
GRANT SELECT ON public.feed_posts TO anon;
GRANT ALL ON public.feed_posts TO service_role;
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feed_public_read" ON public.feed_posts FOR SELECT TO anon, authenticated USING (is_public = true);
CREATE POLICY "feed_author_all" ON public.feed_posts FOR ALL TO authenticated USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
CREATE POLICY "feed_admin_all" ON public.feed_posts FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE INDEX feed_posts_created_idx ON public.feed_posts (created_at DESC);

-- =========================================================
-- SAVED ITEMS
-- =========================================================
CREATE TABLE public.saved_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type public.saved_kind NOT NULL,
  entity_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, entity_type, entity_id)
);
GRANT SELECT, INSERT, DELETE ON public.saved_items TO authenticated;
GRANT ALL ON public.saved_items TO service_role;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saved_self_all" ON public.saved_items FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- =========================================================
-- INSTITUTION VERIFICATION DOCS (private bucket pointer table)
-- =========================================================
CREATE TABLE public.institution_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  label text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.institution_documents TO authenticated;
GRANT ALL ON public.institution_documents TO service_role;
ALTER TABLE public.institution_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "instdoc_owner_all" ON public.institution_documents FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.institutions i WHERE i.id = institution_id AND i.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.institutions i WHERE i.id = institution_id AND i.owner_id = auth.uid()));
CREATE POLICY "instdoc_admin_all" ON public.institution_documents FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

-- =========================================================
-- TRIGGER FUNCTIONS: notifications + activity on side-effects
-- =========================================================

-- on donation insert -> notify institution owner, log activity for donor & owner, bump need
CREATE OR REPLACE FUNCTION public.on_donation_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner uuid;
  v_need_title text;
  v_inst_id uuid;
BEGIN
  SELECT n.title, i.owner_id, i.id INTO v_need_title, v_owner, v_inst_id
  FROM public.needs n JOIN public.institutions i ON i.id = n.institution_id
  WHERE n.id = NEW.need_id;

  -- notify institution owner
  IF v_owner IS NOT NULL THEN
    INSERT INTO public.notifications(user_id, type, title, body, link)
    VALUES (v_owner, 'donation_received', 'New donation received',
            'A donation of ₹' || NEW.amount::text || ' was made to "' || v_need_title || '"',
            '/app/institution/donations');
    INSERT INTO public.activity_log(user_id, type, entity_type, entity_id, summary)
    VALUES (v_owner, 'donation_received', 'donation', NEW.id,
            'Received ₹' || NEW.amount::text || ' for ' || v_need_title);
  END IF;

  -- activity for donor
  INSERT INTO public.activity_log(user_id, type, entity_type, entity_id, summary)
  VALUES (NEW.donor_id, 'donation_made', 'donation', NEW.id,
          'Donated ₹' || NEW.amount::text || ' to ' || v_need_title);
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.on_donation_created() FROM PUBLIC, authenticated, anon;
CREATE TRIGGER trg_on_donation_created AFTER INSERT ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.on_donation_created();

-- on volunteer_application status change -> notify applicant
CREATE OR REPLACE FUNCTION public.on_application_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_title text;
BEGIN
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;
  SELECT title INTO v_title FROM public.volunteer_opportunities WHERE id = NEW.opportunity_id;
  IF NEW.status = 'accepted' THEN
    INSERT INTO public.notifications(user_id, type, title, body, link)
    VALUES (NEW.user_id, 'application_accepted', 'Application accepted',
            'Your application for "' || v_title || '" was accepted.',
            '/app/volunteer/applications');
  ELSIF NEW.status = 'rejected' THEN
    INSERT INTO public.notifications(user_id, type, title, body, link)
    VALUES (NEW.user_id, 'application_rejected', 'Application update',
            'Your application for "' || v_title || '" was not accepted this time.',
            '/app/volunteer/applications');
  END IF;
  INSERT INTO public.activity_log(user_id, type, entity_type, entity_id, summary)
  VALUES (NEW.user_id, 'application_decided', 'application', NEW.id,
          'Application for ' || v_title || ' marked ' || NEW.status::text);
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.on_application_status_change() FROM PUBLIC, authenticated, anon;
CREATE TRIGGER trg_on_application_status_change AFTER UPDATE ON public.volunteer_applications
  FOR EACH ROW EXECUTE FUNCTION public.on_application_status_change();

-- on application insert -> notify institution owner
CREATE OR REPLACE FUNCTION public.on_application_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner uuid;
  v_title text;
BEGIN
  SELECT o.title, i.owner_id INTO v_title, v_owner
  FROM public.volunteer_opportunities o JOIN public.institutions i ON i.id = o.institution_id
  WHERE o.id = NEW.opportunity_id;
  IF v_owner IS NOT NULL THEN
    INSERT INTO public.notifications(user_id, type, title, body, link)
    VALUES (v_owner, 'generic', 'New volunteer application',
            'A new application was submitted for "' || v_title || '"',
            '/app/institution/volunteers');
  END IF;
  INSERT INTO public.activity_log(user_id, type, entity_type, entity_id, summary)
  VALUES (NEW.user_id, 'application_submitted', 'application', NEW.id,
          'Applied to ' || v_title);
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.on_application_created() FROM PUBLIC, authenticated, anon;
CREATE TRIGGER trg_on_application_created AFTER INSERT ON public.volunteer_applications
  FOR EACH ROW EXECUTE FUNCTION public.on_application_created();

-- need status -> activity & notifications when completed
CREATE OR REPLACE FUNCTION public.on_need_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner uuid;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status = 'fulfilled' THEN
    SELECT owner_id INTO v_owner FROM public.institutions WHERE id = NEW.institution_id;
    IF v_owner IS NOT NULL THEN
      INSERT INTO public.activity_log(user_id, type, entity_type, entity_id, summary)
      VALUES (v_owner, 'need_completed', 'need', NEW.id, 'Need completed: ' || NEW.title);
    END IF;
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.on_need_status_change() FROM PUBLIC, authenticated, anon;
CREATE TRIGGER trg_on_need_status_change AFTER UPDATE ON public.needs
  FOR EACH ROW EXECUTE FUNCTION public.on_need_status_change();

-- institution verification change -> notify owner
CREATE OR REPLACE FUNCTION public.on_institution_verification_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.verification IS DISTINCT FROM OLD.verification AND NEW.verification = 'verified' THEN
    INSERT INTO public.notifications(user_id, type, title, body, link)
    VALUES (NEW.owner_id, 'institution_verified', 'Institution verified',
            NEW.name || ' has been verified.', '/app/institution');
    INSERT INTO public.activity_log(user_id, type, entity_type, entity_id, summary)
    VALUES (NEW.owner_id, 'institution_verified', 'institution', NEW.id, NEW.name || ' verified');
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.on_institution_verification_change() FROM PUBLIC, authenticated, anon;
CREATE TRIGGER trg_on_institution_verification_change AFTER UPDATE ON public.institutions
  FOR EACH ROW EXECUTE FUNCTION public.on_institution_verification_change();

-- =========================================================
-- STORAGE BUCKET POLICIES (buckets created via tool separately)
-- public-media: anyone reads; authenticated uploads to their own {auth.uid()}/ prefix
-- institution-docs: only institution owner & admins
-- =========================================================
CREATE POLICY "public_media_read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'public-media');

CREATE POLICY "public_media_insert_own"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'public-media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "public_media_update_own"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'public-media' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'public-media' AND owner = auth.uid());

CREATE POLICY "public_media_delete_own"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'public-media' AND owner = auth.uid());

CREATE POLICY "inst_docs_owner_select"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'institution-docs'
    AND (
      private.has_role(auth.uid(),'admin')
      OR EXISTS (
        SELECT 1 FROM public.institutions i
        WHERE i.id::text = (storage.foldername(name))[1] AND i.owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "inst_docs_owner_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'institution-docs'
    AND EXISTS (
      SELECT 1 FROM public.institutions i
      WHERE i.id::text = (storage.foldername(name))[1] AND i.owner_id = auth.uid()
    )
  );

CREATE POLICY "inst_docs_owner_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'institution-docs'
    AND (
      private.has_role(auth.uid(),'admin')
      OR EXISTS (
        SELECT 1 FROM public.institutions i
        WHERE i.id::text = (storage.foldername(name))[1] AND i.owner_id = auth.uid()
      )
    )
  );
