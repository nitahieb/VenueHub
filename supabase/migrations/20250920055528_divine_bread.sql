/*
  # Add Vector Embeddings for Semantic Search

  1. Database Schema Changes
    - Add embedding columns to venues and reviews tables
    - Enable pgvector extension for vector operations
    - Add indexes for efficient similarity search

  2. Embedding Strategy
    - Use VoyageAI voyage-3-large model (1024 dimensions)
    - Combine venue metadata into searchable text
    - Store both venue and review embeddings
    - Support cosine similarity search

  3. Search Functionality
    - Natural language query support
    - Semantic matching beyond keyword search
    - Relevance scoring and ranking
*/

-- Enable pgvector extension for vector operations
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding columns to venues table
ALTER TABLE venues 
ADD COLUMN IF NOT EXISTS embedding vector(1024),
ADD COLUMN IF NOT EXISTS embedding_text text,
ADD COLUMN IF NOT EXISTS embedding_updated_at timestamptz;

-- Add embedding columns to reviews table  
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS embedding vector(1024),
ADD COLUMN IF NOT EXISTS embedding_updated_at timestamptz;

-- Create indexes for efficient vector similarity search
CREATE INDEX IF NOT EXISTS venues_embedding_idx ON venues 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS reviews_embedding_idx ON reviews 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Function to generate searchable text for venues
CREATE OR REPLACE FUNCTION generate_venue_embedding_text(venue_row venues)
RETURNS text AS $$
BEGIN
    RETURN CONCAT_WS(' ',
        venue_row.name,
        venue_row.description,
        venue_row.category,
        venue_row.city,
        venue_row.state,
        CASE 
            WHEN venue_row.category = 'wedding' THEN 'wedding ceremony reception bridal romantic elegant'
            WHEN venue_row.category = 'corporate' THEN 'business meeting conference professional office'
            WHEN venue_row.category = 'party' THEN 'celebration birthday anniversary fun festive'
            WHEN venue_row.category = 'outdoor' THEN 'nature garden park scenic natural fresh air'
            WHEN venue_row.category = 'historic' THEN 'heritage vintage classic traditional architecture'
            WHEN venue_row.category = 'modern' THEN 'contemporary sleek minimalist urban chic'
            ELSE ''
        END,
        CASE 
            WHEN venue_row.seated_capacity > 200 THEN 'large spacious grand ballroom'
            WHEN venue_row.seated_capacity > 100 THEN 'medium sized comfortable'
            ELSE 'intimate cozy small private'
        END,
        CASE 
            WHEN venue_row.hourly_price > 100000 THEN 'luxury premium upscale exclusive high-end'
            WHEN venue_row.hourly_price > 50000 THEN 'upscale quality refined'
            ELSE 'affordable budget-friendly value'
        END,
        array_to_string(venue_row.amenities, ' ')
    );
END;
$$ LANGUAGE plpgsql;

-- Function to search venues by semantic similarity
CREATE OR REPLACE FUNCTION search_venues_semantic(
    query_embedding vector(1024),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id uuid,
    name text,
    description text,
    city text,
    state text,
    category text,
    similarity float
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.name,
        v.description,
        v.city,
        v.state,
        v.category,
        (1 - (v.embedding <=> query_embedding)) as similarity
    FROM venues v
    WHERE v.embedding IS NOT NULL
        AND v.status = 'approved'
        AND (1 - (v.embedding <=> query_embedding)) > match_threshold
    ORDER BY v.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Function to search reviews by semantic similarity
CREATE OR REPLACE FUNCTION search_reviews_semantic(
    query_embedding vector(1024),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 20
)
RETURNS TABLE (
    venue_id uuid,
    venue_name text,
    review_content text,
    rating int,
    similarity float
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.venue_id,
        v.name as venue_name,
        r.comment as review_content,
        r.rating,
        (1 - (r.embedding <=> query_embedding)) as similarity
    FROM reviews r
    JOIN venues v ON r.venue_id = v.id
    WHERE r.embedding IS NOT NULL
        AND v.status = 'approved'
        AND (1 - (r.embedding <=> query_embedding)) > match_threshold
    ORDER BY r.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get hybrid search results (venues + reviews)
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
) AS $$
BEGIN
    RETURN QUERY
    WITH venue_matches AS (
        SELECT * FROM search_venues_semantic(query_embedding, match_threshold, match_count)
    ),
    review_matches AS (
        SELECT * FROM search_reviews_semantic(query_embedding, match_threshold, 50)
    ),
    combined_scores AS (
        SELECT 
            COALESCE(vm.id, rm.venue_id) as venue_id,
            COALESCE(vm.name, rm.venue_name) as venue_name,
            vm.description as venue_description,
            vm.city,
            vm.state,
            vm.category,
            GREATEST(
                COALESCE(vm.similarity, 0),
                COALESCE(MAX(rm.similarity), 0)
            ) as max_similarity,
            COUNT(rm.venue_id) as review_matches
        FROM venue_matches vm
        FULL OUTER JOIN review_matches rm ON vm.id = rm.venue_id
        GROUP BY vm.id, vm.name, vm.description, vm.city, vm.state, vm.category, vm.similarity, rm.venue_id, rm.venue_name
    )
    SELECT 
        cs.venue_id,
        cs.venue_name,
        cs.venue_description,
        cs.city,
        cs.state,
        cs.category,
        cs.max_similarity,
        cs.review_matches::int
    FROM combined_scores cs
    WHERE cs.max_similarity > match_threshold
    ORDER BY cs.max_similarity DESC, cs.review_matches DESC
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;