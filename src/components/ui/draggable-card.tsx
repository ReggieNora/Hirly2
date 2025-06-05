import React, { ReactNode, useState } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";

interface DraggableCardContainerProps {
  children: ReactNode;
  className?: string;
}

interface DraggableCardBodyProps {
  children: ReactNode;
  className?: string;
  onDismiss?: (direction: 'left' | 'right') => void;
  onDrag?: (x: number) => void;
  onTap?: () => void;
}

// Emoji burst component
function EmojiBurst({ direction, type }: { direction: 'left' | 'right', type: 'heart' | 'fire' }) {
  const emoji = type === 'heart' ? '❤️' : '🔥';
  
  return (
    <motion.div
      className="fixed text-9xl z-[9999] pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        x: '-50%',
        y: '-50%'
      }}
      initial={{ 
        scale: 0,
        opacity: 0,
        y: 0
      }}
      animate={{ 
        scale: [0, 2.5, 2],
        opacity: [0, 1, 0],
        y: -300 // Float up
      }}
      transition={{
        duration: 2,
        ease: "easeOut",
        times: [0, 0.2, 1]
      }}
    >
      {emoji}
    </motion.div>
  );
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
  onTap,
}: DraggableCardBodyProps) {
  const x = useMotionValue(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right'>('right');
  const [showEmojiBurst, setShowEmojiBurst] = useState(false);

  function handleDragEnd(_e: any, info: { offset: { x: number } }) {
    if (!onDismiss) return;
    if (info.offset.x > 150) {
      setExitDirection('right');
      setShowEmojiBurst(true);
      setTimeout(() => onDismiss('right'), 50);
    } else if (info.offset.x < -150) {
      setExitDirection('left');
      setShowEmojiBurst(true);
      setTimeout(() => onDismiss('left'), 50);
    }
    // Reset the drag position
    x.set(0);
    onDrag?.(0);
  }

  return (
    <motion.div
      className={`cursor-grab active:cursor-grabbing ${className}`}
      drag
      dragElastic={0.7}
      dragConstraints={{ left: -400, right: 400, top: -200, bottom: 200 }}
      style={{ x }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20,
        mass: 0.8
      }}
      onDragEnd={handleDragEnd}
      onDrag={(_, info) => onDrag?.(info.offset.x)}
      onClick={onTap}
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
          duration: 0.4,
          ease: "easeInOut"
        }}
      >
        {children}
        <AnimatePresence>
          {showEmojiBurst && (
            <EmojiBurst 
              direction={exitDirection} 
              type={exitDirection === 'right' ? 'heart' : 'fire'} 
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
} 