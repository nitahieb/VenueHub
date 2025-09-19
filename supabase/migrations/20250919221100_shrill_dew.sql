/*
  # Create venues database schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
    - `venues`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `zip_code` (text)
      - `seated_capacity` (integer)
      - `standing_capacity` (integer)
      - `hourly_price` (integer)
      - `daily_price` (integer)
      - `category` (text)
      - `amenities` (text array)
      - `images` (text array)
      - `rating` (decimal)
      - `reviews_count` (integer)
      - `availability` (boolean)
      - `featured` (boolean)
      - `status` (text)
      - `owner_id` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to approved venues
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create venues table
CREATE TABLE IF NOT EXISTS venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  seated_capacity integer NOT NULL,
  standing_capacity integer NOT NULL,
  hourly_price integer NOT NULL,
  daily_price integer NOT NULL,
  category text NOT NULL CHECK (category IN ('wedding', 'corporate', 'party', 'conference', 'exhibition', 'outdoor', 'historic', 'modern')),
  amenities text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  rating decimal(3,2) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  availability boolean DEFAULT true,
  featured boolean DEFAULT false,
  status text DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Venues policies
CREATE POLICY "Anyone can read approved venues"
  ON venues
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

CREATE POLICY "Users can read own venues"
  ON venues
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own venues"
  ON venues
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own venues"
  ON venues
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own venues"
  ON venues
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();