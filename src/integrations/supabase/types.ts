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
      carbon_strategies: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          expected_reduction: number | null
          id: string
          implementation_year: number | null
          status: string | null
          strategy_type: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          expected_reduction?: number | null
          id?: string
          implementation_year?: number | null
          status?: string | null
          strategy_type: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          expected_reduction?: number | null
          id?: string
          implementation_year?: number | null
          status?: string | null
          strategy_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "carbon_strategies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          carbon_footprint: number
          created_at: string | null
          description: string | null
          energy_consumption: number
          id: string
          industry: string | null
          name: string
          renewable_energy_percentage: number | null
          sector: string | null
          top_carbon_footprints: string[] | null
          updated_at: string | null
          waste_generated: number
        }
        Insert: {
          carbon_footprint?: number
          created_at?: string | null
          description?: string | null
          energy_consumption?: number
          id: string
          industry?: string | null
          name: string
          renewable_energy_percentage?: number | null
          sector?: string | null
          top_carbon_footprints?: string[] | null
          updated_at?: string | null
          waste_generated?: number
        }
        Update: {
          carbon_footprint?: number
          created_at?: string | null
          description?: string | null
          energy_consumption?: number
          id?: string
          industry?: string | null
          name?: string
          renewable_energy_percentage?: number | null
          sector?: string | null
          top_carbon_footprints?: string[] | null
          updated_at?: string | null
          waste_generated?: number
        }
        Relationships: []
      }
      emissions_data: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          scope1: number
          scope2: number
          scope3: number
          year: number
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          scope1?: number
          scope2?: number
          scope3?: number
          year: number
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          scope1?: number
          scope2?: number
          scope3?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "emissions_data_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      frameworks_compliance: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          framework_name: string
          id: string
          last_updated: string | null
          status: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          framework_name: string
          id?: string
          last_updated?: string | null
          status: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          framework_name?: string
          id?: string
          last_updated?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "frameworks_compliance_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      sbti_pathway_data: {
        Row: {
          actual_emissions: number | null
          company_id: string | null
          created_at: string | null
          id: string
          target_emissions: number | null
          year: number
        }
        Insert: {
          actual_emissions?: number | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          target_emissions?: number | null
          year: number
        }
        Update: {
          actual_emissions?: number | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          target_emissions?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "sbti_pathway_data_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      sbti_targets: {
        Row: {
          baseline_year: number | null
          company_id: string | null
          created_at: string | null
          current_progress_scope1_2: number
          current_progress_scope3: number
          description: string | null
          id: string
          long_term_target: string | null
          near_term_2030_scope1_2: number
          near_term_2030_scope3: number
          near_term_target: string | null
          progress_percentage: number | null
          status: string | null
          target_year: number | null
        }
        Insert: {
          baseline_year?: number | null
          company_id?: string | null
          created_at?: string | null
          current_progress_scope1_2: number
          current_progress_scope3: number
          description?: string | null
          id?: string
          long_term_target?: string | null
          near_term_2030_scope1_2: number
          near_term_2030_scope3: number
          near_term_target?: string | null
          progress_percentage?: number | null
          status?: string | null
          target_year?: number | null
        }
        Update: {
          baseline_year?: number | null
          company_id?: string | null
          created_at?: string | null
          current_progress_scope1_2?: number
          current_progress_scope3?: number
          description?: string | null
          id?: string
          long_term_target?: string | null
          near_term_2030_scope1_2?: number
          near_term_2030_scope3?: number
          near_term_target?: string | null
          progress_percentage?: number | null
          status?: string | null
          target_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sbti_targets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      scope1_emissions: {
        Row: {
          company_id: string | null
          created_at: string | null
          emissions_by_source: number
          id: string
          source: string
          total_emissions: number
          year: number
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          emissions_by_source: number
          id?: string
          source: string
          total_emissions: number
          year: number
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          emissions_by_source?: number
          id?: string
          source?: string
          total_emissions?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "scope1_emissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      scope2_emissions: {
        Row: {
          company_id: string | null
          created_at: string | null
          emissions_by_source: number
          id: string
          location: string | null
          percentage: string | null
          source: string
          total_emissions: number
          year: number
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          emissions_by_source: number
          id?: string
          location?: string | null
          percentage?: string | null
          source: string
          total_emissions: number
          year: number
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          emissions_by_source?: number
          id?: string
          location?: string | null
          percentage?: string | null
          source?: string
          total_emissions?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "scope2_emissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      scope3_emissions: {
        Row: {
          category: string
          company_id: string | null
          created_at: string | null
          emissions_by_category: number
          id: string
          influence_factors: string | null
          insights: string | null
          total_emissions: number
          year: number
        }
        Insert: {
          category: string
          company_id?: string | null
          created_at?: string | null
          emissions_by_category: number
          id?: string
          influence_factors?: string | null
          insights?: string | null
          total_emissions: number
          year: number
        }
        Update: {
          category?: string
          company_id?: string | null
          created_at?: string | null
          emissions_by_category?: number
          id?: string
          influence_factors?: string | null
          insights?: string | null
          total_emissions?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "scope3_emissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
