import { supabase } from '../lib/supabase';
import { Venue, VenueCategory } from '../types/venue';
import type { Database } from '../lib/supabase';
import { geocodeAddress } from './geocoding';

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
    latitude: coordinates?.latitude || null,
    longitude: coordinates?.longitude || null,
  };

  const { data, error } = await supabase
    .from('venues')
    .insert(venueInsert)
    .select()
    .single();

  if (error) throw error;
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