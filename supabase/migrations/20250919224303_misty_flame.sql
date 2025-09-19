/*
  # Create Reviews Table with Detailed Sample Data

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
    - Detailed, venue-specific reviews for all approved venues
    - Event-type focused content with practical information
    - Varied perspectives and authentic feedback
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

-- Insert detailed sample reviews for all approved venues
DO $$
DECLARE
  venue_record RECORD;
BEGIN
  -- Loop through all approved venues and add reviews
  FOR venue_record IN 
    SELECT id, name, category FROM venues WHERE status = 'approved'
  LOOP
    -- Wedding venues get wedding-focused reviews
    IF venue_record.category = 'wedding' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Sarah & Michael Chen', 5, 'Absolutely magical venue for our wedding! The bridal suite was spacious and beautifully lit for getting ready photos. The coordinator, Jessica, was incredible - she handled every detail flawlessly. Our 150 guests fit comfortably for the ceremony and reception. The built-in sound system worked perfectly for our vows and first dance. The catering kitchen allowed our vendor to serve hot, delicious food. Only minor issue was parking filled up quickly, but the valet service handled overflow perfectly. The garden backdrop made for stunning photos. Worth every penny!', now() - interval '5 days'),
      (venue_record.id, 'Jennifer Martinez', 4, 'Beautiful venue with great natural lighting for photos. We had 120 guests and the space felt just right - not too cramped, not too empty. The staff was professional and helped with setup/breakdown. The dance floor was the perfect size and the acoustics were excellent. One thing to note: the air conditioning struggled a bit during our July wedding, but they brought in extra fans quickly. The bridal suite has a great mirror setup for hair/makeup. Parking was adequate but guests had to walk a bit from the back lot. Overall, highly recommend for medium-sized weddings.', now() - interval '12 days'),
      (venue_record.id, 'David & Lisa Thompson', 5, 'This venue exceeded our expectations! The historic charm combined with modern amenities was perfect. Our wedding planner raved about how easy the venue was to work with. The kitchen facilities allowed our caterer to prepare everything on-site, which made a huge difference in food quality. The ceremony space has incredible acoustics - no microphone needed for our vows. The reception area transitioned beautifully from dinner to dancing. Parking was plentiful and well-lit for evening events. The coordinator stayed late to ensure everything was perfect. A truly special place for a special day.', now() - interval '18 days');

    -- Corporate venues get business-focused reviews  
    ELSIF venue_record.category = 'corporate' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Amanda Rodriguez, Event Coordinator', 5, 'Exceptional venue for our annual company conference. Hosted 200 attendees across the main hall and 3 breakout rooms. The AV setup is top-notch - multiple projection screens, wireless microphones, and excellent WiFi throughout. The tech support team was on-site and incredibly helpful. Catering space allowed for seamless coffee breaks and lunch service. Parking was ample with easy access for attendees. The professional atmosphere impressed our executives and clients. Climate control kept everyone comfortable all day. Already booked for next year!', now() - interval '8 days'),
      (venue_record.id, 'Marcus Johnson, HR Director', 4, 'Great corporate venue with modern facilities. We held our quarterly all-hands meeting here with 150 employees. The main presentation area has excellent sightlines from every seat. The breakout rooms were perfect for team sessions. WiFi was fast and reliable - important for our hybrid attendees joining virtually. The only minor issue was the coffee station got crowded during breaks, but the staff quickly set up an additional station. Parking was convenient and free. The venue coordinator helped us stay on schedule throughout the day. Professional and efficient experience overall.', now() - interval '15 days'),
      (venue_record.id, 'Rachel Kim, Training Manager', 5, 'Perfect for our leadership training workshop. The flexible room setup allowed us to easily transition from presentation style to small group work. Excellent natural lighting reduced eye strain during our full-day session. The sound system was crystal clear for our 80 participants. Breakout rooms had whiteboards and flip charts available. The catering area made lunch service smooth and efficient. Parking was plentiful and the location was easy for attendees to find. The venue staff was professional and unobtrusive. Highly recommend for corporate training events.', now() - interval '22 days');

    -- Party venues get celebration-focused reviews
    ELSIF venue_record.category = 'party' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Maria Gonzalez', 5, 'Amazing venue for my daughter''s quinceañera! The dance floor was the perfect size for our 180 guests. The DJ setup area had all the power outlets and space needed. The built-in bar made service so much easier. The lighting system created the perfect party atmosphere. Staff helped with decorating and were flexible with our setup time. The kitchen facilities allowed our caterer to keep food hot and fresh. Parking was adequate though it filled up quickly - recommend carpooling for large parties. The venue coordinator stayed to help with cleanup. Unforgettable celebration!', now() - interval '6 days'),
      (venue_record.id, 'Robert Chen', 4, 'Great party venue with a fun atmosphere. Celebrated my 50th birthday here with 120 friends and family. The sound system was excellent - music sounded great without being too loud for conversation. The bar area was well-designed and kept lines moving. Dance floor was spacious and the lighting created great ambiance. One small issue: the air conditioning couldn''t quite keep up with a full dance floor, but opening some windows helped. The staff was friendly and accommodating. Easy load-in for decorations and catering. Would definitely use again for future celebrations.', now() - interval '14 days'),
      (venue_record.id, 'Jessica Williams', 5, 'Perfect venue for our company holiday party! The space has such a great energy - everyone was dancing and having a blast. The built-in sound system saved us money on DJ equipment rental. The bar setup allowed for quick service even with 200 guests. The lighting system had different settings that worked great for dinner vs. dancing. Plenty of space for mingling and the dance floor never felt crowded. Parking was free and plentiful. The venue coordinator helped coordinate with our caterer and DJ. Staff stayed late to help with breakdown. Excellent value for a memorable party!', now() - interval '25 days');

    -- Conference venues get professional meeting reviews
    ELSIF venue_record.category = 'conference' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Dr. Patricia Adams, Conference Chair', 5, 'Outstanding venue for our medical conference. The main auditorium seated 300 comfortably with excellent sightlines. The AV capabilities were impressive - multiple screens, wireless presentation, and live streaming setup. The 6 breakout rooms were perfectly sized for our concurrent sessions. WiFi was fast and reliable throughout the building. The catering areas allowed for efficient coffee breaks and networking lunches. Parking was ample and the location was convenient for out-of-town attendees. The technical support team was knowledgeable and responsive. Professional atmosphere that impressed our speakers and attendees.', now() - interval '10 days'),
      (venue_record.id, 'Michael Torres, Event Manager', 4, 'Solid conference venue with good facilities. Hosted our industry summit with 250 attendees. The main hall has great acoustics and comfortable seating. The presentation technology worked flawlessly - easy to connect laptops and the wireless microphones were clear. Breakout rooms were well-equipped with whiteboards and flip charts. The only challenge was the coffee stations got congested during breaks, but the staff quickly adapted. Parking was convenient and free. The venue coordinator was helpful with logistics and timing. Good value for a professional conference setting.', now() - interval '17 days'),
      (venue_record.id, 'Linda Chang, Association Director', 5, 'Excellent venue for our annual membership conference. The flexible room configurations allowed us to adapt throughout the day. The theater-style main room was perfect for keynote presentations. Smaller rooms worked great for workshops and panel discussions. The AV equipment was modern and user-friendly. WiFi handled 200+ simultaneous users without issues. The exhibition area was well-lit and spacious for our vendor booths. Catering facilities made meal service seamless. The venue staff was professional and anticipated our needs. Already planning to return next year. Highly recommend for multi-day conferences.', now() - interval '28 days');

    -- Exhibition venues get trade show focused reviews
    ELSIF venue_record.category = 'exhibition' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Thomas Mitchell, Trade Show Director', 5, 'Perfect exhibition space for our annual trade show. The high ceilings and open floor plan accommodated 50 vendor booths beautifully. Loading dock access made setup and breakdown efficient for exhibitors. Electrical outlets were plentiful and well-positioned. The lighting was bright and even throughout the space. Parking was ample for both exhibitors and attendees. The venue staff understood trade show logistics and were helpful with vendor needs. Climate control kept the space comfortable even with large crowds. Registration area had good flow and visibility. Excellent value for exhibition events.', now() - interval '7 days'),
      (venue_record.id, 'Sandra Lopez, Event Coordinator', 4, 'Great exhibition venue with practical features. We hosted our craft fair with 40 vendors and steady foot traffic all day. The space layout allowed for good traffic flow between booths. Loading access was convenient for vendor setup. Adequate electrical for all vendor needs. The only minor issue was the restroom facilities got busy during peak hours. Parking was free and plentiful. The venue coordinator helped with floor plan layout and vendor questions. Good natural lighting supplemented the overhead fixtures. Would use again for future exhibitions.', now() - interval '19 days'),
      (venue_record.id, 'Kevin Park, Show Manager', 5, 'Outstanding exhibition facility! Hosted our technology expo with 60 booths and 500+ attendees. The space has excellent infrastructure - plenty of power, great lighting, and strong WiFi throughout. The loading dock made vendor move-in smooth and efficient. High ceilings accommodated tall displays and banners. The venue staff was experienced with trade shows and anticipated our needs. Parking was well-organized with clear signage. The registration area had good visibility and flow. Climate control maintained comfortable temperatures all day. Professional venue that impressed both exhibitors and attendees.', now() - interval '26 days');

    -- Outdoor venues get weather and logistics focused reviews
    ELSIF venue_record.category = 'outdoor' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Emily Rodriguez', 5, 'Absolutely stunning outdoor venue! The garden setting was perfect for our wedding ceremony and cocktail hour. The covered pavilion provided great backup for our reception - good thing because we had a brief shower! The outdoor lighting created magical ambiance as the sun set. Restroom facilities were clean and easily accessible. The catering prep area worked well for our outdoor menu. Parking was on grass but well-maintained and adequate. The venue coordinator helped us plan for weather contingencies. The natural acoustics worked well for our ceremony. Unforgettable outdoor celebration!', now() - interval '9 days'),
      (venue_record.id, 'James Wilson', 4, 'Beautiful outdoor space for our company picnic. The open lawn area was perfect for games and activities. The covered pavilion provided good shade and shelter. Grilling facilities were excellent for our BBQ menu. The only challenge was parking on the grass after recent rain - some cars needed help getting out. Restroom facilities were adequate but could use updating. The natural setting was relaxing and everyone enjoyed being outdoors. Good value for casual outdoor events. Would recommend checking weather and ground conditions before the event.', now() - interval '16 days'),
      (venue_record.id, 'Michelle Davis', 5, 'Perfect outdoor venue for our family reunion! The combination of open space and covered areas worked great for our 100+ guests. The playground area kept the kids entertained while adults could relax. Grilling and food prep areas were well-designed. The restroom facilities were clean and sufficient. Parking was ample on the paved area. The venue provided tables and chairs which saved us rental costs. The natural setting encouraged mingling and conversation. Weather was perfect, but the covered pavilion would have provided good backup. Great value for large family gatherings.', now() - interval '23 days');

    -- Historic venues get character and charm focused reviews
    ELSIF venue_record.category = 'historic' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Catherine Bennett', 5, 'Absolutely enchanting historic venue! The original architecture and period details created such a romantic atmosphere for our wedding. The grand staircase made for incredible photos. The ballroom''s crystal chandeliers and hardwood floors were breathtaking. Modern amenities were seamlessly integrated - excellent sound system and climate control. The bridal suite in the historic tower was like a fairy tale. Parking was managed well despite the downtown location. The venue coordinator was knowledgeable about the building''s history and logistics. Worth the premium price for such a unique and memorable setting.', now() - interval '11 days'),
      (venue_record.id, 'Richard Thompson', 4, 'Stunning historic venue with incredible character. Hosted our anniversary party in the main hall - the original details and craftsmanship were impressive. The acoustics were surprisingly good for such an old building. Modern lighting complemented the historic fixtures beautifully. One consideration: the historic nature means some accessibility limitations for elderly guests. Parking required some walking but was manageable. The venue staff was knowledgeable about the building''s quirks and history. Catering worked well despite the older kitchen facilities. Unique venue that made our celebration truly special.', now() - interval '20 days'),
      (venue_record.id, 'Margaret Foster', 5, 'Magnificent historic venue that transported our guests to another era! The preserved original features - tin ceilings, hardwood floors, and stained glass - created an elegant atmosphere. The venue has been thoughtfully updated with modern conveniences while maintaining its character. The grand ballroom was perfect for our gala dinner. Excellent acoustics for speeches and presentations. The venue coordinator shared fascinating historical details with our guests. Parking was well-organized with shuttle service from remote lots. Professional staff who understood both the venue''s history and modern event needs. Truly exceptional experience.', now() - interval '27 days');

    -- Modern venues get contemporary and tech-focused reviews
    ELSE -- modern category
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Alexandra Kim', 5, 'Sleek, contemporary venue that was perfect for our product launch! The minimalist design provided a clean backdrop for our brand presentation. The integrated AV system was state-of-the-art - wireless presentation, multiple screens, and excellent sound quality. The LED lighting system could be customized to match our brand colors. Climate control was precise and quiet. The modern kitchen facilities supported our catering perfectly. Parking garage was convenient and secure. The venue''s tech support team was knowledgeable and responsive. Professional atmosphere that impressed our clients and media. Exactly what we needed for a modern corporate event.', now() - interval '4 days'),
      (venue_record.id, 'Daniel Martinez', 4, 'Great modern venue with clean lines and contemporary feel. The open floor plan was flexible for our networking event. The built-in bar area was stylish and functional. Sound system was excellent and easy to use. The floor-to-ceiling windows provided great natural light during our daytime event. One minor issue: the hard surfaces created some echo during cocktail hour, but it wasn''t a major problem. Parking was convenient in the attached garage. The venue coordinator was professional and detail-oriented. Good value for events that need a contemporary, upscale atmosphere.', now() - interval '13 days'),
      (venue_record.id, 'Stephanie Chen', 5, 'Outstanding modern venue with every amenity you could want! The sophisticated design impressed our VIP guests at our charity gala. The integrated lighting and sound systems created the perfect ambiance. The modern kitchen allowed our caterer to execute a complex menu flawlessly. The venue''s technology infrastructure supported our live streaming and social media needs perfectly. Parking was valet-managed and seamless. The venue staff was professional and anticipated every need. The contemporary art and design elements provided great conversation starters. Premium venue that delivered a premium experience. Worth every dollar for special occasions.', now() - interval '21 days');
    END IF;
  END LOOP;
END $$;