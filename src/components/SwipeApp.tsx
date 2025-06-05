import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { DraggableCardContainer, DraggableCardBody } from "./ui/draggable-card";
import { Heart, X, MapPin, Clock, DollarSign, Users, Building2, Star, Pointer, RotateCcw } from "lucide-react";

const jobs = [
  {
    company: "Google",
    logo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    title: "Senior Frontend Developer",
    location: "Mountain View, CA (Remote)",
    description: "Build the next generation of web apps with a world-class team. React, TypeScript, and more.",
    salary: "$180,000 - $250,000",
    experience: "5+ years",
    teamSize: "15-20 people",
    matchScore: 92,
    benefits: [
      "Comprehensive health coverage",
      "401(k) matching",
      "Flexible work hours",
      "Remote work options",
      "Professional development budget"
    ],
    requirements: [
      "Expert in React and TypeScript",
      "Strong understanding of web performance",
      "Experience with large-scale applications",
      "Excellent communication skills"
    ],
    techStack: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"]
  },
  {
    company: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    title: "Software Engineer",
    location: "Seattle, WA (Hybrid)",
    description: "Join our cloud and AI team to deliver enterprise solutions at scale.",
    salary: "$160,000 - $220,000",
    experience: "4+ years",
    teamSize: "10-15 people",
    matchScore: 68,
    benefits: [
      "Health, dental, and vision insurance",
      "Stock options",
      "Gym membership",
      "Learning resources",
      "Parental leave"
    ],
    requirements: [
      "Strong background in cloud technologies",
      "Experience with Azure or AWS",
      "Proficiency in C# or Java",
      "Understanding of distributed systems"
    ],
    techStack: ["C#", "Azure", "Kubernetes", "Docker", "SQL Server"]
  },
  {
    company: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    title: "Full Stack Engineer",
    location: "San Francisco, CA",
    description: "Work on social platforms that connect billions. Node.js, React, GraphQL.",
    salary: "$190,000 - $260,000",
    experience: "5+ years",
    teamSize: "20-25 people",
    matchScore: 35,
    benefits: [
      "Competitive salary and equity",
      "Health and wellness programs",
      "Flexible PTO",
      "Remote work options",
      "Learning and development"
    ],
    requirements: [
      "Full-stack development experience",
      "Strong system design skills",
      "Experience with large-scale applications",
      "Excellent problem-solving abilities"
    ],
    techStack: ["React", "Node.js", "GraphQL", "Python", "MySQL"]
  },
  {
    company: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    title: "UI Engineer",
    location: "Los Gatos, CA (Remote)",
    description: "Design and build beautiful, performant interfaces for millions of viewers.",
    salary: "$170,000 - $240,000",
    experience: "4+ years",
    teamSize: "12-18 people",
    matchScore: 78,
    benefits: [
      "Unlimited vacation",
      "Health insurance",
      "Stock options",
      "Remote work flexibility",
      "Professional development"
    ],
    requirements: [
      "Strong UI/UX skills",
      "Experience with modern frontend frameworks",
      "Understanding of performance optimization",
      "Excellent design sense"
    ],
    techStack: ["React", "TypeScript", "CSS-in-JS", "Jest", "Webpack"]
  },
];

const CARD_WIDTH = 340;
const CARD_HEIGHT = 400;

function getMatchColor(score: number) {
  if (score >= 75) return "bg-green-500";
  if (score >= 40) return "bg-yellow-400";
  return "bg-red-500";
}

function getMatchMessage(score: number) {
  if (score >= 75) return { msg: "You're a great match!", icon: <Star className="inline w-5 h-5 text-yellow-400 mb-1" /> };
  if (score >= 40) return { msg: "You're a possible match.", icon: null };
  return { msg: "Skills needed to be compatible", icon: null };
}

const mockMissingSkills = [
  "GraphQL",
  "Advanced System Design",
  "Cloud Infrastructure",
  "Machine Learning Basics"
];

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

function getMatchShadowColor(score: number) {
  if (score >= 75) return '34,197,94'; // green-500
  if (score >= 40) return '250,204,21'; // yellow-400
  return '239,68,68'; // red-500
}

export default function SwipeApp({ onCollapse }: { onCollapse: () => void }) {
  const [stack, setStack] = useState(jobs);
  const [cardLayout, setCardLayout] = useState(() => getRandomLayout(jobs.length));
  const [expanded, setExpanded] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [interested, setInterested] = useState<typeof jobs>([]);
  const [rejected, setRejected] = useState<typeof jobs>([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);
  const [lastDismissed, setLastDismissed] = useState<{ job: typeof jobs[0], direction: 'left' | 'right' } | null>(null);
  
  // Create motion values for drag position
  const dragX = useMotionValue(0);
  
  // Transform the drag position into icon animations
  const leftIconScale = useTransform(dragX, [-150, 0], [1.5, 1]);
  const rightIconScale = useTransform(dragX, [0, 150], [1, 1.5]);
  const leftIconOpacity = useTransform(dragX, [-150, 0], [1, 0.3]);
  const rightIconOpacity = useTransform(dragX, [0, 150], [0.3, 1]);

  const handleDismiss = (idx: number, direction: 'left' | 'right') => {
    const job = stack[idx];
    setLastDismissed({ job, direction });
    if (direction === 'right') setInterested((prev) => [...prev, job]);
    if (direction === 'left') setRejected((prev) => [...prev, job]);
    setStack((prev) => prev.filter((_, i) => i !== idx));
    setCardLayout((prev) => prev.filter((_, i) => i !== idx));
    // Reset drag position
    dragX.set(0);
  };

  const handleRewind = () => {
    if (!lastDismissed) return;
    
    // Remove from the appropriate list
    if (lastDismissed.direction === 'right') {
      setInterested(prev => prev.filter(job => job !== lastDismissed.job));
    } else {
      setRejected(prev => prev.filter(job => job !== lastDismissed.job));
    }
    
    // Add back to the stack
    setStack(prev => [lastDismissed.job, ...prev]);
    setCardLayout(prev => [{ rotate: 0, x: 0, y: 0 }, ...prev]);
    setLastDismissed(null);
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
                  className="text-center text-white p-8 max-w-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-3xl font-bold mb-6">How to Use Swipe</h3>
                  
                  <div className="space-y-8">
                    {/* Swipe Actions */}
                    <div className="flex justify-center gap-8 mb-6">
                      <motion.div
                        className="flex flex-col items-center"
                        animate={{ x: [-20, 20, -20] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <X className="w-12 h-12 text-red-500 mb-2" />
                        <span>Skip</span>
                      </motion.div>
                      <motion.div
                        className="flex flex-col items-center"
                        animate={{ x: [20, -20, 20] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Heart className="w-12 h-12 text-green-500 mb-2" />
                        <span>Like</span>
                      </motion.div>
                    </div>

                    {/* Match Score */}
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-green-500 mb-2" />
                        <span className="text-sm">Great Match</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-yellow-400 mb-2" />
                        <span className="text-sm">Possible Match</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-red-500 mb-2" />
                        <span className="text-sm">Skills Needed</span>
                      </div>
                    </div>

                    {/* Tap for Details */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0, -5, 0]
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 2,
                          times: [0, 0.2, 0.4, 0.6, 1]
                        }}
                      >
                        <Pointer className="w-8 h-8 text-white" />
                      </motion.div>
                      <span>Tap any card to see full details</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowTutorial(false)}
                    className="mt-8 px-8 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition text-lg font-semibold"
                  >
                    Got it!
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Job Details Modal */}
          <AnimatePresence>
            {selectedJob && (
              <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedJob(null)}
              >
                <motion.div
                  className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Match Score Emphasis */}
                  <motion.div
                    className={`absolute right-8 top-8 flex items-center gap-2`}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: [0, 1.2, 1],
                      boxShadow: [
                        `0 0 0 0 rgba(${getMatchShadowColor(selectedJob.matchScore)},0.5)`,
                        `0 0 16px 8px rgba(${getMatchShadowColor(selectedJob.matchScore)},0.3)`,
                        `0 0 0 0 rgba(${getMatchShadowColor(selectedJob.matchScore)},0.0)`
                      ]
                    }}
                    transition={{ duration: 0.8, times: [0, 0.5, 1] }}
                  >
                    <motion.div
                      className={`w-12 h-12 flex items-center justify-center rounded-full text-white text-lg font-bold shadow-lg border-4 border-white ${getMatchColor(selectedJob.matchScore)}`}
                      initial={{ scale: 0 }}
                      animate={{
                        scale: [0, 1.2, 1],
                        boxShadow: [
                          `0 0 0 0 rgba(${getMatchShadowColor(selectedJob.matchScore)},0.5)`,
                          `0 0 16px 8px rgba(${getMatchShadowColor(selectedJob.matchScore)},0.3)`,
                          `0 0 0 0 rgba(${getMatchShadowColor(selectedJob.matchScore)},0.0)`
                        ]
                      }}
                      transition={{ duration: 0.8, times: [0, 0.5, 1] }}
                    >
                      {selectedJob.matchScore}%
                    </motion.div>
                  </motion.div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <img src={selectedJob.logo} alt={selectedJob.company} className="h-12" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                        <p className="text-gray-600">{selectedJob.company}</p>
                      </div>
                    </div>
                  </div>

                  {/* Match Message */}
                  <div className="mb-6 text-center">
                    <span className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
                      {getMatchMessage(selectedJob.matchScore).icon}
                      {getMatchMessage(selectedJob.matchScore).msg}
                    </span>
                    {selectedJob.matchScore < 40 && (
                      <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                        {mockMissingSkills.map((skill, i) => (
                          <li key={i}>{skill}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-5 h-5" />
                      <span>{selectedJob.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <DollarSign className="w-5 h-5" />
                      <span>{selectedJob.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-5 h-5" />
                      <span>{selectedJob.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-5 h-5" />
                      <span>{selectedJob.teamSize}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-700">{selectedJob.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {selectedJob.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.techStack.map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {selectedJob.benefits.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 text-center text-sm text-gray-500">
                    Tap anywhere outside to close
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-8 right-8 flex gap-2">
            {lastDismissed && (
              <motion.button
                onClick={handleRewind}
                className="px-4 py-2 rounded-xl bg-white/20 text-white font-semibold shadow hover:bg-white/30 transition flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-5 h-5" />
                Rewind
              </motion.button>
            )}
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
                        onTap={() => setSelectedJob(job)}
                      >
                        <div
                          style={{
                            width: CARD_WIDTH,
                            height: CARD_HEIGHT,
                            transform: `translate(-50%, -50%) translate(${layout.x}px, ${layout.y}px) rotate(${layout.rotate}deg)`
                          }}
                          className="bg-white/90 border border-gray-200 rounded-lg shadow-2xl flex flex-col items-center justify-between overflow-hidden relative"
                        >
                          {/* Match Score Indicator */}
                          <motion.div
                            className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold text-white shadow border-2 border-white ${getMatchColor(job.matchScore)}`}
                            title={`Match Score: ${job.matchScore}%`}
                            initial={{ scale: 0 }}
                            animate={{
                              scale: [0, 1.2, 1],
                              boxShadow: [
                                `0 0 0 0 rgba(${getMatchShadowColor(job.matchScore)},0.5)`,
                                `0 0 12px 6px rgba(${getMatchShadowColor(job.matchScore)},0.3)`,
                                `0 0 0 0 rgba(${getMatchShadowColor(job.matchScore)},0.0)`
                              ]
                            }}
                            transition={{ duration: 0.7, times: [0, 0.5, 1] }}
                          >
                            {job.matchScore}%
                          </motion.div>
                          <div className="flex flex-col items-center justify-center w-full h-full p-6">
                            <img src={job.logo} alt={job.company} className="h-14 mb-4" />
                            <h3 className="text-xl font-bold mb-2 text-gray-900">{job.title}</h3>
                            <div className="text-gray-700 font-semibold mb-1">{job.company}</div>
                            <div className="text-gray-500 text-sm mb-3">{job.location}</div>
                            <p className="text-gray-700 text-center text-sm mb-4">{job.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{job.salary}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{job.experience}</span>
                              </div>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                              Tap for more details
                            </div>
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