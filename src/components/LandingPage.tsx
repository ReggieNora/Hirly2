import React, { useState } from 'react';
import { ArrowRight, UserPlus, LogIn, Star, Quote, Briefcase, Users, Shield, Sparkles, MessageCircle, Globe, CheckCircle, RotateCcw } from 'lucide-react';
import CardSwap, { Card } from './CardSwap';
import GradientText from './GradientText';
import { motion } from 'framer-motion';
import Waves from './Waves';
import AboutPage from './AboutPage';
import { DraggableCardBody, DraggableCardContainer } from './ui/draggable-card';

interface LandingPageProps {
  onAuthSuccess: (userType: 'candidate' | 'employer') => void;
}

const CARD_STACK = [
  {
    title: "Welcome to Hirly",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3540&auto=format&fit=crop",
  },
  {
    title: "Find Your Dream Job",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=3540&auto=format&fit=crop",
  },
  {
    title: "Hire Top Talent",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=3540&auto=format&fit=crop",
  },
  {
    title: "AI-Powered Matching",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=3540&auto=format&fit=crop",
  },
  {
    title: "Real-Time Chat",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=3540&auto=format&fit=crop",
  },
  {
    title: "Privacy First",
    image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=3540&auto=format&fit=crop",
  },
  {
    title: "Global Reach",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3540&auto=format&fit=crop",
  },
];

// Polaroid-style offsets and rotations for the stack
const CARD_LAYOUT = [
  { rotate: -10, x: -80, y: 30 },
  { rotate: -5, x: -40, y: 10 },
  { rotate: 0, x: 0, y: 0 },
  { rotate: 5, x: 40, y: 10 },
  { rotate: 10, x: 80, y: 30 },
  { rotate: 15, x: 120, y: 50 },
  { rotate: -15, x: -120, y: 50 },
];

const CARD_WIDTH = 320;
const CARD_HEIGHT = 380;

// Animated Stat Circle component
const AnimatedStat = ({ icon: Icon, value, label, color }: { icon: any, value: number, label: string, color: string }) => {
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);
  return (
    <div ref={ref} className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, type: 'spring' }}
        className="relative mb-4"
      >
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="48" stroke="#22223b" strokeWidth="10" fill="none" />
          <motion.circle
            cx="55" cy="55" r="48" stroke={color} strokeWidth="10" fill="none"
            strokeDasharray={2 * Math.PI * 48}
            strokeDashoffset={inView ? 2 * Math.PI * 48 * (1 - value / 100) : 2 * Math.PI * 48}
            strokeLinecap="round"
            initial={false}
            animate={{ strokeDashoffset: inView ? 2 * Math.PI * 48 * (1 - value / 100) : 2 * Math.PI * 48 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          />
        </svg>
        <Icon className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 ${color}`} />
      </motion.div>
      <motion.span
        className="text-4xl font-bold text-white mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        {inView ? value : 0}
        {label === 'countries with active users' ? '+' : label === 'faster hiring with AI matching' ? 'x' : '%'}
      </motion.span>
      <span className="text-white/70 text-lg text-center max-w-[160px]">{label}</span>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onAuthSuccess }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userType, setUserType] = useState<'candidate' | 'employer'>('candidate');
  const [resetKey, setResetKey] = useState(0);

  // Reset cards by changing the key on the container
  const handleReset = () => setResetKey(k => k + 1);

  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-end items-center px-12 py-6 text-white/90 text-lg gap-10">
        <button onClick={() => setShowLogin(true)} className="ml-8 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center gap-2">
          <LogIn className="w-5 h-5" /> Login
        </button>
      </nav>
      {/* Centered Card Stack */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Hidden Reset Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 left-4 opacity-30 hover:opacity-80 transition-opacity z-20 p-2 rounded-full bg-neutral-800"
          title="Reset Cards"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </button>
        <DraggableCardContainer key={resetKey} className="relative flex items-center justify-center w-full h-full" >
          {CARD_STACK.map((item, index) => {
            const layout = CARD_LAYOUT[index] || { rotate: 0, x: 0, y: 0 };
            return (
              <DraggableCardBody
                key={index}
                className={`absolute left-1/2 top-1/2`}
              >
                <div
                  style={{
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                    transform: `translate(-50%, -50%) translate(${layout.x}px, ${layout.y}px) rotate(${layout.rotate}deg)`
                  }}
                  className="bg-neutral-900 border-8 border-black rounded-lg shadow-2xl flex flex-col items-center justify-between overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[80%] object-cover bg-black"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="w-full h-[20%] flex flex-col items-center justify-center">
                    <span className="text-white text-lg font-bold mt-2 mb-2 text-center">
                      {item.title}
                    </span>
                  </div>
                </div>
              </DraggableCardBody>
            );
          })}
        </DraggableCardContainer>
        {/* Call to Action Section */}
        <div className="mt-12 flex flex-col items-center justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to join Hirly?</h2>
          <p className="text-white/80 mb-6 text-center max-w-md">Sign up or log in to start matching with top jobs and talent, powered by AI and a modern experience.</p>
          <button
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg flex items-center gap-2 hover:from-pink-600 hover:to-purple-600 transition-colors mx-auto"
            onClick={() => setShowSignUp(true)}
          >
            <UserPlus className="w-5 h-5" /> Sign Up or Log In <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 