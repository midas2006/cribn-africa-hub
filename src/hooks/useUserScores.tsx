
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface UserScores {
  id: string;
  user_id: string;
  cribn_score: number;
  runner_score: number;
  notes_uploaded: number;
  questions_answered: number;
  events_attended: number;
  reviews_received: number;
  marketplace_listings: number;
  errands_completed: number;
  completion_rate: number;
  average_rating: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_name: string;
  badge_description?: string;
  badge_icon?: string;
  earned_at: string;
}

export const useUserScores = () => {
  const [scores, setScores] = useState<UserScores | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchScores = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_scores')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setScores(data);
    } catch (error) {
      console.error('Error fetching scores:', error);
      toast({
        title: "Error",
        description: "Failed to load scores",
        variant: "destructive",
      });
    }
  };

  const fetchBadges = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCribnLevel = (score: number) => {
    if (score >= 1000) return { level: 'Expert', color: 'text-purple-500' };
    if (score >= 500) return { level: 'Advanced', color: 'text-blue-500' };
    if (score >= 200) return { level: 'Intermediate', color: 'text-green-500' };
    if (score >= 50) return { level: 'Beginner', color: 'text-yellow-500' };
    return { level: 'Newbie', color: 'text-gray-500' };
  };

  const getRunnerLevel = (score: number) => {
    if (score >= 2000) return { level: 'Super Runner', color: 'text-purple-500' };
    if (score >= 1000) return { level: 'Pro Runner', color: 'text-blue-500' };
    if (score >= 500) return { level: 'Active Runner', color: 'text-green-500' };
    if (score >= 100) return { level: 'New Runner', color: 'text-yellow-500' };
    return { level: 'Inactive', color: 'text-gray-500' };
  };

  useEffect(() => {
    if (user) {
      fetchScores();
      fetchBadges();
    }
  }, [user]);

  return {
    scores,
    badges,
    loading,
    fetchScores,
    fetchBadges,
    getCribnLevel,
    getRunnerLevel,
  };
};
