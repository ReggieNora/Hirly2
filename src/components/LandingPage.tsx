import React, { useState } from 'react';
import { ArrowRight, UserPlus, LogIn, Star, Quote, Briefcase, Users, Shield, Sparkles, MessageCircle, Globe, CheckCircle } from 'lucide-react';
import CardSwap, { Card } from './CardSwap';
import GradientText from './GradientText';
import { motion } from 'framer-motion';
import Waves from './Waves';
import AboutPage from './AboutPage';

interface LandingPageProps {
  onAuthSuccess: (userType: 'candidate' | 'employer') => void;
}

const carouselCards = [
  {
    title: 'Swipe to find',
    subtitle: 'New opportunities',
    description: 'Browse through curated job matches tailored to your skills and preferences.',
  },
  {
    title: 'Who is it for?',
    subtitle: '',
    description: 'Hirly is for job seekers and employers who want a fast, modern, and AI-powered hiring experience.',
  },
  {
    title: 'How it works',
    subtitle: '',
    description: 'Create a profile, swipe through jobs or candidates, and connect instantly. Our AI matches you with the best opportunities.',
  },
  {
    title: 'Ready to get started?',
    subtitle: '',
    description: 'Sign up now to unlock your next opportunity!',
    cta: true,
  },
];

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
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userType, setUserType] = useState<'candidate' | 'employer'>('candidate');
  const [showAbout, setShowAbout] = useState(false);

  const nextCard = () => setCarouselIndex((i) => (i + 1) % carouselCards.length);
  const prevCard = () => setCarouselIndex((i) => (i - 1 + carouselCards.length) % carouselCards.length);

  // Simulate authentication
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSignUp(false);
    setShowLogin(false);
    onAuthSuccess(userType);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Animated Waves Background */}
      <Waves
        lineColor="#a78bfa"
        backgroundColor="rgba(30, 0, 50, 0.8)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
        style={{ zIndex: 0 }}
      />
      {/* Foreground Content Wrapper */}
      <div className="relative z-10">
        {showAbout ? (
          <AboutPage onBack={() => setShowAbout(false)} />
        ) : (
        <>
        {/* Top Nav */}
        <nav className="flex justify-end items-center px-12 py-6 text-white/90 text-lg gap-10">
          <button type="button" onClick={() => setShowAbout(true)} className="hover:text-white transition bg-transparent border-0 outline-none cursor-pointer">About</button>
          <a href="#how" className="hover:text-white transition">How It Works</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <button onClick={() => setShowLogin(true)} className="ml-8 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center gap-2"><LogIn className="w-5 h-5" /> Login</button>
        </nav>

        {/* Hero Section */}
        <div className="relative flex-1 flex flex-row items-center justify-end" style={{ minHeight: 600 }}>
          {/* Blurred Background Text on the left */}
          <div className="flex-1 flex flex-col items-start justify-center z-0 select-none pointer-events-none pl-0 ml-0">
            <GradientText
              colors={["#6a11cb", "#2575fc", "#3a1859", "#6a11cb", "#1e215d"]}
              animationSpeed={8}
              className="text-[18vw] font-extrabold tracking-tight text-left -ml-8"
            >
              HIRLY
            </GradientText>
          </div>
          {/* CardSwap Animated Card Stack on the right */}
          <div className="relative z-10 flex flex-col items-center mr-[5vw] -mt-24" style={{ height: 600, position: 'relative' }}>
            <CardSwap cardDistance={60} verticalDistance={70} delay={5000} pauseOnHover={false}>
              <Card>
                <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl">
                  <h2 className="text-3xl font-bold text-white mb-2">Swipe to find</h2>
                  <h3 className="text-2xl text-white/70 mb-2">New opportunities</h3>
                  <p className="text-white/80 text-lg mb-6">Browse through curated job matches tailored to your skills and preferences.</p>
                </div>
              </Card>
              <Card>
                <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl">
                  <h2 className="text-3xl font-bold text-white mb-2">Who is it for?</h2>
                  <p className="text-white/80 text-lg mb-6">Hirly is for job seekers and employers who want a fast, modern, and AI-powered hiring experience.</p>
                </div>
              </Card>
              <Card>
                <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl">
                  <h2 className="text-3xl font-bold text-white mb-2">How it works</h2>
                  <p className="text-white/80 text-lg mb-6">Create a profile, swipe through jobs or candidates, and connect instantly. Our AI matches you with the best opportunities.</p>
                </div>
              </Card>
              <Card>
                <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl">
                  <h2 className="text-3xl font-bold text-white mb-2">Ready to get started?</h2>
                  <p className="text-white/80 text-lg mb-6">Sign up now to unlock your next opportunity!</p>
                  <button
                    className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold shadow-lg flex items-center gap-2 hover:from-pink-600 hover:to-red-600 transition-colors"
                    onClick={() => setShowSignUp(true)}
                  >
                    <UserPlus className="w-5 h-5" /> Sign Up Now <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>

        {/* Testimonials Section */}
        <section className="py-24 px-8 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-10">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20 shadow-lg flex flex-col items-center">
              <Quote className="w-8 h-8 text-pink-400 mb-4" />
              <p className="text-white/80 mb-4">"Hirly matched me with my dream job in days. The process was smooth and actually fun!"</p>
              <div className="flex items-center gap-2">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Testimonial" className="w-10 h-10 rounded-full border-2 border-pink-400" />
                <span className="text-white/70 font-semibold">Alex J.</span>
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20 shadow-lg flex flex-col items-center">
              <Quote className="w-8 h-8 text-blue-400 mb-4" />
              <p className="text-white/80 mb-4">"We found top talent for our startup faster than ever. The AI recommendations are spot on."</p>
              <div className="flex items-center gap-2">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Testimonial" className="w-10 h-10 rounded-full border-2 border-blue-400" />
                <span className="text-white/70 font-semibold">Chris T.</span>
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20 shadow-lg flex flex-col items-center">
              <Quote className="w-8 h-8 text-green-400 mb-4" />
              <p className="text-white/80 mb-4">"The privacy features and instant messaging made my job search stress-free. Highly recommend!"</p>
              <div className="flex items-center gap-2">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Testimonial" className="w-10 h-10 rounded-full border-2 border-green-400" />
                <span className="text-white/70 font-semibold">Maya P.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Facts Section (Animated Infographic) */}
        <section className="py-16 px-8 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-10">Job Hunting by the Numbers</h2>
          <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
            <AnimatedStat icon={Briefcase} value={80} label="of jobs are never posted online" color="text-purple-400" />
            <AnimatedStat icon={Users} value={2} label="faster hiring with AI matching" color="text-blue-400" />
            <AnimatedStat icon={Globe} value={50} label="countries with active users" color="text-green-400" />
          </div>
        </section>

        {/* Why Us Section */}
        <section className="py-24 px-8 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-10">Why Choose Hirly?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20 shadow-lg flex flex-col items-center">
              <Sparkles className="w-10 h-10 text-pink-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">AI Matching</h3>
              <p className="text-white/70">Get matched with jobs and candidates that fit your skills and goals.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20 shadow-lg flex flex-col items-center">
              <MessageCircle className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Instant Messaging</h3>
              <p className="text-white/70">Connect and chat instantly with employers or candidates.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20 shadow-lg flex flex-col items-center">
              <Shield className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Privacy First</h3>
              <p className="text-white/70">Your data is secure and you control your visibility at all times.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20 shadow-lg flex flex-col items-center">
              <CheckCircle className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Modern Design</h3>
              <p className="text-white/70">Enjoy a beautiful, intuitive interface on any device.</p>
            </div>
          </div>
        </section>

        {/* Awesome Features Section */}
        <section className="py-24 px-8 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-10">Awesome Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20 shadow-lg flex flex-col items-center">
              <Sparkles className="w-10 h-10 text-pink-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">AI Coach for All</h3>
              <p className="text-white/70">Personalized AI coaching for both candidates and employers: get interview prep, resume tips, smart screening, and hiring insights.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20 shadow-lg flex flex-col items-center">
              <CheckCircle className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Free Forever for Job Hunters</h3>
              <p className="text-white/70">Job seekers can use Hirly for free—always. No hidden fees, no paywalls, just opportunities.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20 shadow-lg flex flex-col items-center">
              <Sparkles className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Modern UI</h3>
              <p className="text-white/70">Enjoy a beautiful, intuitive interface that makes job hunting and hiring a pleasure on any device.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20 shadow-lg flex flex-col items-center">
              <MessageCircle className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Ghosting Policy</h3>
              <p className="text-white/70">We encourage transparency and communication. Get notified if a match is no longer interested—no more wondering.</p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-8 max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 shadow-2xl flex flex-col items-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to experience the future of job hunting?</h2>
            <p className="text-white/80 text-lg mb-8">Sign up now and join thousands of candidates and employers using Hirly to find their perfect match.</p>
            <button
              className="px-8 py-4 rounded-xl bg-white text-pink-600 font-bold text-lg shadow-lg hover:bg-pink-100 transition-colors"
              onClick={() => setShowSignUp(true)}
            >
              Get Started Free
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full bg-white/10 border-t border-white/20 py-10 px-8 mt-16">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-pink-400" />
              <span className="text-2xl font-bold text-white tracking-wide">Hirly</span>
            </div>
            <div className="flex gap-8 text-white/70 text-sm">
              <a href="#about" className="hover:text-white transition">About</a>
              <a href="#pricing" className="hover:text-white transition">Pricing</a>
              <a href="#" className="hover:text-white transition">Contact</a>
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
                    </div>
            <div className="text-white/40 text-xs">&copy; {new Date().getFullYear()} Hirly. All rights reserved.</div>
                  </div>
        </footer>

        {/* Authentication Modals (placeholders) */}
        {showSignUp && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setShowSignUp(false)}>&times;</button>
              <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
              {/* Sign Up Form Placeholder */}
              <form className="flex flex-col gap-4" onSubmit={handleAuth}>
                <input type="email" placeholder="Email" className="p-3 rounded-xl border border-gray-200" required />
                <input type="password" placeholder="Password" className="p-3 rounded-xl border border-gray-200" required />
                <div className="flex gap-4 items-center justify-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="candidate"
                      checked={userType === 'candidate'}
                      onChange={() => setUserType('candidate')}
                      className="accent-pink-500"
                    />
                    <span>Candidate</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="employer"
                      checked={userType === 'employer'}
                      onChange={() => setUserType('employer')}
                      className="accent-pink-500"
                    />
                    <span>Employer</span>
                  </label>
                </div>
                <button type="submit" className="py-3 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold shadow-lg">Create Account</button>
              </form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <button className="text-pink-500 hover:underline" onClick={() => { setShowSignUp(false); setShowLogin(true); }}>Log in</button>
              </div>
                    </div>
                  </div>
        )}
        {showLogin && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setShowLogin(false)}>&times;</button>
              <h2 className="text-2xl font-bold mb-4">Log In</h2>
              {/* Login Form Placeholder */}
              <form className="flex flex-col gap-4" onSubmit={handleAuth}>
                <input type="email" placeholder="Email" className="p-3 rounded-xl border border-gray-200" required />
                <input type="password" placeholder="Password" className="p-3 rounded-xl border border-gray-200" required />
                <div className="flex gap-4 items-center justify-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="candidate"
                      checked={userType === 'candidate'}
                      onChange={() => setUserType('candidate')}
                      className="accent-pink-500"
                    />
                    <span>Candidate</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="employer"
                      checked={userType === 'employer'}
                      onChange={() => setUserType('employer')}
                      className="accent-pink-500"
                    />
                    <span>Employer</span>
                  </label>
                </div>
                <button type="submit" className="py-3 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold shadow-lg">Log In</button>
              </form>
              <div className="mt-4 text-center text-sm">
                New here?{' '}
                <button className="text-pink-500 hover:underline" onClick={() => { setShowLogin(false); setShowSignUp(true); }}>Create an account</button>
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
};

export default LandingPage; 