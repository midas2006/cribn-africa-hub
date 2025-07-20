
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Event {
  id: string;
  title: string;
  description?: string;
  venue: string;
  event_date: string;
  dress_code?: string;
  ticket_price: number;
  max_capacity?: number;
  flyer_url?: string;
  video_url?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  commission_rate: number;
  created_at: string;
  updated_at: string;
  organizer_id: string;
}

export interface EventOrganizer {
  id: string;
  user_id: string;
  business_name: string;
  contact_email: string;
  contact_phone?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    refetch: fetchEvents,
  };
};

export const useEventOrganizer = () => {
  const [organizer, setOrganizer] = useState<EventOrganizer | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrganizer = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('event_organizers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setOrganizer(data);
    } catch (error) {
      console.error('Error fetching organizer:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizer();
  }, []);

  return {
    organizer,
    loading,
    refetch: fetchOrganizer,
  };
};
