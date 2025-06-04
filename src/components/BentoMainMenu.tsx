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

const items = [
  {
    title: "Swipe",
    description: <span className="text-sm">Find matches. Candidates see jobs, Employers see candidates.</span>,
    header: <SkeletonSwipe />,
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
        />
      ))}
    </BentoGrid>
  );
} 