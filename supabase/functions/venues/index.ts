interface VenueSearchRequest {
  location?: string;
  eventtype?: string;
  budget_high?: number;
  budget_low?: number;
  size?: number;
  extra_features?: string[];
}

interface VenueSearchResponse {
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
    images: string[];
    category: string;
    rating: number;
    reviews: number;
    availability: boolean;
    featured: boolean;
  }>;
  total_count: number;
  search_params: VenueSearchRequest;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
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
    let searchParams: VenueSearchRequest;
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

    // Import Supabase client
    const { createClient } = await import("npm:@supabase/supabase-js@2");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build query
    let query = supabase
      .from("venues")
      .select("*")
      .eq("status", "approved")
      .eq("availability", true);

    // Apply filters based on search parameters
    if (searchParams.location) {
      query = query.or(
        `city.ilike.%${searchParams.location}%,state.ilike.%${searchParams.location}%,address.ilike.%${searchParams.location}%`
      );
    }

    if (searchParams.eventtype) {
      // Map common event types to venue categories
      const eventTypeMapping: Record<string, string[]> = {
        wedding: ["wedding"],
        corporate: ["corporate", "conference"],
        party: ["party"],
        conference: ["conference", "corporate"],
        exhibition: ["exhibition"],
        outdoor: ["outdoor"],
        historic: ["historic"],
        modern: ["modern"],
      };

      const categories = eventTypeMapping[searchParams.eventtype.toLowerCase()] || [searchParams.eventtype];
      query = query.in("category", categories);
    }

    if (searchParams.budget_high) {
      query = query.lte("hourly_price", searchParams.budget_high * 100); // Convert to cents
    }

    if (searchParams.budget_low) {
      query = query.gte("hourly_price", searchParams.budget_low * 100); // Convert to cents
    }

    if (searchParams.size) {
      query = query.gte("standing_capacity", searchParams.size);
    }

    // Filter by extra features/amenities
    if (searchParams.extra_features && searchParams.extra_features.length > 0) {
      // Use overlap operator to find venues that have any of the requested amenities
      query = query.overlaps("amenities", searchParams.extra_features);
    }

    // Execute query with ordering
    const { data: venues, error, count } = await query
      .order("rating", { ascending: false })
      .order("featured", { ascending: false })
      .limit(50); // Limit results to prevent large responses

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Database query failed", details: error.message }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Transform venues to match expected format
    const transformedVenues = (venues || []).map((venue) => ({
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
        hourly: venue.hourly_price / 100, // Convert from cents to dollars
        daily: venue.daily_price / 100,
      },
      amenities: venue.amenities || [],
      images: venue.images || [],
      category: venue.category,
      rating: venue.rating,
      reviews: venue.reviews_count,
      availability: venue.availability,
      featured: venue.featured,
    }));

    const response: VenueSearchResponse = {
      venues: transformedVenues,
      total_count: transformedVenues.length,
      search_params: searchParams,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error" 
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