/*
  # Enhanced Semantic Search Functions

  This migration creates comprehensive database functions for semantic search that properly
  combine venue and review embeddings for better search results.

  ## Functions Created

  1. **search_venues_hybrid** - Main hybrid search combining venue and review embeddings
  2. **search_venues_only** - Fallback venue-only search
  3. **venues_within_distance** - Geospatial search function

  ## Features

  - Combines venue and review similarity scores using weighted average
  - Handles cases where venues have no reviews
  - Includes review match counts and similarity scores
  - Supports geospatial filtering
  - Optimized for performance with proper indexing
*/

-- Create the hybrid search function that combines venue and review embeddings
CREATE OR REPLACE FUNCTION search_venues_hybrid(
  query_embedding vector(1024),
  match_threshold float DEFAULT 0.4,
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
    SELECT
      v.id,
      v.name,
      v.description,
      v.city,
      v.state,
      v.category,
      GREATEST(0, 1 - (v.embedding <=> query_embedding)) AS venue_similarity
    FROM venues v
    WHERE v.status = 'approved'
      AND v.embedding IS NOT NULL
      AND (1 - (v.embedding <=> query_embedding)) > (match_threshold * 0.7) -- Slightly lower threshold for venues
  ),
  review_similarities AS (
    SELECT
      r.venue_id,
      MAX(GREATEST(0, 1 - (r.embedding <=> query_embedding))) AS max_review_similarity,
      COUNT(*) AS review_count
    FROM reviews r
    WHERE r.embedding IS NOT NULL
      AND (1 - (r.embedding <=> query_embedding)) > match_threshold
    GROUP BY r.venue_id
  ),
  combined_results AS (
    SELECT
      vs.id AS venue_id,
      vs.name AS venue_name,
      vs.description AS venue_description,
      vs.city,
      vs.state,
      vs.category,
      -- Weighted combination: 60% venue similarity, 40% review similarity
      CASE 
        WHEN rs.max_review_similarity IS NOT NULL THEN
          (0.6 * vs.venue_similarity + 0.4 * rs.max_review_similarity)
        ELSE
          vs.venue_similarity
      END AS combined_similarity,
      COALESCE(rs.review_count, 0) AS review_matches
    FROM venue_similarities vs
    LEFT JOIN review_similarities rs ON vs.id = rs.venue_id
    
    UNION
    
    -- Include venues that only match through reviews (no direct venue match)
    SELECT
      v.id AS venue_id,
      v.name AS venue_name,
      v.description AS venue_description,
      v.city,
      v.state,
      v.category,
      -- For review-only matches, use 70% of review similarity
      (0.7 * rs.max_review_similarity) AS combined_similarity,
      rs.review_count AS review_matches
    FROM review_similarities rs
    JOIN venues v ON v.id = rs.venue_id
    WHERE v.status = 'approved'
      AND NOT EXISTS (
        SELECT 1 FROM venue_similarities vs WHERE vs.id = rs.venue_id
      )
  )
  SELECT
    cr.venue_id,
    cr.venue_name,
    cr.venue_description,
    cr.city,
    cr.state,
    cr.category,
    cr.combined_similarity AS max_similarity,
    cr.review_matches::int
  FROM combined_results cr
  WHERE cr.combined_similarity > match_threshold
  ORDER BY cr.combined_similarity DESC, cr.review_matches DESC
  LIMIT match_count;
END;
$$;

-- Create a fallback venue-only search function
CREATE OR REPLACE FUNCTION search_venues_only(
  query_embedding vector(1024),
  match_threshold float DEFAULT 0.4,
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
  SELECT
    v.id AS venue_id,
    v.name AS venue_name,
    v.description AS venue_description,
    v.city,
    v.state,
    v.category,
    GREATEST(0, 1 - (v.embedding <=> query_embedding)) AS max_similarity,
    0 AS review_matches
  FROM venues v
  WHERE v.status = 'approved'
    AND v.embedding IS NOT NULL
    AND (1 - (v.embedding <=> query_embedding)) > match_threshold
  ORDER BY (1 - (v.embedding <=> query_embedding)) DESC
  LIMIT match_count;
END;
$$;

-- Enhanced geospatial search function
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
    ) AS distance_meters
  FROM venues v
  WHERE v.status = 'approved'
    AND v.latitude IS NOT NULL
    AND v.longitude IS NOT NULL
    AND ST_DWithin(
      ST_MakePoint(v.longitude::float, v.latitude::float)::geography,
      ST_MakePoint(lon, lat)::geography,
      distance_meters
    )
  ORDER BY distance_meters;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION search_venues_hybrid TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_venues_only TO anon, authenticated;
GRANT EXECUTE ON FUNCTION venues_within_distance TO anon, authenticated;