import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Users, MessageSquare, BarChart2, Settings, Briefcase, Building2 } from 'lucide-react';
import ProfileCard from './components/ProfileCard';
import MessagesCard from './components/MessagesCard';
import SettingsCard from './components/SettingsCard';
import ActionButtons from './components/ActionButtons';
import Dashboard from './components/Dashboard';
import CoachCard from './components/CoachCard';
import Iridescence from './components/Iridescence';
import CompanyProfileCard from './components/CompanyProfileCard';
import LandingPage from './components/LandingPage';
import JobCard from './components/JobCard';
import AboutPage from './components/AboutPage';
import BentoMainMenu from './components/BentoMainMenu';

function App() {
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'employer' | null>(null);
  const [userType, setUserType] = useState<'candidate' | 'employer' | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [savedCandidates, setSavedCandidates] = useState<typeof candidateProfiles>([]);
  const [interestedCandidates, setInterestedCandidates] = useState<typeof candidateProfiles>([]);
  const [savedJobs, setSavedJobs] = useState<typeof jobListings>([]);
  const [appliedJobs, setAppliedJobs] = useState<typeof jobListings>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Job listings data
  const jobListings = [
    {
      company: "Google",
      title: "Senior Frontend Developer",
      location: "Mountain View, CA (Remote)",
      type: "Full-time",
      salary: "$120k - $180k",
      posted: "2 days ago",
      logo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      requirements: [
        "5+ years of React experience",
        "Strong TypeScript skills",
        "Experience with large-scale applications",
        "Bachelor's degree in CS or related field"
      ],
      description: "Join our team to build the next generation of web applications. You'll work with cutting-edge technologies and collaborate with world-class engineers to create products that impact millions of users.",
      benefits: [
        "Competitive salary and equity",
        "Comprehensive health coverage",
        "Flexible work arrangements",
        "Professional development budget"
      ]
    },
    {
      company: "Meta",
      title: "Full Stack Engineer",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$130k - $190k",
      posted: "1 day ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png",
      requirements: [
        "4+ years of full stack development",
        "Experience with React and Node.js",
        "Strong system design skills",
        "Bachelor's degree in CS or related field"
      ],
      description: "Build and scale the next generation of social media platforms. Work on challenging problems that impact billions of users worldwide.",
      benefits: [
        "Competitive compensation",
        "Health and wellness benefits",
        "Remote work options",
        "Learning and development"
      ]
    },
    {
      company: "Microsoft",
      title: "Software Engineer",
      location: "Seattle, WA (Hybrid)",
      type: "Full-time",
      salary: "$110k - $170k",
      posted: "3 days ago",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2560px-Microsoft_logo.svg.png",
      requirements: [
        "3+ years of software development",
        "Experience with C# and .NET",
        "Cloud platform knowledge",
        "Bachelor's degree in CS or related field"
      ],
      description: "Join our team to build enterprise solutions that help businesses transform and grow in the digital age.",
      benefits: [
        "Competitive salary",
        "Health insurance",
        "401(k) matching",
        "Professional development"
      ]
    }
  ];

  // All candidate profiles
  const candidateProfiles = [
    {
      avatarSrc: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Alex Johnson",
      title: "Front-End Developer",
      skills: ["React", "Tailwind", "Figma"],
    },
    {
      avatarSrc: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Jordan Rivers",
      title: "Product Designer",
      skills: ["UX", "Sketch", "Notion", "Adobe XD"],
    },
    {
      avatarSrc: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Sam Chen",
      title: "Backend Engineer",
      skills: ["Node.js", "Python", "AWS", "MongoDB"],
    },
    {
      avatarSrc: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Maya Patel",
      title: "Full Stack Developer",
      skills: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    },
    {
      avatarSrc: "https://images.pexels.com/photos/2406949/pexels-photo-2406949.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Chris Taylor",
      title: "DevOps Engineer",
      skills: ["Docker", "Kubernetes", "CI/CD", "Terraform"],
    }
  ];

  // Sample messages data
  const messagesData = [
    {
      id: '1',
      avatarSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Sarah Miller",
      preview: "Hey, I checked out your latest design...",
      timestamp: "2m ago"
    },
    {
      id: '2',
      avatarSrc: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "David Chen",
      preview: "The project looks great! When can we...",
      timestamp: "1h ago"
    },
    {
      id: '3',
      avatarSrc: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Emma Wilson",
      preview: "Thanks for the feedback on the...",
      timestamp: "3h ago"
    },
    {
      id: '4',
      avatarSrc: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Michael Brown",
      preview: "Let's schedule a call to discuss...",
      timestamp: "5h ago"
    }
  ];

  const handleSwipeStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleSwipeMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;
    
    if (Math.abs(diff) > 50) {
      setSwipeDirection(diff > 0 ? 'right' : 'left');
    }
  };

  const handleSwipeEnd = () => {
    if (swipeDirection === 'left') {
      handleNext();
    } else if (swipeDirection === 'right') {
      handlePrevious();
    }
    setSwipeDirection(null);
    touchStartX.current = null;
  };

  const handleNextCandidate = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentCandidateIndex((prev) => 
        prev === candidateProfiles.length - 1 ? 0 : prev + 1
      );
      setIsAnimating(false);
    }, 300);
  };

  const handleCandidateAction = (action: 'pass' | 'save' | 'like') => {
    const currentCandidate = candidateProfiles[currentCandidateIndex];
    
    if (action === 'save') {
      setSavedCandidates(prev => [...prev, currentCandidate]);
    } else if (action === 'like') {
      setInterestedCandidates(prev => [...prev, currentCandidate]);
    }
    
    handleNextCandidate();
  };

  const handleJobAction = (action: 'pass' | 'save' | 'like') => {
    const currentJob = jobListings[currentJobIndex];
    
    if (action === 'like') {
      setAppliedJobs(prev => [...prev, currentJob]);
    } else if (action === 'save') {
      setSavedJobs(prev => [...prev, currentJob]);
    }
    
    // Move to next job
    setCurrentJobIndex(prev => 
      prev === jobListings.length - 1 ? 0 : prev + 1
    );
  };

  const menuItems = selectedRole === 'employer' ? [
    { icon: <Users className="w-5 h-5" />, label: 'Candidates', index: 0 },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', index: 1 },
    { icon: <BarChart2 className="w-5 h-5" />, label: 'Dashboard', index: 2 },
    { icon: <Briefcase className="w-5 h-5" />, label: 'Coach', index: 3 },
    { icon: <Building2 className="w-5 h-5" />, label: 'Profile', index: 4 },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', index: 5 },
  ] : [
    { icon: <Briefcase className="w-5 h-5" />, label: 'Jobs', index: 0 },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', index: 1 },
    { icon: <Briefcase className="w-5 h-5" />, label: 'Coach', index: 2 },
    { icon: <Building2 className="w-5 h-5" />, label: 'Profile', index: 3 },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', index: 4 },
  ];

  const cards = selectedRole === 'employer' ? [
    {
      type: 'candidates',
      component: (
        <ProfileCard 
          avatarSrc={candidateProfiles[currentCandidateIndex].avatarSrc}
          name={candidateProfiles[currentCandidateIndex].name}
          title={candidateProfiles[currentCandidateIndex].title}
          skills={candidateProfiles[currentCandidateIndex].skills}
          onViewProfile={() => console.log("View profile clicked")}
          buttonLabel="View Profile"
        />
      )
    },
    {
      type: 'messages',
      component: (
        <MessagesCard 
          onViewProfile={() => console.log("View profile clicked")}
        />
      )
    },
    {
      type: 'dashboard',
      component: <Dashboard />
    },
    {
      type: 'coach',
      component: <CoachCard onStartSession={() => console.log("Start session clicked")} />
    },
    {
      type: 'company',
      component: <CompanyProfileCard />
    },
    {
      type: 'settings',
      component: <SettingsCard />
    }
  ] : [
    {
      type: 'jobs',
      component: <JobCard job={jobListings[currentJobIndex]} />
    },
    {
      type: 'messages',
      component: (
        <MessagesCard 
          onViewProfile={() => console.log("View profile clicked")}
        />
      )
    },
    {
      type: 'coach',
      component: <CoachCard onStartSession={() => console.log("Start session clicked")} />
    },
    {
      type: 'company',
      component: <CompanyProfileCard />
    },
    {
      type: 'settings',
      component: <SettingsCard />
    }
  ];

  const handlePrevious = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentCardIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentCardIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleViewProfile = () => {
    console.log('View Profile clicked');
  };

  const handleAction = (action: 'star' | 'heart') => {
    console.log(`${action} action clicked`);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuSelect = (index: number) => {
    setCurrentCardIndex(index);
    setIsMenuOpen(false);
  };

  if (!isAuthenticated) {
    return <LandingPage onAuthSuccess={(type) => {
      setUserType(type);
      setSelectedRole(type);
      setIsAuthenticated(true);
    }} />;
  }

  // Render the new bento grid main menu after authentication
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Iridescence 
        color={[0.4, 0.2, 0.8]}
        speed={0.2}
        amplitude={0.05}
      />
      <BentoMainMenu />
    </div>
  );
}

export default App;