-- Placement Portal Schema

CREATE TYPE public.job_type AS ENUM ('full_time', 'internship', 'part_time');
CREATE TYPE public.application_status AS ENUM ('applied', 'shortlisted', 'interview_scheduled', 'rejected', 'selected', 'offer_accepted', 'offer_declined');

-- Companies table
CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  website text,
  logo text,
  industry text,
  size text, -- '1-10', '11-50', '51-200', '201-500', '500+'
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Job postings table
CREATE TABLE public.job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  requirements text,
  responsibilities text,
  job_type public.job_type NOT NULL,
  ctc_min numeric(10,2),
  ctc_max numeric(10,2),
  location text,
  work_mode text, -- 'remote', 'hybrid', 'onsite'
  eligible_branches text[],
  eligible_semesters text[],
  min_cgpa numeric(3,2),
  skills_required text[],
  deadline timestamptz,
  visit_date timestamptz,
  is_active boolean DEFAULT true,
  applications_count int DEFAULT 0,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Applications table
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resume_url text NOT NULL,
  cover_letter text,
  status public.application_status DEFAULT 'applied',
  notes text, -- Admin notes
  interview_date timestamptz,
  interview_location text,
  interview_mode text, -- 'online', 'offline'
  feedback text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, user_id)
);

-- Student profiles (extended)
CREATE TABLE public.student_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  roll_number text UNIQUE,
  branch text,
  semester text,
  cgpa numeric(3,2),
  resume_url text,
  skills text[],
  certifications text[],
  projects jsonb, -- [{title, description, link, technologies}]
  experience jsonb, -- [{company, role, duration, description}]
  achievements text[],
  linkedin_url text,
  github_url text,
  portfolio_url text,
  is_placement_ready boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Placement statistics
CREATE TABLE public.placement_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  academic_year text NOT NULL,
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  job_title text NOT NULL,
  ctc numeric(10,2),
  job_type public.job_type NOT NULL,
  placed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, academic_year)
);

-- Interview experiences
CREATE TABLE public.interview_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  job_title text NOT NULL,
  interview_date date NOT NULL,
  rounds jsonb, -- [{round_name, description, questions, tips}]
  difficulty text, -- 'easy', 'medium', 'hard'
  result text, -- 'selected', 'rejected', 'pending'
  tips text,
  is_anonymous boolean DEFAULT false,
  helpful_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_companies_name ON public.companies(name);
CREATE INDEX idx_job_postings_company ON public.job_postings(company_id);
CREATE INDEX idx_job_postings_type ON public.job_postings(job_type);
CREATE INDEX idx_job_postings_active ON public.job_postings(is_active);
CREATE INDEX idx_job_postings_deadline ON public.job_postings(deadline);
CREATE INDEX idx_job_postings_created_at ON public.job_postings(created_at DESC);
CREATE INDEX idx_applications_job ON public.applications(job_id);
CREATE INDEX idx_applications_user ON public.applications(user_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_student_profiles_user ON public.student_profiles(user_id);
CREATE INDEX idx_student_profiles_branch ON public.student_profiles(branch);
CREATE INDEX idx_student_profiles_semester ON public.student_profiles(semester);
CREATE INDEX idx_placement_stats_user ON public.placement_stats(user_id);
CREATE INDEX idx_placement_stats_year ON public.placement_stats(academic_year);
CREATE INDEX idx_interview_experiences_company ON public.interview_experiences(company_id);

-- Function to increment applications count
CREATE OR REPLACE FUNCTION increment_applications_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.job_postings
  SET applications_count = applications_count + 1
  WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement applications count
CREATE OR REPLACE FUNCTION decrement_applications_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.job_postings
  SET applications_count = applications_count - 1
  WHERE id = OLD.job_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER increment_applications_count_trigger
AFTER INSERT ON public.applications
FOR EACH ROW
EXECUTE FUNCTION increment_applications_count();

CREATE TRIGGER decrement_applications_count_trigger
AFTER DELETE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION decrement_applications_count();
