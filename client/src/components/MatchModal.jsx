import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MessageCircle, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { getDemoUser } from '../services/api';

const MatchModal = ({ matchData, onClose }) => {
  const navigate = useNavigate();
  const [demoUser, setDemoUser] = useState(null);

  // Trigger celebration confetti
  useEffect(() => {
    if (matchData) {
      // Fetch demo user profile for side-by-side photos
      getDemoUser()
        .then((res) => {
          if (res.success) setDemoUser(res.user);
        })
        .catch(() => {});

      // Burst playful confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF347F', '#E9E0FF', '#191722', '#FFA3C4'],
        });
      } catch (e) {
        // Fallback gracefully if confetti fails
      }
    }
  }, [matchData]);

  if (!matchData) return null;

  const matchedUser = matchData.user || {};

  const handleGoToMatches = () => {
    onClose();
    navigate('/matches');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191722]/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-white border-3 border-[#191722] shadow-coy-lg p-6 sm:p-8 text-center overflow-hidden"
        >
          {/* Decorative Background Blob */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-[#E9E0FF] rounded-full blur-2xl -z-10" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[#FF347F]/15 rounded-full blur-2xl -z-10" />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0FF] border border-[#191722]/10 text-xs font-bold text-[#191722] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FF347F]" />
            <span>Mutual Connection</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl font-black text-[#FF347F] tracking-tight">
            It's a Match!
          </h2>

          <p className="mt-2 text-sm text-[#85818F]">
            You and <span className="font-bold text-[#191722]">{matchedUser.name}</span> liked each other.
          </p>

          {/* Matched Photos - Interlocking Circles */}
          <div className="relative flex items-center justify-center my-6">
            {/* Demo User Photo */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 border-[#191722] shadow-coy overflow-hidden -mr-4 bg-[#E9E0FF] z-10">
              <img
                src={
                  demoUser?.photo ||
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80'
                }
                alt={demoUser?.name || 'You'}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Heart in the middle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="absolute z-30 w-11 h-11 rounded-full bg-[#FF347F] border-2 border-[#191722] shadow-coy flex items-center justify-center text-white"
            >
              <Heart className="w-5 h-5 fill-white" />
            </motion.div>

            {/* Matched User Photo */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 border-[#191722] shadow-coy overflow-hidden -ml-4 bg-[#E9E0FF] z-10">
              <img
                src={matchedUser.photo}
                alt={matchedUser.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#191722] font-medium px-4 mb-6">
            Only mutual likes reveal a connection on Coy. Your interest was 100% private until now!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {/* View Matches Button */}
            <button
              type="button"
              onClick={handleGoToMatches}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#FF347F] text-white font-bold text-base border-2 border-[#191722] shadow-coy hover:bg-[#e6246e] active:shadow-coy-sm active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>View Matches</span>
            </button>

            {/* Keep Discovering Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-6 rounded-2xl bg-[#F5F2FA] text-[#191722] font-bold text-sm border-2 border-[#191722] hover:bg-[#E9E0FF] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#85818F]" />
              <span>Keep Discovering</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MatchModal;
