/*
  # Add Reviews Table with Sample Data

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
    - Add policy for public read access
    - Add policy for authenticated users to insert reviews

  3. Sample Data
    - Detailed reviews for each venue with event-specific information
    - Realistic user names and timestamps
    - Helpful details for venue selection
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
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'reviews' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'reviews' 
    AND policyname = 'Public can read reviews'
  ) THEN
    CREATE POLICY "Public can read reviews"
      ON reviews
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'reviews' 
    AND policyname = 'Authenticated users can insert reviews'
  ) THEN
    CREATE POLICY "Authenticated users can insert reviews"
      ON reviews
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Insert sample reviews for each venue
DO $$
DECLARE
  venue_record RECORD;
BEGIN
  -- Loop through all approved venues and add reviews
  FOR venue_record IN 
    SELECT id, name, category FROM venues WHERE status = 'approved'
  LOOP
    -- Add 2-4 reviews per venue based on category
    IF venue_record.category = 'wedding' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Sarah & Michael', 5, 'Absolutely perfect for our wedding! The bridal suite was spacious and beautifully decorated. Our 150 guests fit comfortably, and the dance floor was the perfect size. The catering kitchen allowed our vendors to serve hot, delicious food all evening. The coordinator was incredibly helpful with setup and breakdown. The only minor issue was parking filled up quickly, but the valet service handled it well. Would definitely recommend for weddings!', now() - interval '5 days'),
      (venue_record.id, 'Jennifer L.', 5, 'Had our reception here with 200 guests and it was magical! The lighting was perfect for photos, and the sound system worked flawlessly for our DJ. The venue provided tables and chairs which saved us money. Staff was professional and helped coordinate with all our vendors. The getting-ready room was a nice touch. Great value for the price - highly recommend!', now() - interval '12 days'),
      (venue_record.id, 'David & Emma', 4, 'Beautiful venue with great character. Hosted 180 guests comfortably. The built-in bar was convenient and the bartender was excellent. Setup was easy with their event coordinator. Only downside was the air conditioning struggled a bit during our summer wedding, but they provided fans. The photo opportunities were endless. Would book again!', now() - interval '18 days');
    
    ELSIF venue_record.category = 'corporate' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Tech Solutions Inc.', 5, 'Excellent venue for our annual conference. Hosted 250 attendees across the main hall and 3 breakout rooms. The AV equipment was top-notch - multiple screens, wireless mics, and reliable WiFi throughout. The catering space allowed for seamless lunch service. Parking was ample and the location was convenient for out-of-town guests. Professional atmosphere and responsive staff. Will definitely use again.', now() - interval '8 days'),
      (venue_record.id, 'Marketing Pro Events', 4, 'Great corporate event space. Used it for a 180-person product launch. The modern design impressed our clients, and the presentation setup was professional. WiFi handled all our streaming needs. The only issue was some echo in the main room during presentations, but the sound technician helped adjust. Good value and excellent service.', now() - interval '15 days'),
      (venue_record.id, 'Global Consulting', 5, 'Perfect for our quarterly meeting with 120 executives. The breakout rooms were ideal for smaller group sessions. Excellent catering facilities and the staff coordinated perfectly with our preferred caterer. High-speed internet was crucial for our video conferences and worked flawlessly. Professional environment that impressed our international guests.', now() - interval '22 days');
    
    ELSIF venue_record.category = 'party' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Maria Rodriguez', 5, 'Amazing party venue! Celebrated my 40th birthday with 120 friends and family. The dance floor was perfect size and the sound system had great bass. The bar service was quick and professional. Loved that we could bring our own DJ. The lighting created such a fun atmosphere. Easy load-in for decorations. Everyone had a blast!', now() - interval '6 days'),
      (venue_record.id, 'James & Lisa', 4, 'Great space for our anniversary party. 90 guests had plenty of room to mingle and dance. The built-in bar saved us money on rentals. Staff was helpful with setup and cleanup. The only issue was the music had to end at 11pm due to noise ordinance, but they were upfront about that. Fun atmosphere and good value.', now() - interval '14 days'),
      (venue_record.id, 'Party Planning Plus', 5, 'Used this venue for a client''s graduation party. 150 guests, great flow between indoor and outdoor spaces. The kitchen facilities were perfect for our catering needs. Ample parking and easy access for elderly guests. The staff went above and beyond to accommodate our decorating needs. Highly recommend for celebrations!', now() - interval '20 days');
    
    ELSIF venue_record.category = 'conference' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Medical Association', 5, 'Outstanding conference facility. Hosted our 300-person medical symposium with multiple concurrent sessions. The main auditorium has excellent acoustics and sightlines. All 5 breakout rooms had proper AV setup. The exhibition area was perfect for our 20 vendors. Catering space handled our coffee breaks and lunch efficiently. Professional staff and reliable tech support throughout the event.', now() - interval '7 days'),
      (venue_record.id, 'Education Summit', 4, 'Solid venue for our 200-attendee education conference. Good presentation facilities and comfortable seating. The WiFi handled our live streaming needs well. Registration area was spacious. Only minor issue was temperature control in one breakout room, but staff addressed it quickly. Good value for academic conferences.', now() - interval '16 days'),
      (venue_record.id, 'Industry Leaders Forum', 5, 'Excellent professional venue. The theater-style seating in the main hall was comfortable for our 8-hour conference. Multiple screens ensured everyone could see presentations clearly. The networking areas were well-designed for breaks. Catering coordination was seamless. Impressed our keynote speakers and attendees alike.', now() - interval '25 days');
    
    ELSIF venue_record.category = 'exhibition' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Trade Show Organizers', 5, 'Perfect exhibition space! Hosted a 150-booth trade show with 2000+ attendees over 2 days. The loading dock made setup and breakdown efficient for all vendors. Electrical capacity handled all booth requirements. The high ceilings and open layout created an impressive atmosphere. Ample parking for both exhibitors and visitors. Professional event coordination throughout.', now() - interval '9 days'),
      (venue_record.id, 'Art Gallery Collective', 4, 'Great space for our art exhibition. The lighting was excellent for showcasing artwork. Easy load-in through the loading dock. The open floor plan allowed for creative booth layouts. Good foot traffic flow. Only issue was limited storage space, but we managed. The venue staff was helpful with our unique setup needs.', now() - interval '17 days'),
      (venue_record.id, 'Craft Fair Productions', 5, 'Wonderful venue for our annual craft fair. 80 vendors fit comfortably with room for shoppers to browse. The concrete floors handled heavy foot traffic well. Good natural light supplemented by professional lighting. Easy setup with drive-up access. Restroom facilities were adequate for the crowd. Great community atmosphere.', now() - interval '23 days');
    
    ELSIF venue_record.category = 'outdoor' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Summer Wedding Co.', 5, 'Absolutely stunning outdoor venue! Our 180-guest wedding ceremony and reception were perfect. The natural setting provided incredible photo opportunities. The covered pavilion was essential when it drizzled during cocktail hour. Adequate parking on grass areas. The outdoor lighting created a magical evening atmosphere. Restroom facilities were clean and accessible. Highly recommend for outdoor celebrations!', now() - interval '4 days'),
      (venue_record.id, 'Corporate Retreat Planners', 4, 'Great outdoor space for our company picnic. 200 employees enjoyed the natural setting and lawn games area. The pavilion provided good shade for lunch service. Parking was adequate but got muddy after rain. The outdoor sound system worked well for announcements. Beautiful setting that everyone loved.', now() - interval '13 days'),
      (venue_record.id, 'Festival Organizers', 5, 'Perfect for our music festival! The large open space accommodated 500+ attendees comfortably. Multiple electrical hookups for vendors and stage equipment. The natural amphitheater setting was ideal for performances. Good access roads for equipment trucks. Weather backup plan with covered areas was reassuring. Great outdoor venue!', now() - interval '21 days');
    
    ELSIF venue_record.category = 'historic' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Heritage Events', 5, 'Magnificent historic venue with incredible character! Our 120-guest gala was elegant and memorable. The original architecture provided a stunning backdrop for photos. Modern amenities were seamlessly integrated without compromising the historic charm. The grand staircase was perfect for our entrance. Professional lighting highlighted the beautiful details. Parking was managed well despite the downtown location.', now() - interval '10 days'),
      (venue_record.id, 'Classic Weddings', 4, 'Beautiful historic setting for our vintage-themed wedding. 150 guests were impressed by the authentic period details. The ballroom had wonderful acoustics for our string quartet. Some modern conveniences were limited due to historic preservation, but the charm made up for it. The coordinator was knowledgeable about the building''s history and restrictions.', now() - interval '19 days'),
      (venue_record.id, 'Museum Events', 5, 'Outstanding venue for our fundraising dinner. The historic ambiance elevated our event significantly. 200 guests enjoyed cocktails in the grand foyer and dinner in the main hall. The period lighting fixtures created perfect atmosphere. Catering worked well within the historic kitchen constraints. Truly a special venue that impressed all our donors.', now() - interval '26 days');
    
    ELSIF venue_record.category = 'modern' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Contemporary Events', 5, 'Sleek, modern venue perfect for our product launch! The minimalist design let our brand take center stage. 180 guests were impressed by the contemporary architecture and city views. State-of-the-art AV system handled our multimedia presentation flawlessly. The open floor plan was flexible for different event phases. Professional atmosphere that aligned perfectly with our brand image.', now() - interval '3 days'),
      (venue_record.id, 'Urban Celebrations', 4, 'Stylish modern space for our anniversary party. 140 guests loved the contemporary design and floor-to-ceiling windows. The built-in sound system was excellent for our DJ. Bar area was beautifully designed. Only minor issue was echo in the main space during speeches, but overall atmosphere was fantastic. Great for modern celebrations.', now() - interval '11 days'),
      (venue_record.id, 'Tech Company Events', 5, 'Perfect modern venue for our annual awards ceremony. The clean lines and sophisticated design impressed our 250 guests. Excellent lighting control for our presentation needs. The rooftop terrace was a hit for cocktail hour. High-speed WiFi and multiple charging stations were appreciated by our tech-savvy crowd. Professional and contemporary - exactly what we needed.', now() - interval '24 days');
    
    END IF;
  END LOOP;
END $$;