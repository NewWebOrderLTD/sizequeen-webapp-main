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
      users: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          billing_address: Json | null
          payment_method: Json | null
          gender: string | null
          age: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          payment_method?: Json | null
          gender?: string | null
          age?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          billing_address?: Json | null
          payment_method?: Json | null
          gender?: string | null
          age?: string | null
        }
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
      }
      products: {
        Row: {
          id: string
          active: boolean | null
          name: string | null
          description: string | null
          image: string | null
          metadata: Json | null
        }
        Insert: {
          id: string
          active?: boolean | null
          name?: string | null
          description?: string | null
          image?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          active?: boolean | null
          name?: string | null
          description?: string | null
          image?: string | null
          metadata?: Json | null
        }
      }
      prices: {
        Row: {
          id: string
          product_id: string | null
          active: boolean | null
          description: string | null
          unit_amount: number | null
          currency: string | null
          type: 'one_time' | 'recurring' | null
          interval: 'day' | 'week' | 'month' | 'year' | null
          interval_count: number | null
          trial_period_days: number | null
          metadata: Json | null
        }
        Insert: {
          id: string
          product_id?: string | null
          active?: boolean | null
          description?: string | null
          unit_amount?: number | null
          currency?: string | null
          type?: 'one_time' | 'recurring' | null
          interval?: 'day' | 'week' | 'month' | 'year' | null
          interval_count?: number | null
          trial_period_days?: number | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          product_id?: string | null
          active?: boolean | null
          description?: string | null
          unit_amount?: number | null
          currency?: string | null
          type?: 'one_time' | 'recurring' | null
          interval?: 'day' | 'week' | 'month' | 'year' | null
          interval_count?: number | null
          trial_period_days?: number | null
          metadata?: Json | null
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: 'trialing' | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'paused' | null
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          cancel_at_period_end: boolean | null
          created: string
          current_period_start: string
          current_period_end: string
          ended_at: string | null
          cancel_at: string | null
          canceled_at: string | null
          trial_start: string | null
          trial_end: string | null
        }
        Insert: {
          id: string
          user_id: string
          status?: 'trialing' | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'paused' | null
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          cancel_at_period_end?: boolean | null
          created?: string
          current_period_start?: string
          current_period_end?: string
          ended_at?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'trialing' | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'paused' | null
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          cancel_at_period_end?: boolean | null
          created?: string
          current_period_start?: string
          current_period_end?: string
          ended_at?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
        }
      }
      user_measurements: {
        Row: {
          id: string
          user_id: string
          height_value: number | null
          height_unit: string | null
          weight_value: number | null
          weight_unit: string | null
          chest_value: number | null
          chest_unit: string | null
          waist_value: number | null
          waist_unit: string | null
          arm_value: number | null
          arm_unit: string | null
          shoulder_value: number | null
          shoulder_unit: string | null
          hip_value: number | null
          hip_unit: string | null
          thigh_value: number | null
          thigh_unit: string | null
          leg_inseam_value: number | null
          leg_inseam_unit: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          height_value?: number | null
          height_unit?: string | null
          weight_value?: number | null
          weight_unit?: string | null
          chest_value?: number | null
          chest_unit?: string | null
          waist_value?: number | null
          waist_unit?: string | null
          arm_value?: number | null
          arm_unit?: string | null
          shoulder_value?: number | null
          shoulder_unit?: string | null
          hip_value?: number | null
          hip_unit?: string | null
          thigh_value?: number | null
          thigh_unit?: string | null
          leg_inseam_value?: number | null
          leg_inseam_unit?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          height_value?: number | null
          height_unit?: string | null
          weight_value?: number | null
          weight_unit?: string | null
          chest_value?: number | null
          chest_unit?: string | null
          waist_value?: number | null
          waist_unit?: string | null
          arm_value?: number | null
          arm_unit?: string | null
          shoulder_value?: number | null
          shoulder_unit?: string | null
          hip_value?: number | null
          hip_unit?: string | null
          thigh_value?: number | null
          thigh_unit?: string | null
          leg_inseam_value?: number | null
          leg_inseam_unit?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      pricing_plan_interval: 'day' | 'week' | 'month' | 'year'
      pricing_type: 'one_time' | 'recurring'
      subscription_status: 'trialing' | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'paused'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Row: infer R
    }
      ? R
      : never)
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'])
    ? (Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Row: infer R
      }
        ? R
        : never)
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
      ? I
      : never)
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'])
    ? (Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
        ? I
        : never)
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
      ? U
      : never)
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'])
    ? (Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
        ? U
        : never)
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (Database['public']['Enums'])
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicEnumNameOrOptions['schema']]['Enums'])
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof (Database['public']['Enums'])
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof (Database['public']['CompositeTypes'])
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'])
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof (Database['public']['CompositeTypes'])
    ? Database['public']['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

// Helper types
export interface ProductWithPrices extends Tables<'products'> {
  prices: Tables<'prices'>[]
}

export interface PriceWithProduct extends Tables<'prices'> {
  products: Tables<'products'> | null
}

export interface SubscriptionWithProduct extends Tables<'subscriptions'> {
  prices: PriceWithProduct | null
}
