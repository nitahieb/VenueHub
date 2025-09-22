import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      venues: {
        Row: {
          id: string;
          name: string;
          description: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          seated_capacity: number;
          standing_capacity: number;
          hourly_price: number | null;
          daily_price: number | null;
          category: string;
          amenities: string[];
          images: string[];
          rating: number;
          reviews_count: number;
          availability: boolean;
          featured: boolean;
          status: string;
          owner_id: string | null;
          created_at: string;
          updated_at: string;
          latitude: number | null;
          longitude: number | null;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          seated_capacity: number;
          standing_capacity: number;
          hourly_price: number;
          daily_price: number;
          category: string;
          amenities?: string[];
          images?: string[];
          rating?: number;
          reviews_count?: number;
          availability?: boolean;
          featured?: boolean;
          status?: string;
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
          latitude?: number | null;
          longitude?: number | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          seated_capacity?: number;
          standing_capacity?: number;
          hourly_price?: number;
          daily_price?: number;
          category?: string;
          amenities?: string[];
          images?: string[];
          rating?: number;
          reviews_count?: number;
          availability?: boolean;
          featured?: boolean;
          status?: string;
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
          latitude?: number | null;
          longitude?: number | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          venue_id: string;
          user_name: string;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          venue_id: string;
          user_name: string;
          rating: number;
          comment: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          venue_id?: string;
          user_name?: string;
          rating?: number;
          comment?: string;
          created_at?: string;
        };
      };
    };
  };
}