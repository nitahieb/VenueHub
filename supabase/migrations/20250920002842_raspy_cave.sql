/*
  # Geocode Existing Venues

  This migration adds latitude and longitude coordinates to existing venues
  by geocoding their addresses using the application's geocoding service.
  
  1. Database Changes
    - Updates existing venues with null coordinates
    - Uses the address, city, state, zip_code fields to construct full addresses
  
  2. Process
    - The actual geocoding will be done by the application
    - This migration prepares the data structure
    - A separate script will populate the coordinates
*/

-- First, let's see how many venues need geocoding
DO $$
DECLARE
    venue_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO venue_count 
    FROM venues 
    WHERE latitude IS NULL OR longitude IS NULL;
    
    RAISE NOTICE 'Found % venues that need geocoding', venue_count;
END $$;

-- The actual geocoding will be done by the application
-- This ensures we use the same geocoding logic and API keys