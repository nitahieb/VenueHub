import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Star, Clock, DollarSign } from 'lucide-react';
import { Venue } from '../types/venue';

interface VenueCardProps {
  venue: Venue;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  return (
    <Link to={`/venue/${venue.id}`} className="group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
        <div className="relative">
          <img
            src={venue.images[0]}
            alt={venue.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {venue.featured && (
            <div className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </div>
          )}
          {!venue.availability && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Unavailable
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {venue.name}
            </h3>
            <div className="flex items-center text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium text-gray-600 ml-1">
                {venue.rating}
              </span>
            </div>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{venue.location.city}, {venue.location.state}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {venue.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>Up to {venue.capacity.standing}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{venue.reviews} reviews</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-blue-600 font-semibold">
              <DollarSign className="h-4 w-4" />
              <p className="text-lg font-semibold text-gray-700">${(venue.price.daily ?? 0).toLocaleString()}</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VenueCard;