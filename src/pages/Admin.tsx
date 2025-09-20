import React, { useState } from 'react';
import { MapPin, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { geocodeExistingVenues } from '../utils/geocode-venues';

const Admin: React.FC = () => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingResults, setGeocodingResults] = useState<{
    success: number;
    errors: number;
    total: number;
  } | null>(null);

  const handleGeocodeVenues = async () => {
    setIsGeocoding(true);
    setGeocodingResults(null);
    
    try {
      const results = await geocodeExistingVenues();
      setGeocodingResults(results);
      
    } catch (error) {
      console.error('Error during geocoding:', error);
      alert('Error during geocoding. Please check the console for details.');
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Admin Tools
          </h1>
          
          <div className="space-y-8">
            {/* Geocoding Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Venue Geocoding
                </h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Add latitude and longitude coordinates to existing venues by geocoding their addresses.
                This enables location-based search functionality.
              </p>
              
              <button
                onClick={handleGeocodeVenues}
                disabled={isGeocoding}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
              >
                {isGeocoding ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Geocoding Venues...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-5 w-5" />
                    <span>Geocode All Venues</span>
                  </>
                )}
              </button>
              
              {geocodingResults && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Geocoding Results</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Successfully geocoded: {geocodingResults.success} venues</span>
                    </div>
                    {geocodingResults.errors > 0 && (
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Failed to geocode: {geocodingResults.errors} venues</span>
                      </div>
                    )}
                    <div className="text-gray-600">
                      Total processed: {geocodingResults.total} venues
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;