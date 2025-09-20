/**
 * Smythos Venue Search Edge Function
 * 
 * This function provides a simplified API for the Smythos agent to get venue recommendations.
 * It handles the complete workflow by:
 * 1. Accept natural language query from Smythos
 * 2. Generate embedding using VoyageAI (client-side approach)
 * 3. Call the semantic-search function internally
 * 4. Return formatted venue recommendations without images
 * 
 * This keeps the VoyageAI API key secure and provides a clean interface for Smythos.
 */

interface SmythosVenueSearchRequest {
  query: string;
  match_threshold?: number;
  match_count?: number;
  include_reviews?: boolean;
}

interface SmythosVenueSearchResponse {
  success: boolean;
  venues: Array<{
    id: string;
    name: string;
    description: string;
    location: {
      address: string;
      city: string;
      state: string;
      zipCode: string;
      latitude?: number;
      longitude?: number;
    };
    capacity: {
      seated: number;
      standing: number;
    };
    price: {
      hourly: number;
      daily: number;
    };
    amenities: string[];
    category: string;
    rating: number;
    reviews: number;
    availability: boolean;
    featured: boolean;
    similarity_score: number;
  }>;
  total_results: number;
  original_query: string;
  search_time_ms: number;
  error?: string;
}

interface VoyageAIResponse {
  data: Array<{
    embedding: number[];
  }>;
  model: string;
  usage: {
    total_tokens: number;
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * Generate embeddings using VoyageAI API
 */
async function generateQueryEmbedding(query: string): Promise<number[] | null> {
  const apiKey = Deno.env.get("VITE_VOYAGEAI_API_KEY");
  
  if (!apiKey) {
    console.error('VoyageAI API key not found in environment variables');
    return null;
  }

  try {
    const response = await fetch('https://api.voyageai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: [query],
        model: 'voyage-3-large', // 1024 dimensions, high quality
        input_type: 'query',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`VoyageAI API error: ${response.status} - ${errorText}`);
      return null;
    }

    const data: VoyageAIResponse = await response.json();
    return data.data[0]?.embedding || null;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

/**
 * Call the semantic-search function internally
 */
async function callSemanticSearch(
  queryEmbedding: number[],
  originalQuery: string,
  matchThreshold: number,
  matchCount: number,
  includeReviews: boolean
) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration not found');
  }

  console.log('Calling semantic-search with:', {
    embedding_length: queryEmbedding.length,
    original_query: originalQuery,
    match_threshold: matchThreshold,
    match_count: matchCount,
    include_reviews: includeReviews
  });

  const response = await fetch(`${supabaseUrl}/functions/v1/semantic-search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      query_embedding: queryEmbedding,
      original_query: originalQuery,
      match_threshold: matchThreshold,
      match_count: matchCount,
      include_reviews: includeReviews,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    console.error('Semantic search API error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText
    });
    throw new Error(`Semantic search failed: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log('Semantic search response:', {
    total_results: result.total_results,
    search_time_ms: result.search_time_ms,
    results_count: result.results?.length || 0
  });
  
  return result;
}

/**
 * Transform venue details to match the expected format for Smythos (without images)
 */
function transformVenueForSmythos(venueDetails: any, similarityScore: number) {
  return {
    id: venueDetails.id,
    name: venueDetails.name,
    description: venueDetails.description,
    location: {
      address: venueDetails.address,
      city: venueDetails.city,
      state: venueDetails.state,
      zipCode: venueDetails.zip_code,
      latitude: venueDetails.latitude,
      longitude: venueDetails.longitude,
    },
    capacity: {
      seated: venueDetails.seated_capacity,
      standing: venueDetails.standing_capacity,
    },
    price: {
      hourly: venueDetails.hourly_price / 100, // Convert from cents to dollars
      daily: venueDetails.daily_price / 100,
    },
    amenities: venueDetails.amenities || [],
    category: venueDetails.category,
    rating: venueDetails.rating,
    reviews: venueDetails.reviews_count,
    availability: venueDetails.availability,
    featured: venueDetails.featured,
    similarity_score: similarityScore,
    // Note: images are intentionally excluded for Smythos
  };
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
        JSON.stringify({ 
          success: false, 
          error: "Method not allowed. Use POST.",
          venues: [],
          total_results: 0,
          original_query: "",
          search_time_ms: 0
        }),
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
    let searchParams: SmythosVenueSearchRequest;
    try {
      searchParams = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid JSON in request body",
          venues: [],
          total_results: 0,
          original_query: "",
          search_time_ms: Date.now() - startTime
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

    // Validate required parameters
    if (!searchParams.query || typeof searchParams.query !== 'string' || searchParams.query.trim() === '') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Query parameter is required and must be a non-empty string",
          venues: [],
          total_results: 0,
          original_query: searchParams.query || "",
          search_time_ms: Date.now() - startTime
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
    const matchThreshold = searchParams.match_threshold || 0.4;
    const matchCount = Math.min(searchParams.match_count || 10, 50); // Cap at 50 results
    const includeReviews = searchParams.include_reviews !== false;
    const originalQuery = searchParams.query.trim();

    console.log(`Processing Smythos venue search request: "${originalQuery}"`);

    // Step 1: Generate query embedding using VoyageAI
    console.log('Generating query embedding...');
    const queryEmbedding = await generateQueryEmbedding(originalQuery);

    if (!queryEmbedding) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to generate query embedding. Please check VoyageAI API configuration.",
          venues: [],
          total_results: 0,
          original_query: originalQuery,
          search_time_ms: Date.now() - startTime
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

    console.log(`Generated embedding with ${queryEmbedding.length} dimensions`);

    // Step 2: Call semantic search function
    console.log('Calling semantic search...');
    const semanticSearchResponse = await callSemanticSearch(
      queryEmbedding,
      originalQuery,
      matchThreshold,
      matchCount,
      includeReviews
    );

    // Step 3: Transform results for Smythos (exclude images)
    const transformedVenues = semanticSearchResponse.results
      .filter((result: any) => result.venue_details) // Only include results with full venue details
      .map((result: any) => transformVenueForSmythos(result.venue_details, result.similarity_score));

    const searchTimeMs = Date.now() - startTime;

    console.log(`Search completed in ${searchTimeMs}ms, found ${transformedVenues.length} venues`);

    // Step 4: Return formatted response for Smythos
    const response: SmythosVenueSearchResponse = {
      success: true,
      venues: transformedVenues,
      total_results: transformedVenues.length,
      original_query: originalQuery,
      search_time_ms: searchTimeMs,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error("Unexpected error in Smythos venue search:", error);
    
    const searchTimeMs = Date.now() - startTime;
    
    const errorResponse: SmythosVenueSearchResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      venues: [],
      total_results: 0,
      original_query: "",
      search_time_ms: searchTimeMs,
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
});