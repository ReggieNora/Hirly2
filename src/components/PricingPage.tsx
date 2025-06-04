import React, { useState } from 'react';
import hirlyLogo from '../assets/hirly-logo.png';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    title: 'Job Seekers',
    price: 'Free',
    description: 'Always free for candidates. No hidden fees, no paywalls, just opportunities.',
    features: [
      'Unlimited job matching',
      'Direct messaging',
      'AI-powered profile',
      'No credit card required',
    ],
    highlight: true,
  },
  {
    title: 'Employers (Pro)',
    price: '$149/mo',
    description: 'Full access for hiring teams. First 100 founders get $99/mo for life.',
    features: [
      'Unlimited candidate matches',
      'Direct outreach',
      'AI-powered screening',
      'Team collaboration',
      'Priority support',
    ],
    note: 'First 100 founders: $99/mo',
    highlight: false,
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    description: 'For large teams or custom integrations. Contact us for a tailored solution.',
    features: [
      'Custom integrations',
      'Dedicated support',
      'Advanced analytics',
      'White-label options',
    ],
    contact: 'sales@hirly.io',
    highlight: false,
  },
];

const PricingPage: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen w-full bg-gradient-to-tl from-purple-700 via-black to-black flex flex-col items-center justify-center overflow-hidden">
      {/* Top nav */}
      <nav className="flex justify-between items-center w-full px-12 py-6 text-white/90 text-lg gap-10 relative">
        <Link to="/" className="flex items-center group" style={{ textDecoration: 'none' }}>
          <img src={hirlyLogo} alt="Hirly Logo" className="w-24 h-auto drop-shadow-lg transition-transform group-hover:scale-105" style={{ borderRadius: '8px' }} />
        </Link>
        <div className="flex items-center gap-8">
          <a href="/#about" className="hover:text-white transition">About</a>
          <Link to="/pricing" className="hover:text-white transition font-bold underline underline-offset-4">Pricing</Link>
          <Link to="/" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Home
          </Link>
        </div>
      </nav>
      {/* Pricing Cards */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 mt-8 mb-16 z-10">
        {plans.map((plan, idx) => (
          <div
            key={plan.title}
            onClick={() => setSelected(idx)}
            className={`backdrop-blur-xl bg-black/60 border border-white/20 rounded-2xl shadow-2xl flex flex-col items-center justify-between p-8 w-[320px] min-h-[420px] relative cursor-pointer transition-all duration-200
              ${plan.highlight ? 'ring-2 ring-purple-400' : ''}
              ${selected === idx ? 'ring-4 ring-purple-500 shadow-[0_0_32px_4px_rgba(168,85,247,0.3)] scale-105 z-20' : ''}`}
          >
            <h2 className="text-2xl font-bold text-white mb-2 text-center">{plan.title}</h2>
            <div className="text-4xl font-extrabold text-purple-300 mb-2 text-center">{plan.price}</div>
            <div className="text-white/80 mb-4 text-center text-base">{plan.description}</div>
            <ul className="mb-6 space-y-2 w-full">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-white/90 text-base">
                  <CheckCircle className="w-4 h-4 text-purple-400" /> {feature}
                </li>
              ))}
            </ul>
            {plan.note && <div className="text-xs text-purple-300 mb-2 text-center">{plan.note}</div>}
            {plan.title === 'Employers (Pro)' && (
              <button className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg flex items-center justify-center gap-2 hover:from-pink-600 hover:to-purple-600 transition-colors text-lg">
                Subscribe to Pro
              </button>
            )}
            {plan.contact && (
              <a href={`mailto:${plan.contact}`} className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg flex items-center gap-2 hover:from-pink-600 hover:to-purple-600 transition-colors">
                <Mail className="w-4 h-4" /> Contact Sales
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage; 