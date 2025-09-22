import React from 'react';
import { useState, useEffect } from 'react';
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
  Mail,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { getVenueById, getVenueReviews, getSimilarVenues } from '../utils/venues';
import { getCurrentUser } from '../utils/auth';
import { Venue } from '../types/venue';
import VenueCard from '../components/VenueCard';

const VenueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [venueReviews, setVenueReviews] = useState<any[]>([]);
  const [similarVenues, setSimilarVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSimilarVenues, setLoadingSimilarVenues] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Scroll to top when component mounts or venue ID changes
    window.scrollTo(0, 0);
    
    const loadVenue = async () => {
      if (!id) return;
      
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        
        const venueData = await getVenueById(id);
        
        // Check if venue exists and user has permission to view it
        if (!venueData) {
          setVenue(null);
          return;
        }
        
        // If venue is not approved and user is not the owner, treat as not found
        if (venueData.status !== 'approved' && (!user || user.id !== venueData.owner_id)) {
          setVenue(null);
          return;
        }
        
        setVenue(venueData);
        
        // Load venue reviews
        const reviewsData = await getVenueReviews(id);
        setVenueReviews(reviewsData);
        
        // Load similar venues
        try {
          const similar = await getSimilarVenues(id);
          setSimilarVenues(similar);
        } catch (error) {
          console.error('Error loading similar venues:', error);
        } finally {
          setLoadingSimilarVenues(false);
        }
      } catch (error) {
        console.error('Error loading venue:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVenue();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-96 rounded-xl mb-8"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 rounded w-1/2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 h-4 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Pending Status Banner */}
        {venue.status === 'pending' && currentUser?.id === venue.owner_id && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Venue Pending Review
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Your venue is currently under review. It will be visible to the public once approved.
                </p>
              </div>
            </div>
          </div>
        )}
        
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
                  <span className="text-gray-500 ml-1">({venue.reviews} ratings)</span>
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
              <div className="space-y-6">
                {/* Overall Rating */}
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
                    <span className="text-gray-500 ml-2">({venue.reviews} ratings)</span>
                  </div>
                  <p className="text-gray-600">
                    Based on {venue.reviews} verified ratings from past events.
                  </p>
                </div>
                
                {/* Individual Reviews */}
                <div className="space-y-4">
                  {venueReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
                
                {venueReviews.length === 0 && (
                <>
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
                    <span className="text-gray-500 ml-2">({venue.reviews} ratings)</span>
                  </div>
                  <p className="text-gray-600">
                    No reviews yet. Be the first to review this venue!
                  </p>
                </>
                )}
              </div>
            </div>

            {/* Similar Venues Section */}
            <div>
              <div className="flex items-center mb-6">
                <Sparkles className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Similar Venues You Might Like</h2>
              </div>
              
              {loadingSimilarVenues ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              ) : similarVenues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarVenues.map((similarVenue) => (
                    <VenueCard key={similarVenue.id} venue={similarVenue} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <Sparkles className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No similar venues found
                  </h3>
                  <p className="text-gray-500">
                    We couldn't find venues similar to this one at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-xl shadow-lg p-6 border">
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${venue.price.hourly.toLocaleString()}<span className="text-lg font-normal text-gray-600">/hour</span>
                </div>
                <div className="text-gray-600">
                  ${venue.price.daily.toLocaleString()}/day
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