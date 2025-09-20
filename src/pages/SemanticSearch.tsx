import React, { useState } from 'react';
import { Search, Sparkles, Zap, Brain, Target } from 'lucide-react';
import { 
  searchVenuesSemantic, 
  searchVenuesSemanticWithDetails,
  generateVenueEmbeddings, 
  generateReviewEmbeddings 
} from '../utils/embeddings';
import VenueCard from '../components/VenueCard';
import { Venue } from '../types/venue';

interface SemanticResult {
  venue_id: string;
  venue_name: string;
  venue_description: string;
  city: string;
  state: string;
  category: string;
  max_similarity: number;
  review_matches: number;
}

const SemanticSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SemanticResult[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [generatingEmbeddings, setGeneratingEmbeddings] = useState(false);
  const [embeddingProgress, setEmbeddingProgress] = useState<string>('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const startTime = Date.now();
      
      // Get search results with similarity scores
      const searchResults = await searchVenuesSemantic(query, 0.6, 12, true);
      setResults(searchResults);
      
      // Get full venue details using the enhanced search
      const venueDetails = await searchVenuesSemanticWithDetails(query, 0.6, 12);
      
      // Transform venue details to match Venue interface
      const transformedVenues: Venue[] = venueDetails.map(venue => ({
        id: venue.id,
        name: venue.name,
        description: venue.description,
        location: {
          address: venue.address,
          city: venue.city,
          state: venue.state,
          zipCode: venue.zip_code,
          latitude: venue.latitude,
          longitude: venue.longitude,
        },
        capacity: {
          seated: venue.seated_capacity,
          standing: venue.standing_capacity,
        },
        price: {
          hourly: venue.hourly_price / 100,
          daily: venue.daily_price / 100,
        },
        amenities: venue.amenities || [],
        images: venue.images || [],
        category: venue.category,
        rating: venue.rating,
        reviews: venue.reviews_count,
        availability: venue.availability,
        featured: venue.featured,
        status: venue.status,
        owner_id: venue.owner_id,
      }));
      
      setVenues(transformedVenues);
      setSearchTime(Date.now() - startTime);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEmbeddings = async () => {
    setGeneratingEmbeddings(true);
    setEmbeddingProgress('Generating venue embeddings...');
    
    try {
      const venueResults = await generateVenueEmbeddings();
      setEmbeddingProgress(`Generated ${venueResults.success} venue embeddings. Generating review embeddings...`);
      
      const reviewResults = await generateReviewEmbeddings();
      setEmbeddingProgress(`Complete! Generated ${venueResults.success} venue and ${reviewResults.success} review embeddings.`);
      
      setTimeout(() => {
        setEmbeddingProgress('');
        setGeneratingEmbeddings(false);
      }, 3000);
    } catch (error) {
      console.error('Error generating embeddings:', error);
      setEmbeddingProgress('Error generating embeddings. Check console for details.');
      setGeneratingEmbeddings(false);
    }
  };

  const exampleQueries = [
    "romantic lakeside wedding venue",
    "corporate retreat in the mountains",
    "family-friendly outdoor celebration",
    "intimate dinner party space",
    "historic venue with character",
    "modern tech conference center",
    "garden wedding with natural beauty",
    "luxury ballroom for gala"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-purple-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Semantic Venue Search
            </h1>
            <Sparkles className="h-6 w-6 text-amber-500 ml-2" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find venues using natural language. Describe what you're looking for, and our AI will understand the meaning behind your words.
          </p>
        </div>

        {/* Search Interface */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Describe your ideal venue... (e.g., 'romantic lakeside wedding venue')"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Target className="h-5 w-5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>

          {/* Example Queries */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Try these example searches:</h3>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 px-3 py-1 rounded-full text-sm transition-colors duration-200"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>

          {/* Embedding Generation */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Setup Required</h3>
                <p className="text-gray-600">Generate embeddings for all venues and reviews to enable semantic search.</p>
              </div>
              <button
                onClick={handleGenerateEmbeddings}
                disabled={generatingEmbeddings}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
              >
                {generatingEmbeddings ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    <span>Generate Embeddings</span>
                  </>
                )}
              </button>
            </div>
            {embeddingProgress && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">{embeddingProgress}</p>
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results ({results.length})
              </h2>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Powered by AI semantic understanding</div>
                {searchTime > 0 && (
                  <div>Search completed in {searchTime}ms</div>
                )}
              </div>
            </div>

            {/* Results with Similarity Scores */}
            <div className="space-y-4 mb-8">
              {results.map((result, index) => (
                <div key={result.venue_id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {result.venue_name}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {result.city}, {result.state} • {result.category}
                      </p>
                      <p className="text-gray-700 line-clamp-2">
                        {result.venue_description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                        {Math.round((result.max_similarity || 0) * 100)}% match
                      </div>
                      {result.review_matches > 0 && (
                        <div className="text-xs text-gray-500">
                          {result.review_matches} review matches
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Venue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How Semantic Search Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Understanding</h3>
              <p className="text-gray-600">
                VoyageAI understands the meaning and context of your search, not just keywords.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-gray-600">
                Vector similarity search finds venues that match your intent, even without exact keywords.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Relevant Results</h3>
              <p className="text-gray-600">
                Results ranked by cosine similarity scores and enhanced with review sentiment analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemanticSearch;