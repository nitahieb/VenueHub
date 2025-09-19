import React, { useState, useMemo } from 'react';
import { getAllVenues } from '../data/venues';
import { VenueCategory } from '../types/venue';
import VenueCard from '../components/VenueCard';
import SearchFilters from '../components/SearchFilters';

const Venues: React.FC = () => {
  const [venues, setVenues] = useState(getAllVenues());
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<VenueCategory | ''>('');
  const [maxPrice, setMaxPrice] = useState(0);
  const [minCapacity, setMinCapacity] = useState(0);

  // Listen for venue status updates
  React.useEffect(() => {
    const handleVenueUpdate = () => {
      setVenues(getAllVenues());
    };

    window.addEventListener('venueStatusUpdated', handleVenueUpdate);
    return () => window.removeEventListener('venueStatusUpdated', handleVenueUpdate);
  }, []);

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           venue.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !location || 
                             venue.location.city.toLowerCase().includes(location.toLowerCase()) ||
                             venue.location.state.toLowerCase().includes(location.toLowerCase());
      const matchesCategory = !category || venue.category === category;
      const matchesPrice = !maxPrice || venue.price.hourly <= maxPrice;
      const matchesCapacity = !minCapacity || venue.capacity.standing >= minCapacity;
      
      return matchesSearch && matchesLocation && matchesCategory && matchesPrice && matchesCapacity;
    });
  }, [venues, searchTerm, location, category, maxPrice, minCapacity]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse Event Venues
          </h1>
          <p className="text-xl text-gray-600">
            Discover the perfect space for your next event from our curated collection
          </p>
        </div>

        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          minCapacity={minCapacity}
          setMinCapacity={setMinCapacity}
        />

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {filteredVenues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No venues found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or browse all available venues.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;