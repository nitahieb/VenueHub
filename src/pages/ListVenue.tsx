import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  DollarSign, 
  Plus, 
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { VenueCategory } from '../types/venue';
import ImageUpload from '../components/ImageUpload';
import { saveVenue, autoApproveVenue } from '../utils/venueStorage';

const ListVenue: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    seatedCapacity: '',
    standingCapacity: '',
    hourlyPrice: '',
    dailyPrice: '',
    category: '' as VenueCategory | '',
    amenities: [] as string[],
    images: [] as string[],
    submitterEmail: ''
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories: { value: VenueCategory; label: string }[] = [
    { value: 'wedding', label: 'Wedding Venue' },
    { value: 'corporate', label: 'Corporate Event Space' },
    { value: 'party', label: 'Party Venue' },
    { value: 'conference', label: 'Conference Center' },
    { value: 'exhibition', label: 'Exhibition Hall' },
    { value: 'outdoor', label: 'Outdoor Space' },
    { value: 'historic', label: 'Historic Venue' },
    { value: 'modern', label: 'Modern Space' },
  ];

  const commonAmenities = [
    'Full catering kitchen',
    'Audio/visual equipment',
    'Parking',
    'Bridal suite',
    'Dance floor',
    'Bar service',
    'High-speed WiFi',
    'Projection screens',
    'Video conferencing',
    'Breakout rooms',
    'Garden setting',
    'Covered pavilion',
    'Outdoor lighting',
    'Historic architecture',
    'Built-in bar',
    'Grand piano',
    'Gallery space',
    'Coat check',
    'City views',
    'Full bar',
    'Outdoor terrace',
    'Climate control',
    'Valet parking',
    'Industrial design',
    'Loading dock',
    'Flexible layout',
    'Sound system',
    'Street parking'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
    setNewAmenity('');
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save venue to local storage
      const savedVenue = saveVenue({
        name: formData.name,
        description: formData.description,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        capacity: {
          seated: parseInt(formData.seatedCapacity),
          standing: parseInt(formData.standingCapacity)
        },
        price: {
          hourly: parseInt(formData.hourlyPrice),
          daily: parseInt(formData.dailyPrice)
        },
        amenities: formData.amenities,
        images: formData.images,
        category: formData.category as VenueCategory,
        availability: true,
        submitterEmail: formData.submitterEmail
      });

      // Auto-approve for demo purposes
      autoApproveVenue(savedVenue.id);

      setIsSubmitting(false);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error saving venue:', error);
      setIsSubmitting(false);
      // Handle error state here
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-xl shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Venue Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for listing your venue with us. Our team will review your submission and get back to you within 24-48 hours.
          </p>
          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
            >
              Return to Home
            </Link>
            <button
              onClick={() => {
                setSubmitSuccess(false);
                setFormData({
                  name: '',
                  description: '',
                  address: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  seatedCapacity: '',
                  standingCapacity: '',
                  hourlyPrice: '',
                  dailyPrice: '',
                  category: '' as VenueCategory | '',
                  amenities: [],
                  images: [],
                  submitterEmail: ''
                });
              }}
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
            >
              List Another Venue
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            List Your Venue
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our platform and connect with event planners looking for the perfect space. 
            It's free to list and you only pay when you book.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter your venue name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="submitterEmail"
                  value={formData.submitterEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="your@email.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Describe your venue, its unique features, and what makes it special..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-6 w-6 mr-2 text-blue-600" />
              Location
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>

          {/* Capacity & Pricing */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-600" />
              Capacity & Pricing
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seated Capacity *
                </label>
                <input
                  type="number"
                  name="seatedCapacity"
                  value={formData.seatedCapacity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Standing Capacity *
                </label>
                <input
                  type="number"
                  name="standingCapacity"
                  value={formData.standingCapacity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate ($) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    name="hourlyPrice"
                    value={formData.hourlyPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Rate ($) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    name="dailyPrice"
                    value={formData.dailyPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="3500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities & Features</h2>
            
            {/* Quick Add Common Amenities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {commonAmenities.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => addAmenity(amenity)}
                    disabled={formData.amenities.includes(amenity)}
                    className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors duration-200 ${
                      formData.amenities.includes(amenity)
                        ? 'bg-blue-50 border-blue-200 text-blue-700 cursor-not-allowed'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amenity Input */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Custom Amenity</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter custom amenity"
                />
                <button
                  type="button"
                  onClick={() => addAmenity(newAmenity)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Selected Amenities */}
            {formData.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertCircle className="h-6 w-6 mr-2 text-blue-600" />
              Photos
            </h2>
            
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
              maxImages={10}
            />
          </div>

          {/* Terms and Submit */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start space-x-3 mb-6">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  By submitting this form, you agree to our Terms of Service and Privacy Policy. 
                  Your venue will be reviewed by our team before going live.
                </p>
                <p>
                  We charge a 5% service fee on successful bookings. There are no upfront costs or monthly fees.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 px-8 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Venue for Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListVenue;