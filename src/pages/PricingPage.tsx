import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check } from 'lucide-react';

export function PricingPage() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Standard',
      price: '₹0',
      period: 'Free Forever',
      description: 'Ideal For Individuals Or Small Team Of Less Than 5 Users. Limited Features',
      features: [
        'Basic task management',
        'Up to 5 users',
        'Basic reporting',
        'Email support'
      ]
    },
    {
      name: 'Pro',
      price: '₹150',
      period: 'Per User/ Month',
      description: 'Best For All Business Types. Ideal For Upto 100 Users.',
      features: [
        'Everything in Standard',
        'Up to 100 users',
        'Advanced analytics',
        'Priority support',
        'Custom workflows',
        'API access'
      ],
      popular: true,
      link: 'https://topmate.io/hirespoof/1422720'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Contact Us',
      description: 'Have Big Enterprise! Ideal For Bigger Team Size.',
      features: [
        'Everything in Pro',
        'Unlimited users',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantees',
        'Custom training'
      ],
      link: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1WLaWrBv8zKbxjMrojixmSRrYHNxh2kUop0_qV3IA2Xz16YLjOPrSfjGlXBBBIld9X3UP9YRo7'
    }
  ];

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
                Task Tracker
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

      {/* Pricing Section */}
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Let's Manage Together</h1>
            <p className="text-xl text-gray-600">No Credit Card Required. Start Free</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden
                  ${plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg text-sm">
                    Recommended
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.link ? (
                    <a
                      href={plan.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      {plan.name === 'Enterprise' ? 'Let\'s Connect' : 'Get Started'}
                    </a>
                  ) : (
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Get Started
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-lg py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>All rights reserved @OrbeeAI By @Offerrush</p>
        </div>
      </footer>
    </div>
  );
}