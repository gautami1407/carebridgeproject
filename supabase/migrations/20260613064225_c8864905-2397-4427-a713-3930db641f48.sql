
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('donor', 'volunteer', 'mentor', 'institution_admin', 'admin');
CREATE TYPE public.need_category AS ENUM ('food', 'education', 'medical', 'shelter', 'clothing', 'other');
CREATE TYPE public.need_urgency AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.need_status AS ENUM ('draft', 'active', 'fulfilled', 'closed');
CREATE TYPE public.institution_type AS ENUM ('orphanage', 'old_age_home', 'shelter', 'other');
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Shared updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-create profile + default donor role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'), NEW.raw_user_meta_data->>'avatar_url');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'donor') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- institutions
CREATE TABLE public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  mission TEXT,
  description TEXT,
  type public.institution_type NOT NULL DEFAULT 'other',
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  cover_image TEXT,
  residents_count INT DEFAULT 0,
  verification public.verification_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.institutions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.institutions TO authenticated;
GRANT ALL ON public.institutions TO service_role;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Verified institutions viewable by all" ON public.institutions FOR SELECT USING (verification = 'verified' OR owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners can create institutions" ON public.institutions FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners and admins can update institutions" ON public.institutions FOR UPDATE TO authenticated USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete institutions" ON public.institutions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_institutions_updated BEFORE UPDATE ON public.institutions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- needs
CREATE TABLE public.needs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category public.need_category NOT NULL DEFAULT 'other',
  urgency public.need_urgency NOT NULL DEFAULT 'medium',
  status public.need_status NOT NULL DEFAULT 'active',
  goal_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  raised_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  beneficiaries INT DEFAULT 0,
  deadline DATE,
  cover_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.needs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.needs TO authenticated;
GRANT ALL ON public.needs TO service_role;
ALTER TABLE public.needs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active needs viewable by all" ON public.needs FOR SELECT USING (
  status IN ('active','fulfilled') OR public.has_role(auth.uid(), 'admin')
  OR EXISTS (SELECT 1 FROM public.institutions i WHERE i.id = institution_id AND i.owner_id = auth.uid())
);
CREATE POLICY "Institution owners can manage needs" ON public.needs FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.institutions i WHERE i.id = institution_id AND (i.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.institutions i WHERE i.id = institution_id AND (i.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE TRIGGER trg_needs_updated BEFORE UPDATE ON public.needs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_needs_institution ON public.needs(institution_id);
CREATE INDEX idx_needs_status ON public.needs(status);

-- donations
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL REFERENCES public.needs(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  message TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.donations TO anon, authenticated;
GRANT INSERT, UPDATE ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Non-anonymous donations viewable by all" ON public.donations FOR SELECT USING (
  is_anonymous = false OR donor_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
  OR EXISTS (SELECT 1 FROM public.needs n JOIN public.institutions i ON i.id = n.institution_id WHERE n.id = need_id AND i.owner_id = auth.uid())
);
CREATE POLICY "Authenticated users can donate" ON public.donations FOR INSERT TO authenticated WITH CHECK (donor_id = auth.uid() OR donor_id IS NULL);
CREATE INDEX idx_donations_need ON public.donations(need_id);
CREATE INDEX idx_donations_donor ON public.donations(donor_id);

-- Trigger to bump need.raised_amount on donation
CREATE OR REPLACE FUNCTION public.bump_need_raised()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.needs SET raised_amount = raised_amount + NEW.amount WHERE id = NEW.need_id;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_donation_bumps_need AFTER INSERT ON public.donations FOR EACH ROW EXECUTE FUNCTION public.bump_need_raised();
