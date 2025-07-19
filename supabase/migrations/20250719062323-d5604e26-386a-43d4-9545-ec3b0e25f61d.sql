
-- Create enum types for hostel amenities and status
CREATE TYPE public.hostel_amenity AS ENUM (
  'wifi', 'ac', 'parking', 'kitchen', 'laundry', 'security', 'gym', 'study_room', 'common_area', 'backup_power'
);

CREATE TYPE public.hostel_status AS ENUM (
  'pending', 'active', 'reported', 'suspended', 'verified'
);

CREATE TYPE public.contact_method AS ENUM (
  'whatsapp', 'phone', 'in_app'
);

-- Create hostels table
CREATE TABLE public.hostels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  location_address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price_min INTEGER NOT NULL, -- Price in kobo (¢)
  price_max INTEGER NOT NULL, -- Price in kobo (¢)
  total_rooms INTEGER NOT NULL DEFAULT 0,
  available_rooms INTEGER NOT NULL DEFAULT 0,
  amenities hostel_amenity[] DEFAULT '{}',
  status hostel_status DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT FALSE,
  contact_whatsapp TEXT,
  contact_phone TEXT,
  preferred_contact contact_method DEFAULT 'whatsapp',
  payment_verified BOOLEAN DEFAULT FALSE,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create hostel media table for photos and videos
CREATE TABLE public.hostel_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create hostel reports table
CREATE TABLE public.hostel_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  reporter_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create hostel payments table to track posting fees
CREATE TABLE public.hostel_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Amount in kobo (¢2 = 200 kobo)
  currency TEXT DEFAULT 'GHS',
  stripe_session_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for hostels table
CREATE POLICY "Anyone can view active hostels" ON public.hostels
  FOR SELECT USING (status = 'active' OR status = 'verified');

CREATE POLICY "Users can view their own hostels" ON public.hostels
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create hostels" ON public.hostels
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hostels" ON public.hostels
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hostels" ON public.hostels
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for hostel_media table
CREATE POLICY "Anyone can view media for active hostels" ON public.hostel_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.hostels 
      WHERE hostels.id = hostel_media.hostel_id 
      AND (hostels.status = 'active' OR hostels.status = 'verified')
    )
  );

CREATE POLICY "Users can manage their hostel media" ON public.hostel_media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.hostels 
      WHERE hostels.id = hostel_media.hostel_id 
      AND hostels.user_id = auth.uid()
    )
  );

-- RLS policies for hostel_reports table
CREATE POLICY "Users can create reports" ON public.hostel_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_user_id);

CREATE POLICY "Users can view their own reports" ON public.hostel_reports
  FOR SELECT USING (auth.uid() = reporter_user_id);

-- RLS policies for hostel_payments table
CREATE POLICY "Users can view their own payments" ON public.hostel_payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments" ON public.hostel_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_hostels_location ON public.hostels (latitude, longitude);
CREATE INDEX idx_hostels_price ON public.hostels (price_min, price_max);
CREATE INDEX idx_hostels_status ON public.hostels (status);
CREATE INDEX idx_hostels_amenities ON public.hostels USING GIN (amenities);
CREATE INDEX idx_hostel_media_hostel_id ON public.hostel_media (hostel_id);

-- Add storage bucket for hostel images and videos
INSERT INTO storage.buckets (id, name, public) VALUES ('hostel-media', 'hostel-media', true);

-- Create storage policies for hostel media bucket
CREATE POLICY "Anyone can view hostel media" ON storage.objects
  FOR SELECT USING (bucket_id = 'hostel-media');

CREATE POLICY "Authenticated users can upload hostel media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'hostel-media' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own hostel media" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'hostel-media' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own hostel media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'hostel-media' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
