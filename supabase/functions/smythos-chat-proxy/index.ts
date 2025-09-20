/**
 * Smythos Chat Proxy Edge Function
 * 
 * This function acts as a proxy between the frontend and the Smythos AI API
 * to avoid CORS issues when calling the external API directly from the browser.
 */

interface SmythosChatRequest {
  message: string;
}

interface SmythosChatResponse {
  response_text?: string;
  response?: string;
  venues?: any[];
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
    let chatRequest: SmythosChatRequest;
    try {
      chatRequest = await req.json();
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
    if (!chatRequest.message || typeof chatRequest.message !== 'string' || chatRequest.message.trim() === '') {
      return new Response(
        JSON.stringify({ error: "Message parameter is required and must be a non-empty string" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    console.log('Proxying chat request to Smythos API:', chatRequest.message);

    // Forward request to Smythos API
    const smythosResponse = await fetch('https://cmfsk9ysip7q123qun1z7cfkj.agent.pa.smyth.ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: chatRequest.message
      }),
    });

    if (!smythosResponse.ok) {
      const errorData = await smythosResponse.json().catch(() => ({}));
      console.error('Smythos API error:', smythosResponse.status, errorData);
      
      return new Response(
        JSON.stringify({ 
          error: `Smythos API error: ${smythosResponse.status}`,
          details: errorData
        }),
        {
          status: smythosResponse.status,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const smythosData: SmythosChatResponse = await smythosResponse.json();
    console.log('Smythos API response received:', {
      hasResponse: !!(smythosData.response_text || smythosData.response),
      venueCount: smythosData.venues?.length || 0
    });

    // Return the Smythos response
    return new Response(JSON.stringify(smythosData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error("Unexpected error in Smythos chat proxy:", error);
    
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