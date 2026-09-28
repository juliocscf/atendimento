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
      addresses: {
        Row: {
          address_complement: string | null
          address_line: string
          address_number: string | null
          city: string
          client_id: string
          country: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_primary: boolean
          label: string
          neighborhood: string | null
          organization_id: string
          postal_code: string | null
          state: string
          updated_at: string
        }
        Insert: {
          address_complement?: string | null
          address_line: string
          address_number?: string | null
          city: string
          client_id: string
          country?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_primary?: boolean
          label?: string
          neighborhood?: string | null
          organization_id: string
          postal_code?: string | null
          state: string
          updated_at?: string
        }
        Update: {
          address_complement?: string | null
          address_line?: string
          address_number?: string | null
          city?: string
          client_id?: string
          country?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_primary?: boolean
          label?: string
          neighborhood?: string | null
          organization_id?: string
          postal_code?: string | null
          state?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          organization_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          organization_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          organization_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address_complement: string | null
          address_line: string | null
          address_number: string | null
          city: string | null
          code: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          email: string | null
          id: string
          name: string
          neighborhood: string | null
          organization_id: string
          phone: string | null
          postal_code: string | null
          state: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address_complement?: string | null
          address_line?: string | null
          address_number?: string | null
          city?: string | null
          code: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string | null
          id?: string
          name: string
          neighborhood?: string | null
          organization_id: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address_complement?: string | null
          address_line?: string | null
          address_number?: string | null
          city?: string | null
          code?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string | null
          id?: string
          name?: string
          neighborhood?: string | null
          organization_id?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "branches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contacts: {
        Row: {
          client_id: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          department: string | null
          email: string | null
          id: string
          is_primary: boolean
          name: string
          organization_id: string
          phone: string | null
          role_title: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          department?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean
          name: string
          organization_id: string
          phone?: string | null
          role_title?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          department?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean
          name?: string
          organization_id?: string
          phone?: string | null
          role_title?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          branch_id: string | null
          client_type: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          display_name: string
          document_ciphertext: string | null
          document_hash: string | null
          document_type: string | null
          email: string | null
          id: string
          legal_name: string | null
          notes: string | null
          organization_id: string
          phone: string | null
          status: string
          trade_name: string | null
          updated_at: string
          updated_by: string | null
          whatsapp: string | null
        }
        Insert: {
          branch_id?: string | null
          client_type: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          display_name: string
          document_ciphertext?: string | null
          document_hash?: string | null
          document_type?: string | null
          email?: string | null
          id?: string
          legal_name?: string | null
          notes?: string | null
          organization_id: string
          phone?: string | null
          status?: string
          trade_name?: string | null
          updated_at?: string
          updated_by?: string | null
          whatsapp?: string | null
        }
        Update: {
          branch_id?: string | null
          client_type?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          display_name?: string
          document_ciphertext?: string | null
          document_hash?: string | null
          document_type?: string | null
          email?: string | null
          id?: string
          legal_name?: string | null
          notes?: string | null
          organization_id?: string
          phone?: string | null
          status?: string
          trade_name?: string | null
          updated_at?: string
          updated_by?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      device_timeline_events: {
        Row: {
          actor_user_id: string | null
          created_at: string
          description: string | null
          device_id: string
          event_type: string
          id: string
          metadata: Json
          organization_id: string
          title: string
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          description?: string | null
          device_id: string
          event_type: string
          id?: string
          metadata?: Json
          organization_id: string
          title: string
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          description?: string | null
          device_id?: string
          event_type?: string
          id?: string
          metadata?: Json
          organization_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_timeline_events_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_timeline_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      device_types: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          organization_id: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          organization_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_types_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          acquisition_date: string | null
          architecture: string | null
          branch_id: string | null
          client_id: string
          created_at: string
          created_by: string | null
          current_location: string | null
          deleted_at: string | null
          deleted_by: string | null
          device_type_id: string
          gpu: string | null
          hostname: string | null
          id: string
          ip_address: unknown
          mac_address: string | null
          manufacturer: string | null
          manufacturer_warranty_until: string | null
          memory_ram: string | null
          model: string | null
          motherboard: string | null
          notes: string | null
          operating_system: string | null
          organization_id: string
          patrimony: string | null
          processor: string | null
          public_code: string
          serial_number: string | null
          service_tag: string | null
          status: string
          storage: string | null
          system_version: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          acquisition_date?: string | null
          architecture?: string | null
          branch_id?: string | null
          client_id: string
          created_at?: string
          created_by?: string | null
          current_location?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          device_type_id: string
          gpu?: string | null
          hostname?: string | null
          id?: string
          ip_address?: unknown
          mac_address?: string | null
          manufacturer?: string | null
          manufacturer_warranty_until?: string | null
          memory_ram?: string | null
          model?: string | null
          motherboard?: string | null
          notes?: string | null
          operating_system?: string | null
          organization_id: string
          patrimony?: string | null
          processor?: string | null
          public_code?: string
          serial_number?: string | null
          service_tag?: string | null
          status?: string
          storage?: string | null
          system_version?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          acquisition_date?: string | null
          architecture?: string | null
          branch_id?: string | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          current_location?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          device_type_id?: string
          gpu?: string | null
          hostname?: string | null
          id?: string
          ip_address?: unknown
          mac_address?: string | null
          manufacturer?: string | null
          manufacturer_warranty_until?: string | null
          memory_ram?: string | null
          model?: string | null
          motherboard?: string | null
          notes?: string | null
          operating_system?: string | null
          organization_id?: string
          patrimony?: string | null
          processor?: string | null
          public_code?: string
          serial_number?: string | null
          service_tag?: string | null
          status?: string
          storage?: string | null
          system_version?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_device_type_id_fkey"
            columns: ["device_type_id"]
            isOneToOne: false
            referencedRelation: "device_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          all_branches: boolean
          created_at: string
          id: string
          organization_id: string
          role_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          all_branches?: boolean
          created_at?: string
          id?: string
          organization_id: string
          role_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          all_branches?: boolean
          created_at?: string
          id?: string
          organization_id?: string
          role_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          name: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          name: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          name?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system: boolean
          key: string
          name: string
          organization_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          key: string
          name: string
          organization_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          key?: string
          name?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_branch_access: {
        Row: {
          branch_id: string
          created_at: string
          organization_member_id: string
        }
        Insert: {
          branch_id: string
          created_at?: string
          organization_member_id: string
        }
        Update: {
          branch_id?: string
          created_at?: string
          organization_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_branch_access_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_branch_access_organization_member_id_fkey"
            columns: ["organization_member_id"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_initial_workspace: {
        Args: {
          p_branch_code: string
          p_branch_name: string
          p_full_name: string
          p_organization_name: string
          p_phone?: string
          p_slug: string
        }
        Returns: {
          branch_id: string
          member_id: string
          organization_id: string
          profile_id: string
        }[]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
