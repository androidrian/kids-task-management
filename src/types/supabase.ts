export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string
          username: string
          full_name: string
          avatar_url: string | null
          child_name: string | null
        }
        Insert: {
          id: string
          updated_at?: string
          username: string
          full_name: string
          avatar_url?: string | null
          child_name?: string | null
        }
        Update: {
          id?: string
          updated_at?: string
          username?: string
          full_name?: string
          avatar_url?: string | null
          child_name?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          title: string
          points: number
          completed: boolean
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          points: number
          completed?: boolean
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          points?: number
          completed?: boolean
          user_id?: string
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
      [_ in never]: never
    }
  }
}