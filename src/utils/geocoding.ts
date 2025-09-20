// Geocoding utility functions for converting addresses to coordinates

interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address?: string;
}

interface GeocodeResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    formatted_address: string;
  }>;
  status: string;
}

/**
 * Geocode an address using Google Maps Geocoding API
 * Falls back to OpenStreetMap Nominatim if Google API key is not available
 */
export const geocodeAddress = async (address: string): Promise<GeocodeResult | null> => {
  const fullAddress = `${address}`;
  
  // Try Google Maps Geocoding API first (if API key is available)
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (googleApiKey) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${googleApiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Google Geocoding API request failed');
      }
      
      const data: GeocodeResponse = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        return {
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          formatted_address: result.formatted_address,
        };
      }
    } catch (error) {
      console.warn('Google Geocoding failed, falling back to OpenStreetMap:', error);
    }
  }
  
  // Fallback to OpenStreetMap Nominatim (free, no API key required)
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`,
      {
        headers: {
          'User-Agent': 'VenueHub-App/1.0', // Required by Nominatim
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Nominatim geocoding request failed');
    }
    
    const data = await response.json();
    
    if (data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formatted_address: result.display_name,
      };
    }
  } catch (error) {
    console.error('Geocoding failed:', error);
  }
  
  return null;
};

/**
 * Reverse geocode coordinates to get an address
 */
export const reverseGeocode = async (latitude: number, longitude: number): Promise<string | null> => {
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (googleApiKey) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Google Reverse Geocoding API request failed');
      }
      
      const data: GeocodeResponse = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
    } catch (error) {
      console.warn('Google Reverse Geocoding failed, falling back to OpenStreetMap:', error);
    }
  }
  
  // Fallback to OpenStreetMap Nominatim
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'User-Agent': 'VenueHub-App/1.0',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Nominatim reverse geocoding request failed');
    }
    
    const data = await response.json();
    return data.display_name || null;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return null;
  }
};

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in meters
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};