import React, { useState } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";

interface DraggableCardContainerProps {
  children: React.ReactNode;
  className?: string;
}

interface DraggableCardBodyProps {
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
}

export function DraggableCardContainer({
  children,
  className = "",
}: DraggableCardContainerProps) {
  return <div className={`relative ${className}`}>{children}</div>;
}

export function DraggableCardBody({
  children,
  className = "",
  onDismiss,
}: DraggableCardBodyProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);

  const handleDragEnd = async (_: any, info: { point: { x: number } }) => {
    // Get viewport width
    const vw = window.innerWidth;
    // Get the card's current center x position (relative to viewport)
    const card = document.elementFromPoint(info.point.x, window.innerHeight / 2);
    // If the pointer is past the left or right edge, dismiss
    if (info.point.x < 0 || info.point.x > vw) {
      setIsDismissed(true);
      await controls.start({
        x: info.point.x < 0 ? -vw * 1.2 : vw * 1.2,
        opacity: 0,
        transition: { duration: 0.35 }
      });
      onDismiss?.();
    } else {
      // Snap back to center
      controls.start({ x: 0, y: 0, rotate: 0 });
    }
  };

  if (isDismissed) return null;

  return (
    <motion.div
      className={`cursor-grab active:cursor-grabbing ${className}`}
      drag
      style={{ x }}
      animate={controls}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
} 