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
      "LNG Information": {
        Row: {
          date: string | null
          EETL_cargo: number | null
          id: number
          import_Volume: number | null
          LT_Volume: number | null
          num_Long_Term_Cargoes: number | null
          num_Spot_Cargoes: number | null
          PGPCL_cargo: number | null
          Spot_Volume: number | null
          Total_Cargoes: number | null
        }
        Insert: {
          date?: string | null
          EETL_cargo?: number | null
          id: number
          import_Volume?: number | null
          LT_Volume?: number | null
          num_Long_Term_Cargoes?: number | null
          num_Spot_Cargoes?: number | null
          PGPCL_cargo?: number | null
          Spot_Volume?: number | null
          Total_Cargoes?: number | null
        }
        Update: {
          date?: string | null
          EETL_cargo?: number | null
          id?: number
          import_Volume?: number | null
          LT_Volume?: number | null
          num_Long_Term_Cargoes?: number | null
          num_Spot_Cargoes?: number | null
          PGPCL_cargo?: number | null
          Spot_Volume?: number | null
          Total_Cargoes?: number | null
        }
        Relationships: []
      }
      "LNG Port_Price_Import": {
        Row: {
          date: string | null
          DES_Slope: number | null
          id: number
          Long_Term_DES: number | null
          Long_Term_Slope: number | null
          PLL_DES: number | null
          PSO_DES: number | null
          Spot_DES: number | null
          Spot_Slope: number | null
          wAvg_DES: number | null
          wAvg_Port_Charges: number | null
        }
        Insert: {
          date?: string | null
          DES_Slope?: number | null
          id: number
          Long_Term_DES?: number | null
          Long_Term_Slope?: number | null
          PLL_DES?: number | null
          PSO_DES?: number | null
          Spot_DES?: number | null
          Spot_Slope?: number | null
          wAvg_DES?: number | null
          wAvg_Port_Charges?: number | null
        }
        Update: {
          date?: string | null
          DES_Slope?: number | null
          id?: number
          Long_Term_DES?: number | null
          Long_Term_Slope?: number | null
          PLL_DES?: number | null
          PSO_DES?: number | null
          Spot_DES?: number | null
          Spot_Slope?: number | null
          wAvg_DES?: number | null
          wAvg_Port_Charges?: number | null
        }
        Relationships: []
      }
      "LNG Power Gen": {
        Row: {
          brentAvg: number | null
          date: string | null
          id: number
          importPayment: number | null
          powerGenCost: number | null
          powerGeneration: number | null
          rlngShare: number | null
          total_power_gen: number | null
        }
        Insert: {
          brentAvg?: number | null
          date?: string | null
          id: number
          importPayment?: number | null
          powerGenCost?: number | null
          powerGeneration?: number | null
          rlngShare?: number | null
          total_power_gen?: number | null
        }
        Update: {
          brentAvg?: number | null
          date?: string | null
          id?: number
          importPayment?: number | null
          powerGenCost?: number | null
          powerGeneration?: number | null
          rlngShare?: number | null
          total_power_gen?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          country: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          location: string | null
          phone_number: string | null
          position: string | null
          social_media_link: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          country?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          location?: string | null
          phone_number?: string | null
          position?: string | null
          social_media_link?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          country?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          phone_number?: string | null
          position?: string | null
          social_media_link?: string | null
          updated_at?: string | null
          username?: string | null
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
      "special date": "YYYY" | "MM"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
