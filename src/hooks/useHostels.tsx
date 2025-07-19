
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Hostel {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  location_address: string;
  latitude: number | null;
  longitude: number | null;
  price_min: number;
  price_max: number;
  total_rooms: number;
  available_rooms: number;
  amenities: string[];
  status: string;
  is_verified: boolean;
  contact_whatsapp: string | null;
  contact_phone: string | null;
  preferred_contact: string;
  payment_verified: boolean;
  created_at: string;
  updated_at: string;
  hostel_media?: {
    id: string;
    media_url: string;
    media_type: string;
    display_order: number;
  }[];
}

export const useHostels = (filters?: {
  priceRange?: [number, number];
  amenities?: string[];
  searchTerm?: string;
}) => {
  return useQuery({
    queryKey: ['hostels', filters],
    queryFn: async () => {
      let query = supabase
        .from('hostels')
        .select(`
          *,
          hostel_media (
            id,
            media_url,
            media_type,
            display_order
          )
        `)
        .in('status', ['active', 'verified'])
        .order('created_at', { ascending: false });

      if (filters?.priceRange) {
        query = query
          .gte('price_min', filters.priceRange[0])
          .lte('price_max', filters.priceRange[1]);
      }

      if (filters?.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,location_address.ilike.%${filters.searchTerm}%`);
      }

      if (filters?.amenities && filters.amenities.length > 0) {
        query = query.overlaps('amenities', filters.amenities);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching hostels:', error);
        throw error;
      }

      return data as Hostel[];
    },
  });
};

export const useMyHostels = () => {
  return useQuery({
    queryKey: ['my-hostels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hostels')
        .select(`
          *,
          hostel_media (
            id,
            media_url,
            media_type,
            display_order
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching my hostels:', error);
        throw error;
      }

      return data as Hostel[];
    },
  });
};

export const useCreateHostel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (hostelData: Omit<Hostel, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'hostel_media'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Convert the data to match the database expected types
      const insertData = {
        name: hostelData.name,
        description: hostelData.description,
        location_address: hostelData.location_address,
        latitude: hostelData.latitude,
        longitude: hostelData.longitude,
        price_min: hostelData.price_min,
        price_max: hostelData.price_max,
        total_rooms: hostelData.total_rooms,
        available_rooms: hostelData.available_rooms,
        amenities: hostelData.amenities as any, // Cast to any to handle the enum type
        status: hostelData.status as any,
        is_verified: hostelData.is_verified,
        contact_whatsapp: hostelData.contact_whatsapp,
        contact_phone: hostelData.contact_phone,
        preferred_contact: hostelData.preferred_contact as any,
        payment_verified: hostelData.payment_verified,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('hostels')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostels'] });
      queryClient.invalidateQueries({ queryKey: ['my-hostels'] });
      toast({
        title: "Success",
        description: "Hostel listing created successfully! Please complete payment to activate.",
      });
    },
    onError: (error) => {
      console.error('Error creating hostel:', error);
      toast({
        title: "Error",
        description: "Failed to create hostel listing. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useReportHostel = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ hostelId, reason, description }: {
      hostelId: string;
      reason: string;
      description?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('hostel_reports')
        .insert({
          hostel_id: hostelId,
          reporter_user_id: user.id,
          reason,
          description,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Your report has been submitted successfully. We'll review it shortly.",
      });
    },
    onError: (error) => {
      console.error('Error reporting hostel:', error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });
};
