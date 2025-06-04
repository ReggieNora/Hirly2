import React from "react";
import { motion, useMotionValue } from "framer-motion";

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
}: DraggableCardBodyProps) {
  const x = useMotionValue(0);

  return (
    <motion.div
      className={`cursor-grab active:cursor-grabbing ${className}`}
      drag
      style={{ x }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
} 