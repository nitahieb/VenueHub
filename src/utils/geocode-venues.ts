import { supabase } from '../lib/supabase';
import { geocodeAddress } from './geocoding';

/**
 * Geocode all existing venues that don't have coordinates
 */
export const geocodeExistingVenues = async (): Promise<{
  success: number;
  errors: number;
  total: number;
}> => {
  console.log('Starting geocoding process...');
  
  // Get all venues without coordinates
  const { data: venues, error } = await supabase
    .from('venues')
    .select('id, name, address, city, state, zip_code, latitude, longitude')
    .or('latitude.is.null,longitude.is.null');

  if (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }

  console.log(`Found ${venues?.length || 0} venues to geocode:`, venues);

  if (!venues || venues.length === 0) {
    console.log('No venues need geocoding');
    return { success: 0, errors: 0, total: 0 };
  }

  let successCount = 0;
  let errorCount = 0;

  for (const venue of venues) {
    try {
      const fullAddress = `${venue.address}, ${venue.city}, ${venue.state} ${venue.zip_code}`;
      console.log(`Geocoding venue: ${venue.name} - ${fullAddress}`);
      
      const coordinates = await geocodeAddress(fullAddress);
      console.log(`Geocoding result for ${venue.name}:`, coordinates);
      
      if (coordinates) {
        // Update the venue with coordinates
        const { error: updateError } = await supabase
          .from('venues')
          .update({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
          })
          .eq('id', venue.id)
          .select();

        if (updateError) {
          console.error(`Database update error for ${venue.name}:`, updateError);
          errorCount++;
        } else {
          console.log(`Successfully geocoded: ${venue.name} (${coordinates.latitude}, ${coordinates.longitude})`);
          successCount++;
          
          // Verify the update worked
          const { data: verifyData, error: verifyError } = await supabase
            .from('venues')
            .select('latitude, longitude')
            .eq('id', venue.id)
            .single();
          
          if (verifyError) {
            console.error(`Verification error for ${venue.name}:`, verifyError);
          } else {
            console.log(`Verification for ${venue.name}:`, verifyData);
          }
        }
      } else {
        console.warn(`Could not geocode: ${venue.name} - ${fullAddress}`);
        errorCount++;
      }

      // Add a small delay to be respectful to the geocoding API
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`Error geocoding venue ${venue.name}:`, error);
      errorCount++;
    }
  }

  console.log(`Geocoding complete. Success: ${successCount}, Errors: ${errorCount}, Total: ${venues.length}`);
  
  return {
    success: successCount,
    errors: errorCount,
    total: venues.length
  };
};

/**
 * Geocode a single venue by ID
 */
export const geocodeVenue = async (venueId: string) => {
  const { data: venue, error } = await supabase
    .from('venues')
    .select('id, name, address, city, state, zip_code')
    .eq('id', venueId)
    .single();

  if (error || !venue) {
    console.error('Error fetching venue:', error);
    return null;
  }

  const fullAddress = `${venue.address}, ${venue.city}, ${venue.state} ${venue.zip_code}`;
  const coordinates = await geocodeAddress(fullAddress);

  if (coordinates) {
    const { error: updateError } = await supabase
      .from('venues')
      .update({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      },
    { returning: 'representation' })
      .eq('id', Number(venueId));

    if (updateError) {
      console.error('Error updating venue coordinates:', updateError);
      return null;
    }

    return coordinates;
  }

  return null;
};