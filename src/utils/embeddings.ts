// Semantic search utilities using VoyageAI embeddings

interface VoyageAIResponse {
  data: Array<{
    embedding: number[];
  }>;
  model: string;
  usage: {
    total_tokens: number;
  };
}

interface SemanticSearchResult {
  venue_id: string;
  venue_name: string;
  venue_description: string;
  city: string;
  state: string;
  category: string;
  max_similarity: number;
  review_matches: number;
}

/**
 * Generate embeddings using VoyageAI API
 */
const generateEmbedding = async (text: string, inputType: 'document' | 'query' = 'document'): Promise<number[] | null> => {
  const apiKey = import.meta.env.VITE_VOYAGEAI_API_KEY;
  
  if (!apiKey) {
    console.warn('VoyageAI API key not found. Semantic search will not be available.');
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
        input: [text],
        model: 'voyage-3-large', // 1024 dimensions, high quality
        input_type: inputType,
      }),
    });

    if (!response.ok) {
      throw new Error(`VoyageAI API error: ${response.status}`);
    }

    const data: VoyageAIResponse = await response.json();
    return data.data[0]?.embedding || null;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
};

/**
 * Generate query embedding (optimized for search queries)
 */
export const generateQueryEmbedding = async (query: string): Promise<number[] | null> => {
  return generateEmbedding(query, 'query');
};

/**
 * Generate embeddings for all venues that don't have them
 */
export const generateVenueEmbeddings = async (): Promise<{
  success: number;
  errors: number;
  total: number;
}> => {
  const { supabase } = await import('../lib/supabase');
  
  // Get venues without embeddings
  const { data: venues, error } = await supabase
    .from('venues')
    .select('id, name, description, category, city, state, seated_capacity, hourly_price, amenities')
    .is('embedding', null)
    .eq('status', 'approved');

  if (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }

  if (!venues || venues.length === 0) {
    return { success: 0, errors: 0, total: 0 };
  }

  let successCount = 0;
  let errorCount = 0;

  for (const venue of venues) {
    try {
      // Generate searchable text
      const embeddingText = [
        venue.name,
        venue.description,
        venue.category,
        venue.city,
        venue.state,
        // Add category-specific keywords
        getCategoryKeywords(venue.category),
        // Add capacity-based keywords
        getCapacityKeywords(venue.seated_capacity),
        // Add price-based keywords
        getPriceKeywords(venue.hourly_price),
        // Add amenities
        venue.amenities?.join(' ') || ''
      ].filter(Boolean).join(' ');

      const embedding = await generateEmbedding(embeddingText);

      if (embedding) {
        const { error: updateError } = await supabase
          .from('venues')
          .update({
            embedding: `[${embedding.join(',')}]`,
            embedding_text: embeddingText,
            embedding_updated_at: new Date().toISOString()
          })
          .eq('id', venue.id);

        if (updateError) {
          console.error(`Error updating venue ${venue.name}:`, updateError);
          errorCount++;
        } else {
          console.log(`Generated embedding for venue: ${venue.name}`);
          successCount++;
        }
      } else {
        console.warn(`Could not generate embedding for venue: ${venue.name}`);
        errorCount++;
      }

      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`Error processing venue ${venue.name}:`, error);
      errorCount++;
    }
  }

  return { success: successCount, errors: errorCount, total: venues.length };
};

/**
 * Generate embeddings for all reviews that don't have them
 */
export const generateReviewEmbeddings = async (): Promise<{
  success: number;
  errors: number;
  total: number;
}> => {
  const { supabase } = await import('../lib/supabase');
  
  // Get reviews without embeddings
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('id, comment, rating, venue_id')
    .is('embedding', null);

  if (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }

  if (!reviews || reviews.length === 0) {
    return { success: 0, errors: 0, total: 0 };
  }

  let successCount = 0;
  let errorCount = 0;

  for (const review of reviews) {
    try {
      // Enhance review text with rating context
      const embeddingText = [
        review.comment,
        getRatingKeywords(review.rating)
      ].filter(Boolean).join(' ');

      const embedding = await generateEmbedding(embeddingText);

      if (embedding) {
        const { error: updateError } = await supabase
          .from('reviews')
          .update({
            embedding: `[${embedding.join(',')}]`,
            embedding_updated_at: new Date().toISOString()
          })
          .eq('id', review.id);

        if (updateError) {
          console.error(`Error updating review ${review.id}:`, updateError);
          errorCount++;
        } else {
          console.log(`Generated embedding for review: ${review.id}`);
          successCount++;
        }
      } else {
        console.warn(`Could not generate embedding for review: ${review.id}`);
        errorCount++;
      }

      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`Error processing review ${review.id}:`, error);
      errorCount++;
    }
  }

  return { success: successCount, errors: errorCount, total: reviews.length };
};

/**
 * Perform semantic search on venues
 */
export const searchVenuesSemantic = async (
  query: string,
  matchThreshold: number = 0.7,
  matchCount: number = 10,
  includeReviews: boolean = true
): Promise<SemanticSearchResult[]> => {
  const { supabase } = await import('../lib/supabase');
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration not found');
    return [];
  }
  
  // Generate query embedding client-side
  console.log('Generating query embedding client-side...');
  const queryEmbedding = await generateQueryEmbedding(query);
  
  if (!queryEmbedding) {
    console.error('Failed to generate query embedding');
    return [];
  }
  
  // Get authentication token
  let authToken = supabaseAnonKey;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      authToken = session.access_token;
    }
  } catch (error) {
    console.warn('Could not get user session, using anon key:', error);
  }
  
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/semantic-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query_embedding: queryEmbedding,
        original_query: query,
        match_threshold: matchThreshold,
        match_count: matchCount,
        include_reviews: includeReviews,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Semantic search API error:', response.status, errorData);
      return [];
    }

    const data = await response.json();
    
    // Transform the response to match the expected format
    return data.results.map((result: any) => ({
      venue_id: result.venue_id,
      venue_name: result.venue_name,
      venue_description: result.venue_description,
      city: result.city,
      state: result.state,
      category: result.category,
      max_similarity: result.similarity_score,
      review_matches: result.review_matches,
    }));
    
  } catch (error) {
    console.error('Error performing semantic search:', error);
    return [];
  }
};

/**
 * Perform semantic search and return full venue objects
 */
export const searchVenuesSemanticWithDetails = async (
  query: string,
  matchThreshold: number = 0.7,
  matchCount: number = 10
): Promise<any[]> => {
  const { supabase } = await import('../lib/supabase');
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration not found');
    return [];
  }
  
  // Generate query embedding client-side
  console.log('Generating query embedding client-side...');
  const queryEmbedding = await generateQueryEmbedding(query);
  
  if (!queryEmbedding) {
    console.error('Failed to generate query embedding');
    return [];
  }
  
  // Get authentication token
  let authToken = supabaseAnonKey;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      authToken = session.access_token;
    }
  } catch (error) {
    console.warn('Could not get user session, using anon key:', error);
  }
  
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/semantic-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query_embedding: queryEmbedding,
        original_query: query,
        match_threshold: matchThreshold,
        match_count: matchCount,
        include_reviews: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Semantic search API error:', response.status, errorData);
      return [];
    }

    const data = await response.json();
    return data.results.filter((result: any) => result.venue_details).map((result: any) => result.venue_details);
    
  } catch (error) {
    console.error('Error performing semantic search with details:', error);
    return [];
  }
};

// Helper functions for generating contextual keywords
const getCategoryKeywords = (category: string): string => {
  const keywords: Record<string, string> = {
    wedding: 'wedding ceremony reception bridal romantic elegant beautiful',
    corporate: 'business meeting conference professional office boardroom',
    party: 'celebration birthday anniversary fun festive entertainment',
    outdoor: 'nature garden park scenic natural fresh air landscape',
    historic: 'heritage vintage classic traditional architecture historical',
    modern: 'contemporary sleek minimalist urban chic stylish',
    conference: 'meeting presentation seminar workshop training business',
    exhibition: 'display showcase gallery museum art culture'
  };
  return keywords[category] || '';
};

const getCapacityKeywords = (capacity: number): string => {
  if (capacity > 200) return 'large spacious grand ballroom massive';
  if (capacity > 100) return 'medium sized comfortable roomy';
  return 'intimate cozy small private boutique';
};

const getPriceKeywords = (priceInCents: number): string => {
  const pricePerHour = priceInCents / 100;
  if (pricePerHour > 1000) return 'luxury premium upscale exclusive high-end';
  if (pricePerHour > 500) return 'upscale quality refined elegant';
  return 'affordable budget-friendly value economical';
};

const getRatingKeywords = (rating: number): string => {
  if (rating >= 5) return 'excellent outstanding perfect amazing exceptional';
  if (rating >= 4) return 'great good quality recommended solid';
  if (rating >= 3) return 'decent okay average acceptable';
  return 'poor disappointing issues problems';
};