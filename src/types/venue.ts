export interface Venue {
  id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
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
  category: VenueCategory;
  rating: number;
  reviews: number;
  availability: boolean;
  featured: boolean;
  status: string;
  owner_id: string | null;
}

export type VenueCategory = 
  | 'wedding'
  | 'corporate'
  | 'party'
  | 'conference'
  | 'exhibition'
  | 'outdoor'
  | 'historic'
  | 'modern';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  venueRecommendations?: Venue[];
}