/*
  # Clear existing venues and add real Washington State venues

  1. Data Changes
    - Remove all existing venue data
    - Add 25 real venues across Washington State
    - Include major cities: Seattle, Bellevue, Tacoma, Spokane, Olympia
    - Mix of venue types: wedding, corporate, party, conference, outdoor, historic

  2. Venue Details
    - Real addresses that can be geocoded
    - Realistic pricing based on Washington market
    - Appropriate amenities for each venue type
    - Stock photos from Pexels for consistency
*/

-- Clear existing venues and reviews
DELETE FROM reviews;
DELETE FROM venues;

-- Insert real Washington State venues
INSERT INTO venues (
  name, description, address, city, state, zip_code,
  seated_capacity, standing_capacity, hourly_price, daily_price,
  category, amenities, images, rating, reviews_count, availability, featured, status
) VALUES

-- Seattle Wedding Venues
(
  'The Fairmont Olympic Hotel',
  'Historic luxury hotel in downtown Seattle offering elegant ballrooms with crystal chandeliers, marble columns, and impeccable service. Perfect for sophisticated weddings and corporate events.',
  '411 University Street',
  'Seattle',
  'WA',
  '98101',
  300,
  400,
  80000,
  600000,
  'wedding',
  ARRAY['Full catering kitchen', 'Bridal suite', 'Valet parking', 'Audio/visual equipment', 'Historic architecture', 'City views', 'Climate control'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.8,
  127,
  true,
  true,
  'approved'
),

(
  'Sodo Park',
  'Industrial-chic venue in Seattle''s SoDo district featuring exposed brick walls, soaring ceilings, and flexible event spaces. Popular for modern weddings and corporate gatherings.',
  '1200 1st Avenue South',
  'Seattle',
  'WA',
  '98134',
  250,
  350,
  45000,
  320000,
  'wedding',
  ARRAY['Industrial design', 'Flexible layout', 'Full bar', 'Loading dock', 'Sound system', 'Parking', 'Climate control'],
  ARRAY['https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg', 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg'],
  4.6,
  89,
  true,
  true,
  'approved'
),

(
  'The Georgetown Ballroom',
  'Restored 1920s ballroom with original hardwood floors, vintage chandeliers, and art deco details. An intimate venue perfect for classic weddings and special celebrations.',
  '5519 Airport Way South',
  'Seattle',
  'WA',
  '98108',
  150,
  200,
  35000,
  250000,
  'wedding',
  ARRAY['Historic architecture', 'Dance floor', 'Built-in bar', 'Vintage chandeliers', 'Hardwood floors', 'Street parking'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.7,
  64,
  true,
  false,
  'approved'
),

-- Seattle Corporate Venues
(
  'Washington State Convention Center',
  'Premier convention facility in downtown Seattle with state-of-the-art meeting rooms, exhibition halls, and advanced technology infrastructure for large corporate events.',
  '705 Pike Street',
  'Seattle',
  'WA',
  '98101',
  2000,
  3000,
  150000,
  1200000,
  'corporate',
  ARRAY['Audio/visual equipment', 'Video conferencing', 'High-speed WiFi', 'Breakout rooms', 'Full catering kitchen', 'Valet parking', 'Loading dock'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.5,
  156,
  true,
  true,
  'approved'
),

(
  'The Westin Seattle',
  'Upscale hotel with sophisticated meeting spaces and panoramic city views. Ideal for executive conferences, board meetings, and corporate retreats.',
  '1900 5th Avenue',
  'Seattle',
  'WA',
  '98101',
  400,
  600,
  95000,
  750000,
  'corporate',
  ARRAY['City views', 'Audio/visual equipment', 'Video conferencing', 'High-speed WiFi', 'Breakout rooms', 'Valet parking', 'Full catering kitchen'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.6,
  98,
  true,
  false,
  'approved'
),

-- Bellevue Venues
(
  'Hyatt Regency Bellevue',
  'Elegant hotel venue with modern amenities and stunning views of Lake Washington. Perfect for upscale weddings, corporate events, and social gatherings.',
  '900 Bellevue Way Northeast',
  'Bellevue',
  'WA',
  '98004',
  350,
  500,
  70000,
  550000,
  'wedding',
  ARRAY['Lake views', 'Bridal suite', 'Audio/visual equipment', 'Valet parking', 'Full catering kitchen', 'Climate control', 'High-speed WiFi'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.7,
  112,
  true,
  true,
  'approved'
),

(
  'Meydenbauer Center',
  'Modern conference center in downtown Bellevue offering flexible meeting spaces, advanced technology, and professional event services for corporate gatherings.',
  '11100 Northeast 6th Street',
  'Bellevue',
  'WA',
  '98004',
  800,
  1200,
  85000,
  650000,
  'corporate',
  ARRAY['Audio/visual equipment', 'Video conferencing', 'High-speed WiFi', 'Breakout rooms', 'Exhibition space', 'Parking', 'Full catering kitchen'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.4,
  87,
  true,
  false,
  'approved'
),

-- Tacoma Venues
(
  'Hotel Murano',
  'Boutique art hotel in downtown Tacoma featuring contemporary design and sophisticated event spaces. Ideal for intimate weddings and corporate functions.',
  '1320 Broadway',
  'Tacoma',
  'WA',
  '98402',
  200,
  300,
  55000,
  400000,
  'wedding',
  ARRAY['Contemporary design', 'Art gallery', 'Full bar', 'Audio/visual equipment', 'Valet parking', 'Climate control'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.5,
  73,
  true,
  false,
  'approved'
),

(
  'Greater Tacoma Convention Center',
  'Full-service convention facility with flexible meeting rooms, exhibition halls, and comprehensive event services for large corporate conferences and trade shows.',
  '1500 Commerce Street',
  'Tacoma',
  'WA',
  '98402',
  1500,
  2200,
  120000,
  900000,
  'corporate',
  ARRAY['Exhibition halls', 'Audio/visual equipment', 'Video conferencing', 'High-speed WiFi', 'Loading dock', 'Parking', 'Full catering kitchen'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.3,
  94,
  true,
  false,
  'approved'
),

-- Outdoor Venues
(
  'Snoqualmie Falls Lodge',
  'Rustic lodge overlooking the spectacular Snoqualmie Falls, offering breathtaking natural beauty for outdoor weddings and corporate retreats in the Cascade Mountains.',
  '6501 Railroad Avenue Southeast',
  'Snoqualmie',
  'WA',
  '98065',
  180,
  250,
  60000,
  450000,
  'outdoor',
  ARRAY['Waterfall views', 'Mountain setting', 'Outdoor ceremony space', 'Covered pavilion', 'Rustic lodge', 'Parking', 'Full catering kitchen'],
  ARRAY['https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.8,
  145,
  true,
  true,
  'approved'
),

(
  'Willows Lodge',
  'Luxury resort in Woodinville wine country featuring gardens, courtyards, and vineyard views. Perfect for elegant outdoor weddings and corporate events.',
  '14580 Northeast 145th Street',
  'Woodinville',
  'WA',
  '98072',
  220,
  320,
  75000,
  580000,
  'outdoor',
  ARRAY['Vineyard views', 'Garden setting', 'Outdoor ceremony space', 'Wine country location', 'Luxury amenities', 'Valet parking', 'Full catering kitchen'],
  ARRAY['https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.7,
  118,
  true,
  true,
  'approved'
),

-- Party Venues
(
  'The Showbox',
  'Iconic music venue in downtown Seattle with a rich history of live performances. Perfect for unique parties, product launches, and entertainment events.',
  '1426 1st Avenue',
  'Seattle',
  'WA',
  '98101',
  800,
  1200,
  40000,
  300000,
  'party',
  ARRAY['Historic venue', 'Sound system', 'Stage', 'Full bar', 'Dance floor', 'Lighting system', 'Street parking'],
  ARRAY['https://images.pexels.com/photos/2310904/pexels-photo-2310904.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.6,
  203,
  true,
  false,
  'approved'
),

(
  'Fremont Abbey Arts Center',
  'Converted church in Seattle''s Fremont neighborhood offering a unique atmosphere for creative parties, art events, and unconventional celebrations.',
  '4272 Fremont Avenue North',
  'Seattle',
  'WA',
  '98103',
  300,
  450,
  35000,
  260000,
  'party',
  ARRAY['Historic church', 'High ceilings', 'Stained glass', 'Sound system', 'Flexible layout', 'Street parking', 'Art gallery space'],
  ARRAY['https://images.pexels.com/photos/2310904/pexels-photo-2310904.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.5,
  76,
  true,
  false,
  'approved'
),

-- Historic Venues
(
  'Union Station',
  'Beautifully restored 1911 train station in downtown Tacoma featuring original architecture and elegant event spaces for weddings and special occasions.',
  '1717 Pacific Avenue',
  'Tacoma',
  'WA',
  '98402',
  400,
  600,
  65000,
  500000,
  'historic',
  ARRAY['Historic architecture', 'Original details', 'High ceilings', 'Grand staircase', 'Marble floors', 'Parking', 'Full catering kitchen'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.7,
  92,
  true,
  true,
  'approved'
),

(
  'Stimson-Green Mansion',
  'Historic 1901 mansion on Capitol Hill featuring period architecture, elegant rooms, and manicured gardens for intimate weddings and special events.',
  '1204 Minor Avenue',
  'Seattle',
  'WA',
  '98101',
  120,
  180,
  50000,
  380000,
  'historic',
  ARRAY['Historic mansion', 'Period architecture', 'Garden setting', 'Elegant rooms', 'Original details', 'Street parking'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.6,
  58,
  true,
  false,
  'approved'
),

-- Spokane Venues
(
  'The Historic Davenport Hotel',
  'Legendary luxury hotel in downtown Spokane with opulent ballrooms, crystal chandeliers, and impeccable service for grand weddings and corporate events.',
  '10 South Post Street',
  'Spokane',
  'WA',
  '99201',
  500,
  750,
  85000,
  650000,
  'wedding',
  ARRAY['Historic luxury', 'Crystal chandeliers', 'Marble columns', 'Bridal suite', 'Valet parking', 'Full catering kitchen', 'Audio/visual equipment'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.8,
  134,
  true,
  true,
  'approved'
),

(
  'Spokane Convention Center',
  'Modern convention facility in downtown Spokane offering flexible meeting spaces and exhibition halls for large corporate conferences and trade shows.',
  '334 West Spokane Falls Boulevard',
  'Spokane',
  'WA',
  '99201',
  2500,
  3500,
  140000,
  1100000,
  'corporate',
  ARRAY['Exhibition halls', 'Audio/visual equipment', 'Video conferencing', 'High-speed WiFi', 'Breakout rooms', 'Loading dock', 'Parking'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.4,
  78,
  true,
  false,
  'approved'
),

-- Olympia Venues
(
  'The Washington Center for the Performing Arts',
  'Premier performing arts venue in downtown Olympia with multiple theaters and event spaces for corporate presentations, galas, and special performances.',
  '512 Washington Street Southeast',
  'Olympia',
  'WA',
  '98501',
  800,
  1000,
  75000,
  580000,
  'corporate',
  ARRAY['Theater setting', 'Professional lighting', 'Sound system', 'Stage', 'Audio/visual equipment', 'Parking', 'Green rooms'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.5,
  67,
  true,
  false,
  'approved'
),

-- Additional Seattle Venues
(
  'Chihuly Garden and Glass',
  'Stunning museum venue featuring Dale Chihuly''s glass art installations and a beautiful garden conservatory, perfect for unique corporate events and receptions.',
  '305 Harrison Street',
  'Seattle',
  'WA',
  '98109',
  200,
  300,
  90000,
  700000,
  'corporate',
  ARRAY['Art installations', 'Garden conservatory', 'Unique atmosphere', 'Audio/visual equipment', 'Catering approved', 'Parking'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.9,
  156,
  true,
  true,
  'approved'
),

(
  'The Canal',
  'Industrial waterfront venue in Seattle''s Ballard neighborhood with exposed brick, steel beams, and canal views for modern weddings and corporate events.',
  '2218 Northwest Market Street',
  'Seattle',
  'WA',
  '98107',
  280,
  400,
  55000,
  420000,
  'modern',
  ARRAY['Industrial design', 'Waterfront views', 'Exposed brick', 'Steel beams', 'Flexible layout', 'Full bar', 'Parking'],
  ARRAY['https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg', 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg'],
  4.6,
  89,
  true,
  false,
  'approved'
),

(
  'Woodland Park Zoo',
  'Unique outdoor venue offering private event spaces throughout the zoo grounds with animal encounters and natural settings for memorable parties and corporate events.',
  '5500 Phinney Avenue North',
  'Seattle',
  'WA',
  '98103',
  500,
  800,
  65000,
  500000,
  'outdoor',
  ARRAY['Zoo setting', 'Animal encounters', 'Multiple venues', 'Outdoor spaces', 'Educational opportunities', 'Parking', 'Catering approved'],
  ARRAY['https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.7,
  124,
  true,
  true,
  'approved'
),

-- Redmond/Eastside
(
  'Chateau Lill',
  'Elegant French-inspired chateau in Woodinville wine country with vineyard views, formal gardens, and luxury amenities for sophisticated weddings.',
  '15500 Woodinville-Redmond Road Northeast',
  'Woodinville',
  'WA',
  '98072',
  160,
  240,
  80000,
  620000,
  'wedding',
  ARRAY['Vineyard views', 'French architecture', 'Formal gardens', 'Wine cellar', 'Bridal suite', 'Luxury amenities', 'Valet parking'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.8,
  97,
  true,
  true,
  'approved'
),

-- Everett
(
  'Historic Everett Theatre',
  'Restored 1901 vaudeville theater in downtown Everett featuring original architecture and vintage charm for unique weddings, parties, and corporate events.',
  '2911 Colby Avenue',
  'Everett',
  'WA',
  '98201',
  350,
  500,
  45000,
  340000,
  'historic',
  ARRAY['Historic theater', 'Original architecture', 'Stage', 'Vintage charm', 'Sound system', 'Lighting', 'Street parking'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.5,
  71,
  true,
  false,
  'approved'
),

-- Bellingham
(
  'Bellingham Cruise Terminal',
  'Waterfront venue with panoramic views of Bellingham Bay and the San Juan Islands, perfect for large corporate events, conferences, and waterfront weddings.',
  '355 Harris Avenue',
  'Bellingham',
  'WA',
  '98225',
  600,
  900,
  70000,
  540000,
  'corporate',
  ARRAY['Waterfront views', 'Bay views', 'Large capacity', 'Loading facilities', 'Audio/visual equipment', 'Parking', 'Full catering kitchen'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.4,
  52,
  true,
  false,
  'approved'
),

-- Vancouver, WA
(
  'The Historic Reserve',
  'Restored 1920s building in downtown Vancouver featuring original brick walls, hardwood floors, and vintage details for weddings and special events.',
  '1601 East Fourth Plain Boulevard',
  'Vancouver',
  'WA',
  '98661',
  200,
  300,
  40000,
  300000,
  'historic',
  ARRAY['Historic building', 'Brick walls', 'Hardwood floors', 'Vintage details', 'Flexible layout', 'Full bar', 'Parking'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.6,
  63,
  true,
  false,
  'approved'
);