
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  image_url?: string;
  pdf_url?: string;
  course_name: string;
  department: string;
  semester: string;
  topic: string;
  caption?: string;
  likes_count: number;
  points_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteData {
  title: string;
  content?: string;
  course_name: string;
  department: string;
  semester: string;
  topic: string;
  caption?: string;
  image_url?: string;
  pdf_url?: string;
}

export const useNotes = (searchTerm?: string, department?: string, course?: string) => {
  return useQuery({
    queryKey: ['notes', searchTerm, department, course],
    queryFn: async () => {
      let query = supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,topic.ilike.%${searchTerm}%`);
      }

      if (department) {
        query = query.eq('department', department);
      }

      if (course) {
        query = query.eq('course_name', course);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Note[];
    },
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (noteData: CreateNoteData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notes')
        .insert({
          ...noteData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: "Note created successfully!",
        description: "Your note has been shared with the community.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating note",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useLikeNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ noteId, isLiked }: { noteId: string; isLiked: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (isLiked) {
        const { error } = await supabase
          .from('note_likes')
          .delete()
          .eq('note_id', noteId)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('note_likes')
          .insert({
            note_id: noteId,
            user_id: user.id,
          });
          
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating like",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useGivePoints = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ noteId, points }: { noteId: string; points: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('note_points')
        .upsert({
          note_id: noteId,
          user_id: user.id,
          points,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: "Points awarded!",
        description: "Thank you for rating this note.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error giving points",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
