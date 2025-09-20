/*
  # Create venues_within_distance RPC function

  1. Extensions
    - Enable PostGIS extension for geospatial operations

  2. Functions
    - `venues_within_distance(distance_meters, lat, lon)` - Returns venue IDs within specified distance from coordinates
    - Uses ST_DWithin for efficient geospatial distance calculations
    - Returns only venue IDs to minimize data transfer

  3. Security
    - Function is accessible to authenticated and anonymous users for venue search functionality
*/

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the venues_within_distance function
CREATE OR REPLACE FUNCTION public.venues_within_distance(
  distance_meters float,
  lat float,
  lon float
)
RETURNS TABLE(id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id
  FROM
    public.venues AS v
  WHERE
    v.latitude IS NOT NULL 
    AND v.longitude IS NOT NULL 
    AND v.status = 'approved'
    AND ST_DWithin(
      ST_MakePoint(v.longitude, v.latitude)::geography,
      ST_MakePoint(lon, lat)::geography,
      distance_meters
    );
END;
$$;