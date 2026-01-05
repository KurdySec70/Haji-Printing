import React from 'react';

/**
 * Animated background component with floating particles and glow effects
 */
export const AnimatedBackground: React.FC = () => {
  return (
    <>
      {/* Pure white background */}
      <div className="absolute inset-0 bg-white dark:bg-[#0a0a0a]"></div>
    </>
  );
};
