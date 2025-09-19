import { supabase } from '../lib/supabase';

const VENUE_IMAGES_BUCKET = 'venue-images';

export const uploadVenueImage = async (file: File, venueId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${venueId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(VENUE_IMAGES_BUCKET)
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(VENUE_IMAGES_BUCKET)
    .getPublicUrl(fileName);

  return publicUrl;
};

export const uploadMultipleVenueImages = async (files: File[], venueId: string): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadVenueImage(file, venueId));
  return Promise.all(uploadPromises);
};

export const deleteVenueImage = async (imageUrl: string): Promise<void> => {
  // Extract file path from URL
  const urlParts = imageUrl.split('/');
  const fileName = urlParts.slice(-2).join('/'); // Get venueId/filename.ext

  const { error } = await supabase.storage
    .from(VENUE_IMAGES_BUCKET)
    .remove([fileName]);

  if (error) throw error;
};