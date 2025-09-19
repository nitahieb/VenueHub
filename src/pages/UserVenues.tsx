import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Eye, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus
} from 'lucide-react';
import { getUserVenues, deleteVenue } from '../utils/venues';
import { Venue } from '../types/venue';

const UserVenues: React.FC = () => {
  const [userVenues, setUserVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserVenues();
  }, []);

  const loadUserVenues = async () => {
    try {
      const venues = await getUserVenues();
      setUserVenues(venues);
    } catch (error) {
      console.error('Error loading user venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVenue = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
      try {
        await deleteVenue(id);
        await loadUserVenues();
      } catch (error) {
        console.error('Error deleting venue:', error);
        alert('Failed to delete venue. Please try again.');
      }
    }
  };

  // For now, all venues are approved since they're in the database
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Live
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock className="h-3 w-3 mr-1" />
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              My Venues
            </h1>
            <p className="text-xl text-gray-600">
              Manage your venue listings and track their status
            </p>
          </div>
          <Link
            to="/list-venue"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Venue</span>
          </Link>
        </div>

        {/* Venues List */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="md:flex">
                  <div className="md:w-48 h-48 md:h-auto bg-gray-200"></div>
                  <div className="flex-1 p-6 space-y-3">
                    <div className="bg-gray-200 h-6 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    <div className="bg-gray-200 h-4 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : userVenues.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No venues listed yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start by adding your first venue to our platform.
              </p>
              <Link
                to="/list-venue"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>List Your First Venue</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {userVenues.map((venue) => (
              <div key={venue.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-48 h-48 md:h-auto">
                    {venue.images.length > 0 ? (
                      <img
                        src={venue.images[0]}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {venue.name}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {venue.location.city}, {venue.location.state}
                        </p>
                        <p className="text-gray-500 text-sm line-clamp-2">
                          {venue.description}
                        </p>
                      </div>
                      <div className="ml-4">
                        {getStatusBadge(venue.status)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex space-x-4">
                        <span>Up to {venue.capacity.standing} guests</span>
                        <span>${venue.price.hourly}/hour</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      {venue.status === 'approved' ? (
                        <Link
                          to={`/venue/${venue.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Live</span>
                        </Link>
                      ) : (
                        <Link
                          to={`/venue/${venue.id}`}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Preview</span>
                        </Link>
                      )}
                      <button
                        onClick={() => handleDeleteVenue(venue.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVenues;