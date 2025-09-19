/*
  # Create reviews table

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `venue_id` (uuid, foreign key to venues)
      - `user_name` (text)
      - `rating` (integer, 1-5)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `reviews` table
    - Add policy for anyone to read reviews
    - Add policy for authenticated users to insert reviews

  3. Sample Data
    - Insert sample reviews for existing venues
*/

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert sample reviews
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
-- Reviews for venues (using sample venue IDs - these will need to match actual venue IDs)
('3e7ce553-b31b-46f6-b78a-3bdabedd6f33', 'Sarah Johnson', 5, 'Absolutely stunning venue! The historic architecture provided the perfect backdrop for our wedding. The staff was incredibly helpful and the acoustics were amazing.', '2024-01-15 10:30:00'),
('3e7ce553-b31b-46f6-b78a-3bdabedd6f33', 'Michael Chen', 4, 'Great location and beautiful space. The only minor issue was parking, but overall an excellent experience for our corporate event.', '2024-01-20 14:45:00'),
('3e7ce553-b31b-46f6-b78a-3bdabedd6f33', 'Emily Rodriguez', 5, 'Perfect for our art exhibition! The lighting was ideal and the layout allowed for great flow. Highly recommend!', '2024-02-01 09:15:00');

-- Add more sample reviews for other venues (these IDs are examples)
DO $$
DECLARE
    venue_record RECORD;
    sample_names text[] := ARRAY['Alex Thompson', 'Jessica Williams', 'David Brown', 'Lisa Davis', 'Robert Wilson', 'Amanda Taylor', 'Christopher Lee', 'Michelle Garcia', 'Daniel Martinez', 'Jennifer Anderson'];
    sample_comments text[] := ARRAY[
        'Fantastic venue with excellent service and beautiful ambiance.',
        'Perfect location for our event. Everything went smoothly.',
        'Amazing space with great acoustics and lighting.',
        'Professional staff and stunning architecture.',
        'Exceeded our expectations in every way.',
        'Beautiful venue with all the amenities we needed.',
        'Great value for money and exceptional service.',
        'Perfect for our special occasion. Highly recommended!',
        'Outstanding venue with attention to detail.',
        'Wonderful experience from start to finish.'
    ];
    i integer;
    review_count integer;
BEGIN
    -- Get all approved venues and add 2-4 reviews each
    FOR venue_record IN 
        SELECT id FROM venues WHERE status = 'approved' LIMIT 10
    LOOP
        review_count := 2 + floor(random() * 3)::integer; -- 2-4 reviews per venue
        
        FOR i IN 1..review_count LOOP
            INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES (
                venue_record.id,
                sample_names[1 + floor(random() * array_length(sample_names, 1))::integer],
                4 + floor(random() * 2)::integer, -- Rating 4-5
                sample_comments[1 + floor(random() * array_length(sample_comments, 1))::integer],
                now() - interval '1 day' * floor(random() * 30)::integer -- Random date within last 30 days
            );
        END LOOP;
    END LOOP;
END $$;