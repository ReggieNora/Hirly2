import React, { useState } from 'react';
import { ArrowRight, UserPlus, LogIn, RotateCcw, Twitter, Linkedin, Github } from 'lucide-react';
import { DraggableCardBody, DraggableCardContainer } from './ui/draggable-card';
import hirlyLogo from '../assets/hirly-logo.png';

interface LandingPageProps {
  onAuthSuccess: (userType: 'candidate' | 'employer') => void;
}

const CARD_STACK = [
  {
    icon: '🎯',
    title: 'Hirly',
    text: 'Work that finds you.\n\nSmart matches. Human-first hiring.',
  },
  {
    icon: '📸',
    title: 'Not a Resume. A Real Story.',
    text: "You're more than a bullet list.\nHirly captures your whole vibe -- not just your job titles.",
  },
  {
    icon: '🔁',
    title: 'Matching, Not Searching',
    text: 'Stop scrolling. Start matching.\nWe pair you with people and places where you belong.',
  },
  {
    icon: '📱',
    title: 'Sleek. Simple. Swipe.',
    text: 'Our modern UI makes hiring feel like a convo, not a chore.\nClean cards. Clear paths. No clutter.',
  },
  {
    icon: '💬',
    title: 'Personality Over Paper',
    text: 'Culture fit > checkbox fit.\nWe focus on chemistry, not just credentials.',
  },
  {
    icon: '🛠️',
    title: 'Built by Creatives, Not Corporates',
    text: 'Hirly is made by makers --\nFor people who hire with heart, not templates.',
  },
  {
    icon: '🚀',
    title: 'Ready to stop applying and start aligning?',
    text: '',
    cta: true,
  },
];

const CARD_WIDTH = 340;
const CARD_HEIGHT = 400;

function getRandomLayout(num: number) {
  // Spread cards in a fan, but randomize rotation and offset a bit
  const baseAngles = [-10, -5, 0, 5, 10, 15, -15];
  const baseXs = [-80, -40, 0, 40, 80, 120, -120];
  const baseYs = [30, 10, 0, 10, 30, 50, 50];
  return Array.from({ length: num }).map((_, i) => ({
    rotate: baseAngles[i % baseAngles.length] + (Math.random() - 0.5) * 8, // ±4 deg
    x: baseXs[i % baseXs.length] + (Math.random() - 0.5) * 30, // ±15 px
    y: baseYs[i % baseYs.length] + (Math.random() - 0.5) * 20, // ±10 px
  }));
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuthSuccess }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userType, setUserType] = useState<'candidate' | 'employer'>('candidate');
  const [resetKey, setResetKey] = useState(0);
  const [cardLayout, setCardLayout] = useState(() => getRandomLayout(CARD_STACK.length));

  // Reset cards by changing the key on the container and randomizing layout
  const handleReset = () => {
    setResetKey(k => k + 1);
    setCardLayout(getRandomLayout(CARD_STACK.length));
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-12 py-6 text-white/90 text-lg gap-10 relative">
        {/* Logo in upper left */}
        <a href="/" className="flex items-center group" style={{ textDecoration: 'none' }}>
          <img src={hirlyLogo} alt="Hirly Logo" className="w-24 h-auto drop-shadow-lg transition-transform group-hover:scale-105" style={{ borderRadius: '8px' }} />
        </a>
        <div className="flex items-center gap-8">
          <a href="#about" className="hover:text-white transition">About</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <button onClick={() => setShowLogin(true)} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center gap-2">
            <LogIn className="w-5 h-5" /> Login / Sign Up
          </button>
          <div className="flex gap-4 text-white/70 text-xl ml-4">
            <a href="#" className="hover:text-white transition" aria-label="Twitter"><Twitter /></a>
            <a href="#" className="hover:text-white transition" aria-label="LinkedIn"><Linkedin /></a>
            <a href="#" className="hover:text-white transition" aria-label="GitHub"><Github /></a>
          </div>
        </div>
      </nav>
      {/* Centered Card Stack */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Hidden Reset Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 left-4 opacity-30 hover:opacity-80 transition-opacity z-20 p-2 rounded-full bg-neutral-800"
          title="Reset Cards"
          style={{ marginLeft: '72px' }}
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </button>
        <DraggableCardContainer key={resetKey} className="relative flex items-center justify-center w-full h-full" >
          {[...CARD_STACK].reverse().map((item, index) => {
            // The top card (Hirly, target icon) is the last in the reversed array
            const isHero = (CARD_STACK.length - 1 - index) === 0;
            const layout = isHero
              ? { rotate: 0, x: 0, y: 0 }
              : cardLayout[index] || { rotate: 0, x: 0, y: 0 };
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
                  className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl flex flex-col items-center justify-between overflow-hidden"
                >
                  <div className="flex flex-col items-center justify-center w-full h-full p-6">
                    <span className="text-5xl mb-4 select-none" aria-hidden>{item.icon}</span>
                    <h2 className="text-2xl font-bold text-white mb-3 text-center">{item.title}</h2>
                    {item.text && (
                      <p className="text-white/90 text-center whitespace-pre-line text-lg">{item.text}</p>
                    )}
                    {item.cta && (
                      <button
                        className="mt-8 px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg flex items-center justify-center gap-2 hover:from-pink-600 hover:to-purple-600 transition-colors"
                        onClick={() => setShowSignUp(true)}
                      >
                        <UserPlus className="w-5 h-5" /> Get Started <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
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