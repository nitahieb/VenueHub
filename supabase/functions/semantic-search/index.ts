/**
 * Semantic Search Edge Function
 * 
 * This function provides semantic search capabilities for venues using VoyageAI embeddings.
 * It converts user queries to embeddings and performs similarity search against stored venue
 * and review embeddings in the database.
 * 
 * Workflow:
 * 1. Accept user query via POST request
 * 2. Generate embedding for the query using VoyageAI
 * 3. Perform similarity search using cosine distance
 * 4. Return ranked results with similarity scores
 * 5. Include both venue and review matches for comprehensive results
 * 
 * Updated: Environment variables configured in Supabase dashboard
 */

interface SemanticSearchRequest {
  query_embedding: number[];
  original_query?: string;
  match_threshold?: number;
  match_count?: number;
  include_reviews?: boolean;
}

interface SemanticSearchResponse {
  results: Array<{
    venue_id: string;
    venue_name: string;
    venue_description: string;
    city: string;
    state: string;
    category: string;
    similarity_score: number;
    review_matches: number;
    venue_details?: any;
  }>;
  original_query: string;
  total_results: number;
  search_time_ms: number;
  embedding_provided_by_client: boolean;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * Perform semantic search using database function
 */
async function performSemanticSearch(
  supabase: any,
  queryEmbedding: number[],
  matchThreshold: number,
  matchCount: number
) {
  const { data, error } = await supabase.rpc("search_venues_hybrid", {
    query_embedding: `[${queryEmbedding.join(",")}]`,
    match_threshold: matchThreshold,
    match_count: matchCount,
  });

  if (error) {
    console.error("Database search error:", error);
    throw new Error(`Database search failed: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetch full venue details for search results
 */
async function enrichWithVenueDetails(supabase: any, results: any[]) {
  if (results.length === 0) return results;

  const venueIds = results.map(r => r.venue_id);
  
  const { data: venues, error } = await supabase
    .from("venues")
    .select("*")
    .in("id", venueIds);

  if (error) {
    console.warn("Error fetching venue details:", error);
    return results;
  }

  // Create a map for quick lookup
  const venueMap = new Map(venues.map(v => [v.id, v]));

  // Enrich results with venue details
  return results.map(result => ({
    ...result,
    venue_details: venueMap.get(result.venue_id) || null,
  }));
}

Deno.serve(async (req: Request) => {
  const startTime = Date.now();

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST." }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Parse request body
    let searchParams: SemanticSearchRequest;
    try {
      searchParams = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Validate required parameters
    if (!searchParams.query_embedding || !Array.isArray(searchParams.query_embedding) || searchParams.query_embedding.length === 0) {
      return new Response(
        JSON.stringify({ error: "query_embedding parameter is required and must be a non-empty array" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Validate embedding dimensions (VoyageAI voyage-3-large uses 1024 dimensions)
    if (searchParams.query_embedding.length !== 1024) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid embedding dimensions", 
          details: `Expected 1024 dimensions, got ${searchParams.query_embedding.length}` 
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Set default parameters
    const matchThreshold = searchParams.match_threshold || 0.7;
    const matchCount = Math.min(searchParams.match_count || 10, 50); // Cap at 50 results
    const includeReviews = searchParams.include_reviews !== false;
    const originalQuery = searchParams.original_query || "semantic search";

    // Use the provided query embedding
    console.log(`Performing semantic search with provided embedding (${searchParams.query_embedding.length} dimensions)`);
    const queryEmbedding = searchParams.query_embedding;

    // Initialize Supabase client
    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Perform semantic search
    console.log(`Performing semantic search with threshold: ${matchThreshold}`);
    const searchResults = await performSemanticSearch(
      supabase,
      queryEmbedding,
      matchThreshold,
      matchCount
    );

    // Enrich results with full venue details if requested
    const enrichedResults = includeReviews 
      ? await enrichWithVenueDetails(supabase, searchResults)
      : searchResults;

    // Calculate search time
    const searchTimeMs = Date.now() - startTime;

    // Format response
    const response: SemanticSearchResponse = {
      results: enrichedResults.map(result => ({
        venue_id: result.venue_id,
        venue_name: result.venue_name,
        venue_description: result.venue_description,
        city: result.city,
        state: result.state,
        category: result.category,
        similarity_score: Math.round(result.max_similarity * 100) / 100, // Round to 2 decimal places
        review_matches: result.review_matches,
        venue_details: result.venue_details || undefined,
      })),
      original_query: originalQuery,
      total_results: enrichedResults.length,
      search_time_ms: searchTimeMs,
      embedding_provided_by_client: true,
    };

    console.log(`Search completed in ${searchTimeMs}ms, found ${enrichedResults.length} results`);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error("Unexpected error in semantic search:", error);
    
    const searchTimeMs = Date.now() - startTime;
    
    return new Response(
      JSON.stringify({
        error: "Internal server error during semantic search",
        details: error instanceof Error ? error.message : "Unknown error",
        search_time_ms: searchTimeMs,
        embedding_provided_by_client: false,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});