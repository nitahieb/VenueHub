/*
  # Add Venue Reviews

  1. New Data
    - Adds realistic, specific reviews for each Washington venue
    - Reviews mention specific details about facilities, service, and experience
    - Varied ratings (4-5 stars) with constructive feedback
    - Different reviewer names and dates

  2. Review Content
    - Specific mentions of venue features and amenities
    - Helpful details about capacity, layout, and logistics
    - Service quality and staff responsiveness
    - Value for money considerations
    - Practical tips for future event planners
*/

-- Clear existing reviews
DELETE FROM reviews;

-- The Fairmont Olympic Hotel - Seattle
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'The Fairmont Olympic Hotel'), 'Sarah Mitchell', 5, 'Absolutely stunning venue for our corporate gala. The Georgian Ballroom''s crystal chandeliers and marble columns created an elegant atmosphere. Staff was incredibly professional and the catering exceeded expectations. The central downtown location made it convenient for all our out-of-town guests. Worth every penny for a high-end event.', '2024-01-15 10:30:00'),
((SELECT id FROM venues WHERE name = 'The Fairmont Olympic Hotel'), 'Michael Chen', 5, 'Hosted our company''s 50th anniversary here and it was flawless. The event coordination team was exceptional - they handled every detail perfectly. The acoustics in the ballroom are excellent for speeches. Parking can be expensive but valet service is top-notch. The historic charm combined with modern amenities makes this venue special.', '2024-02-08 14:20:00'),
((SELECT id FROM venues WHERE name = 'The Fairmont Olympic Hotel'), 'Jennifer Rodriguez', 4, 'Beautiful venue with impeccable service. The only minor issue was the limited loading dock access for our large exhibit setup, but the staff worked with us to find solutions. The catering options are extensive and delicious. Perfect for upscale corporate events where you want to impress clients.', '2024-03-12 09:45:00');

-- Chateau Ste. Michelle Winery
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Chateau Ste. Michelle Winery'), 'Amanda Thompson', 5, 'Our wedding here was absolutely magical! The vineyard setting is breathtaking, especially during golden hour. The tasting room reception was perfect for our 120 guests. The wine pairings were exceptional and the staff''s knowledge of their wines enhanced the entire experience. The outdoor ceremony space has stunning views of the Cascade Mountains.', '2024-04-20 16:15:00'),
((SELECT id FROM venues WHERE name = 'Chateau Ste. Michelle Winery'), 'David Park', 5, 'Incredible venue for our wine-themed corporate retreat. The private tasting experience was a huge hit with our team. The grounds are well-maintained and provide great photo opportunities. The event coordinator was knowledgeable about both the venue and wine selections. Weather backup plans are solid with their indoor spaces.', '2024-05-18 11:30:00'),
((SELECT id FROM venues WHERE name = 'Chateau Ste. Michelle Winery'), 'Lisa Wang', 4, 'Beautiful winery with excellent facilities. The catering partnerships they work with are top-quality. Only challenge was coordinating transportation for guests since it''s a bit outside the city. The sunset views over the vineyards are absolutely worth it. Perfect for couples who love wine and want a romantic outdoor setting.', '2024-06-25 13:45:00');

-- Washington State Convention Center
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Washington State Convention Center'), 'Robert Johnson', 5, 'Excellent facility for large-scale conferences. The exhibition halls are spacious with high ceilings and excellent lighting. Loading dock access is convenient for large setups. The built-in A/V capabilities saved us thousands in rental costs. Staff is experienced with large events and very professional. Downtown location is perfect for attendees.', '2024-01-28 08:20:00'),
((SELECT id FROM venues WHERE name = 'Washington State Convention Center'), 'Maria Gonzalez', 4, 'Great venue for our 800-person conference. The breakout rooms are well-equipped and the main hall acoustics are good. Catering options are somewhat limited but quality is decent. Parking can be challenging during peak times. The venue''s experience with large events really shows in their smooth operations.', '2024-03-05 15:10:00'),
((SELECT id FROM venues WHERE name = 'Washington State Convention Center'), 'James Wilson', 5, 'Perfect for our trade show. The flexible floor plans allowed us to create exactly the layout we needed. The registration areas are well-designed for crowd flow. Wi-Fi is reliable throughout the facility. The venue''s sustainability initiatives align well with our company values. Highly recommend for large corporate events.', '2024-04-12 12:00:00');

-- Snoqualmie Falls Lodge
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Snoqualmie Falls Lodge'), 'Emily Davis', 5, 'Our wedding at Snoqualmie Falls was like a fairy tale! The sound of the waterfall created the most romantic atmosphere. The lodge''s rustic elegance is perfect for couples wanting something unique. The bridal suite has stunning views and the outdoor ceremony site is breathtaking. Staff went above and beyond to make our day perfect.', '2024-05-30 17:30:00'),
((SELECT id FROM venues WHERE name = 'Snoqualmie Falls Lodge'), 'Kevin Brown', 5, 'Hosted our company retreat here and everyone was amazed by the natural beauty. The meeting rooms have great natural light and the outdoor team-building spaces are fantastic. The restaurant on-site is excellent for group dining. The location offers a perfect escape from the city while still being accessible.', '2024-07-08 10:15:00'),
((SELECT id FROM venues WHERE name = 'Snoqualmie Falls Lodge'), 'Rachel Green', 4, 'Absolutely beautiful venue with incredible views. The historic lodge has so much character. Only minor issue was limited parking during peak season, but they have shuttle service available. The catering is outstanding and they accommodate dietary restrictions well. Perfect for couples who love nature and want stunning photos.', '2024-08-14 14:45:00');

-- Museum of Flight
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Museum of Flight'), 'Steven Miller', 5, 'What an incredible venue for our aviation company''s anniversary celebration! Having cocktails surrounded by historic aircraft was unforgettable. The Great Gallery provides a unique backdrop that our guests are still talking about. The museum staff was knowledgeable and helped incorporate aviation themes into our event perfectly.', '2024-02-22 19:20:00'),
((SELECT id FROM venues WHERE name = 'Museum of Flight'), 'Nicole Taylor', 4, 'Unique and memorable venue for our corporate dinner. The aircraft displays create amazing conversation starters. Acoustics can be challenging in the large spaces, so good sound system is essential. The catering partners they work with understand the venue well. Great for companies wanting something different from typical hotel ballrooms.', '2024-04-18 16:00:00'),
((SELECT id FROM venues WHERE name = 'Museum of Flight'), 'Christopher Lee', 5, 'Perfect venue for our aerospace industry conference. The educational aspect added value for our attendees. The Red Barn is great for smaller breakout sessions. Parking is ample and free, which is rare in Seattle. The venue''s unique character made our event stand out. Highly recommend for industry-related events.', '2024-06-10 11:45:00');

-- Willows Lodge
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Willows Lodge'), 'Jessica Anderson', 5, 'Our wedding at Willows Lodge was absolutely perfect! The riverside ceremony site is magical and the reception space has beautiful natural light. The spa services for the bridal party were amazing. The culinary team created a menu that perfectly reflected our Pacific Northwest theme. Every detail was handled with care and professionalism.', '2024-03-25 18:10:00'),
((SELECT id FROM venues WHERE name = 'Willows Lodge'), 'Daniel White', 5, 'Exceptional venue for our executive retreat. The lodge atmosphere promotes relaxation while still being professional. The meeting spaces are well-equipped and the outdoor areas are perfect for team activities. The restaurant is outstanding - some of the best Pacific Northwest cuisine we''ve experienced. Great for combining business with pleasure.', '2024-05-12 13:30:00'),
((SELECT id FROM venues WHERE name = 'Willows Lodge'), 'Michelle Clark', 4, 'Beautiful lodge with excellent service. The natural setting along the Sammamish River is peaceful and scenic. Room accommodations for out-of-town guests are luxurious. The only minor issue was coordinating multiple vendor deliveries, but the staff handled it well. Perfect for intimate weddings or corporate retreats.', '2024-07-20 15:50:00');

-- Sodo Park
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Sodo Park'), 'Brandon Martinez', 5, 'Incredible industrial venue with so much character! The exposed brick and high ceilings create a perfect urban atmosphere. The space is completely customizable which allowed us to create exactly the vibe we wanted for our product launch. Loading access is excellent for large setups. The venue coordinator was creative and helpful throughout the planning process.', '2024-01-10 20:15:00'),
((SELECT id FROM venues WHERE name = 'Sodo Park'), 'Stephanie Harris', 4, 'Great venue for our company holiday party. The industrial aesthetic is unique and photographs beautifully. The space can accommodate both cocktail and seated dinner formats well. Parking is convenient and free. The venue provides good vendor recommendations. Perfect for companies wanting a trendy, urban vibe.', '2024-02-28 12:40:00'),
((SELECT id FROM venues WHERE name = 'Sodo Park'), 'Ryan Thompson', 5, 'Perfect venue for our art gallery opening. The raw space allows the artwork to really shine. The lighting can be customized for different needs. The venue''s flexibility is its greatest strength - you can transform it into anything. Great for creative events where you want a blank canvas to work with.', '2024-04-05 16:25:00');

-- Woodland Park Zoo
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Woodland Park Zoo'), 'Laura Johnson', 5, 'What a unique and fun venue for our family reunion! The kids loved being able to see the animals during the event. The Zoomazium is perfect for events with children - it''s educational and entertaining. The catering options include kid-friendly choices. The staff is experienced with family events and very accommodating.', '2024-06-15 14:20:00'),
((SELECT id FROM venues WHERE name = 'Woodland Park Zoo'), 'Mark Davis', 4, 'Great venue for our company''s family day. The educational component added value for employees with children. The outdoor spaces are beautiful and well-maintained. Weather contingency planning is important since many areas are outdoor. The unique setting made our event memorable and different from typical corporate gatherings.', '2024-07-30 10:30:00'),
((SELECT id FROM venues WHERE name = 'Woodland Park Zoo'), 'Karen Wilson', 5, 'Perfect for our conservation organization''s fundraising gala. The mission alignment was perfect and guests loved the behind-the-scenes animal encounters. The venue''s commitment to education and conservation resonated with our donors. The Rose Garden is beautiful for cocktail receptions. Highly recommend for mission-driven organizations.', '2024-08-22 17:45:00');

-- Bell Harbor International Conference Center
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Bell Harbor International Conference Center'), 'Patricia Brown', 5, 'Excellent conference facility with stunning waterfront views. The meeting rooms are well-equipped with modern A/V technology. The pier location is unique and memorable for attendees. Catering quality is high and they handle dietary restrictions well. The venue''s experience with international conferences shows in their attention to detail.', '2024-03-18 09:15:00'),
((SELECT id FROM venues WHERE name = 'Bell Harbor International Conference Center'), 'Thomas Garcia', 4, 'Great venue for our medical conference. The breakout rooms are appropriately sized and the main auditorium has excellent sightlines. The waterfront location provides a nice break for attendees. Parking can be limited during peak times. The venue staff is professional and experienced with large conferences.', '2024-05-25 11:50:00'),
((SELECT id FROM venues WHERE name = 'Bell Harbor International Conference Center'), 'Sandra Rodriguez', 5, 'Perfect venue for our international business summit. The harbor views create a impressive backdrop for networking events. The facility is modern and well-maintained. The location is convenient for out-of-town attendees staying downtown. The venue''s reputation in the conference industry is well-deserved.', '2024-09-08 13:25:00');

-- Chihuly Garden and Glass
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Chihuly Garden and Glass'), 'Catherine Lee', 5, 'Absolutely breathtaking venue for our art foundation gala! The glass sculptures create the most incredible atmosphere - our guests were in awe. The garden setting is magical, especially in the evening with the lighting. The venue perfectly reflects Seattle''s artistic culture. This is a once-in-a-lifetime venue that guests will never forget.', '2024-04-28 19:30:00'),
((SELECT id FROM venues WHERE name = 'Chihuly Garden and Glass'), 'Jonathan Miller', 5, 'Incredible venue for our design company''s anniversary celebration. The artistic environment inspired amazing conversations among our creative team. The glass house provides a unique indoor-outdoor feel. The venue coordination team understands how to work around the delicate art installations. Perfect for events where you want to inspire and amaze guests.', '2024-06-12 16:40:00'),
((SELECT id FROM venues WHERE name = 'Chihuly Garden and Glass'), 'Elizabeth Taylor', 4, 'Stunning and unique venue that photographs beautifully. The art installations provide incredible backdrops for photos. Space limitations require careful planning for larger groups. The venue''s exclusivity and beauty make it worth the premium price. Perfect for intimate, high-end events where ambiance is paramount.', '2024-08-05 15:15:00');

-- The Edgewater Hotel
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'The Edgewater Hotel'), 'Andrew Wilson', 5, 'Our waterfront wedding was absolutely perfect! The ceremony on the pier with Elliott Bay as the backdrop was breathtaking. The hotel''s rustic elegance fits Seattle perfectly. The bridal suite has amazing water views and the reception space flows beautifully. The staff''s attention to detail made our day stress-free and magical.', '2024-05-20 18:45:00'),
((SELECT id FROM venues WHERE name = 'The Edgewater Hotel'), 'Michelle Anderson', 4, 'Beautiful venue with incredible water views. The lodge-style decor creates a cozy yet elegant atmosphere. The location on the pier is unique and memorable. Limited parking requires coordination with the hotel. The catering is excellent and they''re flexible with menu customization. Great for couples wanting a quintessentially Seattle wedding.', '2024-07-15 14:30:00'),
((SELECT id FROM venues WHERE name = 'The Edgewater Hotel'), 'Robert Clark', 5, 'Perfect venue for our corporate retreat. The waterfront location provides a relaxing atmosphere that encouraged team bonding. The meeting spaces have natural light and water views. The hotel''s history and character add to the experience. Excellent for companies wanting to combine business with the beauty of the Pacific Northwest.', '2024-09-12 10:20:00');

-- Salish Lodge & Spa
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Salish Lodge & Spa'), 'Jennifer Martinez', 5, 'Our wedding at Salish Lodge was like something out of a dream! The waterfall views are absolutely stunning and the lodge''s cozy elegance is perfect for an intimate celebration. The spa services for the bridal party were incredible. The culinary team created an amazing Pacific Northwest menu. Every moment was perfect.', '2024-06-08 17:20:00'),
((SELECT id FROM venues WHERE name = 'Salish Lodge & Spa'), 'David Thompson', 5, 'Exceptional venue for our executive retreat. The natural setting promotes relaxation and creativity. The meeting spaces are intimate and conducive to productive discussions. The spa services were a great addition to our program. The famous Sunday brunch was a highlight for our team. Perfect for high-level corporate gatherings.', '2024-08-18 12:15:00'),
((SELECT id FROM venues WHERE name = 'Salish Lodge & Spa'), 'Sarah Garcia', 4, 'Absolutely beautiful venue with incredible natural surroundings. The lodge has a romantic, intimate feel that''s perfect for smaller weddings. The waterfall provides a stunning backdrop for photos. Accommodations for guests are luxurious. The only consideration is the remote location, but that''s also part of its charm.', '2024-09-25 16:00:00');

-- Seattle Art Museum
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Seattle Art Museum'), 'Michael Rodriguez', 5, 'Incredible venue for our cultural foundation''s fundraising gala. The art collections provide an inspiring backdrop that perfectly aligned with our mission. The Great Hall is elegant and spacious. The venue''s downtown location is convenient for guests. The staff understands how to work around the artwork and create memorable experiences.', '2024-03-15 19:45:00'),
((SELECT id FROM venues WHERE name = 'Seattle Art Museum'), 'Lisa Johnson', 4, 'Beautiful and sophisticated venue for our corporate art auction. The museum setting added credibility and elegance to our event. The galleries provide unique spaces for different activities. Logistics require careful planning around the permanent collections. Perfect for events where culture and sophistication are important.', '2024-05-22 15:30:00'),
((SELECT id FROM venues WHERE name = 'Seattle Art Museum'), 'Christopher Davis', 5, 'Perfect venue for our design industry awards ceremony. The artistic environment inspired our creative community. The venue''s reputation and prestige added value to our event. The staff is experienced with high-end events and very professional. Great for organizations wanting to associate with Seattle''s cultural scene.', '2024-07-10 18:10:00');

-- The Arctic Club Seattle
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'The Arctic Club Seattle'), 'Amanda White', 5, 'Our wedding at The Arctic Club was absolutely magical! The historic ballroom with its ornate details and crystal chandeliers created the perfect elegant atmosphere. The venue''s history adds so much character. The staff was incredibly professional and the catering was exceptional. Perfect for couples wanting old-world glamour in the heart of Seattle.', '2024-04-12 16:50:00'),
((SELECT id FROM venues WHERE name = 'The Arctic Club Seattle'), 'James Brown', 4, 'Stunning historic venue with incredible architectural details. The ballroom is elegant and photographs beautifully. The downtown location is convenient for guests. Some of the spaces are more intimate, which works well for smaller gatherings. The venue''s character and history make events feel special and memorable.', '2024-06-28 13:40:00'),
((SELECT id FROM venues WHERE name = 'The Arctic Club Seattle'), 'Rebecca Miller', 5, 'Exceptional venue for our company''s centennial celebration. The historic setting perfectly matched our company''s long history. The attention to detail in the restoration is remarkable. The venue staff understands the building''s character and helps create events that honor its heritage. Perfect for milestone celebrations.', '2024-08-30 11:25:00');

-- Fremont Abbey Arts Center
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Fremont Abbey Arts Center'), 'Daniel Anderson', 5, 'What an incredible and unique venue! The converted church provides such a dramatic and artistic atmosphere. The soaring ceilings and stained glass windows are breathtaking. Perfect for our art gallery opening - the space itself is a work of art. The venue supports the local arts community, which aligns with our values.', '2024-02-18 20:30:00'),
((SELECT id FROM venues WHERE name = 'Fremont Abbey Arts Center'), 'Maria Wilson', 4, 'Beautiful and atmospheric venue with incredible character. The historic architecture creates a memorable setting. The acoustics are excellent for performances and speeches. Parking in Fremont can be challenging during events. The venue''s commitment to the arts community makes it special. Great for creative and cultural events.', '2024-05-05 17:15:00'),
((SELECT id FROM venues WHERE name = 'Fremont Abbey Arts Center'), 'Kevin Taylor', 5, 'Perfect venue for our music festival fundraiser. The church setting provides amazing acoustics and atmosphere. The venue''s history and character add depth to events. The staff is passionate about the arts and very supportive. Great for organizations and events that want to support Seattle''s creative community.', '2024-07-22 14:45:00');

-- Georgetown Ballroom
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Georgetown Ballroom'), 'Stephanie Clark', 5, 'Our wedding at Georgetown Ballroom was absolutely perfect! The vintage charm and elegant details create such a romantic atmosphere. The ballroom''s size is ideal for medium-sized weddings. The staff was incredibly helpful and the catering partners they work with are excellent. The historic neighborhood adds character to the whole experience.', '2024-03-30 18:20:00'),
((SELECT id FROM venues WHERE name = 'Georgetown Ballroom'), 'Ryan Garcia', 4, 'Beautiful historic venue with great character. The ballroom has lovely architectural details and good acoustics. The neighborhood is up-and-coming with interesting restaurants nearby. Parking is generally available on the street. Perfect for couples wanting vintage elegance without the downtown price tag.', '2024-06-18 15:55:00'),
((SELECT id FROM venues WHERE name = 'Georgetown Ballroom'), 'Nicole Martinez', 5, 'Incredible venue for our company''s vintage-themed holiday party. The 1920s atmosphere was perfect for our theme. The ballroom is elegant and spacious. The venue''s flexibility allowed us to create exactly the ambiance we wanted. Great value for the quality and character you get. Highly recommend for themed events.', '2024-09-15 12:30:00');

-- Volunteer Park Conservatory
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Volunteer Park Conservatory'), 'Laura Thompson', 5, 'Our wedding at the Conservatory was like being in a tropical paradise! The lush plants and glass architecture create the most romantic setting. The natural light is incredible for photos. The intimate size is perfect for smaller weddings. The venue''s uniqueness made our day truly special and memorable.', '2024-05-15 16:35:00'),
((SELECT id FROM venues WHERE name = 'Volunteer Park Conservatory'), 'Matthew Davis', 4, 'Unique and beautiful venue with incredible natural beauty. The tropical plants create an exotic atmosphere right in Seattle. The glass structure provides great natural light. Space is limited so it works best for intimate gatherings. Perfect for couples who love nature and want something completely different.', '2024-07-08 14:10:00'),
((SELECT id FROM venues WHERE name = 'Volunteer Park Conservatory'), 'Jennifer Wilson', 5, 'Perfect venue for our botanical society''s annual gala. The plant collections provided an educational and beautiful backdrop. The conservatory''s mission aligns well with our organization''s values. The intimate setting encouraged great conversations among members. Ideal for organizations focused on nature and conservation.', '2024-08-12 19:25:00');

-- The Ruins at Fort Worden
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'The Ruins at Fort Worden'), 'Charles Rodriguez', 5, 'Absolutely incredible venue for our destination wedding! The historic fort ruins create such a dramatic and unique backdrop. The views of the Strait of Juan de Fuca are breathtaking. The venue''s history adds depth and meaning to the celebration. Perfect for couples wanting something truly unique and memorable.', '2024-06-25 17:40:00'),
((SELECT id FROM venues WHERE name = 'The Ruins at Fort Worden'), 'Susan Miller', 4, 'Stunning and unique venue with incredible views and history. The fort setting is unlike anything else available. The outdoor ceremony site is breathtaking. Weather contingency planning is essential. The venue''s remote location requires good coordination but adds to the special feeling. Great for adventurous couples.', '2024-08-20 13:15:00'),
((SELECT id FROM venues WHERE name = 'The Ruins at Fort Worden'), 'Paul Anderson', 5, 'Perfect venue for our military reunion. The fort''s history resonated deeply with our group. The dramatic setting and views created a memorable experience. The venue staff understands the historical significance and helps create meaningful events. Ideal for groups with military connections or those wanting a truly unique setting.', '2024-09-18 11:50:00');

-- Deception Pass Lodge
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Deception Pass Lodge'), 'Rachel Johnson', 5, 'Our wedding at Deception Pass Lodge was absolutely magical! The waterfront location with views of the pass is breathtaking. The lodge''s rustic elegance perfectly captures the Pacific Northwest spirit. The outdoor ceremony site is stunning and the reception space has great natural light. Perfect for nature-loving couples.', '2024-07-12 18:15:00'),
((SELECT id FROM venues WHERE name = 'Deception Pass Lodge'), 'Gregory White', 4, 'Beautiful venue with incredible natural surroundings. The lodge atmosphere is cozy and welcoming. The views of Deception Pass are spectacular. The location requires some travel but it''s worth it for the scenery. Great for couples wanting a destination feel without going too far from Seattle.', '2024-08-28 15:45:00'),
((SELECT id FROM venues WHERE name = 'Deception Pass Lodge'), 'Monica Brown', 5, 'Perfect venue for our corporate retreat focused on team building. The natural setting encouraged relaxation and bonding. The lodge provides a great escape from city life. The meeting spaces have beautiful views that kept our team engaged. Excellent for companies wanting to combine business with the beauty of nature.', '2024-09-22 10:40:00');

-- Alderbrook Resort & Spa
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Alderbrook Resort & Spa'), 'Victoria Garcia', 5, 'Our wedding at Alderbrook was absolutely perfect! The waterfront location on Hood Canal is stunning and the resort''s elegance is unmatched. The spa services for the bridal party were incredible. The culinary team created an amazing menu featuring local seafood. Every detail was handled with perfection.', '2024-06-30 17:55:00'),
((SELECT id FROM venues WHERE name = 'Alderbrook Resort & Spa'), 'Benjamin Taylor', 5, 'Exceptional venue for our executive retreat. The resort setting promotes relaxation while maintaining professionalism. The meeting spaces have water views and the spa services were a great addition to our program. The golf course provided excellent team-building opportunities. Perfect for high-level corporate gatherings.', '2024-08-15 12:20:00'),
((SELECT id FROM venues WHERE name = 'Alderbrook Resort & Spa'), 'Samantha Clark', 4, 'Beautiful resort with incredible water views and luxurious amenities. The wedding coordination team was professional and detail-oriented. The location is somewhat remote but that adds to the exclusive feel. The accommodations for guests are excellent. Perfect for couples wanting a luxury destination wedding experience.', '2024-09-10 16:30:00');

-- Kalaloch Lodge
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Kalaloch Lodge'), 'Timothy Martinez', 5, 'Our wedding at Kalaloch Lodge was like something out of a dream! The oceanfront location is absolutely breathtaking and the lodge''s rustic charm is perfect for a Pacific Northwest celebration. The sound of the waves created the most romantic atmosphere. Perfect for couples who love the ocean and want a truly unique venue.', '2024-07-25 19:10:00'),
((SELECT id FROM venues WHERE name = 'Kalaloch Lodge'), 'Angela Wilson', 4, 'Incredible venue with stunning ocean views and natural beauty. The lodge has a cozy, intimate feel that''s perfect for smaller gatherings. The location in Olympic National Park adds to the special feeling. Weather planning is important for outdoor elements. Great for nature-loving couples wanting something truly special.', '2024-08-18 14:25:00'),
((SELECT id FROM venues WHERE name = 'Kalaloch Lodge'), 'Christopher Thompson', 5, 'Perfect venue for our environmental organization''s annual retreat. The ocean setting and national park location perfectly aligned with our mission. The lodge''s commitment to sustainability impressed our members. The natural beauty inspired great discussions about conservation. Ideal for organizations focused on environmental issues.', '2024-09-05 11:15:00');

-- Skamania Lodge
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Skamania Lodge'), 'Melissa Davis', 5, 'Our wedding at Skamania Lodge was absolutely incredible! The Columbia River Gorge views are breathtaking and the lodge''s rustic elegance is perfect. The outdoor ceremony site with the gorge backdrop was stunning. The staff went above and beyond to make our day perfect. The adventure activities were a hit with our guests.', '2024-06-20 18:30:00'),
((SELECT id FROM venues WHERE name = 'Skamania Lodge'), 'Jonathan Rodriguez', 5, 'Exceptional venue for our corporate adventure retreat. The lodge setting encourages team bonding and the outdoor activities were perfect for team building. The meeting spaces have incredible views that kept everyone engaged. The spa services were a great way to unwind after activities. Perfect for active corporate groups.', '2024-08-08 13:45:00'),
((SELECT id FROM venues WHERE name = 'Skamania Lodge'), 'Katherine Miller', 4, 'Beautiful lodge with stunning gorge views and excellent facilities. The adventure theme is unique and fun for active couples. The location requires some travel but the scenery is worth it. The wedding coordination team was professional and experienced. Great for couples wanting an adventure-themed celebration.', '2024-09-12 15:20:00');

-- Sun Mountain Lodge
INSERT INTO reviews (venue_id, user_name, rating, comment, created_at) VALUES
((SELECT id FROM venues WHERE name = 'Sun Mountain Lodge'), 'Alexander Brown', 5, 'Our wedding at Sun Mountain Lodge was absolutely magical! The mountain views are incredible and the lodge''s rustic luxury is perfect. The outdoor ceremony site with the Cascade Mountains backdrop was breathtaking. The staff was incredibly professional and the catering featured excellent local ingredients. Perfect for mountain-loving couples.', '2024-07-18 17:45:00'),
((SELECT id FROM venues WHERE name = 'Sun Mountain Lodge'), 'Natalie Anderson', 4, 'Stunning venue with incredible mountain views and excellent facilities. The lodge has a cozy, intimate feel that''s perfect for destination weddings. The location in the Methow Valley is beautiful but requires travel planning for guests. The outdoor activities are a great addition for adventure-loving couples.', '2024-08-25 14:35:00'),
((SELECT id FROM venues WHERE name = 'Sun Mountain Lodge'), 'William Garcia', 5, 'Perfect venue for our outdoor industry conference. The mountain setting inspired our discussions about adventure and conservation. The lodge''s commitment to outdoor recreation aligned perfectly with our industry. The meeting spaces have incredible views and the outdoor team-building opportunities were excellent.', '2024-09-15 12:10:00');

-- Update venue ratings and review counts based on the reviews added
UPDATE venues SET 
  rating = (
    SELECT ROUND(AVG(rating::numeric), 2)
    FROM reviews 
    WHERE reviews.venue_id = venues.id
  ),
  reviews_count = (
    SELECT COUNT(*)
    FROM reviews 
    WHERE reviews.venue_id = venues.id
  )
WHERE id IN (
  SELECT DISTINCT venue_id FROM reviews
);