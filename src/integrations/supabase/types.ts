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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          enterprise_id: string | null
          id: string
          license_id: string | null
          status: string | null
          submission_date: string | null
          type: string
          workflow_step_id: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          enterprise_id?: string | null
          id?: string
          license_id?: string | null
          status?: string | null
          submission_date?: string | null
          type: string
          workflow_step_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          enterprise_id?: string | null
          id?: string
          license_id?: string | null
          status?: string | null
          submission_date?: string | null
          type?: string
          workflow_step_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_violations: {
        Row: {
          description: string | null
          detection_date: string | null
          enterprise_id: string | null
          id: string
          license_id: string | null
          severity: string | null
          status: string | null
          violation_type: string | null
        }
        Insert: {
          description?: string | null
          detection_date?: string | null
          enterprise_id?: string | null
          id?: string
          license_id?: string | null
          severity?: string | null
          status?: string | null
          violation_type?: string | null
        }
        Update: {
          description?: string | null
          detection_date?: string | null
          enterprise_id?: string | null
          id?: string
          license_id?: string | null
          severity?: string | null
          status?: string | null
          violation_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_violations_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_violations_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_types: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          status: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          status?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      enterprises: {
        Row: {
          created_at: string | null
          enterprise_type_id: string | null
          id: string
          name: string
          representative: string | null
          status: string | null
          tax_code: string | null
        }
        Insert: {
          created_at?: string | null
          enterprise_type_id?: string | null
          id?: string
          name: string
          representative?: string | null
          status?: string | null
          tax_code?: string | null
        }
        Update: {
          created_at?: string | null
          enterprise_type_id?: string | null
          id?: string
          name?: string
          representative?: string | null
          status?: string | null
          tax_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enterprises_enterprise_type_id_fkey"
            columns: ["enterprise_type_id"]
            isOneToOne: false
            referencedRelation: "enterprise_types"
            referencedColumns: ["id"]
          },
        ]
      }
      license_types: {
        Row: {
          category: string | null
          code: string
          has_expiry: boolean | null
          id: string
          name: string
          status: string | null
        }
        Insert: {
          category?: string | null
          code: string
          has_expiry?: boolean | null
          id?: string
          name: string
          status?: string | null
        }
        Update: {
          category?: string | null
          code?: string
          has_expiry?: boolean | null
          id?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      licenses: {
        Row: {
          created_at: string | null
          enterprise_id: string | null
          expiry_date: string | null
          file_url: string | null
          id: string
          issue_date: string | null
          license_number: string | null
          license_type_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          enterprise_id?: string | null
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          license_number?: string | null
          license_type_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          enterprise_id?: string | null
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          license_number?: string | null
          license_type_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "licenses_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "licenses_license_type_id_fkey"
            columns: ["license_type_id"]
            isOneToOne: false
            referencedRelation: "license_types"
            referencedColumns: ["id"]
          },
        ]
      }
      number_ranges: {
        Row: {
          block_size: number | null
          created_at: string | null
          end_number: number | null
          id: string
          license_id: string | null
          prefix: string | null
          start_number: number | null
          status: string | null
          telco_id: string | null
        }
        Insert: {
          block_size?: number | null
          created_at?: string | null
          end_number?: number | null
          id?: string
          license_id?: string | null
          prefix?: string | null
          start_number?: number | null
          status?: string | null
          telco_id?: string | null
        }
        Update: {
          block_size?: number | null
          created_at?: string | null
          end_number?: number | null
          id?: string
          license_id?: string | null
          prefix?: string | null
          start_number?: number | null
          status?: string | null
          telco_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "number_ranges_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "number_ranges_telco_id_fkey"
            columns: ["telco_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      resource_types: {
        Row: {
          code: string
          format_rule: string | null
          id: string
          name: string
          status: string | null
        }
        Insert: {
          code: string
          format_rule?: string | null
          id?: string
          name: string
          status?: string | null
        }
        Update: {
          code?: string
          format_rule?: string | null
          id?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      service_types: {
        Row: {
          code: string
          group_type: string | null
          id: string
          name: string
          requires_license: boolean | null
          status: string | null
        }
        Insert: {
          code: string
          group_type?: string | null
          id?: string
          name: string
          requires_license?: boolean | null
          status?: string | null
        }
        Update: {
          code?: string
          group_type?: string | null
          id?: string
          name?: string
          requires_license?: boolean | null
          status?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          activation_date: string | null
          activation_status: string | null
          expiry_date: string | null
          id: string
          last_sync_at: string | null
          msisdn: string | null
          range_id: string | null
          serial_number: string | null
          status: string | null
          sub_type: string | null
          telco_id: string | null
        }
        Insert: {
          activation_date?: string | null
          activation_status?: string | null
          expiry_date?: string | null
          id?: string
          last_sync_at?: string | null
          msisdn?: string | null
          range_id?: string | null
          serial_number?: string | null
          status?: string | null
          sub_type?: string | null
          telco_id?: string | null
        }
        Update: {
          activation_date?: string | null
          activation_status?: string | null
          expiry_date?: string | null
          id?: string
          last_sync_at?: string | null
          msisdn?: string | null
          range_id?: string | null
          serial_number?: string | null
          status?: string | null
          sub_type?: string | null
          telco_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscribers_range_id_fkey"
            columns: ["range_id"]
            isOneToOne: false
            referencedRelation: "number_ranges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscribers_telco_id_fkey"
            columns: ["telco_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
        ]
      }
      system_logs: {
        Row: {
          action: string | null
          actor: string | null
          created_at: string | null
          details: string | null
          id: string
          target_entity: string | null
          target_id: string | null
        }
        Insert: {
          action?: string | null
          actor?: string | null
          created_at?: string | null
          details?: string | null
          id?: string
          target_entity?: string | null
          target_id?: string | null
        }
        Update: {
          action?: string | null
          actor?: string | null
          created_at?: string | null
          details?: string | null
          id?: string
          target_entity?: string | null
          target_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          department: string | null
          enterprise_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          enterprise_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          department?: string | null
          enterprise_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "director" | "reviewer" | "staff"
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
      app_role: ["admin", "director", "reviewer", "staff"],
    },
  },
} as const
