/**
 * Smythos Hybrid Search Edge Function
 * 
 * This function combines SQL filtering with semantic search for Smythos.
 * It allows Smythos to first filter venues using SQL criteria, then apply
 * semantic search on the filtered results for more precise recommendations.
 */

interface SmythosHybridSearchRequest {
  semantic_query?: string;
  sql_filters?: {
    category?: string;
    city?: string;
    state?: string;
    min_capacity?: number;
    max_price?: number;
    featured?: boolean;
    min_rating?: number;
  };
  match_threshold?: number;
  match_count?: number;
  include_reviews?: boolean;
}

interface SmythosHybridSearchResponse {
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
    similarity_score?: number;
  }>;
  total_results: number;
  filtered_count: number;
  semantic_query?: string;
  sql_filters_applied: string[];
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
        model: 'voyage-3-large',
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
 * Apply SQL filters to venues query
 */
function applySqlFilters(query: any, filters: any): { query: any; appliedFilters: string[] } {
  const appliedFilters: string[] = [];
  
  if (filters.category) {
    query = query.eq('category', filters.category);
    appliedFilters.push(`category = '${filters.category}'`);
  }
  
  if (filters.city) {
    query = query.eq('city', filters.city);
    appliedFilters.push(`city = '${filters.city}'`);
  }
  
  if (filters.state) {
    query = query.eq('state', filters.state);
    appliedFilters.push(`state = '${filters.state}'`);
  }
  
  if (filters.min_capacity) {
    query = query.gte('standing_capacity', filters.min_capacity);
    appliedFilters.push(`standing_capacity >= ${filters.min_capacity}`);
  }
  
  if (filters.max_price) {
    query = query.lte('hourly_price', filters.max_price * 100); // Convert to cents
    appliedFilters.push(`hourly_price <= ${filters.max_price * 100}`);
  }
  
  if (filters.featured !== undefined) {
    query = query.eq('featured', filters.featured);
    appliedFilters.push(`featured = ${filters.featured}`);
  }
  
  if (filters.min_rating) {
    query = query.gte('rating', filters.min_rating);
    appliedFilters.push(`rating >= ${filters.min_rating}`);
  }
  
  return { query, appliedFilters };
}

/**
 * Transform venue details for Smythos (exclude images)
 */
function transformVenueForSmythos(venue: any, similarityScore?: number) {
  return {
    id: venue.id,
    name: venue.name,
    description: venue.description,
    location: {
      address: venue.address,
      city: venue.city,
      state: venue.state,
      zipCode: venue.zip_code,
      latitude: venue.latitude,
      longitude: venue.longitude,
    },
    capacity: {
      seated: venue.seated_capacity,
      standing: venue.standing_capacity,
    },
    price: {
      hourly: venue.hourly_price / 100,
      daily: venue.daily_price / 100,
    },
    amenities: venue.amenities || [],
    category: venue.category,
    rating: venue.rating,
    reviews: venue.reviews_count,
    availability: venue.availability,
    featured: venue.featured,
    similarity_score: similarityScore,
  };
}

/**
 * Perform semantic search on filtered venues
 */
async function performSemanticSearchOnVenues(
  supabase: any,
  venueIds: string[],
  queryEmbedding: number[],
  matchThreshold: number,
  matchCount: number
) {
  if (venueIds.length === 0) return [];
  
  try {
    // Use the semantic search function but filter by venue IDs
    const { data, error } = await supabase.rpc('search_venues_by_ids', {
      venue_ids: venueIds,
      query_embedding: `[${queryEmbedding.join(",")}]`,
      match_threshold: matchThreshold,
      match_count: matchCount,
    });

    if (error) {
      console.warn('Semantic search on filtered venues failed, falling back to simple filtering:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in semantic search on venues:', error);
    return [];
  }
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
          filtered_count: 0,
          sql_filters_applied: [],
          search_time_ms: Date.now() - startTime
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
    let searchParams: SmythosHybridSearchRequest;
    try {
      searchParams = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid JSON in request body",
          venues: [],
          total_results: 0,
          filtered_count: 0,
          sql_filters_applied: [],
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
    const matchCount = Math.min(searchParams.match_count || 10, 50);
    const includeReviews = searchParams.include_reviews !== false;

    console.log(`Processing Smythos hybrid search request`);
    console.log('Semantic query:', searchParams.semantic_query);
    console.log('SQL filters:', searchParams.sql_filters);

    // Initialize Supabase client
    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Step 1: Apply SQL filters to get initial venue set
    console.log('Applying SQL filters...');
    let venuesQuery = supabase
      .from('venues')
      .select('*')
      .eq('status', 'approved')
      .eq('availability', true);

    let appliedFilters = ['status = approved', 'availability = true'];
    
    if (searchParams.sql_filters) {
      const filterResult = applySqlFilters(venuesQuery, searchParams.sql_filters);
      venuesQuery = filterResult.query;
      appliedFilters = appliedFilters.concat(filterResult.appliedFilters);
    }

    const { data: filteredVenues, error: sqlError } = await venuesQuery
      .order('rating', { ascending: false })
      .limit(200); // Reasonable limit for semantic search

    if (sqlError) {
      console.error('SQL filtering error:', sqlError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `SQL filtering failed: ${sqlError.message}`,
          venues: [],
          total_results: 0,
          filtered_count: 0,
          sql_filters_applied: appliedFilters,
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

    console.log(`SQL filtering found ${filteredVenues?.length || 0} venues`);

    let finalVenues = filteredVenues || [];
    
    // Step 2: Apply semantic search if semantic query is provided
    if (searchParams.semantic_query && searchParams.semantic_query.trim()) {
      console.log('Generating query embedding...');
      const queryEmbedding = await generateQueryEmbedding(searchParams.semantic_query.trim());

      if (queryEmbedding && finalVenues.length > 0) {
        console.log('Performing semantic search on filtered venues...');
        
        // For now, we'll use a simpler approach: call the semantic-search function
        // and then filter the results to only include venues from our SQL filter
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const response = await fetch(`${supabaseUrl}/functions/v1/semantic-search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            query_embedding: queryEmbedding,
            original_query: searchParams.semantic_query,
            match_threshold: matchThreshold,
            match_count: matchCount * 2, // Get more results to filter
            include_reviews: includeReviews,
          }),
        });

        if (response.ok) {
          const semanticResults = await response.json();
          const filteredVenueIds = new Set(finalVenues.map(v => v.id));
          
          // Filter semantic results to only include venues that passed SQL filters
          const hybridResults = semanticResults.results
            .filter((result: any) => result.venue_details && filteredVenueIds.has(result.venue_details.id))
            .slice(0, matchCount)
            .map((result: any) => transformVenueForSmythos(result.venue_details, result.similarity_score));
          
          finalVenues = hybridResults;
          console.log(`Hybrid search found ${finalVenues.length} venues`);
        } else {
          console.warn('Semantic search failed, using SQL-filtered results only');
          finalVenues = finalVenues.slice(0, matchCount).map(venue => transformVenueForSmythos(venue));
        }
      } else {
        console.log('No embedding generated or no venues to search, using SQL-filtered results only');
        finalVenues = finalVenues.slice(0, matchCount).map(venue => transformVenueForSmythos(venue));
      }
    } else {
      console.log('No semantic query provided, using SQL-filtered results only');
      finalVenues = finalVenues.slice(0, matchCount).map(venue => transformVenueForSmythos(venue));
    }

    const searchTimeMs = Date.now() - startTime;
    console.log(`Hybrid search completed in ${searchTimeMs}ms`);

    // Return formatted response
    const response: SmythosHybridSearchResponse = {
      success: true,
      venues: finalVenues,
      total_results: finalVenues.length,
      filtered_count: filteredVenues?.length || 0,
      semantic_query: searchParams.semantic_query,
      sql_filters_applied: appliedFilters,
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
    console.error("Unexpected error in Smythos hybrid search:", error);
    
    const searchTimeMs = Date.now() - startTime;
    
    const errorResponse: SmythosHybridSearchResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      venues: [],
      total_results: 0,
      filtered_count: 0,
      sql_filters_applied: [],
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