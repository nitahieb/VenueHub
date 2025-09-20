import { supabase } from '../lib/supabase';
import { geocodeAddress } from './geocoding';

/**
 * Geocode all existing venues that don't have coordinates
 */
export const geocodeExistingVenues = async () => {
  console.log('Starting to geocode existing venues...');
  
  // Get all venues without coordinates
  const { data: venues, error } = await supabase
    .from('venues')
    .select('id, name, address, city, state, zip_code, latitude, longitude')
    .or('latitude.is.null,longitude.is.null');

  if (error) {
    console.error('Error fetching venues:', error);
    return;
  }

  if (!venues || venues.length === 0) {
    console.log('No venues need geocoding');
    return;
  }

  console.log(`Found ${venues.length} venues to geocode`);

  let successCount = 0;
  let errorCount = 0;

  for (const venue of venues) {
    try {
      const fullAddress = `${venue.address}, ${venue.city}, ${venue.state} ${venue.zip_code}`;
      console.log(`Geocoding: ${venue.name} - ${fullAddress}`);
      
      const coordinates = await geocodeAddress(fullAddress);
      
      if (coordinates) {
        // Update the venue with coordinates
        const { error: updateError } = await supabase
          .from('venues')
          .update({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
          })
          .eq('id', venue.id);

        if (updateError) {
          console.error(`Error updating venue ${venue.name}:`, updateError);
          errorCount++;
        } else {
          console.log(`✅ Successfully geocoded: ${venue.name} (${coordinates.latitude}, ${coordinates.longitude})`);
          successCount++;
        }
      } else {
        console.warn(`❌ Could not geocode: ${venue.name} - ${fullAddress}`);
        errorCount++;
      }

      // Add a small delay to be respectful to the geocoding API
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Error geocoding venue ${venue.name}:`, error);
      errorCount++;
    }
  }

  console.log(`\n🎉 Geocoding complete!`);
  console.log(`✅ Successfully geocoded: ${successCount} venues`);
  console.log(`❌ Failed to geocode: ${errorCount} venues`);
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
      })
      .eq('id', venueId);

    if (updateError) {
      console.error('Error updating venue coordinates:', updateError);
      return null;
    }

    return coordinates;
  }

  return null;
};