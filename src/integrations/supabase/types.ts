export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      hostel_media: {
        Row: {
          created_at: string | null
          display_order: number | null
          hostel_id: string
          id: string
          media_type: string
          media_url: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          hostel_id: string
          id?: string
          media_type: string
          media_url: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          hostel_id?: string
          id?: string
          media_type?: string
          media_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_media_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          hostel_id: string | null
          id: string
          payment_status: string | null
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          hostel_id?: string | null
          id?: string
          payment_status?: string | null
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          hostel_id?: string | null
          id?: string
          payment_status?: string | null
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_payments_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_reports: {
        Row: {
          created_at: string | null
          description: string | null
          hostel_id: string
          id: string
          reason: string
          reporter_user_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hostel_id: string
          id?: string
          reason: string
          reporter_user_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hostel_id?: string
          id?: string
          reason?: string
          reporter_user_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hostel_reports_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      hostels: {
        Row: {
          amenities: Database["public"]["Enums"]["hostel_amenity"][] | null
          available_rooms: number
          contact_phone: string | null
          contact_whatsapp: string | null
          created_at: string | null
          description: string | null
          id: string
          is_verified: boolean | null
          latitude: number | null
          location_address: string
          longitude: number | null
          name: string
          payment_verified: boolean | null
          preferred_contact:
            | Database["public"]["Enums"]["contact_method"]
            | null
          price_max: number
          price_min: number
          status: Database["public"]["Enums"]["hostel_status"] | null
          stripe_payment_intent_id: string | null
          total_rooms: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amenities?: Database["public"]["Enums"]["hostel_amenity"][] | null
          available_rooms?: number
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          latitude?: number | null
          location_address: string
          longitude?: number | null
          name: string
          payment_verified?: boolean | null
          preferred_contact?:
            | Database["public"]["Enums"]["contact_method"]
            | null
          price_max: number
          price_min: number
          status?: Database["public"]["Enums"]["hostel_status"] | null
          stripe_payment_intent_id?: string | null
          total_rooms?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amenities?: Database["public"]["Enums"]["hostel_amenity"][] | null
          available_rooms?: number
          contact_phone?: string | null
          contact_whatsapp?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          latitude?: number | null
          location_address?: string
          longitude?: number | null
          name?: string
          payment_verified?: boolean | null
          preferred_contact?:
            | Database["public"]["Enums"]["contact_method"]
            | null
          price_max?: number
          price_min?: number
          status?: Database["public"]["Enums"]["hostel_status"] | null
          stripe_payment_intent_id?: string | null
          total_rooms?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      note_likes: {
        Row: {
          created_at: string
          id: string
          note_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_likes_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      note_points: {
        Row: {
          created_at: string
          id: string
          note_id: string
          points: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note_id: string
          points: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note_id?: string
          points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_points_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          caption: string | null
          content: string | null
          course_name: string
          created_at: string
          department: string
          id: string
          image_url: string | null
          likes_count: number | null
          pdf_url: string | null
          points_count: number | null
          semester: string
          title: string
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          content?: string | null
          course_name: string
          created_at?: string
          department: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          pdf_url?: string | null
          points_count?: number | null
          semester: string
          title: string
          topic: string
          updated_at?: string
          user_id: string
        }
        Update: {
          caption?: string | null
          content?: string | null
          course_name?: string
          created_at?: string
          department?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          pdf_url?: string | null
          points_count?: number | null
          semester?: string
          title?: string
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      contact_method: "whatsapp" | "phone" | "in_app"
      hostel_amenity:
        | "wifi"
        | "ac"
        | "parking"
        | "kitchen"
        | "laundry"
        | "security"
        | "gym"
        | "study_room"
        | "common_area"
        | "backup_power"
      hostel_status:
        | "pending"
        | "active"
        | "reported"
        | "suspended"
        | "verified"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      contact_method: ["whatsapp", "phone", "in_app"],
      hostel_amenity: [
        "wifi",
        "ac",
        "parking",
        "kitchen",
        "laundry",
        "security",
        "gym",
        "study_room",
        "common_area",
        "backup_power",
      ],
      hostel_status: ["pending", "active", "reported", "suspended", "verified"],
    },
  },
} as const
