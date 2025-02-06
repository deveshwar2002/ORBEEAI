import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">OrbeeAI</span>
            </div>
            <p className="text-gray-400">
              Simplifying work management for teams worldwide
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">24x7 Support Available</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Download</h3>
            <div className="space-y-2">
              <p className="text-gray-400"></p>
              <p className="text-gray-400">Android App Coming Soon</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <Link 
                to="/privacy-policy" 
                className="block text-gray-400 hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="block text-gray-400 hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>All rights reserved @OrbeeAI By @Offerrush</p>
        </div>
      </div>
    </footer>
  );
}