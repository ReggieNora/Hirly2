import React, { useState } from 'react';
import hirlyLogo from '../assets/hirly-logo.png';
import { ArrowLeft, LogIn, UserPlus, Eye, EyeOff, Briefcase, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const stackCards = [
  {
    icon: '🔒',
    title: 'Secure Login',
    text: 'Your privacy and security are our top priority.',
  },
  {
    icon: '✨',
    title: 'Welcome Back!',
    text: 'Sign in to discover new opportunities and connections.',
  },
];

const CARD_WIDTH = 400;
const CARD_HEIGHT = 520;

type UserType = 'employer' | 'candidate';

type AuthAction = 'signin' | 'signup';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<UserType>('candidate');
  const [authAction, setAuthAction] = useState<AuthAction>('signin');

  return (
    <div className="min-h-screen w-full bg-gradient-to-tl from-purple-700 via-black to-black flex flex-col items-center justify-center overflow-hidden">
      {/* Top nav */}
      <nav className="flex justify-between items-center w-full px-12 py-6 text-white/90 text-lg gap-10 relative">
        <Link to="/" className="flex items-center group" style={{ textDecoration: 'none' }}>
          <img src={hirlyLogo} alt="Hirly Logo" className="w-24 h-auto drop-shadow-lg transition-transform group-hover:scale-105" style={{ borderRadius: '8px' }} />
        </Link>
        <div className="flex items-center gap-8">
          <a href="/#about" className="hover:text-white transition">About</a>
          <Link to="/pricing" className="hover:text-white transition">Pricing</Link>
          <Link to="/" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> Home
          </Link>
        </div>
      </nav>
      {/* Card Stack */}
      <div className="relative flex items-center justify-center w-full h-[500px] mt-8 mb-16 z-10">
        {/* Background cards for stack aesthetics */}
        {[0, 1].map((index) => {
          const layout = [
            { rotate: -8, x: -80, y: 30 },
            { rotate: 6, x: 80, y: 30 },
          ][index];
          const item = stackCards[index];
          return (
            <div
              key={index}
              className="absolute left-1/2 top-1/2"
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                transform: `translate(-50%, -50%) translate(${layout.x}px, ${layout.y}px) rotate(${layout.rotate}deg)`,
                zIndex: index,
                pointerEvents: 'none',
              }}
            >
              <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl flex flex-col items-center justify-between overflow-hidden w-full h-full p-6">
                <span className="text-5xl mb-4 select-none" aria-hidden>{item.icon}</span>
                <h2 className="text-2xl font-bold text-white mb-3 text-center">{item.title}</h2>
                <p className="text-white/90 text-center whitespace-pre-line text-lg mb-2">{item.text}</p>
              </div>
            </div>
          );
        })}
        {/* Top card with toggle and form */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            zIndex: 2,
          }}
        >
          <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl flex flex-col items-center justify-between overflow-hidden w-full h-full p-6">
            {/* User type toggle/slider */}
            <div className="flex items-center justify-center gap-4 mb-6 w-full">
              <button
                className={`flex-1 px-6 py-2 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold transition-colors ${userType === 'candidate' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-black/30 text-white/60 border border-white/10'}`}
                onClick={() => setUserType('candidate')}
              >
                <User className="w-5 h-5" /> Candidate
              </button>
              <button
                className={`flex-1 px-6 py-2 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold transition-colors ${userType === 'employer' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' : 'bg-black/30 text-white/60 border border-white/10'}`}
                onClick={() => setUserType('employer')}
              >
                <Briefcase className="w-5 h-5" /> Employer
              </button>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 text-center">
              {authAction === 'signin' ? 'Sign In' : 'Sign Up'} as {userType === 'candidate' ? 'Candidate' : 'Employer'}
            </h2>
            <p className="text-white/90 text-center whitespace-pre-line text-lg mb-2">
              {authAction === 'signin' ? 'Enter your credentials to sign in.' : 'Fill out the form to create your account.'}
            </p>
            <form className="w-full flex flex-col gap-4 mt-4">
              <input
                type="email"
                placeholder="Email"
                className="p-3 rounded-xl border border-white/20 bg-black/40 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="p-3 rounded-xl border border-white/20 bg-black/40 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {authAction === 'signup' && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="p-3 rounded-xl border border-white/20 bg-black/40 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              )}
              <Link
                to="/"
                className="mt-2 px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg flex items-center justify-center gap-2 hover:from-pink-600 hover:to-purple-600 transition-colors text-lg"
              >
                {authAction === 'signin' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />} {authAction === 'signin' ? 'Sign In' : 'Sign Up'}
              </Link>
            </form>
            {/* Social Sign-In Buttons */}
            {authAction === 'signin' && (
              <div className="w-full flex flex-col gap-3 mt-6">
                <button className="flex items-center justify-center gap-3 w-full py-2 rounded-xl bg-white/90 hover:bg-white text-gray-800 font-semibold shadow border border-white/30 transition-colors">
                  <span className="inline-block w-6 h-6">
                    {/* Google SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.2 3.6l6.85-6.85C35.9 2.7 30.4 0 24 0 14.82 0 6.73 5.8 2.7 14.1l7.98 6.2C12.2 13.6 17.6 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.6c0-1.6-.14-3.13-.41-4.6H24v9.1h12.4c-.54 2.9-2.2 5.36-4.7 7.04l7.2 5.6C43.7 37.2 46.1 31.5 46.1 24.6z"/><path fill="#FBBC05" d="M10.7 28.7c-1.1-3.2-1.1-6.7 0-9.9l-7.98-6.2C.9 16.2 0 19 0 22c0 3 .9 5.8 2.7 8.4l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.5 0 12-2.1 16.1-5.7l-7.2-5.6c-2 1.4-4.6 2.2-8.9 2.2-6.4 0-11.8-4.3-13.7-10.1l-7.98 6.2C6.7 42.2 14.8 48 24 48z"/></g></svg>
                  </span>
                  Sign in with Google
                </button>
              </div>
            )}
            <div className="mt-8 text-center w-full">
              {authAction === 'signin' ? (
                <span className="text-white/70">New here?{' '}
                  <button className="text-purple-300 hover:underline ml-1" onClick={() => setAuthAction('signup')}>Sign up</button>
                </span>
              ) : (
                <span className="text-white/70">Already have an account?{' '}
                  <button className="text-purple-300 hover:underline ml-1" onClick={() => setAuthAction('signin')}>Sign in</button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 