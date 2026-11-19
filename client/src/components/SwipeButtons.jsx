import React from 'react';
import { X, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const SwipeButtons = ({ onSwipe, disabled = false }) => {
  return (
    <div className="flex items-center justify-center gap-8 py-3 w-full">
      {/* PASS BUTTON */}
      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => onSwipe('pass')}
        whileHover={{ scale: disabled ? 1 : 1.08 }}
        whileTap={{ scale: disabled ? 1 : 0.92 }}
        className={`group relative flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white text-[#191722] border-2 border-[#191722] shadow-coy transition-colors ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-[#F5F2FA] active:shadow-coy-sm active:translate-x-[2px] active:translate-y-[2px]'
        }`}
        aria-label="Pass Profile"
        title="Pass (Swipe Left)"
      >
        <X className="w-8 h-8 transition-transform group-hover:rotate-12 stroke-[2.5]" />
      </motion.button>

      {/* LIKE BUTTON */}
      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => onSwipe('like')}
        whileHover={{ scale: disabled ? 1 : 1.08 }}
        whileTap={{ scale: disabled ? 1 : 0.92 }}
        className={`group relative flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#FF347F] text-white border-2 border-[#191722] shadow-coy transition-colors ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-[#e6246e] active:shadow-coy-sm active:translate-x-[2px] active:translate-y-[2px]'
        }`}
        aria-label="Like Profile"
        title="Like (Swipe Right)"
      >
        <Heart className="w-8 h-8 fill-white stroke-[2.5] transition-transform group-hover:scale-110" />
      </motion.button>
    </div>
  );
};

export default SwipeButtons;
