export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alert_history: {
        Row: {
          alert_type: string
          contacts_notified: string[] | null
          danger_zone_id: string | null
          id: string
          location_id: string | null
          message: string | null
          sent_at: string
          status: string | null
          user_id: string
        }
        Insert: {
          alert_type: string
          contacts_notified?: string[] | null
          danger_zone_id?: string | null
          id?: string
          location_id?: string | null
          message?: string | null
          sent_at?: string
          status?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string
          contacts_notified?: string[] | null
          danger_zone_id?: string | null
          id?: string
          location_id?: string | null
          message?: string | null
          sent_at?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_history_danger_zone_id_fkey"
            columns: ["danger_zone_id"]
            isOneToOne: false
            referencedRelation: "danger_zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_history_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "user_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      danger_zones: {
        Row: {
          active_from: string | null
          active_to: string | null
          center_latitude: number
          center_longitude: number
          created_at: string
          created_by: string | null
          danger_level: string | null
          days_of_week: number[] | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          radius_meters: number
          updated_at: string
        }
        Insert: {
          active_from?: string | null
          active_to?: string | null
          center_latitude: number
          center_longitude: number
          created_at?: string
          created_by?: string | null
          danger_level?: string | null
          days_of_week?: number[] | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          radius_meters: number
          updated_at?: string
        }
        Update: {
          active_from?: string | null
          active_to?: string | null
          center_latitude?: number
          center_longitude?: number
          created_at?: string
          created_by?: string | null
          danger_level?: string | null
          days_of_week?: number[] | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          radius_meters?: number
          updated_at?: string
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          contact_email: string | null
          contact_name: string
          contact_phone: string | null
          created_at: string
          id: string
          is_primary: boolean | null
          relationship: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean | null
          relationship?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean | null
          relationship?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      entities: {
        Row: {
          created_at: string
          entity_type: string
          entity_value: string
          id: string
          last_reported_at: string | null
          report_count: number | null
          risk_score: number | null
        }
        Insert: {
          created_at?: string
          entity_type: string
          entity_value: string
          id?: string
          last_reported_at?: string | null
          report_count?: number | null
          risk_score?: number | null
        }
        Update: {
          created_at?: string
          entity_type?: string
          entity_value?: string
          id?: string
          last_reported_at?: string | null
          report_count?: number | null
          risk_score?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          last_active_at: string | null
          phone_number: string | null
          report_count: number | null
        }
        Insert: {
          created_at?: string
          id: string
          last_active_at?: string | null
          phone_number?: string | null
          report_count?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          last_active_at?: string | null
          phone_number?: string | null
          report_count?: number | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          confirmations: string[] | null
          created_at: string
          description: string
          entity_id: string
          evidence_urls: string[] | null
          id: string
          reporter_user_id: string
          scam_category: string
          status: string | null
          updated_at: string
          verified_by_moderator_id: string | null
        }
        Insert: {
          confirmations?: string[] | null
          created_at?: string
          description: string
          entity_id: string
          evidence_urls?: string[] | null
          id?: string
          reporter_user_id: string
          scam_category: string
          status?: string | null
          updated_at?: string
          verified_by_moderator_id?: string | null
        }
        Update: {
          confirmations?: string[] | null
          created_at?: string
          description?: string
          entity_id?: string
          evidence_urls?: string[] | null
          id?: string
          reporter_user_id?: string
          scam_category?: string
          status?: string | null
          updated_at?: string
          verified_by_moderator_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_locations: {
        Row: {
          accuracy: number | null
          battery_level: number | null
          created_at: string
          id: string
          is_emergency: boolean | null
          latitude: number
          longitude: number
          timestamp: string
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          battery_level?: number | null
          created_at?: string
          id?: string
          is_emergency?: boolean | null
          latitude: number
          longitude: number
          timestamp?: string
          user_id: string
        }
        Update: {
          accuracy?: number | null
          battery_level?: number | null
          created_at?: string
          id?: string
          is_emergency?: boolean | null
          latitude?: number
          longitude?: number
          timestamp?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
