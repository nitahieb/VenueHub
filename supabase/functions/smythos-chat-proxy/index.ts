/**
 * Smythos Chat Proxy Edge Function
 * 
 * This function acts as a proxy to the Smythos API to avoid CORS issues
 * when calling from the frontend.
 */

interface SmythosChatRequest {
  requirements: string;
}

interface SmythosChatResponse {
  success: boolean;
  response?: string;
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

    // Get response text from Smythos API
    const responseText = await smythosResponse.text();
    console.log('Smythos API response received, length:', responseText.length);

    // Return successful response
    const response: SmythosChatResponse = {
      success: true,
      response: responseText,
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