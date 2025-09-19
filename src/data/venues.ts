import { Venue } from '../types/venue';
import { getApprovedUserVenues } from '../utils/venueStorage';

const staticVenues: Venue[] = [
  {
    id: '1',
    name: 'Grand Metropolitan Ballroom',
    description: 'An elegant ballroom featuring crystal chandeliers, marble floors, and panoramic city views. Perfect for weddings, galas, and corporate events.',
    location: {
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    capacity: {
      seated: 300,
      standing: 500
    },
    price: {
      hourly: 800,
      daily: 5500
    },
    amenities: ['Full catering kitchen', 'Audio/visual equipment', 'Parking', 'Bridal suite', 'Dance floor', 'Bar service'],
    images: [
      'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg',
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'
    ],
    category: 'wedding',
    rating: 4.9,
    reviews: 127,
    availability: true,
    featured: true
  },
  {
    id: '2',
    name: 'Modern Tech Hub',
    description: 'A contemporary space designed for innovation and collaboration. Features state-of-the-art technology and flexible configurations.',
    location: {
      address: '456 Innovation Drive',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107'
    },
    capacity: {
      seated: 150,
      standing: 200
    },
    price: {
      hourly: 450,
      daily: 3200
    },
    amenities: ['High-speed WiFi', 'Projection screens', 'Video conferencing', 'Catering prep area', 'Breakout rooms'],
    images: [
      'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      'https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg',
      'https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg'
    ],
    category: 'corporate',
    rating: 4.7,
    reviews: 89,
    availability: true,
    featured: true
  },
  {
    id: '3',
    name: 'Garden Pavilion',
    description: 'Beautiful outdoor venue surrounded by lush gardens and water features. Perfect for intimate celebrations and outdoor ceremonies.',
    location: {
      address: '789 Garden Lane',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701'
    },
    capacity: {
      seated: 120,
      standing: 180
    },
    price: {
      hourly: 350,
      daily: 2500
    },
    amenities: ['Garden setting', 'Covered pavilion', 'Outdoor lighting', 'Catering stations', 'Parking'],
    images: [
      'https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg',
      'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg',
      'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg'
    ],
    category: 'outdoor',
    rating: 4.8,
    reviews: 64,
    availability: true,
    featured: false
  },
  {
    id: '4',
    name: 'Historic Library Hall',
    description: 'A stunning historic venue with original architecture, vaulted ceilings, and rich wooden details. Ideal for sophisticated events.',
    location: {
      address: '321 Heritage Avenue',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108'
    },
    capacity: {
      seated: 180,
      standing: 250
    },
    price: {
      hourly: 650,
      daily: 4500
    },
    amenities: ['Historic architecture', 'Built-in bar', 'Grand piano', 'Gallery space', 'Coat check'],
    images: [
      'https://images.pexels.com/photos/2041396/pexels-photo-2041396.jpeg',
      'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg',
      'https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg'
    ],
    category: 'historic',
    rating: 4.6,
    reviews: 92,
    availability: true,
    featured: false
  },
  {
    id: '5',
    name: 'Rooftop Sky Lounge',
    description: 'Modern rooftop venue with panoramic city views and contemporary design. Perfect for cocktail parties and networking events.',
    location: {
      address: '555 Sky Tower',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101'
    },
    capacity: {
      seated: 80,
      standing: 120
    },
    price: {
      hourly: 550,
      daily: 3800
    },
    amenities: ['City views', 'Full bar', 'Outdoor terrace', 'Climate control', 'Valet parking'],
    images: [
      'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg',
      'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg',
      'https://images.pexels.com/photos/2506954/pexels-photo-2506954.jpeg'
    ],
    category: 'modern',
    rating: 4.5,
    reviews: 73,
    availability: false,
    featured: true
  },
  {
    id: '6',
    name: 'Warehouse Event Space',
    description: 'Industrial chic venue with exposed brick, high ceilings, and flexible layout options. Great for creative events and parties.',
    location: {
      address: '888 Industrial Way',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60622'
    },
    capacity: {
      seated: 200,
      standing: 350
    },
    price: {
      hourly: 400,
      daily: 2800
    },
    amenities: ['Industrial design', 'Loading dock', 'Flexible layout', 'Sound system', 'Street parking'],
    images: [
      'https://images.pexels.com/photos/2310904/pexels-photo-2310904.jpeg',
      'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg',
      'https://images.pexels.com/photos/3184428/pexels-photo-3184428.jpeg'
    ],
    category: 'party',
    rating: 4.4,
    reviews: 56,
    availability: true,
    featured: false
  }
];

export const venues: Venue[] = [
  ...staticVenues,
  ...getApprovedUserVenues()
];

// Function to get fresh venue data including user submissions
export const getAllVenues = (): Venue[] => {
  return [
    ...staticVenues,
    ...getApprovedUserVenues()
  ];
};