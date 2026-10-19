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
      agent_proposals: {
        Row: {
          agent: string
          confidence: number | null
          created_at: string
          decided_at: string | null
          decided_by: string | null
          id: string
          kind: string
          payload: Json
          rationale: string
          status: string
          target_id: string | null
        }
        Insert: {
          agent: string
          confidence?: number | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          kind: string
          payload?: Json
          rationale: string
          status?: string
          target_id?: string | null
        }
        Update: {
          agent?: string
          confidence?: number | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          kind?: string
          payload?: Json
          rationale?: string
          status?: string
          target_id?: string | null
        }
        Relationships: []
      }
      alert_votes: {
        Row: {
          alert_id: string
          created_at: string
          user_id: string
          vote: number
        }
        Insert: {
          alert_id: string
          created_at?: string
          user_id: string
          vote: number
        }
        Update: {
          alert_id?: string
          created_at?: string
          user_id?: string
          vote?: number
        }
        Relationships: []
      }
      appeals: {
        Row: {
          contact: string | null
          created_at: string
          display_value: string | null
          entity_type: string
          id: string
          normalized_value: string
          reason: string
          resolution_note: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          user_id: string
        }
        Insert: {
          contact?: string | null
          created_at?: string
          display_value?: string | null
          entity_type: string
          id?: string
          normalized_value: string
          reason: string
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          user_id: string
        }
        Update: {
          contact?: string | null
          created_at?: string
          display_value?: string | null
          entity_type?: string
          id?: string
          normalized_value?: string
          reason?: string
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
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
      community_alerts: {
        Row: {
          affected_areas: string[] | null
          alert_type: string
          contact_info: string | null
          created_at: string
          description: string
          downvotes: number | null
          evidence_urls: string[] | null
          expires_at: string | null
          id: string
          is_verified: boolean | null
          latitude: number | null
          location_name: string | null
          longitude: number | null
          reporter_user_id: string | null
          severity: string
          source_type: string | null
          tags: string[] | null
          title: string
          updated_at: string
          upvotes: number | null
          verified_by: string | null
          view_count: number | null
        }
        Insert: {
          affected_areas?: string[] | null
          alert_type: string
          contact_info?: string | null
          created_at?: string
          description: string
          downvotes?: number | null
          evidence_urls?: string[] | null
          expires_at?: string | null
          id?: string
          is_verified?: boolean | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          reporter_user_id?: string | null
          severity: string
          source_type?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          upvotes?: number | null
          verified_by?: string | null
          view_count?: number | null
        }
        Update: {
          affected_areas?: string[] | null
          alert_type?: string
          contact_info?: string | null
          created_at?: string
          description?: string
          downvotes?: number | null
          evidence_urls?: string[] | null
          expires_at?: string | null
          id?: string
          is_verified?: boolean | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          reporter_user_id?: string | null
          severity?: string
          source_type?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          upvotes?: number | null
          verified_by?: string | null
          view_count?: number | null
        }
        Relationships: []
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
          bank_code: string | null
          display_value: string | null
          legacy: boolean
          normalized_value: string | null
        }
        Insert: {
          created_at?: string
          entity_type: string
          entity_value: string
          id?: string
          last_reported_at?: string | null
          report_count?: number | null
          risk_score?: number | null
          bank_code?: string | null
          display_value?: string | null
          legacy?: boolean
          normalized_value?: string | null
        }
        Update: {
          created_at?: string
          entity_type?: string
          entity_value?: string
          id?: string
          last_reported_at?: string | null
          report_count?: number | null
          risk_score?: number | null
          bank_code?: string | null
          display_value?: string | null
          legacy?: boolean
          normalized_value?: string | null
        }
        Relationships: []
      }
      moderation_log: {
        Row: {
          action: string
          actor: string
          created_at: string
          id: number
          note: string | null
          target_id: string
        }
        Insert: {
          action: string
          actor: string
          created_at?: string
          id?: number
          note?: string | null
          target_id: string
        }
        Update: {
          action?: string
          actor?: string
          created_at?: string
          id?: number
          note?: string | null
          target_id?: string
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
      scam_statistics: {
        Row: {
          created_at: string
          damage_score: number | null
          danger_level: string
          description: string
          frequency_score: number | null
          id: string
          prevention_tips: string[] | null
          recent_trend: string | null
          scam_type: string
          title: string
          total_reports: number | null
          updated_at: string
          warning_signs: string[] | null
          is_active: boolean
          sort_order: number | null
          source_note: string | null
        }
        Insert: {
          created_at?: string
          damage_score?: number | null
          danger_level: string
          description: string
          frequency_score?: number | null
          id?: string
          prevention_tips?: string[] | null
          recent_trend?: string | null
          scam_type: string
          title: string
          total_reports?: number | null
          updated_at?: string
          warning_signs?: string[] | null
          is_active?: boolean
          sort_order?: number | null
          source_note?: string | null
        }
        Update: {
          created_at?: string
          damage_score?: number | null
          danger_level?: string
          description?: string
          frequency_score?: number | null
          id?: string
          prevention_tips?: string[] | null
          recent_trend?: string | null
          scam_type?: string
          title?: string
          total_reports?: number | null
          updated_at?: string
          warning_signs?: string[] | null
          is_active?: boolean
          sort_order?: number | null
          source_note?: string | null
        }
        Relationships: []
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
      user_roles: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decide_proposal: {
        Args: { p_proposal_id: string; p_decision: string; p_note?: string | null }
        Returns: undefined
      }
      has_role: {
        Args: { _user_id: string; _role: string }
        Returns: boolean
      }
      metrics_summary: {
        Args: { p_days?: number }
        Returns: { day: string; kind: string; count: number }[]
      }
      moderate_alert: {
        Args: { p_alert_id: string; p_decision: string; p_note?: string | null }
        Returns: undefined
      }
      moderate_report: {
        Args: { p_report_id: string; p_decision: string; p_note?: string | null }
        Returns: undefined
      }
      resolve_appeal: {
        Args: { p_appeal_id: string; p_decision: string; p_note?: string | null }
        Returns: undefined
      }
      submit_appeal: {
        Args: { p_kind: string; p_value: string; p_reason: string; p_contact?: string | null }
        Returns: string
      }
      lookup_entity: {
        Args: { p_kind: string; p_value: string }
        Returns: Json
      }
      submit_report: {
        Args: {
          p_kind: string
          p_value: string
          p_category: string
          p_description: string
          p_bank_code?: string | null
          p_evidence?: string[]
        }
        Returns: string
      }
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
