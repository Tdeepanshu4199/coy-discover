import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import SwipeButtons from '../components/SwipeButtons';
import MatchModal from '../components/MatchModal';
import EmptyState from '../components/EmptyState';
import { useFeed } from '../hooks/useFeed';
import { useSwipe } from '../hooks/useSwipe';

const Discover = ({ onReset, isResetting = false }) => {
  const { profiles, currentProfile, nextProfile, loading, error, refetch, removeTopProfile } =
    useFeed();
  const [exitDirection, setExitDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Hook to handle swipe API
  const { performSwipe, isSubmitting, matchData, clearMatch } = useSwipe(() => {
    // Handled after animation
  });

  const handleSwipeAction = useCallback(
    (action) => {
      if (isAnimating || isSubmitting || !currentProfile) return;

      setIsAnimating(true);
      setExitDirection(action);

      // Trigger swipe API
      performSwipe(currentProfile._id, action);

      // Give exit animation time to fly off screen before removing from DOM stack
      setTimeout(() => {
        removeTopProfile();
        setExitDirection(null);
        setIsAnimating(false);
      }, 350);
    },
    [isAnimating, isSubmitting, currentProfile, performSwipe, removeTopProfile]
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-between w-full max-w-md mx-auto px-4 py-2 sm:py-4">
      {/* Mobile Top Bar with Privacy Tag */}
      <div className="w-full flex items-center justify-between py-1 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-black text-[#191722] tracking-tight">
            Discover<span className="text-[#FF347F]">.</span>
          </span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E9E0FF] text-[11px] font-bold text-[#191722] border border-[#191722]/10">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FF347F]" />
          <span>Private Swiping</span>
        </div>
      </div>

      {/* Main Discover Card Deck Area */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[550px] sm:min-h-[580px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#191722] shadow-coy flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-[#FF347F] animate-spin" />
            </div>
            <p className="text-xs font-bold text-[#85818F] tracking-wide uppercase">
              Finding new profiles...
            </p>
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-white rounded-3xl border-2 border-[#191722] shadow-coy max-w-sm">
            <p className="text-sm font-semibold text-red-500 mb-3">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="px-4 py-2 rounded-xl bg-[#191722] text-white text-xs font-bold"
            >
              Retry
            </button>
          </div>
        ) : !currentProfile ? (
          <EmptyState
            type="feed"
            onReset={async () => {
              if (onReset) await onReset();
              refetch();
            }}
            isResetting={isResetting}
          />
        ) : (
          <div className="relative w-full h-[540px] sm:h-[570px] flex items-center justify-center">
            {/* Next Card in Stack (Visual depth) */}
            {nextProfile && (
              <ProfileCard
                key={nextProfile._id}
                profile={nextProfile}
                isTop={false}
              />
            )}

            {/* Current Interactive Top Card */}
            <AnimatePresence custom={exitDirection}>
              <ProfileCard
                key={currentProfile._id}
                profile={currentProfile}
                isTop={true}
                exitDirection={exitDirection}
                onSwipe={handleSwipeAction}
              />
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Swipe Action Buttons (Fixed beneath card) */}
      {currentProfile && (
        <div className="w-full mt-2 sm:mt-4">
          <SwipeButtons
            onSwipe={handleSwipeAction}
            disabled={isAnimating || isSubmitting || !currentProfile}
          />
        </div>
      )}

      {/* Mutual Match Modal */}
      <MatchModal matchData={matchData} onClose={clearMatch} />
    </div>
  );
};

export default Discover;
