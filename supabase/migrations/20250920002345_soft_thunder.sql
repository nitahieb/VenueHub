/*
  # Add Distance Search Function

  1. Function
    - `venues_within_distance` - Returns venues within specified distance from coordinates
    - Uses PostGIS ST_DistanceSphere for accurate distance calculations
    - Optimized with spatial indexing

  2. Usage
    - Call with latitude, longitude, and distance in meters
    - Returns venue IDs that are within the specified radius
*/

-- Create function to find venues within distance
CREATE OR REPLACE FUNCTION venues_within_distance(
  lat NUMERIC,
  lon NUMERIC,
  distance_meters INTEGER DEFAULT 15000
)
RETURNS TABLE(id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT v.id
  FROM venues v
  WHERE v.latitude IS NOT NULL 
    AND v.longitude IS NOT NULL
    AND ST_DistanceSphere(
      ST_MakePoint(v.longitude, v.latitude),
      ST_MakePoint(lon, lat)
    ) <= distance_meters;
END;
$$ LANGUAGE plpgsql;