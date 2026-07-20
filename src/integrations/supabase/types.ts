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
      activity_log: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["entity_kind"] | null
          id: string
          summary: string
          type: Database["public"]["Enums"]["activity_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["entity_kind"] | null
          id?: string
          summary: string
          type: Database["public"]["Enums"]["activity_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["entity_kind"] | null
          id?: string
          summary?: string
          type?: Database["public"]["Enums"]["activity_type"]
          user_id?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          category: string
          code: string
          created_at: string
          criteria: Json
          description: string
          icon: string
          id: string
          name: string
          tier: string
        }
        Insert: {
          category?: string
          code: string
          created_at?: string
          criteria?: Json
          description: string
          icon?: string
          id?: string
          name: string
          tier?: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          criteria?: Json
          description?: string
          icon?: string
          id?: string
          name?: string
          tier?: string
        }
        Relationships: []
      }
      donation_certificates: {
        Row: {
          certificate_no: string
          donation_id: string
          id: string
          issued_at: string
        }
        Insert: {
          certificate_no: string
          donation_id: string
          id?: string
          issued_at?: string
        }
        Update: {
          certificate_no?: string
          donation_id?: string
          id?: string
          issued_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donation_certificates_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: true
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
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
      event_registrations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          note: string | null
          status: Database["public"]["Enums"]["registration_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          banner_url: string | null
          capacity: number | null
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          institution_id: string
          is_published: boolean
          kind: Database["public"]["Enums"]["event_kind"]
          location: string | null
          starts_at: string
          title: string
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          institution_id: string
          is_published?: boolean
          kind?: Database["public"]["Enums"]["event_kind"]
          location?: string | null
          starts_at: string
          title: string
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          institution_id?: string
          is_published?: boolean
          kind?: Database["public"]["Enums"]["event_kind"]
          location?: string | null
          starts_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_posts: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          institution_id: string | null
          is_public: boolean
          kind: Database["public"]["Enums"]["feed_kind"]
          media: string[]
          related_entity: Database["public"]["Enums"]["entity_kind"] | null
          related_id: string | null
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          institution_id?: string | null
          is_public?: boolean
          kind?: Database["public"]["Enums"]["feed_kind"]
          media?: string[]
          related_entity?: Database["public"]["Enums"]["entity_kind"] | null
          related_id?: string | null
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          institution_id?: string | null
          is_public?: boolean
          kind?: Database["public"]["Enums"]["feed_kind"]
          media?: string[]
          related_entity?: Database["public"]["Enums"]["entity_kind"] | null
          related_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feed_posts_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      impact_reports: {
        Row: {
          beneficiaries: number | null
          created_at: string
          id: string
          institution_id: string
          is_published: boolean
          need_id: string | null
          outcomes: string | null
          photos: string[]
          published_at: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          beneficiaries?: number | null
          created_at?: string
          id?: string
          institution_id: string
          is_published?: boolean
          need_id?: string | null
          outcomes?: string | null
          photos?: string[]
          published_at?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          beneficiaries?: number | null
          created_at?: string
          id?: string
          institution_id?: string
          is_published?: boolean
          need_id?: string | null
          outcomes?: string | null
          photos?: string[]
          published_at?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "impact_reports_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "impact_reports_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "needs"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_documents: {
        Row: {
          created_at: string
          id: string
          institution_id: string
          label: string | null
          storage_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          institution_id: string
          label?: string | null
          storage_path: string
        }
        Update: {
          created_at?: string
          id?: string
          institution_id?: string
          label?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "institution_documents_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
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
          geocoded_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
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
          geocoded_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
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
          geocoded_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
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
          beneficiaries_count: number | null
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
          beneficiaries_count?: number | null
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
          beneficiaries_count?: number | null
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
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
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
      saved_items: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["saved_kind"]
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["saved_kind"]
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["saved_kind"]
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          meta: Json | null
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          meta?: Json | null
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          meta?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
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
      volunteer_applications: {
        Row: {
          created_at: string
          hours_logged: number
          id: string
          message: string | null
          opportunity_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hours_logged?: number
          id?: string
          message?: string | null
          opportunity_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hours_logged?: number
          id?: string
          message?: string | null
          opportunity_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "volunteer_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_opportunities: {
        Row: {
          category: Database["public"]["Enums"]["opportunity_category"]
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          institution_id: string
          is_open: boolean
          location: string | null
          skills: string[]
          slots: number | null
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["opportunity_category"]
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          institution_id: string
          is_open?: boolean
          location?: string | null
          skills?: string[]
          slots?: number | null
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["opportunity_category"]
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          institution_id?: string
          is_open?: boolean
          location?: string | null
          skills?: string[]
          slots?: number | null
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_opportunities_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_badge: {
        Args: { _code: string; _user_id: string }
        Returns: undefined
      }
      get_donation_message: { Args: { _donation_id: string }; Returns: string }
    }
    Enums: {
      activity_type:
        | "donation_made"
        | "donation_received"
        | "application_submitted"
        | "application_decided"
        | "event_registered"
        | "need_created"
        | "need_completed"
        | "institution_verified"
        | "profile_updated"
      app_role: "donor" | "volunteer" | "mentor" | "institution_admin" | "admin"
      application_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "completed"
        | "withdrawn"
      entity_kind:
        | "need"
        | "institution"
        | "event"
        | "opportunity"
        | "application"
        | "donation"
        | "impact_report"
        | "post"
      event_kind:
        | "health_camp"
        | "education"
        | "birthday"
        | "festival"
        | "volunteer_drive"
        | "fundraiser"
        | "other"
      feed_kind:
        | "success_story"
        | "need_update"
        | "event_update"
        | "volunteer_story"
        | "milestone"
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
      notification_type:
        | "donation_received"
        | "need_completed"
        | "application_accepted"
        | "application_rejected"
        | "new_need_nearby"
        | "event_reminder"
        | "institution_verified"
        | "generic"
      opportunity_category:
        | "teaching"
        | "healthcare"
        | "mentorship"
        | "event_support"
        | "technology"
        | "fundraising"
        | "other"
      registration_status:
        | "registered"
        | "waitlisted"
        | "cancelled"
        | "attended"
      saved_kind: "need" | "institution" | "event" | "opportunity"
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
      activity_type: [
        "donation_made",
        "donation_received",
        "application_submitted",
        "application_decided",
        "event_registered",
        "need_created",
        "need_completed",
        "institution_verified",
        "profile_updated",
      ],
      app_role: ["donor", "volunteer", "mentor", "institution_admin", "admin"],
      application_status: [
        "pending",
        "accepted",
        "rejected",
        "completed",
        "withdrawn",
      ],
      entity_kind: [
        "need",
        "institution",
        "event",
        "opportunity",
        "application",
        "donation",
        "impact_report",
        "post",
      ],
      event_kind: [
        "health_camp",
        "education",
        "birthday",
        "festival",
        "volunteer_drive",
        "fundraiser",
        "other",
      ],
      feed_kind: [
        "success_story",
        "need_update",
        "event_update",
        "volunteer_story",
        "milestone",
      ],
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
      notification_type: [
        "donation_received",
        "need_completed",
        "application_accepted",
        "application_rejected",
        "new_need_nearby",
        "event_reminder",
        "institution_verified",
        "generic",
      ],
      opportunity_category: [
        "teaching",
        "healthcare",
        "mentorship",
        "event_support",
        "technology",
        "fundraising",
        "other",
      ],
      registration_status: [
        "registered",
        "waitlisted",
        "cancelled",
        "attended",
      ],
      saved_kind: ["need", "institution", "event", "opportunity"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
