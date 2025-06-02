import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, Briefcase, Building2, ChevronRight, Users, Globe, Award, Heart } from 'lucide-react';

interface JobCardProps {
  job: {
    company: string;
    title: string;
    location: string;
    type: string;
    salary: string;
    posted: string;
    requirements: string[];
    description: string;
    benefits: string[];
  };
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`
        relative w-[350px] rounded-2xl overflow-hidden
        bg-white/10 backdrop-blur-md border border-white/20
        shadow-xl shadow-black/20
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'h-[600px]' : 'h-[480px]'}
      `}
    >
      {/* Company Logo */}
      <div className="absolute top-6 left-6 w-16 h-16 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center">
        <Building2 className="w-8 h-8 text-white" />
      </div>

      {/* Job Info */}
      <div className="absolute top-6 right-6 text-right">
        <h3 className="text-white/60 text-sm font-medium">{job.type}</h3>
        <p className="text-white/40 text-xs">Posted {job.posted}</p>
      </div>

      {/* Main Content */}
      <div className={`
        absolute top-32 left-0 right-0 p-6
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'}
      `}>
        <h2 className="text-2xl font-bold text-white mb-2">{job.title}</h2>
        <h3 className="text-xl text-white/80 mb-4">{job.company}</h3>

        <div className="space-y-3">
          <div className="flex items-center text-white/60">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-white/60">
            <Clock className="w-4 h-4 mr-2" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center text-white/60">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>{job.salary}</span>
          </div>
        </div>
      </div>

      {/* Show More Button */}
      <div className="absolute bottom-6 left-0 right-0 px-6 z-10">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 
                   text-white/80 hover:text-white rounded-xl
                   transition-all duration-200 flex items-center justify-center"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
          <ChevronRight className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Expanded Content */}
      <div className={`
        absolute top-0 left-0 right-0 p-6
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px] pointer-events-none'}
      `}>
        <div className="mt-32 h-[calc(600px-8rem)] overflow-y-auto scrollbar-hide">
          <h2 className="text-2xl font-bold text-white mb-2">{job.title}</h2>
          <h3 className="text-xl text-white/80 mb-4">{job.company}</h3>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-white/60">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-white/60">
              <Clock className="w-4 h-4 mr-2" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center text-white/60">
              <DollarSign className="w-4 h-4 mr-2" />
              <span>{job.salary}</span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-white/80 font-medium mb-2">Requirements</h4>
            <ul className="text-white/60 text-sm space-y-1">
              {job.requirements.map((req, index) => (
                <li key={index}>• {req}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h4 className="text-white/80 font-medium mb-2">About the Role</h4>
            <p className="text-white/60 text-sm">
              {job.description}
            </p>
          </div>

          <div className="mb-4">
            <h4 className="text-white/80 font-medium mb-2">Benefits</h4>
            <ul className="text-white/60 text-sm space-y-1">
              {job.benefits.map((benefit, index) => (
                <li key={index}>• {benefit}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-white/60">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">Team Size: 10-15</span>
            </div>
            <div className="flex items-center text-white/60">
              <Globe className="w-4 h-4 mr-2" />
              <span className="text-sm">Remote Friendly</span>
            </div>
            <div className="flex items-center text-white/60">
              <Award className="w-4 h-4 mr-2" />
              <span className="text-sm">Career Growth</span>
            </div>
            <div className="flex items-center text-white/60">
              <Heart className="w-4 h-4 mr-2" />
              <span className="text-sm">Great Culture</span>
            </div>
          </div>

          <div className="text-white/60 text-sm mb-6">
            <p>• Flexible working hours</p>
            <p>• Regular team events</p>
            <p>• Learning & development budget</p>
            <p>• Health & wellness programs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard; 