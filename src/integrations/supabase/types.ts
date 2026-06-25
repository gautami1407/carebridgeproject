export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      donations: {
        Row: {
          amount: number
          created_at: string
          donor_id: string
          id: string
          is_anonymous: boolean
          message: string | null
          need_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          donor_id: string
          id?: string
          is_anonymous?: boolean
          message?: string | null
          need_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          donor_id?: string
          id?: string
          is_anonymous?: boolean
          message?: string | null
          need_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "needs"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          city: string | null
          country: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          mission: string | null
          name: string
          owner_id: string | null
          residents_count: number | null
          slug: string
          state: string | null
          type: Database["public"]["Enums"]["institution_type"]
          updated_at: string
          verification: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          city?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          mission?: string | null
          name: string
          owner_id?: string | null
          residents_count?: number | null
          slug: string
          state?: string | null
          type?: Database["public"]["Enums"]["institution_type"]
          updated_at?: string
          verification?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          city?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          mission?: string | null
          name?: string
          owner_id?: string | null
          residents_count?: number | null
          slug?: string
          state?: string | null
          type?: Database["public"]["Enums"]["institution_type"]
          updated_at?: string
          verification?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      needs: {
        Row: {
          beneficiaries: number | null
          category: Database["public"]["Enums"]["need_category"]
          cover_image: string | null
          created_at: string
          deadline: string | null
          description: string
          goal_amount: number
          id: string
          institution_id: string
          raised_amount: number
          status: Database["public"]["Enums"]["need_status"]
          title: string
          updated_at: string
          urgency: Database["public"]["Enums"]["need_urgency"]
        }
        Insert: {
          beneficiaries?: number | null
          category?: Database["public"]["Enums"]["need_category"]
          cover_image?: string | null
          created_at?: string
          deadline?: string | null
          description: string
          goal_amount?: number
          id?: string
          institution_id: string
          raised_amount?: number
          status?: Database["public"]["Enums"]["need_status"]
          title: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["need_urgency"]
        }
        Update: {
          beneficiaries?: number | null
          category?: Database["public"]["Enums"]["need_category"]
          cover_image?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          goal_amount?: number
          id?: string
          institution_id?: string
          raised_amount?: number
          status?: Database["public"]["Enums"]["need_status"]
          title?: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["need_urgency"]
        }
        Relationships: [
          {
            foreignKeyName: "needs_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles_private: {
        Row: {
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
      app_role: "donor" | "volunteer" | "mentor" | "institution_admin" | "admin"
      institution_type: "orphanage" | "old_age_home" | "shelter" | "other"
      need_category:
        | "food"
        | "education"
        | "medical"
        | "shelter"
        | "clothing"
        | "other"
      need_status: "draft" | "active" | "fulfilled" | "closed"
      need_urgency: "low" | "medium" | "high" | "critical"
      verification_status: "pending" | "verified" | "rejected"
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
      app_role: ["donor", "volunteer", "mentor", "institution_admin", "admin"],
      institution_type: ["orphanage", "old_age_home", "shelter", "other"],
      need_category: [
        "food",
        "education",
        "medical",
        "shelter",
        "clothing",
        "other",
      ],
      need_status: ["draft", "active", "fulfilled", "closed"],
      need_urgency: ["low", "medium", "high", "critical"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
