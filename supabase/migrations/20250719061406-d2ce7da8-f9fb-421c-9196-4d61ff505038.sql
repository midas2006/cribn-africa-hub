
-- Create notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  pdf_url TEXT,
  course_name TEXT NOT NULL,
  department TEXT NOT NULL,
  semester TEXT NOT NULL,
  topic TEXT NOT NULL,
  caption TEXT,
  likes_count INTEGER DEFAULT 0,
  points_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create note_likes table for tracking user likes
CREATE TABLE public.note_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(note_id, user_id)
);

-- Create note_points table for tracking user points given
CREATE TABLE public.note_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  points INTEGER NOT NULL CHECK (points > 0 AND points <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(note_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_points ENABLE ROW LEVEL SECURITY;

-- RLS policies for notes table
CREATE POLICY "Anyone can view notes" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Users can create their own notes" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes" ON public.notes FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for note_likes table
CREATE POLICY "Anyone can view note likes" ON public.note_likes FOR SELECT USING (true);
CREATE POLICY "Users can like notes" ON public.note_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own likes" ON public.note_likes FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for note_points table
CREATE POLICY "Anyone can view note points" ON public.note_points FOR SELECT USING (true);
CREATE POLICY "Users can give points to notes" ON public.note_points FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own point ratings" ON public.note_points FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can remove their own point ratings" ON public.note_points FOR DELETE USING (auth.uid() = user_id);

-- Create functions to update counters
CREATE OR REPLACE FUNCTION public.update_note_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.notes SET likes_count = likes_count + 1 WHERE id = NEW.note_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.notes SET likes_count = likes_count - 1 WHERE id = OLD.note_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_note_points_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.notes SET points_count = (
      SELECT COALESCE(SUM(points), 0) FROM public.note_points WHERE note_id = NEW.note_id
    ) WHERE id = NEW.note_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.notes SET points_count = (
      SELECT COALESCE(SUM(points), 0) FROM public.note_points WHERE note_id = NEW.note_id
    ) WHERE id = NEW.note_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.notes SET points_count = (
      SELECT COALESCE(SUM(points), 0) FROM public.note_points WHERE note_id = OLD.note_id
    ) WHERE id = OLD.note_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_note_likes_count
  AFTER INSERT OR DELETE ON public.note_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_note_likes_count();

CREATE TRIGGER trigger_update_note_points_count
  AFTER INSERT OR UPDATE OR DELETE ON public.note_points
  FOR EACH ROW EXECUTE FUNCTION public.update_note_points_count();

-- Create storage bucket for note images and PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('notes', 'notes', true);

-- Storage policies
CREATE POLICY "Anyone can view note files" ON storage.objects FOR SELECT USING (bucket_id = 'notes');
CREATE POLICY "Users can upload note files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own note files" ON storage.objects FOR UPDATE USING (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own note files" ON storage.objects FOR DELETE USING (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);
