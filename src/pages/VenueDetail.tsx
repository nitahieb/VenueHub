import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  Star, 
  DollarSign, 
  Clock, 
  Wifi, 
  Car, 
  Music, 
  Coffee, 
  Camera, 
  Shield,
  ArrowLeft,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { getAllVenues } from '../data/venues';

const VenueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const venue = getAllVenues().find(v => v.id === id);

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Venue not found</h2>
          <Link to="/venues" className="text-blue-600 hover:text-blue-700">
            ← Back to venues
          </Link>
        </div>
      </div>
    );
  }

  const amenityIcons: Record<string, any> = {
    'Wi-Fi': Wifi,
    'Parking': Car,
    'Sound system': Music,
    'Catering': Coffee,
    'Photography': Camera,
    'Security': Shield,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/venues"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to venues
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2">
            <img
              src={venue.images[0]}
              alt={venue.name}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {venue.images.slice(1, 3).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${venue.name} ${index + 2}`}
                className="w-full h-44 lg:h-[11.5rem] object-cover rounded-xl shadow-lg"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{venue.location.address}, {venue.location.city}, {venue.location.state} {venue.location.zipCode}</span>
                  </div>
                </div>
                <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full">
                  <Star className="h-5 w-5 text-amber-400 fill-current mr-1" />
                  <span className="font-semibold text-amber-700">{venue.rating}</span>
                  <span className="text-gray-500 ml-1">({venue.reviews} reviews)</span>
                </div>
              </div>

              {venue.featured && (
                <div className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  Featured Venue
                </div>
              )}

              <p className="text-gray-700 text-lg leading-relaxed">{venue.description}</p>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <Users className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Capacity</h3>
                <p className="text-gray-600">Up to {venue.capacity.seated} seated</p>
                <p className="text-gray-600">Up to {venue.capacity.standing} standing</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <DollarSign className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                <p className="text-gray-600">${venue.price.hourly}/hour</p>
                <p className="text-gray-600">${venue.price.daily}/day</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <Clock className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Availability</h3>
                <p className={`font-medium ${venue.availability ? 'text-green-600' : 'text-red-600'}`}>
                  {venue.availability ? 'Available' : 'Unavailable'}
                </p>
                <p className="text-gray-600 text-sm">Check specific dates</p>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities & Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {venue.amenities.map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity] || Shield;
                  return (
                    <div key={index} className="flex items-center space-x-3 bg-white rounded-lg p-4 shadow-sm border">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700 font-medium">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(venue.rating) ? 'text-amber-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{venue.rating} out of 5</span>
                  <span className="text-gray-500 ml-2">({venue.reviews} reviews)</span>
                </div>
                <p className="text-gray-600">
                  Based on {venue.reviews} verified reviews from past events. Guests consistently praise the beautiful atmosphere, professional staff, and attention to detail.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-xl shadow-lg p-6 border">
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${venue.price.hourly}<span className="text-lg font-normal text-gray-600">/hour</span>
                </div>
                <div className="text-gray-600">
                  ${venue.price.daily}/day
                </div>
              </div>

              <form className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="number"
                      placeholder="Enter guest count"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </form>

              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200">
                  Request Booking
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors duration-200">
                  Check Availability
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Venue</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>info@{venue.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetail;