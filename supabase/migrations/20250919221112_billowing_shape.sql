/*
  # Insert sample venue data

  1. Sample Data
    - Insert comprehensive venue data covering all categories
    - Include realistic pricing, capacity, and amenities
    - Set up featured venues and ratings
*/

-- Insert sample venues
INSERT INTO venues (
  name, description, address, city, state, zip_code,
  seated_capacity, standing_capacity, hourly_price, daily_price,
  category, amenities, images, rating, reviews_count, availability, featured, status
) VALUES 
(
  'Grand Metropolitan Ballroom',
  'An elegant ballroom featuring crystal chandeliers, marble floors, and panoramic city views. Perfect for weddings, galas, and corporate events.',
  '123 Main Street', 'New York', 'NY', '10001',
  300, 500, 800, 5500,
  'wedding',
  ARRAY['Full catering kitchen', 'Audio/visual equipment', 'Parking', 'Bridal suite', 'Dance floor', 'Bar service'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'],
  4.9, 127, true, true, 'approved'
),
(
  'Modern Tech Hub',
  'A contemporary space designed for innovation and collaboration. Features state-of-the-art technology and flexible configurations.',
  '456 Innovation Drive', 'San Francisco', 'CA', '94107',
  150, 200, 450, 3200,
  'corporate',
  ARRAY['High-speed WiFi', 'Projection screens', 'Video conferencing', 'Catering prep area', 'Breakout rooms'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg', 'https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg'],
  4.7, 89, true, true, 'approved'
),
(
  'Garden Pavilion',
  'Beautiful outdoor venue surrounded by lush gardens and water features. Perfect for intimate celebrations and outdoor ceremonies.',
  '789 Garden Lane', 'Austin', 'TX', '78701',
  120, 180, 350, 2500,
  'outdoor',
  ARRAY['Garden setting', 'Covered pavilion', 'Outdoor lighting', 'Catering stations', 'Parking'],
  ARRAY['https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg', 'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg', 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg'],
  4.8, 64, true, false, 'approved'
),
(
  'Historic Library Hall',
  'A stunning historic venue with original architecture, vaulted ceilings, and rich wooden details. Ideal for sophisticated events.',
  '321 Heritage Avenue', 'Boston', 'MA', '02108',
  180, 250, 650, 4500,
  'historic',
  ARRAY['Historic architecture', 'Built-in bar', 'Grand piano', 'Gallery space', 'Coat check'],
  ARRAY['https://images.pexels.com/photos/2041396/pexels-photo-2041396.jpeg', 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg', 'https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg'],
  4.6, 92, true, false, 'approved'
),
(
  'Rooftop Sky Lounge',
  'Modern rooftop venue with panoramic city views and contemporary design. Perfect for cocktail parties and networking events.',
  '555 Sky Tower', 'Miami', 'FL', '33101',
  80, 120, 550, 3800,
  'modern',
  ARRAY['City views', 'Full bar', 'Outdoor terrace', 'Climate control', 'Valet parking'],
  ARRAY['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg', 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg', 'https://images.pexels.com/photos/2506954/pexels-photo-2506954.jpeg'],
  4.5, 73, false, true, 'approved'
),
(
  'Warehouse Event Space',
  'Industrial chic venue with exposed brick, high ceilings, and flexible layout options. Great for creative events and parties.',
  '888 Industrial Way', 'Chicago', 'IL', '60622',
  200, 350, 400, 2800,
  'party',
  ARRAY['Industrial design', 'Loading dock', 'Flexible layout', 'Sound system', 'Street parking'],
  ARRAY['https://images.pexels.com/photos/2310904/pexels-photo-2310904.jpeg', 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg', 'https://images.pexels.com/photos/3184428/pexels-photo-3184428.jpeg'],
  4.4, 56, true, false, 'approved'
),
(
  'Crystal Conference Center',
  'State-of-the-art conference facility with multiple meeting rooms and advanced presentation technology.',
  '999 Business Plaza', 'Seattle', 'WA', '98101',
  400, 600, 600, 4200,
  'conference',
  ARRAY['Multiple meeting rooms', 'Advanced AV equipment', 'High-speed internet', 'Catering kitchen', 'Executive lounge'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg', 'https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg'],
  4.7, 134, true, true, 'approved'
),
(
  'Artisan Exhibition Hall',
  'Spacious exhibition space with high ceilings and flexible booth configurations. Perfect for trade shows and art exhibitions.',
  '777 Exhibition Drive', 'Las Vegas', 'NV', '89101',
  500, 800, 750, 5200,
  'exhibition',
  ARRAY['High ceilings', 'Flexible booth setup', 'Loading docks', 'Security system', 'Visitor parking'],
  ARRAY['https://images.pexels.com/photos/2310904/pexels-photo-2310904.jpeg', 'https://images.pexels.com/photos/3184428/pexels-photo-3184428.jpeg', 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg'],
  4.3, 78, true, false, 'approved'
),
(
  'Lakeside Wedding Pavilion',
  'Romantic lakeside venue with stunning water views and elegant outdoor ceremony space.',
  '456 Lakefront Road', 'Denver', 'CO', '80201',
  200, 300, 700, 4800,
  'wedding',
  ARRAY['Lakeside ceremony space', 'Bridal suite', 'Reception hall', 'Photography areas', 'Guest parking'],
  ARRAY['https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg', 'https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg', 'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg'],
  4.8, 156, true, true, 'approved'
),
(
  'Downtown Corporate Plaza',
  'Premium corporate event space in the heart of downtown with panoramic city views.',
  '123 Corporate Center', 'Atlanta', 'GA', '30301',
  250, 400, 500, 3500,
  'corporate',
  ARRAY['City views', 'Executive boardroom', 'Presentation equipment', 'Catering facilities', 'Valet service'],
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg', 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg'],
  4.6, 98, true, false, 'approved'
);