-- Create enums
CREATE TYPE public.user_role AS ENUM ('user', 'admin');
CREATE TYPE public.item_category AS ENUM ('books', 'laptops', 'aprons', 'others');
CREATE TYPE public.announcement_category AS ENUM ('exam', 'holiday', 'placement', 'emergency');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent');
CREATE TYPE public.lost_found_status AS ENUM ('found', 'returned');
CREATE TYPE public.club_category AS ENUM ('tech', 'sports', 'cultural', 'other');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text NOT NULL,
  role public.user_role NOT NULL DEFAULT 'user'::public.user_role,
  created_at timestamptz DEFAULT now()
);

-- Create shared_items table
CREATE TABLE public.shared_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  zone text NOT NULL,
  category public.item_category NOT NULL,
  name text NOT NULL,
  subject text,
  brand text,
  specs text,
  size text,
  color text,
  description text,
  location text,
  availability_date timestamptz,
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create announcements table
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category public.announcement_category NOT NULL,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create attendance_records table
CREATE TABLE public.attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  date date NOT NULL,
  status public.attendance_status NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, subject, date)
);

-- Create lost_found_items table
CREATE TABLE public.lost_found_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  location_found text NOT NULL,
  images text[] DEFAULT '{}',
  status public.lost_found_status NOT NULL DEFAULT 'found'::public.lost_found_status,
  claimed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create clubs table
CREATE TABLE public.clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category public.club_category NOT NULL,
  image text,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create club_events table
CREATE TABLE public.club_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  event_date timestamptz NOT NULL,
  location text NOT NULL,
  max_participants integer,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create event_registrations table
CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.club_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create indexes
CREATE INDEX idx_shared_items_user_id ON public.shared_items(user_id);
CREATE INDEX idx_shared_items_zone ON public.shared_items(zone);
CREATE INDEX idx_shared_items_category ON public.shared_items(category);
CREATE INDEX idx_announcements_category ON public.announcements(category);
CREATE INDEX idx_attendance_records_user_id ON public.attendance_records(user_id);
CREATE INDEX idx_lost_found_items_status ON public.lost_found_items(status);
CREATE INDEX idx_clubs_category ON public.clubs(category);
CREATE INDEX idx_club_events_club_id ON public.club_events(club_id);
CREATE INDEX idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON public.event_registrations(user_id);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('app-8yy119savwg1_campus_images', 'app-8yy119savwg1_campus_images', true);

-- Storage policies for images
CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT USING (bucket_id = 'app-8yy119savwg1_campus_images');
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'app-8yy119savwg1_campus_images');
CREATE POLICY "Users can update their own images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'app-8yy119savwg1_campus_images');
CREATE POLICY "Users can delete their own images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'app-8yy119savwg1_campus_images');