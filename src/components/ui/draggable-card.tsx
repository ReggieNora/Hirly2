import React from "react";
import { motion, useMotionValue } from "framer-motion";

interface DraggableCardContainerProps {
  children: React.ReactNode;
  className?: string;
}

interface DraggableCardBodyProps {
  children: React.ReactNode;
  className?: string;
  onDismiss?: (direction: 'left' | 'right') => void;
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
  const x = useMotionValue(0);

  function handleDragEnd(_e: any, info: { offset: { x: number } }) {
    if (!onDismiss) return;
    if (info.offset.x > 150) {
      onDismiss('right');
    } else if (info.offset.x < -150) {
      onDismiss('left');
    }
  }

  return (
    <motion.div
      className={`cursor-grab active:cursor-grabbing ${className}`}
      drag
      style={{ x }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
} 