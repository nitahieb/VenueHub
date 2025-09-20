/*
  # Add Real Washington State Venues

  1. Clear existing venues
  2. Insert 25 real venues across Washington State
     - Seattle area venues (hotels, event spaces, unique locations)
     - Eastside venues (Bellevue, Redmond, Woodinville)
     - Tacoma venues (hotels, historic venues)
     - Other WA cities (Spokane, Olympia, etc.)
  3. Mix of categories and price points
  4. Real addresses that can be geocoded
*/

-- Clear existing venues
DELETE FROM venues;

-- Insert real Washington State venues
INSERT INTO venues (
  name, description, address, city, state, zip_code,
  seated_capacity, standing_capacity, hourly_price, daily_price,
  category, amenities, images, rating, reviews_count,
  availability, featured, status
) VALUES
-- Seattle Venues
(
  'The Fairmont Olympic Hotel',
  'Historic luxury hotel in downtown Seattle offering elegant ballrooms and meeting spaces with classic Pacific Northwest charm.',
  '411 University Street',
  'Seattle', 'WA', '98101',
  300, 400, 75000, 500000,
  'wedding',
  ARRAY['Full catering kitchen', 'Audio/visual equipment', 'Valet parking', 'Bridal suite', 'Historic architecture', 'City views'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.8, 127,
  true, true, 'approved'
),
(
  'Sodo Park',
  'Industrial-chic event space in Seattle''s SODO district featuring exposed brick, high ceilings, and modern amenities.',
  '1200 1st Avenue South',
  'Seattle', 'WA', '98134',
  200, 300, 45000, 300000,
  'modern',
  ARRAY['Full catering kitchen', 'Audio/visual equipment', 'Parking', 'Industrial design', 'Flexible layout', 'Loading dock'],
  ARRAY['https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg', 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg'],
  4.6, 89,
  true, true, 'approved'
),
(
  'Washington State Convention Center',
  'Premier convention facility in downtown Seattle with state-of-the-art technology and flexible meeting spaces.',
  '705 Pike Street',
  'Seattle', 'WA', '98101',
  2000, 3000, 125000, 800000,
  'conference',
  ARRAY['Audio/visual equipment', 'Video conferencing', 'Breakout rooms', 'Full catering kitchen', 'Parking', 'High-speed WiFi'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.7, 156,
  true, false, 'approved'
),
(
  'The Showbox',
  'Iconic music venue and event space in the heart of Seattle, perfect for concerts and private parties.',
  '1426 1st Avenue',
  'Seattle', 'WA', '98101',
  800, 1200, 35000, 250000,
  'party',
  ARRAY['Sound system', 'Stage', 'Bar service', 'Security', 'Coat check', 'Street parking'],
  ARRAY['https://images.pexels.com/photos/2310904/pexels-photo-2310904.jpeg', 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg'],
  4.5, 203,
  true, false, 'approved'
),
(
  'Chihuly Garden and Glass',
  'Unique venue featuring stunning glass art installations, perfect for sophisticated events and receptions.',
  '305 Harrison Street',
  'Seattle', 'WA', '98109',
  150, 200, 55000, 400000,
  'exhibition',
  ARRAY['Gallery space', 'Audio/visual equipment', 'Catering', 'Parking', 'Climate control', 'Security'],
  ARRAY['https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg', 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg'],
  4.9, 78,
  true, true, 'approved'
),
(
  'Woodland Park Zoo',
  'Unique outdoor venue offering animal encounters and beautiful garden settings for memorable events.',
  '5500 Phinney Avenue North',
  'Seattle', 'WA', '98103',
  300, 500, 40000, 280000,
  'outdoor',
  ARRAY['Garden setting', 'Animal encounters', 'Outdoor lighting', 'Catering', 'Parking', 'Educational programs'],
  ARRAY['https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.4, 92,
  true, false, 'approved'
),
(
  'The Arctic Club Seattle',
  'Historic 1916 hotel featuring elegant event spaces with original architectural details and modern amenities.',
  '700 3rd Avenue',
  'Seattle', 'WA', '98104',
  120, 180, 50000, 350000,
  'historic',
  ARRAY['Historic architecture', 'Full bar', 'Audio/visual equipment', 'Valet parking', 'City views', 'Climate control'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.6, 67,
  true, false, 'approved'
),
(
  'Bell Harbor International Conference Center',
  'Waterfront conference center with stunning Elliott Bay views and state-of-the-art meeting facilities.',
  '2211 Alaskan Way',
  'Seattle', 'WA', '98121',
  800, 1000, 85000, 600000,
  'corporate',
  ARRAY['Audio/visual equipment', 'Video conferencing', 'Breakout rooms', 'Waterfront views', 'Full catering kitchen', 'Parking'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.7, 134,
  true, true, 'approved'
),
(
  'The Georgetown Ballroom',
  'Restored 1920s ballroom in Seattle''s Georgetown neighborhood with original hardwood floors and vintage charm.',
  '5858 4th Avenue South',
  'Seattle', 'WA', '98108',
  250, 350, 38000, 270000,
  'wedding',
  ARRAY['Dance floor', 'Historic architecture', 'Full bar', 'Sound system', 'Parking', 'Bridal suite'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.5, 88,
  true, false, 'approved'
),
(
  'Seattle Art Museum',
  'Contemporary art museum offering unique gallery spaces for sophisticated corporate and private events.',
  '1300 1st Avenue',
  'Seattle', 'WA', '98101',
  200, 300, 60000, 450000,
  'exhibition',
  ARRAY['Gallery space', 'Audio/visual equipment', 'Security', 'Climate control', 'Catering', 'City views'],
  ARRAY['https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg', 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg'],
  4.8, 45,
  true, false, 'approved'
),
(
  'The Edgewater Hotel',
  'Waterfront hotel on Elliott Bay offering intimate event spaces with stunning water and mountain views.',
  '2411 Alaskan Way',
  'Seattle', 'WA', '98121',
  100, 150, 65000, 480000,
  'wedding',
  ARRAY['Waterfront views', 'Full bar', 'Audio/visual equipment', 'Valet parking', 'Bridal suite', 'Outdoor terrace'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.7, 112,
  true, true, 'approved'
),
(
  'MOHAI - Museum of History & Industry',
  'Modern museum venue in South Lake Union with flexible event spaces and interactive exhibits.',
  '860 Terry Avenue North',
  'Seattle', 'WA', '98109',
  300, 400, 45000, 320000,
  'corporate',
  ARRAY['Gallery space', 'Audio/visual equipment', 'Interactive exhibits', 'Parking', 'Catering', 'Lake views'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.6, 73,
  true, false, 'approved'
),

-- Eastside Venues
(
  'Hyatt Regency Bellevue',
  'Luxury hotel in downtown Bellevue offering elegant ballrooms and meeting spaces with mountain and lake views.',
  '900 Bellevue Way Northeast',
  'Bellevue', 'WA', '98004',
  400, 500, 80000, 550000,
  'wedding',
  ARRAY['Full catering kitchen', 'Audio/visual equipment', 'Valet parking', 'Bridal suite', 'Mountain views', 'Full bar'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.8, 189,
  true, true, 'approved'
),
(
  'Meydenbauer Center',
  'Modern conference center in Bellevue with state-of-the-art technology and flexible meeting spaces.',
  '11100 Northeast 6th Street',
  'Bellevue', 'WA', '98004',
  1200, 1500, 95000, 650000,
  'conference',
  ARRAY['Audio/visual equipment', 'Video conferencing', 'Breakout rooms', 'Full catering kitchen', 'Parking', 'High-speed WiFi'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.7, 98,
  true, false, 'approved'
),
(
  'Willows Lodge',
  'Luxury resort in Woodinville wine country offering intimate event spaces surrounded by Pacific Northwest nature.',
  '14580 Northeast 145th Street',
  'Woodinville', 'WA', '98072',
  150, 200, 70000, 500000,
  'wedding',
  ARRAY['Garden setting', 'Full catering kitchen', 'Spa services', 'Wine cellar', 'Outdoor terrace', 'Bridal suite'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg'],
  4.9, 156,
  true, true, 'approved'
),
(
  'Chateau Lill',
  'French-inspired vineyard and event venue in Woodinville offering wine tastings and elegant celebrations.',
  '15029 Woodinville-Redmond Road Northeast',
  'Woodinville', 'WA', '98072',
  120, 180, 55000, 400000,
  'wedding',
  ARRAY['Wine cellar', 'Vineyard views', 'Outdoor ceremony space', 'Full bar', 'Catering', 'Parking'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg'],
  4.6, 87,
  true, false, 'approved'
),

-- Tacoma Venues
(
  'Hotel Murano',
  'Boutique art hotel in downtown Tacoma featuring contemporary event spaces and stunning glass art collection.',
  '1320 Broadway',
  'Tacoma', 'WA', '98402',
  200, 300, 50000, 350000,
  'modern',
  ARRAY['Gallery space', 'Audio/visual equipment', 'Full bar', 'Valet parking', 'Art collection', 'City views'],
  ARRAY['https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg', 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg'],
  4.5, 76,
  true, false, 'approved'
),
(
  'Union Station',
  'Historic 1911 train station converted into a stunning event venue with soaring ceilings and original architecture.',
  '1717 Pacific Avenue',
  'Tacoma', 'WA', '98402',
  300, 450, 42000, 300000,
  'historic',
  ARRAY['Historic architecture', 'High ceilings', 'Audio/visual equipment', 'Parking', 'Full bar', 'Grand piano'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.7, 134,
  true, true, 'approved'
),
(
  'Greater Tacoma Convention Center',
  'Large-scale convention facility offering flexible meeting spaces and exhibition halls for major events.',
  '1500 Commerce Street',
  'Tacoma', 'WA', '98402',
  2500, 3500, 110000, 750000,
  'conference',
  ARRAY['Audio/visual equipment', 'Video conferencing', 'Exhibition space', 'Loading dock', 'Full catering kitchen', 'Parking'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.4, 67,
  true, false, 'approved'
),

-- Other Washington Cities
(
  'The Historic Davenport Hotel',
  'Luxury historic hotel in downtown Spokane offering elegant ballrooms and meeting spaces with original 1914 charm.',
  '10 South Post Street',
  'Spokane', 'WA', '99201',
  350, 450, 65000, 480000,
  'wedding',
  ARRAY['Historic architecture', 'Full catering kitchen', 'Audio/visual equipment', 'Valet parking', 'Bridal suite', 'Grand ballroom'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.8, 198,
  true, true, 'approved'
),
(
  'Spokane Convention Center',
  'Modern convention facility in downtown Spokane with flexible meeting spaces and exhibition halls.',
  '334 West Spokane Falls Boulevard',
  'Spokane', 'WA', '99201',
  1800, 2200, 85000, 600000,
  'conference',
  ARRAY['Audio/visual equipment', 'Video conferencing', 'Exhibition space', 'Breakout rooms', 'Full catering kitchen', 'Parking'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.5, 89,
  true, false, 'approved'
),
(
  'Washington Center for the Performing Arts',
  'Premier performing arts venue in Olympia offering elegant theater spaces for special events and performances.',
  '512 Washington Street Southeast',
  'Olympia', 'WA', '98501',
  800, 1000, 75000, 520000,
  'exhibition',
  ARRAY['Stage', 'Sound system', 'Audio/visual equipment', 'Dressing rooms', 'Box office', 'Parking'],
  ARRAY['https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg', 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg'],
  4.7, 112,
  true, false, 'approved'
),
(
  'Salish Lodge & Spa',
  'Luxury lodge overlooking Snoqualmie Falls offering intimate event spaces with breathtaking waterfall views.',
  '6501 Railroad Avenue Southeast',
  'Snoqualmie', 'WA', '98065',
  100, 150, 85000, 600000,
  'wedding',
  ARRAY['Waterfall views', 'Spa services', 'Full catering kitchen', 'Outdoor ceremony space', 'Bridal suite', 'Nature setting'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg'],
  4.9, 167,
  true, true, 'approved'
),
(
  'Historic Everett Theatre',
  'Restored 1901 theater in downtown Everett offering unique event spaces with original architectural details.',
  '2911 Colby Avenue',
  'Everett', 'WA', '98201',
  600, 800, 45000, 320000,
  'historic',
  ARRAY['Historic architecture', 'Stage', 'Sound system', 'Dressing rooms', 'Box office', 'Street parking'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.6, 94,
  true, false, 'approved'
),
(
  'Bellingham Cruise Terminal',
  'Waterfront venue with stunning views of Bellingham Bay, perfect for large events and celebrations.',
  '355 Harris Avenue',
  'Bellingham', 'WA', '98225',
  500, 750, 55000, 400000,
  'corporate',
  ARRAY['Bay views', 'Loading dock', 'Audio/visual equipment', 'Full catering kitchen', 'Parking', 'Outdoor terrace'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.4, 58,
  true, false, 'approved'
);