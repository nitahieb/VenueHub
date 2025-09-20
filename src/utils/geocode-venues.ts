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
        // Force numeric ID match if your id column is integer
        const idValue = typeof venue.id === 'string' ? Number(venue.id) : venue.id;

        // Update the venue with coordinates and return the updated row
        const { data: updatedRows, error: updateError } = await supabase
          .from('venues')
          .update({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
          }, { returning: 'representation' }) // force returning updated rows
          .eq('id', idValue)
          .select();

        if (updateError) {
          console.error(`Database update error for ${venue.name}:`, updateError);
          errorCount++;
        } else if (!updatedRows || updatedRows.length === 0) {
          console.warn(`⚠️ No rows were updated for ${venue.name} (id=${venue.id}). Check ID type or RLS policy.`);
          errorCount++;
        } else {
          console.log(`✅ Successfully updated:`, updatedRows[0]);
          successCount++;
        }
      } else {
        console.warn(`Could not geocode: ${venue.name} - ${fullAddress}`);
        errorCount++;
      }

      // Add a small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (err) {
      console.error(`Error geocoding venue ${venue.name}:`, err);
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
