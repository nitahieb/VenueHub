/*
  # Add Geospatial Support to Venues

  1. New Columns
    - `latitude` (numeric) - Venue latitude coordinate
    - `longitude` (numeric) - Venue longitude coordinate

  2. Indexes
    - Add spatial index for efficient distance queries
    - Enable PostGIS extension for geospatial functions

  3. Notes
    - Coordinates will be populated via geocoding API when address is entered
    - Enables distance-based venue searches
*/

-- Enable PostGIS extension for geospatial functions
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add latitude and longitude columns to venues table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'venues' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE venues ADD COLUMN latitude NUMERIC(10, 8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'venues' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE venues ADD COLUMN longitude NUMERIC(11, 8);
  END IF;
END $$;

-- Create spatial index for efficient distance queries
CREATE INDEX IF NOT EXISTS venues_location_idx ON venues USING GIST (ST_MakePoint(longitude, latitude));

-- Add comment for documentation
COMMENT ON COLUMN venues.latitude IS 'Venue latitude coordinate for geospatial queries';
COMMENT ON COLUMN venues.longitude IS 'Venue longitude coordinate for geospatial queries';