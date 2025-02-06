import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Footer } from '../components/Footer';

export function TermsPage() {
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
          <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
          <div className="prose prose-blue max-w-none">
            <p className="text-sm text-gray-500 mb-8">Last Updated: February 06, 2025</p>

            <p className="mb-6">
              Please read these terms and conditions carefully before using Our Service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Interpretation and Definitions</h2>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Interpretation</h3>
            <p className="mb-4">
              The words of which the initial letter is capitalized have meanings defined under the following conditions.
              The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>

            <h3 className="text-lg font-medium mt-6 mb-3">Definitions</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Company:</strong> Refers to OrbeeAI.</li>
              <li><strong>Country:</strong> Refers to Rajasthan, India.</li>
              <li><strong>Device:</strong> Any device that can access the Service.</li>
              <li><strong>Service:</strong> Refers to the Website.</li>
              <li><strong>Terms and Conditions:</strong> These terms and conditions that form the entire agreement between You and the Company.</li>
              <li><strong>Website:</strong> OrbeeAI, accessible at https://orbeeai.vercel.app/</li>
              <li><strong>You:</strong> The individual accessing or using the Service.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">Acknowledgment</h2>
            <p className="mb-6">
              These are the Terms and Conditions governing the use of this Service and the agreement that operates
              between You and the Company. These Terms set out the rights and obligations of all users regarding
              the use of the Service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Links to Other Websites</h2>
            <p className="mb-6">
              Our Service may contain links to third-party websites or services that are not owned or controlled
              by the Company. The Company has no control over, and assumes no responsibility for, the content,
              privacy policies, or practices of any third-party websites or services.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Termination</h2>
            <p className="mb-6">
              We may terminate or suspend Your access immediately, without prior notice or liability, for any
              reason whatsoever, including without limitation if You breach these Terms.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
            <p className="mb-6">
              To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers
              be liable for any special, incidental, indirect, or consequential damages whatsoever.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p className="mb-6">
              If you have any questions about these Terms and Conditions, you can contact us at:
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