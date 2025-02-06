import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Footer } from '../components/Footer';

export function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                OrbeeAI
              </span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-blue max-w-none">
            <p className="text-sm text-gray-500 mb-8">Last Updated: February 06, 2025</p>

            <p className="mb-6">
              This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information
              when you use our Service. It also explains your privacy rights and how the law protects you.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Interpretation and Definitions</h2>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Interpretation</h3>
            <p className="mb-4">
              Words with capitalized initial letters have meanings defined under the following conditions.
              These definitions apply whether the terms appear in singular or plural.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-3">Definitions</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Account:</strong> A unique account created for you to access our Service.</li>
              <li><strong>Company:</strong> Refers to OrbeeAI.</li>
              <li><strong>Country:</strong> Refers to Rajasthan, India.</li>
              <li><strong>Device:</strong> Any device that can access the Service.</li>
              <li><strong>Personal Data:</strong> Any information relating to an identified or identifiable individual.</li>
              <li><strong>Service:</strong> Refers to the Website.</li>
              <li><strong>Website:</strong> OrbeeAI, accessible at https://orbeeai.vercel.app/</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">Collecting and Using Your Personal Data</h2>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Types of Data Collected</h3>
            
            <h4 className="text-base font-medium mt-4 mb-2">Personal Data</h4>
            <p className="mb-4">
              While using our Service, we may ask you to provide personally identifiable information, including:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Email address</li>
              <li>Usage Data</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">Security of Your Personal Data</h2>
            <p className="mb-6">
              The security of Your Personal Data is important to us, but remember that no method of transmission over
              the Internet, or method of electronic storage is 100% secure. While we strive to use commercially
              acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Children's Privacy</h2>
            <p className="mb-6">
              Our Service does not address anyone under the age of 13. We do not knowingly collect personally
              identifiable information from anyone under the age of 13.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Changes to this Privacy Policy</h2>
            <p className="mb-6">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting
              the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy, you can contact us at:
              <br />
              Email: support@offerrush.com
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}