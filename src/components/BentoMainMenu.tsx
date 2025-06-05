"use client";
import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import {
  IconUser,
  IconBriefcase,
  IconMessage,
  IconSettings,
  IconRobotFace,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import SwipeApp from "./SwipeApp";

// Skeletons for visual effect (can be customized per tile)
const SkeletonSwipe = () => (
  <motion.div className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-black/[0.2] dark:bg-dot-white/[0.2] flex-col space-y-2 justify-center items-center">
    <motion.div className="h-12 w-12 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 mb-2" />
    <motion.div className="w-2/3 h-4 rounded-full bg-gray-100 dark:bg-neutral-900" />
  </motion.div>
);
const SkeletonMessages = () => (
  <motion.div className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-black/[0.2] dark:bg-dot-white/[0.2] flex-col space-y-2 justify-center items-center">
    <motion.div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 mb-2" />
    <motion.div className="w-1/2 h-4 rounded-full bg-gray-100 dark:bg-neutral-900" />
  </motion.div>
);
const SkeletonProfile = () => (
  <motion.div className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-black/[0.2] dark:bg-dot-white/[0.2] flex-col space-y-2 justify-center items-center">
    <motion.div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-teal-400 mb-2" />
    <motion.div className="w-1/2 h-4 rounded-full bg-gray-100 dark:bg-neutral-900" />
  </motion.div>
);
const SkeletonSettings = () => (
  <motion.div className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-black/[0.2] dark:bg-dot-white/[0.2] flex-col space-y-2 justify-center items-center">
    <motion.div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-400 to-zinc-500 mb-2" />
    <motion.div className="w-1/3 h-4 rounded-full bg-gray-100 dark:bg-neutral-900" />
  </motion.div>
);
const SkeletonCoach = () => (
  <motion.div className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-black/[0.2] dark:bg-dot-white/[0.2] flex-col space-y-2 justify-center items-center">
    <motion.div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 mb-2" />
    <motion.div className="w-2/3 h-4 rounded-full bg-gray-100 dark:bg-neutral-900" />
  </motion.div>
);

const jobs = [
  {
    company: "Google",
    logo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    title: "Senior Frontend Developer",
  },
  {
    company: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    title: "Software Engineer",
  },
  {
    company: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    title: "Full Stack Engineer",
  },
];

const MiniCardStackPreview = () => {
  const baseAngles = [-8, 0, 8];
  const baseXs = [-18, 0, 18];
  const zIndexes = [1, 2, 3];
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      {jobs.map((job, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 bg-white/90 rounded-xl shadow-xl border border-gray-200 flex flex-col items-center justify-end transition-transform"
          style={{
            width: 82,
            height: 96,
            transform: `translate(-50%, -50%) translateX(${baseXs[i]}px) rotate(${baseAngles[i]}deg)`,
            zIndex: zIndexes[i],
            boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
          }}
        >
          <img src={job.logo} alt={job.company} className="h-8 mt-3 mb-2" />
        </div>
      ))}
    </div>
  );
};

const items = [
  {
    title: "Swipe",
    description: <span className="text-sm">Find matches. Candidates see jobs, Employers see candidates.</span>,
    header: <MiniCardStackPreview />,
    className: "md:col-span-1",
    icon: <IconBriefcase className="h-5 w-5 text-neutral-500" />,
  },
  {
    title: "Messages",
    description: <span className="text-sm">Chat with matches and connections.</span>,
    header: <SkeletonMessages />,
    className: "md:col-span-1",
    icon: <IconMessage className="h-5 w-5 text-neutral-500" />,
  },
  {
    title: "Profile",
    description: <span className="text-sm">View and edit your profile information.</span>,
    header: <SkeletonProfile />,
    className: "md:col-span-1",
    icon: <IconUser className="h-5 w-5 text-neutral-500" />,
  },
  {
    title: "Settings",
    description: <span className="text-sm">Customize your app experience.</span>,
    header: <SkeletonSettings />,
    className: "md:col-span-1",
    icon: <IconSettings className="h-5 w-5 text-neutral-500" />,
  },
  {
    title: "AI Interview Coach",
    description: <span className="text-sm">Practice interviews with AI-powered feedback.</span>,
    header: <SkeletonCoach />,
    className: "md:col-span-2",
    icon: <IconRobotFace className="h-5 w-5 text-neutral-500" />,
  },
];

export default function BentoMainMenu() {
  const [swipeOpen, setSwipeOpen] = React.useState(false);

  if (swipeOpen) {
    return <SwipeApp onCollapse={() => setSwipeOpen(false)} />;
  }

  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
          // Only Swipe tile is clickable for now
          {...(item.title === "Swipe" && { onClick: () => setSwipeOpen(true), style: { cursor: "pointer" } })}
        />
      ))}
    </BentoGrid>
  );
} 