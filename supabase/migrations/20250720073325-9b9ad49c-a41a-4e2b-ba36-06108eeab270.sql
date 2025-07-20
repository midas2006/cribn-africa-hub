
-- Create enum for event status
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');

-- Create enum for organizer verification status  
CREATE TYPE organizer_status AS ENUM ('pending', 'verified', 'rejected');

-- Create table for event organizers
CREATE TABLE public.event_organizers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  verification_status organizer_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Create table for events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES public.event_organizers(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  venue TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  dress_code TEXT,
  ticket_price INTEGER NOT NULL, -- price in cents
  max_capacity INTEGER,
  flyer_url TEXT,
  video_url TEXT,
  status event_status DEFAULT 'draft',
  commission_rate DECIMAL(3,2) DEFAULT 0.05, -- 5% commission
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create table for event tickets
CREATE TABLE public.event_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticket_code TEXT UNIQUE NOT NULL,
  purchase_price INTEGER NOT NULL, -- price paid in cents
  stripe_payment_intent_id TEXT,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create table for event payments (to track commission)
CREATE TABLE public.event_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.event_tickets(id) ON DELETE CASCADE NOT NULL,
  organizer_id UUID REFERENCES public.event_organizers(id) ON DELETE CASCADE NOT NULL,
  gross_amount INTEGER NOT NULL, -- total ticket price in cents
  commission_amount INTEGER NOT NULL, -- commission taken in cents
  net_amount INTEGER NOT NULL, -- amount to organizer in cents
  stripe_session_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.event_organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event_organizers
CREATE POLICY "Users can view their own organizer profile" ON public.event_organizers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create organizer profile" ON public.event_organizers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own organizer profile" ON public.event_organizers
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for events
CREATE POLICY "Anyone can view published events" ON public.events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Organizers can view their own events" ON public.events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.event_organizers 
      WHERE id = events.organizer_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Verified organizers can create events" ON public.events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.event_organizers 
      WHERE id = organizer_id AND user_id = auth.uid() AND verification_status = 'verified'
    )  
  );

CREATE POLICY "Organizers can update their own events" ON public.events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.event_organizers 
      WHERE id = events.organizer_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can delete their own events" ON public.events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.event_organizers 
      WHERE id = events.organizer_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for event_tickets
CREATE POLICY "Users can view their own tickets" ON public.event_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Organizers can view tickets for their events" ON public.event_tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events e
      JOIN public.event_organizers o ON e.organizer_id = o.id
      WHERE e.id = event_tickets.event_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can purchase tickets" ON public.event_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Organizers can update ticket status" ON public.event_tickets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.events e
      JOIN public.event_organizers o ON e.organizer_id = o.id
      WHERE e.id = event_tickets.event_id AND o.user_id = auth.uid()
    )
  );

-- RLS Policies for event_payments
CREATE POLICY "Organizers can view their payments" ON public.event_payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.event_organizers 
      WHERE id = event_payments.organizer_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "System can create payments" ON public.event_payments
  FOR INSERT WITH CHECK (true);

-- Function to generate unique ticket codes
CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'TIX-' || UPPER(substring(gen_random_uuid()::text from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Storage bucket for event media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-media', 'event-media', true);

-- Storage policies for event media
CREATE POLICY "Anyone can view event media" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-media');

CREATE POLICY "Authenticated users can upload event media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'event-media' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own event media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'event-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own event media" ON storage.objects
  FOR DELETE USING (bucket_id = 'event-media' AND auth.uid()::text = (storage.foldername(name))[1]);
