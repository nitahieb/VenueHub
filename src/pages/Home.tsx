import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, Star, MessageSquare, Sparkles } from 'lucide-react';
import { getFeaturedVenues } from '../utils/venues';
import VenueCard from '../components/VenueCard';
import { useState, useEffect } from 'react';
import { Venue } from '../types/venue';
import backgroundImage from '../images/event3.jpg'

const Home: React.FC = () => {
  const [featuredVenues, setFeaturedVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedVenues = async () => {
      try {
        const venues = await getFeaturedVenues();
        setFeaturedVenues(venues.slice(0, 3));
      } catch (error) {
        console.error('Error loading featured venues:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedVenues();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center text-white"
  style={{
    backgroundImage: `url(${backgroundImage})`,
  }}
>
  {/* Overlay for darkening the image */}
  <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500"> Event Venue</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
              Discover amazing spaces for weddings, corporate events, parties, and more. 
              Let our AI assistant help you find the ideal venue for your special occasion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/chat"
                className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Ask AI Assistant</span>
                <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
              </Link>
              <Link
                to="/venues"
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Browse All Venues</span>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Venues */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Venues
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hand-picked premium venues that offer exceptional experiences for your special events
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md h-96 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                  <div className="p-6 space-y-3">
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                    <div className="bg-gray-200 h-3 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/venues"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              View All Venues
              <Search className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Venue Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect space for any occasion
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Weddings', category: 'wedding', image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg' },
              { name: 'Corporate', category: 'corporate', image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg' },
              { name: 'Parties', category: 'party', image: 'https://images.pexels.com/photos/2310904/pexels-photo-2310904.jpeg' },
              { name: 'Outdoor', category: 'outdoor', image: 'https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg' }
            ].map((category) => (
              <Link
                key={category.name}
                to={`/venues?category=${category.category}`}
                className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                  <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">Browse venues</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Premium Venues</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8</div>
              <div className="text-blue-100 flex items-center justify-center">
                <Star className="h-5 w-5 fill-current mr-1" />
                Average Rating
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">AI Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;