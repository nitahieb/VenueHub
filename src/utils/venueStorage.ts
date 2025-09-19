import { Venue } from '../types/venue';

const STORAGE_KEY = 'user_submitted_venues';

export interface UserVenue extends Omit<Venue, 'id' | 'rating' | 'reviews' | 'featured'> {
  id: string;
  rating: number;
  reviews: number;
  featured: boolean;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  submitterEmail?: string;
}

export const saveVenue = (venue: Omit<UserVenue, 'id' | 'submittedAt' | 'status' | 'rating' | 'reviews' | 'featured'>): UserVenue => {
  const venues = getUserVenues();
  
  const newVenue: UserVenue = {
    ...venue,
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    rating: 0,
    reviews: 0,
    featured: false,
    submittedAt: new Date(),
    status: 'pending'
  };

  venues.push(newVenue);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(venues));
  
  return newVenue;
};

export const getUserVenues = (): UserVenue[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const venues = JSON.parse(stored);
    return venues.map((venue: any) => ({
      ...venue,
      submittedAt: new Date(venue.submittedAt)
    }));
  } catch (error) {
    console.error('Error loading user venues:', error);
    return [];
  }
};

export const getApprovedUserVenues = (): Venue[] => {
  const userVenues = getUserVenues();
  return userVenues
    .filter(venue => venue.status === 'approved')
    .map(venue => ({
      id: venue.id,
      name: venue.name,
      description: venue.description,
      location: venue.location,
      capacity: venue.capacity,
      price: venue.price,
      amenities: venue.amenities,
      images: venue.images,
      category: venue.category,
      rating: venue.rating || 4.0, // Default rating for new venues
      reviews: venue.reviews || 0,
      availability: true,
      featured: venue.featured
    }));
};

export const updateVenueStatus = (id: string, status: 'pending' | 'approved' | 'rejected'): void => {
  const venues = getUserVenues();
  const venueIndex = venues.findIndex(v => v.id === id);
  
  if (venueIndex !== -1) {
    venues[venueIndex].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(venues));
  }
};

export const deleteUserVenue = (id: string): void => {
  const venues = getUserVenues();
  const filteredVenues = venues.filter(v => v.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredVenues));
};

// For demo purposes, auto-approve venues after 3 seconds
export const autoApproveVenue = (id: string): void => {
  setTimeout(() => {
    updateVenueStatus(id, 'approved');
    // Trigger a custom event to notify components of the update
    window.dispatchEvent(new CustomEvent('venueStatusUpdated', { detail: { id, status: 'approved' } }));
  }, 3000);
};