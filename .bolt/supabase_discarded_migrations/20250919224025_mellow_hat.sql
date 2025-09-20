/*
  # Create reviews table with detailed sample data

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
    - Detailed, distinct reviews for each venue
    - Useful information for venue selection
    - Varied perspectives and event types
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

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert detailed sample reviews for each venue
DO $$
DECLARE
  venue_record RECORD;
  review_data RECORD;
BEGIN
  -- Loop through all approved venues
  FOR venue_record IN 
    SELECT id, name, category FROM venues WHERE status = 'approved'
  LOOP
    -- Wedding venue reviews
    IF venue_record.category = 'wedding' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Sarah & Michael Chen', 5, 
       'Absolutely magical venue for our wedding! The staff went above and beyond to make our day perfect. The bridal suite was spacious and beautifully decorated - perfect for getting ready photos. The ceremony space had incredible natural lighting, and our photographer was thrilled. The catering team was exceptional, with multiple dietary accommodations handled flawlessly. Our 150 guests raved about the food quality. The venue coordinator, Jessica, was incredibly organized and helped us stay on timeline. The dance floor was the perfect size and the sound system was crystal clear. Parking was ample and well-lit for evening events. Would absolutely recommend for any couple looking for an elegant, stress-free wedding experience!', 
       now() - interval '12 days'),
      (venue_record.id, 'Jennifer Martinez', 5, 
       'We had our reception here after a church ceremony and it was flawless! The venue transformation between cocktail hour and dinner was seamless. The bar service was top-notch with skilled bartenders who made custom cocktails. The outdoor terrace was perfect for photos during golden hour. The venue provided tables, chairs, and linens that perfectly matched our color scheme. The cleanup service was thorough - we didn''t have to worry about anything. The acoustics were perfect for our live band. Guest accessibility was excellent with ramps and accessible restrooms. The venue stayed within our budget and provided incredible value. Our guests are still talking about how beautiful everything was!', 
       now() - interval '8 days'),
      (venue_record.id, 'David & Amanda Rodriguez', 4, 
       'Beautiful venue with stunning architecture! The historic charm added so much character to our wedding. The getting-ready rooms were comfortable and had great natural light. However, the air conditioning struggled a bit during our July wedding, so consider the season when booking. The catering was delicious, though service was slightly slow during cocktail hour. The venue coordinator was helpful but sometimes hard to reach. The photo opportunities are endless - both indoor and outdoor spaces are gorgeous. Parking filled up quickly, so we arranged shuttle service from a nearby lot. The sound system worked well for our DJ. Overall, a beautiful venue that just needs a few operational improvements. Would still recommend for couples who love historic venues!', 
       now() - interval '25 days');

    -- Corporate venue reviews  
    ELSIF venue_record.category = 'corporate' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Marcus Thompson - TechCorp', 5, 
       'Outstanding venue for our annual company retreat! The conference facilities were state-of-the-art with excellent AV equipment and reliable high-speed WiFi throughout. The breakout rooms were perfectly sized for our team sessions. The catering service offered healthy, diverse menu options that accommodated all dietary restrictions. The venue staff was incredibly professional and responsive to our needs. Parking was convenient and free for all 200 attendees. The main presentation hall had perfect acoustics and lighting. The networking areas were well-designed for informal conversations. The venue''s central location made it easy for out-of-town attendees to find hotels nearby. Exceptional value for a corporate event of this scale!', 
       now() - interval '15 days'),
      (venue_record.id, 'Lisa Park - Marketing Solutions Inc', 4, 
       'Great venue for our product launch event! The modern aesthetic perfectly matched our brand image. The built-in projection systems saved us rental costs. The catering was professional-grade with excellent presentation. The venue team helped coordinate with our external vendors seamlessly. The only minor issue was that the main room got a bit warm with 180 people, but the staff quickly adjusted the climate control. The loading dock made setup and breakdown very efficient. The venue''s tech support was knowledgeable and available throughout our event. The bar service was professional and reasonably priced. Would definitely book again for future corporate events!', 
       now() - interval '6 days'),
      (venue_record.id, 'Robert Kim - Global Consulting', 5, 
       'Perfect for our client conference! The venue''s professional atmosphere impressed our high-profile attendees. The registration area was spacious and well-organized. The main auditorium had excellent sightlines from every seat. The simultaneous translation equipment worked flawlessly. The catering team provided seamless service during breaks without disrupting sessions. The venue''s event coordinator was exceptional - anticipated our needs and solved problems before we even noticed them. The business center and WiFi were reliable for attendees who needed to work. Valet parking was a nice touch that our clients appreciated. The venue''s reputation added credibility to our event. Highly recommend for any high-stakes corporate gathering!', 
       now() - interval '20 days');

    -- Party venue reviews
    ELSIF venue_record.category = 'party' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Maria Gonzalez', 5, 
       'Amazing venue for my daughter''s quinceañera! The decorating possibilities are endless - the neutral walls and high ceilings made our pink and gold theme pop beautifully. The dance floor was the perfect size for 120 guests and the DJ booth had all the connections needed. The catering kitchen was fully equipped, allowing our family caterer to prepare fresh food on-site. The venue provided round tables that seated 8 comfortably. The bar area was well-stocked and the bartender was experienced with traditional Mexican drinks. The photo opportunities were fantastic, especially the grand staircase. Parking was free and plentiful. The venue coordinator helped us stay organized during setup. The sound system was powerful enough for our mariachi band. Truly made our celebration unforgettable!', 
       now() - interval '10 days'),
      (venue_record.id, 'James Wilson', 4, 
       'Great space for my 50th birthday party! The venue has a fun, energetic vibe that got everyone in a party mood. The bar service was excellent with creative cocktails and good wine selection. The dance floor filled up quickly - everyone loved the music setup. The catering was tasty, though the service was a bit slow during peak dinner time. The venue provided basic decorations, but we brought our own to personalize the space. The outdoor patio was perfect for guests who wanted to chat away from the music. Parking was adequate but filled up by 8 PM. The venue staff was friendly and accommodating. The cleanup service was thorough. Would recommend for casual, fun celebrations!', 
       now() - interval '18 days'),
      (venue_record.id, 'Ashley Chen', 5, 
       'Perfect for our company holiday party! The venue struck the right balance between professional and fun. The space easily accommodated our 90 employees with room for mingling. The built-in sound system was perfect for background music and announcements. The catering options were diverse and delicious - the appetizer selection was particularly impressive. The bar package was reasonably priced and included premium liquors. The venue''s event coordinator helped us plan activities and timeline. The lighting could be adjusted for different moods throughout the evening. Easy access for elderly employees and those with mobility issues. The venue''s central location made it convenient for everyone. Great value for a memorable company celebration!', 
       now() - interval '5 days');

    -- Conference venue reviews
    ELSIF venue_record.category = 'conference' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Dr. Patricia Adams - Medical Association', 5, 
       'Exceptional venue for our medical conference! The main auditorium had perfect acoustics and sightlines for our 300 attendees. The AV equipment was professional-grade with multiple screens and wireless microphones. The breakout rooms were ideal for smaller sessions and workshops. The catering service provided healthy, energizing meals that kept attendees focused. The venue''s tech support team was knowledgeable and available throughout the event. The registration area was spacious and well-organized. WiFi was fast and reliable - crucial for our digital presentations. The venue coordinator understood the unique needs of professional conferences. Parking was convenient and affordable. The venue''s reputation added credibility to our event. Highly recommend for any professional gathering!', 
       now() - interval '22 days'),
      (venue_record.id, 'Michael Foster - Education Summit', 4, 
       'Solid venue for our education conference! The classroom-style breakout rooms were perfect for interactive workshops. The main hall accommodated our 250 attendees comfortably. The catering was good, though vegetarian options were limited. The venue provided excellent technical support for our live streaming needs. The exhibition area was well-designed for vendor booths. The venue''s central location made it accessible for attendees from multiple states. Parking was adequate but could use better signage. The venue staff was professional and responsive to our needs. The only issue was that some rooms got warm during afternoon sessions. Overall, a reliable choice for professional conferences!', 
       now() - interval '14 days'),
      (venue_record.id, 'Sandra Liu - Tech Innovation Forum', 5, 
       'Outstanding venue for our technology conference! The modern facilities perfectly matched our innovative theme. The high-speed internet and power outlets at every seat were essential for our tech-savvy audience. The presentation equipment was cutting-edge with 4K displays and wireless presentation capabilities. The catering team accommodated our diverse dietary needs perfectly. The venue''s app-based check-in system impressed our attendees. The networking areas were designed to encourage collaboration and idea-sharing. The venue coordinator was tech-savvy and understood our unique requirements. The loading dock made equipment setup efficient. Excellent value for a high-tech professional event!', 
       now() - interval '7 days');

    -- Exhibition venue reviews
    ELSIF venue_record.category = 'exhibition' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Thomas Anderson - Art Gallery Collective', 5, 
       'Perfect venue for our art exhibition! The high ceilings and neutral walls provided an ideal backdrop for displaying artwork. The lighting system was professional-grade with adjustable spotlights for each piece. The open floor plan allowed for flexible booth arrangements. The loading dock made artwork delivery and setup very efficient. The venue provided security throughout the event, which was crucial for valuable pieces. The catering area was separate from the exhibition space, preventing any accidents. The venue''s reputation in the arts community helped attract serious collectors. Parking was convenient for attendees carrying purchases. The venue coordinator understood the unique needs of art exhibitions. Highly recommend for any cultural event!', 
       now() - interval '16 days'),
      (venue_record.id, 'Rachel Green - Trade Show Organizers', 4, 
       'Great space for our industry trade show! The exhibition hall was spacious with good traffic flow between booths. The electrical setup was comprehensive with power available throughout the space. The venue provided tables and basic booth equipment. The catering was professional and kept attendees energized throughout the day. The venue''s marketing support helped promote our event. The only challenge was that the air conditioning struggled with the large crowd, but the staff worked quickly to address it. The loading facilities made vendor setup smooth and efficient. The venue''s central location attracted attendees from across the region. Good value for a successful trade show!', 
       now() - interval '11 days'),
      (venue_record.id, 'Kevin Martinez - Craft Fair Association', 5, 
       'Wonderful venue for our annual craft fair! The space was perfect for our 50 vendor booths with room for shoppers to browse comfortably. The natural lighting was excellent for displaying handmade items. The venue provided tables and chairs for vendors at a reasonable cost. The kitchen facilities allowed food vendors to prepare fresh items on-site. The venue''s marketing support helped us reach new audiences. Parking was free and plentiful - important for shoppers carrying purchases. The venue staff was helpful with setup and breakdown. The family-friendly atmosphere was perfect for our community event. The venue''s reputation helped establish credibility with new vendors. Excellent choice for community events!', 
       now() - interval '3 days');

    -- Outdoor venue reviews
    ELSIF venue_record.category = 'outdoor' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Emma Thompson', 5, 
       'Absolutely stunning outdoor venue! The natural setting provided breathtaking photo opportunities throughout our wedding day. The covered pavilion was perfect for dining while still feeling connected to nature. The venue''s backup plan for weather was comprehensive and reassuring. The outdoor lighting created a magical atmosphere for our evening reception. The catering team was experienced with outdoor events and handled logistics flawlessly. The restroom facilities were clean and well-maintained. The venue provided generators for reliable power throughout the property. The parking area was well-maintained and easily accessible. The venue coordinator was knowledgeable about outdoor event challenges and solutions. Perfect for couples who want a natural, romantic setting!', 
       now() - interval '19 days'),
      (venue_record.id, 'Carlos Rivera', 4, 
       'Beautiful outdoor space for our family reunion! The picnic areas were perfect for our large group of 80 people. The playground kept the kids entertained while adults could relax. The BBQ facilities were well-maintained and easy to use. The venue provided picnic tables and trash disposal. The natural shade from mature trees was a blessing on a hot day. The only challenge was that the restrooms were a bit of a walk from the main area. The venue allowed us to bring our own decorations and music. The parking was adequate but could use better lighting for evening events. Great value for a casual, family-friendly gathering!', 
       now() - interval '13 days'),
      (venue_record.id, 'Nicole Davis', 5, 
       'Perfect venue for our corporate team-building retreat! The outdoor setting encouraged collaboration and creativity. The challenge course was professionally maintained and provided excellent team activities. The covered dining area protected us from unexpected weather. The venue''s catering partner specialized in outdoor events and provided delicious, practical meals. The restroom facilities were modern and clean. The venue provided all necessary equipment for outdoor activities. The natural setting helped our team disconnect from technology and focus on relationships. The venue coordinator was experienced with corporate groups and helped plan engaging activities. Highly recommend for any organization looking to strengthen team bonds!', 
       now() - interval '9 days');

    -- Historic venue reviews
    ELSIF venue_record.category = 'historic' THEN
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Victoria Sterling', 5, 
       'Absolutely enchanting historic venue! The original architecture and period details created an unforgettable atmosphere for our wedding. The venue''s history added so much character and conversation to our celebration. The restoration work was beautifully done while preserving authentic elements. The venue coordinator was knowledgeable about the building''s history and shared fascinating stories with our guests. The catering team was experienced with historic venues and worked within the building''s limitations seamlessly. The photo opportunities were endless - every corner had character and charm. The venue provided period-appropriate furniture and decorations. The acoustics in the main hall were surprisingly excellent. Parking was managed well despite the urban location. Perfect for couples who appreciate history and unique character!', 
       now() - interval '21 days'),
      (venue_record.id, 'Jonathan Hayes', 4, 
       'Wonderful historic venue with incredible character! The original hardwood floors and vintage fixtures created a unique atmosphere for our anniversary party. The venue''s charm impressed all our guests. The catering was excellent, though the historic kitchen required some coordination with our caterer. The venue provided historical information that made great conversation starters. The restoration preserved the building''s authenticity while adding modern conveniences. The only challenge was limited parking, but the venue provided information about nearby options. The venue coordinator was passionate about the building''s history and very helpful. The unique setting made our celebration truly memorable. Great choice for anyone who appreciates architectural history!', 
       now() - interval '17 days'),
      (venue_record.id, 'Margaret Wilson', 5, 
       'Stunning historic venue that exceeded our expectations! The venue''s story became part of our corporate event''s narrative. The original features like exposed brick and vintage chandeliers created an elegant atmosphere. The venue''s catering partner understood how to work within the historic building''s constraints. The venue provided historical displays that entertained guests during cocktail hour. The restoration work was meticulous and respectful of the building''s heritage. The venue coordinator was knowledgeable and helped us incorporate the building''s history into our program. The unique setting impressed our clients and made our event memorable. The venue''s reputation added prestige to our corporate gathering. Highly recommend for any event where atmosphere and character matter!', 
       now() - interval '4 days');

    -- Modern venue reviews
    ELSE -- modern category
      INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
      (venue_record.id, 'Alexander Kim', 5, 
       'Incredible modern venue with cutting-edge facilities! The sleek design and contemporary architecture perfectly matched our tech company''s brand. The integrated AV systems were state-of-the-art with wireless presentation capabilities throughout. The LED lighting system could be customized for different moods and branding. The venue''s smart building features impressed our tech-savvy guests. The catering kitchen was equipped with modern appliances that allowed for creative menu options. The venue''s sustainability features aligned with our company values. The flexible space design allowed us to reconfigure areas throughout the event. The venue coordinator was tech-savvy and understood our digital needs. The high-speed internet and abundant power outlets were essential for our interactive presentations. Perfect for any organization that values innovation and modern design!', 
       now() - interval '23 days'),
      (venue_record.id, 'Sophia Martinez', 4, 
       'Stylish modern venue with great amenities! The contemporary design created a sophisticated atmosphere for our product launch. The venue''s Instagram-worthy spaces provided excellent marketing opportunities. The built-in sound system was high-quality and easy to use. The catering was creative and beautifully presented. The venue''s location in the arts district attracted our target demographic. The only minor issue was that the minimalist design required us to bring more decorations than expected. The venue staff was professional and understood the needs of modern events. The parking garage was convenient and secure. The venue''s reputation helped establish credibility with our industry contacts. Great choice for contemporary, style-conscious events!', 
       now() - interval '12 days'),
      (venue_record.id, 'Daniel Chen', 5, 
       'Outstanding modern venue that impressed everyone! The architectural design was stunning and provided unique photo opportunities. The venue''s technology integration made our event planning seamless. The climate control system kept everyone comfortable throughout our summer event. The catering team was innovative and created dishes that matched the venue''s modern aesthetic. The venue''s app-based services impressed our guests and streamlined check-in. The flexible lighting system allowed us to create different atmospheres throughout the evening. The venue coordinator was professional and detail-oriented. The modern restroom facilities were clean and well-designed. The venue''s commitment to sustainability impressed our environmentally conscious guests. Highly recommend for any event where modern design and technology matter!', 
       now() - interval '6 days');
    END IF;
  END LOOP;
END $$;