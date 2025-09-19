import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, MessageSquare, Search } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">VenueHub</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`${
                isActive('/') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
              } px-3 py-2 text-sm font-medium transition-colors duration-200`}
            >
              Home
            </Link>
            <Link
              to="/venues"
              className={`${
                isActive('/venues') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
              } px-3 py-2 text-sm font-medium transition-colors duration-200`}
            >
              Browse Venues
            </Link>
            <Link
              to="/chat"
              className={`${
                isActive('/chat') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
              } px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-1`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>AI Assistant</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 md:hidden">
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/my-venues"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200 hidden md:block"
            >
              My Venues
            </Link>
            <Link
              to="/list-venue"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              List Your Venue
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;