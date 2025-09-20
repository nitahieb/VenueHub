/*
  # Add Semantic Search Database Functions

  1. Database Functions
    - `search_venues_hybrid` - Performs semantic search on venues and reviews
    - `venues_within_distance` - Geographic proximity search helper
  
  2. Indexes
    - HNSW vector indexes for fast similarity search
    - GiST spatial indexes for location-based queries
  
  3. Search Features
    - Semantic similarity search using cosine distance
    - Hybrid search combining venue and review embeddings
    - Geographic filtering capabilities
    - Configurable similarity thresholds
*/

-- Create the hybrid semantic search function for venues
CREATE OR REPLACE FUNCTION search_venues_hybrid(
  query_embedding vector(1024),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  venue_id uuid,
  venue_name text,
  venue_description text,
  city text,
  state text,
  category text,
  max_similarity float,
  review_matches int
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH venue_similarities AS (
    -- Search venue embeddings
    SELECT 
      v.id as venue_id,
      v.name as venue_name,
      v.description as venue_description,
      v.city,
      v.state,
      v.category,
      1 - (v.embedding <=> query_embedding) as similarity,
      0 as review_matches
    FROM venues v
    WHERE v.embedding IS NOT NULL
      AND v.status = 'approved'
      AND (1 - (v.embedding <=> query_embedding)) >= match_threshold
  ),
  review_similarities AS (
    -- Search review embeddings and aggregate by venue
    SELECT 
      v.id as venue_id,
      v.name as venue_name,
      v.description as venue_description,
      v.city,
      v.state,
      v.category,
      MAX(1 - (r.embedding <=> query_embedding)) as similarity,
      COUNT(*)::int as review_matches
    FROM venues v
    JOIN reviews r ON r.venue_id = v.id
    WHERE r.embedding IS NOT NULL
      AND v.status = 'approved'
      AND (1 - (r.embedding <=> query_embedding)) >= match_threshold
    GROUP BY v.id, v.name, v.description, v.city, v.state, v.category
  ),
  combined_results AS (
    -- Combine venue and review results, taking the best similarity score
    SELECT 
      COALESCE(vs.venue_id, rs.venue_id) as venue_id,
      COALESCE(vs.venue_name, rs.venue_name) as venue_name,
      COALESCE(vs.venue_description, rs.venue_description) as venue_description,
      COALESCE(vs.city, rs.city) as city,
      COALESCE(vs.state, rs.state) as state,
      COALESCE(vs.category, rs.category) as category,
      GREATEST(
        COALESCE(vs.similarity, 0),
        COALESCE(rs.similarity, 0)
      ) as max_similarity,
      COALESCE(rs.review_matches, 0) as review_matches
    FROM venue_similarities vs
    FULL OUTER JOIN review_similarities rs ON vs.venue_id = rs.venue_id
  )
  SELECT 
    cr.venue_id,
    cr.venue_name,
    cr.venue_description,
    cr.city,
    cr.state,
    cr.category,
    cr.max_similarity,
    cr.review_matches
  FROM combined_results cr
  ORDER BY cr.max_similarity DESC, cr.review_matches DESC
  LIMIT match_count;
END;
$$;

-- Create function for geographic proximity search
CREATE OR REPLACE FUNCTION venues_within_distance(
  lat float,
  lon float,
  distance_meters int DEFAULT 15000
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  address text,
  city text,
  state text,
  zip_code text,
  seated_capacity int,
  standing_capacity int,
  hourly_price int,
  daily_price int,
  category text,
  amenities text[],
  images text[],
  rating numeric,
  reviews_count int,
  availability boolean,
  featured boolean,
  status text,
  owner_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  latitude numeric,
  longitude numeric,
  distance_meters float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.*,
    ST_Distance(
      ST_MakePoint(v.longitude::float, v.latitude::float)::geography,
      ST_MakePoint(lon, lat)::geography
    ) as distance_meters
  FROM venues v
  WHERE v.latitude IS NOT NULL 
    AND v.longitude IS NOT NULL
    AND ST_DWithin(
      ST_MakePoint(v.longitude::float, v.latitude::float)::geography,
      ST_MakePoint(lon, lat)::geography,
      distance_meters
    )
  ORDER BY ST_MakePoint(v.longitude::float, v.latitude::float)::geography <-> ST_MakePoint(lon, lat)::geography;
END;
$$;

-- Ensure vector indexes exist for fast similarity search
CREATE INDEX IF NOT EXISTS venues_embedding_idx 
ON venues USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS reviews_embedding_idx 
ON reviews USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- Ensure spatial index exists for location queries
CREATE INDEX IF NOT EXISTS venues_location_idx 
ON venues USING gist (ST_MakePoint(longitude::double precision, latitude::double precision));