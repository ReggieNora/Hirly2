import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { DraggableCardContainer, DraggableCardBody } from "./ui/draggable-card";
import { Heart, X } from "lucide-react";

const jobs = [
  {
    company: "Google",
    logo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    title: "Senior Frontend Developer",
    location: "Mountain View, CA (Remote)",
    description: "Build the next generation of web apps with a world-class team. React, TypeScript, and more.",
  },
  {
    company: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    title: "Software Engineer",
    location: "Seattle, WA (Hybrid)",
    description: "Join our cloud and AI team to deliver enterprise solutions at scale.",
  },
  {
    company: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    title: "Full Stack Engineer",
    location: "San Francisco, CA",
    description: "Work on social platforms that connect billions. Node.js, React, GraphQL.",
  },
  {
    company: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    title: "UI Engineer",
    location: "Los Gatos, CA (Remote)",
    description: "Design and build beautiful, performant interfaces for millions of viewers.",
  },
];

const CARD_WIDTH = 340;
const CARD_HEIGHT = 400;

function getRandomLayout(num: number) {
  const baseAngles = [-10, -5, 0, 5, 10, 15, -15];
  const baseXs = [-80, -40, 0, 40, 80, 120, -120];
  const baseYs = [30, 10, 0, 10, 30, 50, 50];
  return Array.from({ length: num }).map((_, i) => ({
    rotate: baseAngles[i % baseAngles.length] + (Math.random() - 0.5) * 8,
    x: baseXs[i % baseXs.length] + (Math.random() - 0.5) * 30,
    y: baseYs[i % baseYs.length] + (Math.random() - 0.5) * 20,
  }));
}

export default function SwipeApp({ onCollapse }: { onCollapse: () => void }) {
  const [stack, setStack] = useState(jobs);
  const [cardLayout, setCardLayout] = useState(() => getRandomLayout(jobs.length));
  const [expanded, setExpanded] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [interested, setInterested] = useState<typeof jobs>([]);
  const [rejected, setRejected] = useState<typeof jobs>([]);
  const [showTutorial, setShowTutorial] = useState(true);
  
  // Create motion values for drag position
  const dragX = useMotionValue(0);
  
  // Transform the drag position into icon animations
  const leftIconScale = useTransform(dragX, [-150, 0], [1.5, 1]);
  const rightIconScale = useTransform(dragX, [0, 150], [1, 1.5]);
  const leftIconOpacity = useTransform(dragX, [-150, 0], [1, 0.3]);
  const rightIconOpacity = useTransform(dragX, [0, 150], [0.3, 1]);

  const handleDismiss = (idx: number, direction: 'left' | 'right') => {
    const job = stack[idx];
    if (direction === 'right') setInterested((prev) => [...prev, job]);
    if (direction === 'left') setRejected((prev) => [...prev, job]);
    setStack((prev) => prev.filter((_, i) => i !== idx));
    setCardLayout((prev) => prev.filter((_, i) => i !== idx));
    // Reset drag position
    dragX.set(0);
  };

  // Reset drag position when stack changes
  useEffect(() => {
    dragX.set(0);
  }, [stack]);

  const handleCollapse = () => {
    setExpanded(false);
    setTimeout(onCollapse, 400);
  };

  const handleReset = () => {
    setStack(jobs);
    setCardLayout(getRandomLayout(jobs.length));
    setInterested([]);
    setRejected([]);
    setResetKey((k) => k + 1);
  };

  return (
    <AnimatePresence>
      {expanded && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
        >
          {/* Tutorial Overlay */}
          <AnimatePresence>
            {showTutorial && (
              <motion.div
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="text-center text-white p-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-2xl font-bold mb-4">How to Swipe</h3>
                  <div className="flex justify-center gap-8 mb-6">
                    <motion.div
                      className="flex flex-col items-center"
                      animate={{ x: [-20, 20, -20] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <X className="w-12 h-12 text-red-500 mb-2" />
                      <span>Swipe Left to Skip</span>
                    </motion.div>
                    <motion.div
                      className="flex flex-col items-center"
                      animate={{ x: [20, -20, 20] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Heart className="w-12 h-12 text-green-500 mb-2" />
                      <span>Swipe Right to Like</span>
                    </motion.div>
                  </div>
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="px-6 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
                  >
                    Got it!
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-8 right-8 flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-white/20 text-white font-semibold shadow hover:bg-white/30 transition"
            >
              Reset
            </button>
            <button
              onClick={handleCollapse}
              className="px-4 py-2 rounded-xl bg-white/20 text-white font-semibold shadow hover:bg-white/30 transition"
            >
              Back to Menu
            </button>
          </div>
          <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
            {/* Animated Swipe Direction Indicators */}
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="text-red-500"
                style={{
                  scale: leftIconScale,
                  opacity: leftIconOpacity,
                }}
              >
                <X className="w-12 h-12" />
              </motion.div>
              <motion.span
                className="text-sm font-medium text-white"
                style={{ opacity: leftIconOpacity }}
              >
                Not Interested
              </motion.span>
            </motion.div>

            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="text-green-500"
                style={{
                  scale: rightIconScale,
                  opacity: rightIconOpacity,
                }}
              >
                <Heart className="w-12 h-12" />
              </motion.div>
              <motion.span
                className="text-sm font-medium text-white"
                style={{ opacity: rightIconOpacity }}
              >
                Interested
              </motion.span>
            </motion.div>

            {stack.length > 0 ? (
              <DraggableCardContainer key={resetKey} className="relative w-[340px] h-[400px]">
                <AnimatePresence>
                  {[...stack].reverse().map((job, index) => {
                    const layout = index === stack.length - 1
                      ? { rotate: 0, x: 0, y: 0 }
                      : cardLayout[index] || { rotate: 0, x: 0, y: 0 };
                    const realIdx = stack.length - 1 - index;
                    return (
                      <DraggableCardBody
                        key={job.company + index}
                        className="absolute left-1/2 top-1/2"
                        onDismiss={(direction) => handleDismiss(realIdx, direction)}
                        onDrag={(x) => dragX.set(x)}
                      >
                        <div
                          style={{
                            width: CARD_WIDTH,
                            height: CARD_HEIGHT,
                            transform: `translate(-50%, -50%) translate(${layout.x}px, ${layout.y}px) rotate(${layout.rotate}deg)`
                          }}
                          className="bg-white/90 border border-gray-200 rounded-lg shadow-2xl flex flex-col items-center justify-between overflow-hidden"
                        >
                          <div className="flex flex-col items-center justify-center w-full h-full p-6">
                            <img src={job.logo} alt={job.company} className="h-14 mb-4" />
                            <h3 className="text-xl font-bold mb-2 text-gray-900">{job.title}</h3>
                            <div className="text-gray-700 font-semibold mb-1">{job.company}</div>
                            <div className="text-gray-500 text-sm mb-3">{job.location}</div>
                            <p className="text-gray-700 text-center text-sm">{job.description}</p>
                          </div>
                        </div>
                      </DraggableCardBody>
                    );
                  })}
                </AnimatePresence>
              </DraggableCardContainer>
            ) : (
              <motion.div
                className="bg-white/90 rounded-2xl shadow-xl p-10 flex flex-col items-center"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No more matches</h2>
                <p className="text-gray-600">Check back later for new opportunities!</p>
                <button
                  onClick={handleCollapse}
                  className="mt-6 px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow hover:from-pink-600 hover:to-purple-600 transition"
                >
                  Back to Menu
                </button>
                <div className="mt-6 text-center">
                  <div className="text-green-600 font-semibold">Interested: {interested.length}</div>
                  <div className="text-red-600 font-semibold">Rejected: {rejected.length}</div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 