DO $$ BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.volunteer_applications; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.event_registrations; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.volunteer_opportunities; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;
ALTER TABLE public.volunteer_applications REPLICA IDENTITY FULL;
ALTER TABLE public.event_registrations REPLICA IDENTITY FULL;
ALTER TABLE public.volunteer_opportunities REPLICA IDENTITY FULL;