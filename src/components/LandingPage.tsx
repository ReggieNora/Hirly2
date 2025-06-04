import React, { useState } from 'react';
import { ArrowRight, UserPlus, LogIn, RotateCcw } from 'lucide-react';
import { DraggableCardBody, DraggableCardContainer } from './ui/draggable-card';

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

const CARD_LAYOUT = [
  { rotate: -10, x: -80, y: 30 },
  { rotate: -5, x: -40, y: 10 },
  { rotate: 0, x: 0, y: 0 },
  { rotate: 5, x: 40, y: 10 },
  { rotate: 10, x: 80, y: 30 },
  { rotate: 15, x: 120, y: 50 },
  { rotate: -15, x: -120, y: 50 },
];

const CARD_WIDTH = 340;
const CARD_HEIGHT = 400;

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
          {[...CARD_STACK].reverse().map((item, index) => {
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