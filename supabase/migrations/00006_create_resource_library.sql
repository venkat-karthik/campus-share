-- Resource Library Schema

CREATE TYPE public.resource_type AS ENUM ('notes', 'paper', 'video', 'book', 'tutorial', 'other');
CREATE TYPE public.resource_status AS ENUM ('pending', 'approved', 'rejected');

-- Resources table
CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type public.resource_type NOT NULL,
  subject text NOT NULL,
  semester text,
  branch text,
  tags text[],
  file_url text NOT NULL,
  file_size bigint, -- in bytes
  file_type text, -- mime type
  thumbnail_url text,
  uploaded_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.resource_status DEFAULT 'pending',
  approved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at timestamptz,
  downloads_count int DEFAULT 0,
  views_count int DEFAULT 0,
  rating numeric(3,2) DEFAULT 0,
  rating_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resource reviews
CREATE TABLE public.resource_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_helpful boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(resource_id, user_id)
);

-- Resource downloads tracking
CREATE TABLE public.resource_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  downloaded_at timestamptz DEFAULT now()
);

-- Resource bookmarks
CREATE TABLE public.resource_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(resource_id, user_id)
);

-- Indexes
CREATE INDEX idx_resources_type ON public.resources(type);
CREATE INDEX idx_resources_subject ON public.resources(subject);
CREATE INDEX idx_resources_semester ON public.resources(semester);
CREATE INDEX idx_resources_branch ON public.resources(branch);
CREATE INDEX idx_resources_status ON public.resources(status);
CREATE INDEX idx_resources_uploaded_by ON public.resources(uploaded_by);
CREATE INDEX idx_resources_created_at ON public.resources(created_at DESC);
CREATE INDEX idx_resources_rating ON public.resources(rating DESC);
CREATE INDEX idx_resources_downloads ON public.resources(downloads_count DESC);
CREATE INDEX idx_resources_tags ON public.resources USING gin(tags);
CREATE INDEX idx_resource_reviews_resource ON public.resource_reviews(resource_id);
CREATE INDEX idx_resource_downloads_resource ON public.resource_downloads(resource_id);
CREATE INDEX idx_resource_downloads_user ON public.resource_downloads(user_id);
CREATE INDEX idx_resource_bookmarks_user ON public.resource_bookmarks(user_id);

-- Function to update resource rating
CREATE OR REPLACE FUNCTION update_resource_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.resources
  SET 
    rating = (
      SELECT AVG(rating)::numeric(3,2)
      FROM public.resource_reviews
      WHERE resource_id = NEW.resource_id
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM public.resource_reviews
      WHERE resource_id = NEW.resource_id
    )
  WHERE id = NEW.resource_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to increment downloads
CREATE OR REPLACE FUNCTION increment_resource_downloads()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.resources
  SET downloads_count = downloads_count + 1
  WHERE id = NEW.resource_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_resource_rating_trigger
AFTER INSERT OR UPDATE ON public.resource_reviews
FOR EACH ROW
EXECUTE FUNCTION update_resource_rating();

CREATE TRIGGER increment_resource_downloads_trigger
AFTER INSERT ON public.resource_downloads
FOR EACH ROW
EXECUTE FUNCTION increment_resource_downloads();
