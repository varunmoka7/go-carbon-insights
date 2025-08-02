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
      archetype_configurations: {
        Row: {
          archetype_name: string
          benchmarking_considerations: string | null
          created_at: string
          id: string
          key_scope3_categories: string[] | null
          reporting_complexity: string
          scope1_priority: number
          scope2_priority: number
          scope3_priority: number
          typical_hotspots: string[] | null
          updated_at: string
        }
        Insert: {
          archetype_name: string
          benchmarking_considerations?: string | null
          created_at?: string
          id?: string
          key_scope3_categories?: string[] | null
          reporting_complexity?: string
          scope1_priority?: number
          scope2_priority?: number
          scope3_priority?: number
          typical_hotspots?: string[] | null
          updated_at?: string
        }
        Update: {
          archetype_name?: string
          benchmarking_considerations?: string | null
          created_at?: string
          id?: string
          key_scope3_categories?: string[] | null
          reporting_complexity?: string
          scope1_priority?: number
          scope2_priority?: number
          scope3_priority?: number
          typical_hotspots?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          company_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "public_company_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
          {
            foreignKeyName: "carbon_strategies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "public_company_data"
            referencedColumns: ["id"]
          },
        ]
      }
      community_categories: {
        Row: {
          color: string | null
          created_at: string
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "community_users"
            referencedColumns: ["id"]
          },
        ]
      }
      community_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          downvotes: number
          id: string
          is_expert_answer: boolean
          parent_id: string | null
          topic_id: string
          updated_at: string
          upvotes: number
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          downvotes?: number
          id?: string
          is_expert_answer?: boolean
          parent_id?: string | null
          topic_id: string
          updated_at?: string
          upvotes?: number
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          downvotes?: number
          id?: string
          is_expert_answer?: boolean
          parent_id?: string | null
          topic_id?: string
          updated_at?: string
          upvotes?: number
        }
        Relationships: [
          {
            foreignKeyName: "community_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "community_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_replies_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "community_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_replies_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "community_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      community_topics: {
        Row: {
          author_id: string
          category_id: string
          content: string | null
          context_file: string | null
          created_at: string
          id: string
          is_locked: boolean
          is_pinned: boolean
          last_reply_at: string | null
          last_reply_by: string | null
          reply_count: number
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id: string
          category_id: string
          content?: string | null
          context_file?: string | null
          created_at?: string
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          last_reply_at?: string | null
          last_reply_by?: string | null
          reply_count?: number
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string
          category_id?: string
          content?: string | null
          context_file?: string | null
          created_at?: string
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          last_reply_at?: string | null
          last_reply_by?: string | null
          reply_count?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "community_topics_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "community_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_topics_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "community_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_topics_last_reply_by_fkey"
            columns: ["last_reply_by"]
            isOneToOne: false
            referencedRelation: "community_users"
            referencedColumns: ["id"]
          },
        ]
      }
      community_users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          display_name: string | null
          email: string
          id: string
          is_active: boolean
          is_gct_team: boolean
          joined_at: string
          last_active: string | null
          reputation: number | null
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          is_active?: boolean
          is_gct_team?: boolean
          joined_at?: string
          last_active?: string | null
          reputation?: number | null
          role?: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          is_active?: boolean
          is_gct_team?: boolean
          joined_at?: string
          last_active?: string | null
          reputation?: number | null
          role?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          carbon_footprint: number
          created_at: string | null
          data_source_attribution: Json | null
          description: string | null
          energy_consumption: number
          exchange: string | null
          figi: string | null
          id: string
          identifier_confidence_score: number | null
          industry: string | null
          lei: string | null
          mic_code: string | null
          name: string
          permid: string | null
          renewable_energy_percentage: number | null
          sector: string | null
          ticker: string | null
          top_carbon_footprints: string[] | null
          trancenable_company_id: string | null
          updated_at: string | null
          waste_generated: number
        }
        Insert: {
          carbon_footprint?: number
          created_at?: string | null
          data_source_attribution?: Json | null
          description?: string | null
          energy_consumption?: number
          exchange?: string | null
          figi?: string | null
          id: string
          identifier_confidence_score?: number | null
          industry?: string | null
          lei?: string | null
          mic_code?: string | null
          name: string
          permid?: string | null
          renewable_energy_percentage?: number | null
          sector?: string | null
          ticker?: string | null
          top_carbon_footprints?: string[] | null
          trancenable_company_id?: string | null
          updated_at?: string | null
          waste_generated?: number
        }
        Update: {
          carbon_footprint?: number
          created_at?: string | null
          data_source_attribution?: Json | null
          description?: string | null
          energy_consumption?: number
          exchange?: string | null
          figi?: string | null
          id?: string
          identifier_confidence_score?: number | null
          industry?: string | null
          lei?: string | null
          mic_code?: string | null
          name?: string
          permid?: string | null
          renewable_energy_percentage?: number | null
          sector?: string | null
          ticker?: string | null
          top_carbon_footprints?: string[] | null
          trancenable_company_id?: string | null
          updated_at?: string | null
          waste_generated?: number
        }
        Relationships: []
      }
      company_benchmarks: {
        Row: {
          benchmark_year: number
          company_id: string | null
          created_at: string | null
          emissions_per_employee: number | null
          emissions_per_revenue: number | null
          employee_range: string | null
          id: string
          industry: string
          is_public_data: boolean | null
          revenue_range: string | null
          sbti_status: string | null
          sector: string | null
          total_emissions: number
          updated_at: string | null
        }
        Insert: {
          benchmark_year: number
          company_id?: string | null
          created_at?: string | null
          emissions_per_employee?: number | null
          emissions_per_revenue?: number | null
          employee_range?: string | null
          id?: string
          industry: string
          is_public_data?: boolean | null
          revenue_range?: string | null
          sbti_status?: string | null
          sector?: string | null
          total_emissions: number
          updated_at?: string | null
        }
        Update: {
          benchmark_year?: number
          company_id?: string | null
          created_at?: string | null
          emissions_per_employee?: number | null
          emissions_per_revenue?: number | null
          employee_range?: string | null
          id?: string
          industry?: string
          is_public_data?: boolean | null
          revenue_range?: string | null
          sbti_status?: string | null
          sector?: string | null
          total_emissions?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_benchmarks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_benchmarks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "public_company_data"
            referencedColumns: ["id"]
          },
        ]
      }
      company_identifiers: {
        Row: {
          company_id: string
          confidence_score: number | null
          created_at: string
          id: string
          identifier_source: string
          identifier_type: string
          identifier_value: string
          is_primary: boolean | null
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          company_id: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          identifier_source?: string
          identifier_type: string
          identifier_value: string
          is_primary?: boolean | null
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          company_id?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          identifier_source?: string
          identifier_type?: string
          identifier_value?: string
          is_primary?: boolean | null
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_identifiers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_identifiers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "public_company_data"
            referencedColumns: ["id"]
          },
        ]
      }
      company_industries: {
        Row: {
          company_id: string
          created_at: string
          id: string
          industry_id: string
          percentage_allocation: number | null
          relationship_type: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          industry_id: string
          percentage_allocation?: number | null
          relationship_type?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          industry_id?: string
          percentage_allocation?: number | null
          relationship_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industry_taxonomy"
            referencedColumns: ["id"]
          },
        ]
      }
      emission_sources_detail: {
        Row: {
          activity_data: string | null
          calculation_approach: string | null
          created_at: string
          data_quality_rating: number | null
          emission_factor: string | null
          emission_scope: number
          emission_unit: string
          emission_value: number
          emissions_data_id: string
          ghg_protocol_category: string | null
          id: string
          source_category: string
          source_subcategory: string | null
          uncertainty_range: number | null
        }
        Insert: {
          activity_data?: string | null
          calculation_approach?: string | null
          created_at?: string
          data_quality_rating?: number | null
          emission_factor?: string | null
          emission_scope: number
          emission_unit?: string
          emission_value: number
          emissions_data_id: string
          ghg_protocol_category?: string | null
          id?: string
          source_category: string
          source_subcategory?: string | null
          uncertainty_range?: number | null
        }
        Update: {
          activity_data?: string | null
          calculation_approach?: string | null
          created_at?: string
          data_quality_rating?: number | null
          emission_factor?: string | null
          emission_scope?: number
          emission_unit?: string
          emission_value?: number
          emissions_data_id?: string
          ghg_protocol_category?: string | null
          id?: string
          source_category?: string
          source_subcategory?: string | null
          uncertainty_range?: number | null
        }
        Relationships: []
      }
      emissions_archetypes: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      emissions_data: {
        Row: {
          calculation_method: string | null
          company_id: string | null
          created_at: string | null
          data_lineage: Json | null
          disclosure_year: number | null
          emission_sources: Json | null
          id: string
          incomplete_boundaries: string | null
          scope1: number
          scope2: number
          scope3: number
          source_urls: Json | null
          trancenable_document_id: string | null
          year: number
        }
        Insert: {
          calculation_method?: string | null
          company_id?: string | null
          created_at?: string | null
          data_lineage?: Json | null
          disclosure_year?: number | null
          emission_sources?: Json | null
          id?: string
          incomplete_boundaries?: string | null
          scope1?: number
          scope2?: number
          scope3?: number
          source_urls?: Json | null
          trancenable_document_id?: string | null
          year: number
        }
        Update: {
          calculation_method?: string | null
          company_id?: string | null
          created_at?: string | null
          data_lineage?: Json | null
          disclosure_year?: number | null
          emission_sources?: Json | null
          id?: string
          incomplete_boundaries?: string | null
          scope1?: number
          scope2?: number
          scope3?: number
          source_urls?: Json | null
          trancenable_document_id?: string | null
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
          {
            foreignKeyName: "emissions_data_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "public_company_data"
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
          {
            foreignKeyName: "frameworks_compliance_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "public_company_data"
            referencedColumns: ["id"]
          },
        ]
      }
      industry_mapping_log: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          companies_using_mapping: number | null
          confidence_score: number
          created_at: string
          id: string
          last_used_at: string | null
          mapped_industry_id: string
          mapping_notes: string | null
          mapping_type: string
          trancenable_industry: string
          trancenable_sector: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          companies_using_mapping?: number | null
          confidence_score: number
          created_at?: string
          id?: string
          last_used_at?: string | null
          mapped_industry_id: string
          mapping_notes?: string | null
          mapping_type: string
          trancenable_industry: string
          trancenable_sector: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          companies_using_mapping?: number | null
          confidence_score?: number
          created_at?: string
          id?: string
          last_used_at?: string | null
          mapped_industry_id?: string
          mapping_notes?: string | null
          mapping_type?: string
          trancenable_industry?: string
          trancenable_sector?: string
        }
        Relationships: []
      }
      industry_tag_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string
          id: string
          industry_id: string
          tag_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          industry_id: string
          tag_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          industry_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "industry_tag_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "industry_tag_assignments_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industry_taxonomy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "industry_tag_assignments_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "industry_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      industry_tags: {
        Row: {
          color_code: string | null
          created_at: string
          description: string | null
          id: string
          tag_category: string
          tag_name: string
        }
        Insert: {
          color_code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          tag_category?: string
          tag_name: string
        }
        Update: {
          color_code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          tag_category?: string
          tag_name?: string
        }
        Relationships: []
      }
      industry_taxonomy: {
        Row: {
          cdp_category: string | null
          created_at: string
          description: string | null
          emissions_archetype: string
          ghg_protocol_alignment: string | null
          id: string
          industry: string
          sbti_pathway: string | null
          sector: string
          updated_at: string
        }
        Insert: {
          cdp_category?: string | null
          created_at?: string
          description?: string | null
          emissions_archetype: string
          ghg_protocol_alignment?: string | null
          id?: string
          industry: string
          sbti_pathway?: string | null
          sector: string
          updated_at?: string
        }
        Update: {
          cdp_category?: string | null
          created_at?: string
          description?: string | null
          emissions_archetype?: string
          ghg_protocol_alignment?: string | null
          id?: string
          industry?: string
          sbti_pathway?: string | null
          sector?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_id: string | null
          created_at: string
          email: string
          email_verified: boolean | null
          full_name: string | null
          id: string
          is_active: boolean | null
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email: string
          email_verified?: boolean | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          role?: string
          updated_at?: string
          username: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role?: string
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "public_company_data"
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
          {
            foreignKeyName: "sbti_pathway_data_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "public_company_data"
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
          {
            foreignKeyName: "sbti_targets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "public_company_data"
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
          {
            foreignKeyName: "scope1_emissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "public_company_data"
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
          {
            foreignKeyName: "scope2_emissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "public_company_data"
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
          {
            foreignKeyName: "scope3_emissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "public_company_data"
            referencedColumns: ["id"]
          },
        ]
      }
      taxonomy_audit_log: {
        Row: {
          action: string
          change_reason: string | null
          changed_by: string | null
          created_at: string
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "taxonomy_audit_log_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trancenable_import_log: {
        Row: {
          companies_created: number | null
          companies_updated: number | null
          created_at: string
          created_by: string | null
          data_completeness_score: number | null
          emissions_records_created: number | null
          error_details: Json | null
          id: string
          import_batch_id: string
          import_completed_at: string | null
          import_started_at: string
          import_status: string
          industry_mapping_confidence: number | null
          lei_match_rate: number | null
          processing_notes: string | null
          total_records_processed: number | null
          validation_errors: number | null
        }
        Insert: {
          companies_created?: number | null
          companies_updated?: number | null
          created_at?: string
          created_by?: string | null
          data_completeness_score?: number | null
          emissions_records_created?: number | null
          error_details?: Json | null
          id?: string
          import_batch_id: string
          import_completed_at?: string | null
          import_started_at?: string
          import_status?: string
          industry_mapping_confidence?: number | null
          lei_match_rate?: number | null
          processing_notes?: string | null
          total_records_processed?: number | null
          validation_errors?: number | null
        }
        Update: {
          companies_created?: number | null
          companies_updated?: number | null
          created_at?: string
          created_by?: string | null
          data_completeness_score?: number | null
          emissions_records_created?: number | null
          error_details?: Json | null
          id?: string
          import_batch_id?: string
          import_completed_at?: string | null
          import_started_at?: string
          import_status?: string
          industry_mapping_confidence?: number | null
          lei_match_rate?: number | null
          processing_notes?: string | null
          total_records_processed?: number | null
          validation_errors?: number | null
        }
        Relationships: []
      }
      user_company_access: {
        Row: {
          access_level: string
          company_id: string | null
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          user_id: string | null
        }
        Insert: {
          access_level: string
          company_id?: string | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          user_id?: string | null
        }
        Update: {
          access_level?: string
          company_id?: string | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_company_access_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_company_access_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "public_company_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_company_access_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_company_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          email_verified: boolean | null
          full_name: string | null
          id: string
          is_active: boolean | null
          role: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          role?: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_company_data: {
        Row: {
          benchmark_year: number | null
          description: string | null
          id: string | null
          industry: string | null
          name: string | null
          sbti_status: string | null
          sector: string | null
          total_emissions: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      bulk_insert_companies: {
        Args: { company_data: Json }
        Returns: Json
      }
      check_rate_limit: {
        Args: { user_uuid: string; operation_type: string }
        Returns: boolean
      }
      create_test_demo_account: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      create_test_demo_account_fixed: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      detect_suspicious_activity: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          activity_count: number
          distinct_companies: number
          risk_level: string
        }[]
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: string
      }
      increment_topic_views: {
        Args: { topic_uuid: string }
        Returns: Json
      }
      test_view_security: {
        Args: Record<PropertyKey, never>
        Returns: {
          test_name: string
          result: string
          details: string
        }[]
      }
      user_has_company_access: {
        Args: { user_uuid: string; company_text: string }
        Returns: boolean
      }
      user_has_company_access_level: {
        Args: {
          user_uuid: string
          company_text: string
          required_level: string
        }
        Returns: boolean
      }
      user_is_company_admin: {
        Args: { user_uuid: string; company_text: string }
        Returns: boolean
      }
    }
    Enums: {
      emissions_archetype:
        | "Operational Emitter"
        | "Upstream-heavy"
        | "Use-phase Dominant"
        | "Scope 2-heavy"
        | "Financed Emissions"
        | "Lifecycle-dependent"
        | "Offset-focused"
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
      emissions_archetype: [
        "Operational Emitter",
        "Upstream-heavy",
        "Use-phase Dominant",
        "Scope 2-heavy",
        "Financed Emissions",
        "Lifecycle-dependent",
        "Offset-focused",
      ],
    },
  },
} as const
