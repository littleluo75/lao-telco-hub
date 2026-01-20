-- =============================================
-- SECURITY FIX: Implement Authentication & Role-Based Access Control
-- =============================================

-- 1. Create app_role enum for role types
CREATE TYPE public.app_role AS ENUM ('admin', 'director', 'reviewer', 'staff');

-- 2. Create user_roles table (separate from profiles to prevent privilege escalation)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'staff',
  department VARCHAR(100),
  enterprise_id UUID REFERENCES enterprises(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user has any of the specified roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles app_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = ANY(_roles)
  )
$$;

-- Create function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- =============================================
-- 4. DROP ALL PUBLIC POLICIES
-- =============================================

-- Applications
DROP POLICY IF EXISTS "Allow public delete applications" ON applications;
DROP POLICY IF EXISTS "Allow public insert applications" ON applications;
DROP POLICY IF EXISTS "Allow public read applications" ON applications;
DROP POLICY IF EXISTS "Allow public update applications" ON applications;

-- Compliance Violations
DROP POLICY IF EXISTS "Allow public delete compliance_violations" ON compliance_violations;
DROP POLICY IF EXISTS "Allow public insert compliance_violations" ON compliance_violations;
DROP POLICY IF EXISTS "Allow public read compliance_violations" ON compliance_violations;
DROP POLICY IF EXISTS "Allow public update compliance_violations" ON compliance_violations;

-- Enterprise Types
DROP POLICY IF EXISTS "Allow public delete enterprise_types" ON enterprise_types;
DROP POLICY IF EXISTS "Allow public insert enterprise_types" ON enterprise_types;
DROP POLICY IF EXISTS "Allow public read enterprise_types" ON enterprise_types;
DROP POLICY IF EXISTS "Allow public update enterprise_types" ON enterprise_types;

-- Enterprises
DROP POLICY IF EXISTS "Allow public delete enterprises" ON enterprises;
DROP POLICY IF EXISTS "Allow public insert enterprises" ON enterprises;
DROP POLICY IF EXISTS "Allow public read enterprises" ON enterprises;
DROP POLICY IF EXISTS "Allow public update enterprises" ON enterprises;

-- License Types
DROP POLICY IF EXISTS "Allow public delete license_types" ON license_types;
DROP POLICY IF EXISTS "Allow public insert license_types" ON license_types;
DROP POLICY IF EXISTS "Allow public read license_types" ON license_types;
DROP POLICY IF EXISTS "Allow public update license_types" ON license_types;

-- Licenses
DROP POLICY IF EXISTS "Allow public delete licenses" ON licenses;
DROP POLICY IF EXISTS "Allow public insert licenses" ON licenses;
DROP POLICY IF EXISTS "Allow public read licenses" ON licenses;
DROP POLICY IF EXISTS "Allow public update licenses" ON licenses;

-- Number Ranges
DROP POLICY IF EXISTS "Allow public delete number_ranges" ON number_ranges;
DROP POLICY IF EXISTS "Allow public insert number_ranges" ON number_ranges;
DROP POLICY IF EXISTS "Allow public read number_ranges" ON number_ranges;
DROP POLICY IF EXISTS "Allow public update number_ranges" ON number_ranges;

-- Resource Types
DROP POLICY IF EXISTS "Allow public delete resource_types" ON resource_types;
DROP POLICY IF EXISTS "Allow public insert resource_types" ON resource_types;
DROP POLICY IF EXISTS "Allow public read resource_types" ON resource_types;
DROP POLICY IF EXISTS "Allow public update resource_types" ON resource_types;

-- Service Types
DROP POLICY IF EXISTS "Allow public delete service_types" ON service_types;
DROP POLICY IF EXISTS "Allow public insert service_types" ON service_types;
DROP POLICY IF EXISTS "Allow public read service_types" ON service_types;
DROP POLICY IF EXISTS "Allow public update service_types" ON service_types;

-- Subscribers
DROP POLICY IF EXISTS "Allow public delete subscribers" ON subscribers;
DROP POLICY IF EXISTS "Allow public insert subscribers" ON subscribers;
DROP POLICY IF EXISTS "Allow public read subscribers" ON subscribers;
DROP POLICY IF EXISTS "Allow public update subscribers" ON subscribers;

-- System Logs
DROP POLICY IF EXISTS "Allow public delete system_logs" ON system_logs;
DROP POLICY IF EXISTS "Allow public insert system_logs" ON system_logs;
DROP POLICY IF EXISTS "Allow public read system_logs" ON system_logs;
DROP POLICY IF EXISTS "Allow public update system_logs" ON system_logs;

-- =============================================
-- 5. CREATE AUTHENTICATED RLS POLICIES
-- =============================================

-- User Roles table policies
CREATE POLICY "Users can read own role"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all roles"
  ON user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Applications - Authenticated users can read, admins/directors/reviewers can write
CREATE POLICY "Authenticated users can read applications"
  ON applications FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Reviewers and above can update applications"
  ON applications FOR UPDATE
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'director', 'reviewer']::app_role[]));

CREATE POLICY "Admins can delete applications"
  ON applications FOR DELETE
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'director']::app_role[]));

-- Enterprises - All authenticated can read, admins can write
CREATE POLICY "Authenticated users can read enterprises"
  ON enterprises FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage enterprises"
  ON enterprises FOR INSERT
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin', 'director']::app_role[]));

CREATE POLICY "Admins can update enterprises"
  ON enterprises FOR UPDATE
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'director']::app_role[]));

CREATE POLICY "Admins can delete enterprises"
  ON enterprises FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Enterprise Types - Reference data, read-only for most
CREATE POLICY "Authenticated users can read enterprise_types"
  ON enterprise_types FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage enterprise_types"
  ON enterprise_types FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Licenses - Authenticated can read, admins/directors can write
CREATE POLICY "Authenticated users can read licenses"
  ON licenses FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Directors can create licenses"
  ON licenses FOR INSERT
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin', 'director']::app_role[]));

CREATE POLICY "Directors can update licenses"
  ON licenses FOR UPDATE
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'director']::app_role[]));

CREATE POLICY "Admins can delete licenses"
  ON licenses FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- License Types - Reference data
CREATE POLICY "Authenticated users can read license_types"
  ON license_types FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage license_types"
  ON license_types FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Number Ranges - Authenticated can read, admins/directors can write
CREATE POLICY "Authenticated users can read number_ranges"
  ON number_ranges FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Directors can manage number_ranges"
  ON number_ranges FOR INSERT
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin', 'director']::app_role[]));

CREATE POLICY "Directors can update number_ranges"
  ON number_ranges FOR UPDATE
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'director']::app_role[]));

CREATE POLICY "Admins can delete number_ranges"
  ON number_ranges FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Subscribers - Authenticated can read, admins/directors can write
CREATE POLICY "Authenticated users can read subscribers"
  ON subscribers FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can create subscribers"
  ON subscribers FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Reviewers can update subscribers"
  ON subscribers FOR UPDATE
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'director', 'reviewer']::app_role[]));

CREATE POLICY "Admins can delete subscribers"
  ON subscribers FOR DELETE
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'director']::app_role[]));

-- Compliance Violations - Authenticated can read, reviewers+ can manage
CREATE POLICY "Authenticated users can read compliance_violations"
  ON compliance_violations FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Reviewers can create violations"
  ON compliance_violations FOR INSERT
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin', 'director', 'reviewer']::app_role[]));

CREATE POLICY "Reviewers can update violations"
  ON compliance_violations FOR UPDATE
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'director', 'reviewer']::app_role[]));

CREATE POLICY "Admins can delete violations"
  ON compliance_violations FOR DELETE
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'director']::app_role[]));

-- Resource Types - Reference data
CREATE POLICY "Authenticated users can read resource_types"
  ON resource_types FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage resource_types"
  ON resource_types FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Service Types - Reference data
CREATE POLICY "Authenticated users can read service_types"
  ON service_types FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage service_types"
  ON service_types FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- System Logs - Admin only read, application can insert (immutable)
CREATE POLICY "Admins can read system_logs"
  ON system_logs FOR SELECT
  USING (public.has_any_role(auth.uid(), ARRAY['admin', 'director']::app_role[]));

CREATE POLICY "Authenticated users can insert logs"
  ON system_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- No UPDATE or DELETE policies for system_logs (immutable audit trail)

-- =============================================
-- 6. Create profiles table for user display info
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 7. Create trigger to auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  -- Default new users to 'staff' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'staff');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 8. Update timestamp trigger
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();