import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Download, Award, Shield, Globe, 
  MessageSquare, Calendar, Users, Zap, ChevronRight 
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: Calendar, title: 'Task Management', description: 'Organize and track tasks efficiently' },
    { icon: Users, title: 'Leave Management Coming Soon', description: 'Streamline attendance and leave tracking' },
    { icon: MessageSquare, title: 'WhatsApp Notification Coming Soon', description: 'Instant updates via WhatsApp' },
    { icon: Globe, title: 'Multilingual Support', description: 'Available in 9 languages' },
    { icon: Shield, title: 'Data Security', description: 'Enterprise-grade security measures' },
    { icon: Zap, title: 'AI-Powered', description: 'Smart task suggestions and analytics' }
  ];

  const clients = [
    'Cable Master', 'Ekosun', 'E-Sync', 'Fifth Column', 
    'Gem Corpochem', 'Jre', 'Comfort Tours'
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                OrbeeAI 
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/pricing')}
                className="text-gray-600 hover:text-gray-900"
              >
                Pricing
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Simplify Organize<span className="text-blue-600">Automate</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Track Tasks, Coordinate Teams, and Monitor Performance - All in One Place!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => window.open('https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1WLaWrBv8zKbxjMrojixmSRrYHNxh2kUop0_qV3IA2Xz16YLjOPrSfjGlXBBBIld9X3UP9YRo7')}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Request a Demo <ChevronRight size={20} />
              </button>
              <button className="px-6 py-3 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2">
                <Download size={20} /> App Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Features that bring in Productivity Enhancement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by our Clients</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center">
            {clients.map((client, index) => (
              <div key={index} className="text-center text-gray-600 font-medium">
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Awards and Recognition</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <p className="font-semibold">G2 High Performer</p>
              <p className="text-gray-600">Winter 2024</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">4.8/5</div>
              <p className="text-gray-600">Capterra Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">5/5</div>
              <p className="text-gray-600">G2 Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                <p className="text-gray-400">Privacy Policy</p>
                <p className="text-gray-400">Terms of Service</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>All rights reserved @OrbeeAI By @Offerrush</p>
          </div>
        </div>
      </footer>
    </div>
  );
}