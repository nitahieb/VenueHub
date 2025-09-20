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
export const generateEmbedding = async (text: string, inputType: 'document' | 'query' = 'document'): Promise<number[] | null> => {
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
    .select('id, name, description, category, city, state, seated_capacity, standing_capacity, hourly_price, daily_price, amenities, rating, reviews_count, featured')
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
        // Add quality and hospitality keywords
        getQualityKeywords(venue.rating, venue.reviews_count),
        // Add venue type keywords (including hotel-like terms)
        getVenueTypeKeywords(venue.category, venue.name, venue.description),
        // Add category-specific keywords
        getCategoryKeywords(venue.category),
        // Add capacity-based keywords
        getCapacityKeywords(venue.seated_capacity, venue.standing_capacity),
        // Add price-based keywords
        getPriceKeywords(venue.hourly_price, venue.daily_price),
        // Add feature keywords
        getFeaturedKeywords(venue.featured),
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
  matchThreshold: number = 0.4,
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
  matchThreshold: number = 0.4,
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
const getQualityKeywords = (rating: number, reviewCount: number): string => {
  const keywords = [];
  
  // Rating-based quality keywords
  if (rating >= 4.5) {
    keywords.push('excellent', 'outstanding', 'exceptional', 'premium', 'top-rated', 'highly-rated');
  } else if (rating >= 4.0) {
    keywords.push('great', 'good', 'quality', 'well-rated', 'recommended');
  } else if (rating >= 3.5) {
    keywords.push('decent', 'nice', 'acceptable', 'satisfactory');
  }
  
  // Review count-based credibility keywords
  if (reviewCount > 50) {
    keywords.push('popular', 'well-established', 'proven', 'trusted');
  } else if (reviewCount > 20) {
    keywords.push('established', 'reliable');
  }
  
  // General hospitality keywords
  keywords.push('hospitality', 'service', 'accommodation', 'comfort', 'experience');
  
  return keywords.join(' ');
};

const getVenueTypeKeywords = (category: string, name: string, description: string): string => {
  const keywords = [];
  const text = `${name} ${description}`.toLowerCase();
  
  // Hotel and accommodation keywords
  if (text.includes('hotel') || text.includes('resort') || text.includes('inn') || 
      text.includes('lodge') || text.includes('suite') || text.includes('room')) {
    keywords.push('hotel', 'accommodation', 'lodging', 'hospitality', 'rooms', 'suites', 'resort', 'inn');
  }
  
  // Restaurant and dining keywords
  if (text.includes('restaurant') || text.includes('dining') || text.includes('kitchen') || 
      text.includes('catering') || text.includes('food')) {
    keywords.push('restaurant', 'dining', 'culinary', 'food', 'cuisine', 'catering', 'kitchen');
  }
  
  // Event space keywords
  if (text.includes('hall') || text.includes('ballroom') || text.includes('center') || 
      text.includes('space') || text.includes('venue')) {
    keywords.push('event space', 'function hall', 'banquet', 'reception', 'gathering');
  }
  
  // Luxury keywords
  if (text.includes('luxury') || text.includes('upscale') || text.includes('elegant') || 
      text.includes('premium') || text.includes('exclusive')) {
    keywords.push('luxury', 'upscale', 'elegant', 'premium', 'exclusive', 'high-end', 'sophisticated');
  }
  
  return keywords.join(' ');
};

const getFeaturedKeywords = (featured: boolean): string => {
  if (featured) {
    return 'featured premium top-choice recommended highlight showcase';
  }
  return '';
};

const getCategoryKeywords = (category: string): string => {
  const keywords: Record<string, string> = {
    wedding: 'wedding ceremony reception bridal romantic elegant beautiful matrimony nuptials celebration love',
    corporate: 'business meeting conference professional office boardroom executive corporate retreat seminar',
    party: 'celebration birthday anniversary fun festive entertainment social gathering festivity',
    outdoor: 'nature garden park scenic natural fresh air landscape outdoor patio terrace',
    historic: 'heritage vintage classic traditional architecture historical landmark character charm',
    modern: 'contemporary sleek minimalist urban chic stylish cutting-edge innovative',
    conference: 'meeting presentation seminar workshop training business convention symposium',
    exhibition: 'display showcase gallery museum art culture expo trade show'
  };
  return keywords[category] || '';
};

const getCapacityKeywords = (seatedCapacity: number, standingCapacity: number): string => {
  const maxCapacity = Math.max(seatedCapacity, standingCapacity);
  
  if (maxCapacity > 500) return 'massive grand large-scale ballroom convention center huge enormous';
  if (maxCapacity > 200) return 'large spacious grand ballroom big substantial sizeable';
  if (maxCapacity > 100) return 'medium sized comfortable roomy moderate good-sized';
  if (maxCapacity > 50) return 'intimate cozy small private boutique personal';
  return 'tiny micro small intimate exclusive private';
};

const getPriceKeywords = (hourlyPriceInCents: number, dailyPriceInCents: number): string => {
  const hourlyPrice = hourlyPriceInCents / 100;
  const dailyPrice = dailyPriceInCents / 100;
  const avgPrice = (hourlyPrice + dailyPrice / 8) / 2; // Rough average
  
  if (avgPrice > 2000) return 'luxury premium upscale exclusive high-end elite prestigious';
  if (avgPrice > 1000) return 'upscale quality refined elegant premium nice';
  if (avgPrice > 500) return 'mid-range quality good nice comfortable decent';
  if (avgPrice > 200) return 'affordable budget-friendly value economical reasonable';
  return 'budget cheap economical low-cost value bargain';
};

const getRatingKeywords = (rating: number): string => {
  if (rating >= 5) return 'excellent outstanding perfect amazing exceptional flawless superb';
  if (rating >= 4) return 'great good quality recommended solid nice wonderful';
  if (rating >= 3) return 'decent okay average acceptable satisfactory fair';
  if (rating >= 2) return 'below average disappointing issues problems concerns';
  return 'poor terrible awful disappointing major issues problems';
};