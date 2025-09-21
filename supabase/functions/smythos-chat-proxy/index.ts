/**
 * Smythos Chat Proxy Edge Function
 * 
 * This function acts as a proxy to the Smythos API to avoid CORS issues
 * and enriches responses with actual venue data from the database.
 */

interface SmythosChatRequest {
  requirements: string;
}

interface SmythosApiResponse {
  result: string;
  venue_ids?: string[];
}

interface SmythosChatResponse {
  success: boolean;
  response?: string;
  venues?: any[];
  error?: string;
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
        JSON.stringify({ 
          success: false, 
          error: "Method not allowed. Use POST." 
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
    let requestData: SmythosChatRequest;
    try {
      requestData = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid JSON in request body" 
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
    if (!requestData.requirements || typeof requestData.requirements !== 'string') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Requirements parameter is required and must be a string" 
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

    console.log('Proxying request to Smythos API with requirements:', requestData.requirements);

    // Make request to Smythos API
    const smythosResponse = await fetch('https://cmfsk9ysip7q123qun1z7cfkj.agent.pa.smyth.ai/api/find_venues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requirements: requestData.requirements
      }),
    });

    if (!smythosResponse.ok) {
      console.error('Smythos API error:', smythosResponse.status, smythosResponse.statusText);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Smythos API error: ${smythosResponse.status} ${smythosResponse.statusText}` 
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

    // Parse Smythos response
    let smythosData: SmythosApiResponse;
    try {
      const responseText = await smythosResponse.text();
      console.log('Raw Smythos response:', responseText);
      
      // Try to parse as JSON first (if Smythos returns structured data)
      try {
        smythosData = JSON.parse(responseText);
      } catch {
        // If not JSON, treat as plain text response
        smythosData = { result: responseText };
      }
    } catch (error) {
      console.error('Error parsing Smythos response:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to parse Smythos API response" 
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

    console.log('Parsed Smythos data:', smythosData);

    // Extract the result text directly - it should already be a string
    const responseContent = smythosData.result || "I found some venues for you!";

    // Fetch venue details if venue IDs are provided
    let venues = [];
    if (smythosData.venue_ids && Array.isArray(smythosData.venue_ids) && smythosData.venue_ids.length > 0) {
      console.log('Fetching venue details for IDs:', smythosData.venue_ids);
      
      try {
        // Initialize Supabase client
        const { createClient } = await import("npm:@supabase/supabase-js@2");
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Fetch venues by IDs
        const { data: venueData, error: venueError } = await supabase
          .from('venues')
          .select('*')
          .in('id', smythosData.venue_ids)
          .eq('status', 'approved');

        if (venueError) {
          console.error('Error fetching venues:', venueError);
        } else {
          venues = venueData || [];
          console.log(`Successfully fetched ${venues.length} venues`);
        }
      } catch (error) {
        console.error('Error in venue fetching process:', error);
      }
    }

    // Return successful response with both text and venue data
    const response: SmythosChatResponse = {
      success: true,
      response: responseContent,
      venues: venues,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error("Unexpected error in Smythos chat proxy:", error);
    
    const errorResponse: SmythosChatResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
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