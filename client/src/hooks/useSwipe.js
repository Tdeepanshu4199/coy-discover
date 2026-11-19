import { useState, useCallback } from 'react';
import { swipeProfile } from '../services/api';
import toast from 'react-hot-toast';

export const useSwipe = (onSwipeSuccess) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchData, setMatchData] = useState(null);

  const performSwipe = useCallback(
    async (targetUserId, action) => {
      if (isSubmitting || !targetUserId) return;

      setIsSubmitting(true);
      try {
        const response = await swipeProfile(targetUserId, action);

        // Notify parent hook to remove card from stack
        if (onSwipeSuccess) {
          onSwipeSuccess(targetUserId, action);
        }

        if (response.success && response.isMatch) {
          // Trigger match modal celebration
          setMatchData(response.match);
        }
      } catch (err) {
        const errMsg = err.response?.data?.message || err.message || 'Swipe failed';
        toast.error(errMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, onSwipeSuccess]
  );

  const clearMatch = useCallback(() => {
    setMatchData(null);
  }, []);

  return {
    performSwipe,
    isSubmitting,
    matchData,
    clearMatch,
  };
};
