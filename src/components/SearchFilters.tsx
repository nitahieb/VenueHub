import React from 'react';
import { Search, MapPin, Users, DollarSign, Filter, Navigation } from 'lucide-react';
import { VenueCategory } from '../types/venue';
import { geocodeAddress } from '../utils/geocoding';

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  location: string;
  setLocation: (location: string) => void;
  category: VenueCategory | '';
  setCategory: (category: VenueCategory | '') => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minCapacity: number;
  setMinCapacity: (capacity: number) => void;
  onLocationSearch?: (coordinates: { latitude: number; longitude: number } | null) => void;
}

const categories: { value: VenueCategory | ''; label: string }[] = [
  { value: '', label: 'All Categories' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'party', label: 'Party' },
  { value: 'conference', label: 'Conference' },
  { value: 'exhibition', label: 'Exhibition' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'historic', label: 'Historic' },
  { value: 'modern', label: 'Modern' },
];

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  location,
  setLocation,
  category,
  setCategory,
  maxPrice,
  setMaxPrice,
  minCapacity,
  setMinCapacity,
  onLocationSearch,
}) => {
  const [isGeocodingLocation, setIsGeocodingLocation] = React.useState(false);

  const handleLocationChange = async (newLocation: string) => {
    setLocation(newLocation);
    
    if (onLocationSearch && newLocation.trim()) {
      setIsGeocodingLocation(true);
      try {
        const coordinates = await geocodeAddress(newLocation);
        onLocationSearch(coordinates);
      } catch (error) {
        console.error('Error geocoding location:', error);
        onLocationSearch(null);
      } finally {
        setIsGeocodingLocation(false);
      }
    } else if (onLocationSearch) {
      onLocationSearch(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="relative xl:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div className="relative">
          {isGeocodingLocation ? (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          )}
          <input
            type="text"
            placeholder="Location (for nearby search)"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as VenueCategory | '')}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none bg-white"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="number"
            placeholder="Min capacity"
            value={minCapacity || ''}
            onChange={(e) => setMinCapacity(Number(e.target.value))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="number"
            placeholder="Max price/hour"
            value={maxPrice || ''}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;