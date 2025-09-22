import React from 'react';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 mb-8">
          {/* Brand / Description */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <MapPin className="h-6 w-6 text-amber-400" />
              <span className="text-xl font-bold">VenueHub</span>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed max-w-md">
              Discover and book the perfect venue for weddings, corporate events, and parties. 
              Powered by AI to make finding the right space simple.
            </p>
          </div>

          {/* Socials */}
          <div className="flex justify-center md:justify-end space-x-4">
            <a
              href="https://github.com/nitahieb"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/YOUR_LINKEDIN_USERNAME"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:your@email.com"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-6 text-center text-sm text-blue-200">
          © {new Date().getFullYear()} VenueHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
