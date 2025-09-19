/*
  # Create reviews table and add fake review data

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
    - Add policy for authenticated users to create reviews

  3. Sample Data
    - Add realistic fake reviews for existing venues
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert fake reviews for venues
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
-- Reviews for Grand Ballroom
((SELECT id FROM venues WHERE name = 'Grand Ballroom' LIMIT 1), 'Sarah Johnson', 5, 'Absolutely stunning venue! The crystal chandeliers and elegant decor made our wedding day perfect. The staff was incredibly professional and attentive to every detail.', now() - interval '2 months'),
((SELECT id FROM venues WHERE name = 'Grand Ballroom' LIMIT 1), 'Michael Chen', 5, 'Hosted our company gala here and it exceeded all expectations. The acoustics are perfect and the lighting creates such a magical atmosphere.', now() - interval '1 month'),
((SELECT id FROM venues WHERE name = 'Grand Ballroom' LIMIT 1), 'Emily Rodriguez', 4, 'Beautiful venue with excellent service. The only minor issue was parking, but the valet service helped. Would definitely recommend for special occasions.', now() - interval '3 weeks'),

-- Reviews for Modern Conference Center
((SELECT id FROM venues WHERE name = 'Modern Conference Center' LIMIT 1), 'David Park', 5, 'Perfect for our tech conference. All the AV equipment worked flawlessly and the breakout rooms were exactly what we needed. Very professional setup.', now() - interval '1 month'),
((SELECT id FROM venues WHERE name = 'Modern Conference Center' LIMIT 1), 'Lisa Thompson', 4, 'Great facilities and very modern. The WiFi was fast and reliable. Coffee service was excellent. Only wish there were more parking spaces.', now() - interval '2 weeks'),
((SELECT id FROM venues WHERE name = 'Modern Conference Center' LIMIT 1), 'James Wilson', 5, 'Exceptional venue for business events. The staff helped us set up everything perfectly and the location is very convenient.', now() - interval '1 week'),

-- Reviews for Rooftop Garden
((SELECT id FROM venues WHERE name = 'Rooftop Garden' LIMIT 1), 'Amanda Foster', 5, 'The most beautiful outdoor wedding venue! The city views are breathtaking and the garden setting is so romantic. Our guests are still talking about it!', now() - interval '6 weeks'),
((SELECT id FROM venues WHERE name = 'Rooftop Garden' LIMIT 1), 'Robert Kim', 4, 'Great atmosphere for our engagement party. The weather was perfect and the sunset views were amazing. Food service was top-notch.', now() - interval '1 month'),
((SELECT id FROM venues WHERE name = 'Rooftop Garden' LIMIT 1), 'Jennifer Lee', 5, 'Absolutely magical venue! The string lights and garden atmosphere created the perfect ambiance for our anniversary celebration.', now() - interval '2 weeks'),

-- Reviews for Historic Manor
((SELECT id FROM venues WHERE name = 'Historic Manor' LIMIT 1), 'Charles Brown', 5, 'The historic charm of this venue is unmatched. Perfect for our vintage-themed wedding. The architecture and period details are stunning.', now() - interval '3 months'),
((SELECT id FROM venues WHERE name = 'Historic Manor' LIMIT 1), 'Maria Garcia', 4, 'Beautiful historic venue with so much character. The grand staircase made for amazing photos. Staff was knowledgeable about the history.', now() - interval '2 months'),
((SELECT id FROM venues WHERE name = 'Historic Manor' LIMIT 1), 'Thomas Anderson', 5, 'Incredible venue with rich history. The period furnishings and architecture created the perfect atmosphere for our corporate retreat.', now() - interval '1 month'),

-- Reviews for Lakeside Pavilion
((SELECT id FROM venues WHERE name = 'Lakeside Pavilion' LIMIT 1), 'Rachel Green', 5, 'The lake views are absolutely stunning! Perfect for our outdoor ceremony. The pavilion provided great coverage and the setting was so peaceful.', now() - interval '2 months'),
((SELECT id FROM venues WHERE name = 'Lakeside Pavilion' LIMIT 1), 'Kevin Martinez', 4, 'Beautiful natural setting for our family reunion. The kids loved being near the water and the adults enjoyed the scenic views. Great facilities.', now() - interval '1 month'),
((SELECT id FROM venues WHERE name = 'Lakeside Pavilion' LIMIT 1), 'Nicole Davis', 5, 'Perfect venue for our outdoor wedding. The sunset over the lake was breathtaking and the pavilion was beautifully decorated.', now() - interval '3 weeks'),

-- Reviews for Industrial Loft
((SELECT id FROM venues WHERE name = 'Industrial Loft' LIMIT 1), 'Alex Turner', 5, 'Love the modern industrial vibe! Perfect for our art gallery opening. The exposed brick and high ceilings created such a cool atmosphere.', now() - interval '1 month'),
((SELECT id FROM venues WHERE name = 'Industrial Loft' LIMIT 1), 'Samantha White', 4, 'Great space for our product launch. The industrial aesthetic matched our brand perfectly. Good lighting and sound system.', now() - interval '2 weeks'),
((SELECT id FROM venues WHERE name = 'Industrial Loft' LIMIT 1), 'Daniel Johnson', 5, 'Unique venue with great character. The exposed elements and modern touches created the perfect backdrop for our fashion show.', now() - interval '1 week'),

-- Reviews for Beachfront Resort
((SELECT id FROM venues WHERE name = 'Beachfront Resort' LIMIT 1), 'Isabella Rodriguez', 5, 'Dream wedding venue! The beach ceremony was perfect and the resort facilities are top-notch. Our guests loved the ocean views and amenities.', now() - interval '4 months'),
((SELECT id FROM venues WHERE name = 'Beachfront Resort' LIMIT 1), 'Christopher Lee', 5, 'Amazing destination wedding venue. The staff handled everything perfectly and the beachfront location was absolutely stunning.', now() - interval '2 months'),
((SELECT id FROM venues WHERE name = 'Beachfront Resort' LIMIT 1), 'Sophia Chen', 4, 'Beautiful resort with excellent service. The beach access and ocean views made our celebration unforgettable. Highly recommend!', now() - interval '1 month'),

-- Reviews for Urban Warehouse
((SELECT id FROM venues WHERE name = 'Urban Warehouse' LIMIT 1), 'Marcus Thompson', 4, 'Great space for our corporate event. The industrial feel and flexible layout worked perfectly for our needs. Good value for the price.', now() - interval '3 weeks'),
((SELECT id FROM venues WHERE name = 'Urban Warehouse' LIMIT 1), 'Olivia Wilson', 5, 'Perfect venue for our art exhibition. The raw space allowed us to create exactly the atmosphere we wanted. Very accommodating staff.', now() - interval '2 weeks'),
((SELECT id FROM venues WHERE name = 'Urban Warehouse' LIMIT 1), 'Ethan Brown', 4, 'Cool industrial venue with lots of potential. Great for creative events. The loading dock made setup easy and the space has great acoustics.', now() - interval '1 week'),

-- Reviews for Country Club
((SELECT id FROM venues WHERE name = 'Country Club' LIMIT 1), 'Victoria Adams', 5, 'Elegant venue with impeccable service. The golf course views are beautiful and the dining was exceptional. Perfect for our anniversary celebration.', now() - interval '2 months'),
((SELECT id FROM venues WHERE name = 'Country Club' LIMIT 1), 'William Taylor', 4, 'Classic venue with great amenities. The staff was professional and the facilities are well-maintained. Good for formal events.', now() - interval '1 month'),
((SELECT id FROM venues WHERE name = 'Country Club' LIMIT 1), 'Grace Miller', 5, 'Sophisticated venue with beautiful grounds. The ballroom is elegant and the service was outstanding. Highly recommend for weddings.', now() - interval '2 weeks'),

-- Reviews for Art Gallery
((SELECT id FROM venues WHERE name = 'Art Gallery' LIMIT 1), 'Sebastian Davis', 5, 'Unique and inspiring venue! The rotating art exhibitions provided a constantly changing backdrop. Perfect for our creative industry networking event.', now() - interval '1 month'),
((SELECT id FROM venues WHERE name = 'Art Gallery' LIMIT 1), 'Luna Martinez', 4, 'Beautiful space with great natural light. The artwork added such an interesting element to our event. Staff was knowledgeable about the pieces.', now() - interval '3 weeks'),
((SELECT id FROM venues WHERE name = 'Art Gallery' LIMIT 1), 'Phoenix Anderson', 5, 'Absolutely love this venue! The combination of art and event space is brilliant. Created such a sophisticated atmosphere for our book launch.', now() - interval '1 week');