import { supabase } from '../lib/supabase';
import { Venue, VenueCategory } from '../types/venue';
import type { Database } from '../lib/supabase';
import { geocodeAddress } from './geocoding';
import { generateEmbedding } from './embeddings';

type VenueRow = Database['public']['Tables']['venues']['Row'];
type VenueInsert = Database['public']['Tables']['venues']['Insert'];
type VenueUpdate = Database['public']['Tables']['venues']['Update'];

// Convert database row to Venue type
const convertToVenue = (row: VenueRow): Venue => ({
  id: row.id,
  name: row.name,
  description: row.description,
  location: {
    address: row.address,
    city: row.city,
    state: row.state,
    zipCode: row.zip_code,
    latitude: row.latitude || undefined,
    longitude: row.longitude || undefined,
  },
  capacity: {
    seated: row.seated_capacity,
    standing: row.standing_capacity,
  },
  price: {
    hourly: row.hourly_price / 100, // Convert from cents to dollars
    daily: row.daily_price / 100, // Convert from cents to dollars
  },
  amenities: row.amenities,
  images: row.images,
  category: row.category as VenueCategory,
  rating: row.rating,
  reviews: row.reviews_count,
  availability: row.availability,
  featured: row.featured,
  status: row.status,
  owner_id: row.owner_id,
});

export const getAllVenues = async (): Promise<Venue[]> => {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(convertToVenue);
};

export const getVenueById = async (id: string): Promise<Venue | null> => {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return convertToVenue(data);
};

export const getFeaturedVenues = async (): Promise<Venue[]> => {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('status', 'approved')
    .eq('featured', true)
    .order('rating', { ascending: false })
    .limit(6);

  if (error) throw error;
  return data.map(convertToVenue);
};

export const searchVenues = async (filters: {
  searchTerm?: string;
  location?: string;
  category?: VenueCategory;
  maxPrice?: number;
  minCapacity?: number;
  nearLocation?: {
    latitude: number;
    longitude: number;
    radiusMeters?: number;
  };
}): Promise<Venue[]> => {
  let query = supabase
    .from('venues')
    .select('*')
    .eq('status', 'approved');

  if (filters.searchTerm) {
    query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
  }

  if (filters.location) {
    query = query.or(`city.ilike.%${filters.location}%,state.ilike.%${filters.location}%`);
  }

  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.maxPrice) {
    query = query.lte('hourly_price', filters.maxPrice);
  }

  if (filters.minCapacity) {
    query = query.gte('standing_capacity', filters.minCapacity);
  }

  // Add geospatial filtering if location coordinates are provided
  if (filters.nearLocation) {
    const { latitude, longitude, radiusMeters = 15000 } = filters.nearLocation;
    query = query.rpc('venues_within_distance', {
      lat: latitude,
      lon: longitude,
      distance_meters: radiusMeters,
    });
  }

  const { data, error } = await query.order('rating', { ascending: false });

  if (error) throw error;
  return data.map(convertToVenue);
};

/**
 * Generate embedding text for a venue (same logic as in embeddings.ts)
 */
const generateVenueEmbeddingText = (venue: {
  name: string;
  description: string;
  category: string;
  city: string;
  state: string;
  seated_capacity: number;
  standing_capacity: number;
  hourly_price: number;
  daily_price: number;
  amenities: string[];
  rating?: number;
  reviews_count?: number;
  featured?: boolean;
}): string => {
  // Helper functions (simplified versions from embeddings.ts)
  const getQualityKeywords = (rating: number = 0, reviewCount: number = 0): string => {
    const keywords = [];
    
    if (rating >= 4.5) {
      keywords.push('excellent', 'outstanding', 'exceptional', 'premium', 'top-rated', 'highly-rated');
    } else if (rating >= 4.0) {
      keywords.push('great', 'good', 'quality', 'well-rated', 'recommended');
    } else if (rating >= 3.5) {
      keywords.push('decent', 'nice', 'acceptable', 'satisfactory');
    }
    
    if (reviewCount > 50) {
      keywords.push('popular', 'well-established', 'proven', 'trusted');
    } else if (reviewCount > 20) {
      keywords.push('established', 'reliable');
    }
    
    keywords.push('hospitality', 'service', 'accommodation', 'comfort', 'experience');
    return keywords.join(' ');
  };

  const getVenueTypeKeywords = (category: string, name: string, description: string): string => {
    const keywords = [];
    const text = `${name} ${description}`.toLowerCase();
    
    if (text.includes('hotel') || text.includes('resort') || text.includes('inn') || 
        text.includes('lodge') || text.includes('suite') || text.includes('room')) {
      keywords.push('hotel', 'accommodation', 'lodging', 'hospitality', 'rooms', 'suites', 'resort', 'inn');
    }
    
    if (text.includes('restaurant') || text.includes('dining') || text.includes('kitchen') || 
        text.includes('catering') || text.includes('food')) {
      keywords.push('restaurant', 'dining', 'culinary', 'food', 'cuisine', 'catering', 'kitchen');
    }
    
    if (text.includes('hall') || text.includes('ballroom') || text.includes('center') || 
        text.includes('space') || text.includes('venue')) {
      keywords.push('event space', 'function hall', 'banquet', 'reception', 'gathering');
    }
    
    if (text.includes('luxury') || text.includes('upscale') || text.includes('elegant') || 
        text.includes('premium') || text.includes('exclusive')) {
      keywords.push('luxury', 'upscale', 'elegant', 'premium', 'exclusive', 'high-end', 'sophisticated');
    }
    
    return keywords.join(' ');
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
    const avgPrice = (hourlyPrice + dailyPrice / 8) / 2;
    
    if (avgPrice > 2000) return 'luxury premium upscale exclusive high-end elite prestigious';
    if (avgPrice > 1000) return 'upscale quality refined elegant premium nice';
    if (avgPrice > 500) return 'mid-range quality good nice comfortable decent';
    if (avgPrice > 200) return 'affordable budget-friendly value economical reasonable';
    return 'budget cheap economical low-cost value bargain';
  };

  const getFeaturedKeywords = (featured: boolean): string => {
    if (featured) {
      return 'featured premium top-choice recommended highlight showcase';
    }
    return '';
  };

  // Generate comprehensive embedding text
  return [
    venue.name,
    venue.description,
    venue.category,
    venue.city,
    venue.state,
    getQualityKeywords(venue.rating || 0, venue.reviews_count || 0),
    getVenueTypeKeywords(venue.category, venue.name, venue.description),
    getCategoryKeywords(venue.category),
    getCapacityKeywords(venue.seated_capacity, venue.standing_capacity),
    getPriceKeywords(venue.hourly_price, venue.daily_price),
    getFeaturedKeywords(venue.featured || false),
    venue.amenities?.join(' ') || ''
  ].filter(Boolean).join(' ');
};

export const createVenue = async (venueData: {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  seatedCapacity: number;
  standingCapacity: number;
  hourlyPrice: number;
  dailyPrice: number;
  category: VenueCategory;
  amenities: string[];
  images: string[];
}): Promise<Venue> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Must be logged in to create venue');

  // Geocode the address to get coordinates
  const fullAddress = `${venueData.address}, ${venueData.city}, ${venueData.state} ${venueData.zipCode}`;
  const coordinates = await geocodeAddress(fullAddress);

  const venueInsert: VenueInsert = {
    name: venueData.name,
    description: venueData.description,
    address: venueData.address,
    city: venueData.city,
    state: venueData.state,
    zip_code: venueData.zipCode,
    seated_capacity: venueData.seatedCapacity,
    standing_capacity: venueData.standingCapacity,
    hourly_price: venueData.hourlyPrice,
    daily_price: venueData.dailyPrice,
    category: venueData.category,
    amenities: venueData.amenities,
    images: venueData.images,
    owner_id: user.id,
    status: 'approved', // Auto-approve venues for now
    latitude: coordinates?.latitude || null,
    longitude: coordinates?.longitude || null,
  };

  const { data, error } = await supabase
    .from('venues')
    .insert(venueInsert)
    .select()
    .single();

  if (error) throw error;

  // Generate embedding for the new venue
  try {
    console.log('Generating embedding for new venue:', data.name);
    
    const embeddingText = generateVenueEmbeddingText({
      name: data.name,
      description: data.description,
      category: data.category,
      city: data.city,
      state: data.state,
      seated_capacity: data.seated_capacity,
      standing_capacity: data.standing_capacity,
      hourly_price: data.hourly_price,
      daily_price: data.daily_price,
      amenities: data.amenities || [],
      rating: data.rating,
      reviews_count: data.reviews_count,
      featured: data.featured,
    });

    const embedding = await generateEmbedding(embeddingText, 'document');

    if (embedding) {
      // Update the venue with the embedding
      const { error: updateError } = await supabase
        .from('venues')
        .update({
          embedding: `[${embedding.join(',')}]`,
          embedding_text: embeddingText,
          embedding_updated_at: new Date().toISOString()
        })
        .eq('id', data.id);

      if (updateError) {
        console.error('Error updating venue with embedding:', updateError);
        // Don't throw error - venue creation was successful, embedding is just a bonus
      } else {
        console.log('Successfully generated embedding for new venue:', data.name);
      }
    } else {
      console.warn('Could not generate embedding for new venue:', data.name);
    }
  } catch (embeddingError) {
    console.error('Error during embedding generation for new venue:', embeddingError);
    // Don't throw error - venue creation was successful, embedding generation failed
  }

  return convertToVenue(data);
};

export const getUserVenues = async (): Promise<Venue[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(convertToVenue);
};

export const updateVenue = async (id: string, updates: Partial<VenueUpdate>): Promise<Venue> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Must be logged in to update venue');

  const { data, error } = await supabase
    .from('venues')
    .update(updates)
    .eq('id', id)
    .eq('owner_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return convertToVenue(data);
};

export const deleteVenue = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Must be logged in to delete venue');

  const { error } = await supabase
    .from('venues')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id);

  if (error) throw error;
};

export const getVenueReviews = async (venueId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('venue_id', venueId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createReview = async (reviewData: {
  venueId: string;
  userName: string;
  rating: number;
  comment: string;
}) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      venue_id: reviewData.venueId,
      user_name: reviewData.userName,
      rating: reviewData.rating,
      comment: reviewData.comment,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getVenuesByIds = async (venueIds: string[]): Promise<Venue[]> => {
  if (venueIds.length === 0) return [];

  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .in('id', venueIds)
    .eq('status', 'approved');

  if (error) throw error;
  
  // Maintain the order of the input IDs
  const venueMap = new Map(data.map(venue => [venue.id, convertToVenue(venue)]));
  return venueIds.map(id => venueMap.get(id)).filter(Boolean) as Venue[];
};