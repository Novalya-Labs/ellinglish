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
      avatars: {
        Row: {
          created_at: string
          id: number
          name: string
          slug: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          slug: string
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          slug?: string
          url?: string
        }
        Relationships: []
      }
      badge_translations: {
        Row: {
          badge_id: number
          description: string
          id: number
          language: Database["public"]["Enums"]["LANGUAGE"]
          name: string
        }
        Insert: {
          badge_id: number
          description: string
          id?: number
          language: Database["public"]["Enums"]["LANGUAGE"]
          name: string
        }
        Update: {
          badge_id?: number
          description?: string
          id?: number
          language?: Database["public"]["Enums"]["LANGUAGE"]
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "badge_translations_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          code: string
          created_at: string
          icon: string | null
          id: number
        }
        Insert: {
          code: string
          created_at?: string
          icon?: string | null
          id?: number
        }
        Update: {
          code?: string
          created_at?: string
          icon?: string | null
          id?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_id: number | null
          created_at: string
          daily_streak: number
          email: string
          enabled_push: boolean
          expo_token: string | null
          id: string
          language: Database["public"]["Enums"]["LANGUAGE"]
          theme: Database["public"]["Enums"]["THEME"]
          updated_at: string
          username: string
          xp_points: number
        }
        Insert: {
          avatar_id?: number | null
          created_at?: string
          daily_streak?: number
          email: string
          enabled_push?: boolean
          expo_token?: string | null
          id: string
          language?: Database["public"]["Enums"]["LANGUAGE"]
          theme?: Database["public"]["Enums"]["THEME"]
          updated_at?: string
          username: string
          xp_points?: number
        }
        Update: {
          avatar_id?: number | null
          created_at?: string
          daily_streak?: number
          email?: string
          enabled_push?: boolean
          expo_token?: string | null
          id?: string
          language?: Database["public"]["Enums"]["LANGUAGE"]
          theme?: Database["public"]["Enums"]["THEME"]
          updated_at?: string
          username?: string
          xp_points?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_avatar_id_fkey"
            columns: ["avatar_id"]
            isOneToOne: false
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_translations: {
        Row: {
          id: number
          language: Database["public"]["Enums"]["LANGUAGE"]
          name: string
          theme_id: number
        }
        Insert: {
          id?: number
          language: Database["public"]["Enums"]["LANGUAGE"]
          name: string
          theme_id: number
        }
        Update: {
          id?: number
          language?: Database["public"]["Enums"]["LANGUAGE"]
          name?: string
          theme_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "theme_translations_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          created_at: string
          id: number
          required_mastery_level: number
          slug: string
        }
        Insert: {
          created_at?: string
          id?: number
          required_mastery_level?: number
          slug: string
        }
        Update: {
          created_at?: string
          id?: number
          required_mastery_level?: number
          slug?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: number
          unlocked_at: string
          user_id: string
        }
        Insert: {
          badge_id: number
          unlocked_at?: string
          user_id: string
        }
        Update: {
          badge_id?: number
          unlocked_at?: string
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
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_word_progress: {
        Row: {
          last_reviewed_at: string | null
          mastery_level: number
          user_id: string
          word_id: number
        }
        Insert: {
          last_reviewed_at?: string | null
          mastery_level?: number
          user_id: string
          word_id: number
        }
        Update: {
          last_reviewed_at?: string | null
          mastery_level?: number
          user_id?: string
          word_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_word_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_word_progress_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
        ]
      }
      words: {
        Row: {
          created_at: string
          id: number
          text_en: string
          text_fr: string
          theme_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          text_en: string
          text_fr: string
          theme_id: number
        }
        Update: {
          created_at?: string
          id?: number
          text_en?: string
          text_fr?: string
          theme_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "words_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_localized_badges: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          code: string
          name: string
          description: string
          icon: string
        }[]
      }
      get_localized_themes: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          slug: string
          name: string
          required_mastery_level: number
        }[]
      }
    }
    Enums: {
      LANGUAGE: "FR" | "EN"
      THEME: "DARK" | "LIGHT" | "SYSTEM"
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
      LANGUAGE: ["FR", "EN"],
      THEME: ["DARK", "LIGHT", "SYSTEM"],
    },
  },
} as const
