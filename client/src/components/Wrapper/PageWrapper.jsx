import React, { Suspense } from "react";
import { motion } from "framer-motion";

export const pageTransition = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};
// Loading fallback component
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);
export const PageWrapper = ({ children }) => (
  <motion.div
    initial={pageTransition.initial}
    animate={pageTransition.animate}
    exit={pageTransition.exit}
    transition={{ duration: 0.5 }}
  >
    <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
  </motion.div>
);
