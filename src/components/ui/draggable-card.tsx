import React, { ReactNode, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

interface DraggableCardContainerProps {
  children: ReactNode;
  className?: string;
}

interface DraggableCardBodyProps {
  children: ReactNode;
  className?: string;
  onDismiss?: (direction: 'left' | 'right') => void;
  onDrag?: (x: number) => void;
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
  onDrag,
}: DraggableCardBodyProps) {
  const x = useMotionValue(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right'>('right');

  function handleDragEnd(_e: any, info: { offset: { x: number } }) {
    if (!onDismiss) return;
    if (info.offset.x > 150) {
      setExitDirection('right');
      onDismiss('right');
    } else if (info.offset.x < -150) {
      setExitDirection('left');
      onDismiss('left');
    }
    // Reset the drag position
    x.set(0);
    onDrag?.(0);
  }

  return (
    <motion.div
      className={`cursor-grab active:cursor-grabbing ${className}`}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      style={{ x }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onDragEnd={handleDragEnd}
      onDrag={(_, info) => onDrag?.(info.offset.x)}
    >
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        exit={{
          x: exitDirection === 'left' ? -500 : 500,
          opacity: 0,
          scale: 0.5,
          rotate: exitDirection === 'left' ? -30 : 30,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
} 