-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  -- Insert a profile synced with fields collected at signup
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user confirmation
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Public profiles view
CREATE VIEW public_profiles AS
  SELECT id, full_name, role FROM profiles;

-- Shared items policies
ALTER TABLE public.shared_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shared items" ON shared_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create their own items" ON shared_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items" ON shared_items
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items" ON shared_items
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Announcements policies
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view announcements" ON announcements
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can create announcements" ON announcements
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update announcements" ON announcements
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete announcements" ON announcements
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Attendance records policies
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own attendance" ON attendance_records
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attendance" ON attendance_records
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attendance" ON attendance_records
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own attendance" ON attendance_records
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Lost and found policies
ALTER TABLE public.lost_found_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lost and found items" ON lost_found_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create lost and found items" ON lost_found_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lost and found items" ON lost_found_items
  FOR UPDATE TO authenticated USING (auth.uid() = user_id OR auth.uid() = claimed_by);

CREATE POLICY "Users can delete their own lost and found items" ON lost_found_items
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Clubs policies
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view clubs" ON clubs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can create clubs" ON clubs
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update clubs" ON clubs
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete clubs" ON clubs
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Club events policies
ALTER TABLE public.club_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view club events" ON club_events
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can create club events" ON club_events
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update club events" ON club_events
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete club events" ON club_events
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Event registrations policies
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view event registrations" ON event_registrations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can register for events" ON event_registrations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own registrations" ON event_registrations
  FOR DELETE TO authenticated USING (auth.uid() = user_id);