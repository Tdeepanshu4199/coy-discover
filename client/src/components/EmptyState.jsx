import React from 'react';
import { Compass, RotateCcw, HeartHandshake, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({ type = 'feed', onReset, isResetting = false }) => {
  const navigate = useNavigate();

  if (type === 'matches') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto my-auto">
        <div className="relative w-24 h-24 rounded-3xl bg-[#E9E0FF] border-2 border-[#191722] shadow-coy flex items-center justify-center mb-6">
          <HeartHandshake className="w-12 h-12 text-[#FF347F]" />
          <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[#FF347F] text-white text-[10px] font-bold border border-[#191722]">
            Private
          </span>
        </div>

        <h3 className="text-2xl font-black text-[#191722] tracking-tight">
          No matches yet
        </h3>

        <p className="mt-2 text-sm text-[#85818F] leading-relaxed">
          Matches only appear when both people like each other. Your likes are 100% confidential!
        </p>

        <button
          type="button"
          onClick={() => navigate('/discover')}
          className="mt-6 inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-[#FF347F] text-white font-bold text-sm border-2 border-[#191722] shadow-coy hover:bg-[#e6246e] active:shadow-coy-sm active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Start Discovering</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto my-auto">
      <div className="relative w-24 h-24 rounded-3xl bg-[#E9E0FF] border-2 border-[#191722] shadow-coy flex items-center justify-center mb-6">
        <Sparkles className="w-12 h-12 text-[#FF347F]" />
      </div>

      <h3 className="text-2xl font-black text-[#191722] tracking-tight">
        You're all caught up!
      </h3>

      <p className="mt-2 text-sm text-[#85818F] leading-relaxed">
        You have swiped through all available profiles in your area. Check back later or reset the demo feed to test again.
      </p>

      {onReset && (
        <button
          type="button"
          disabled={isResetting}
          onClick={onReset}
          className="mt-6 inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-[#191722] text-white font-bold text-sm border-2 border-[#191722] shadow-coy hover:bg-[#2b2738] active:shadow-coy-sm active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50"
        >
          <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
          <span>{isResetting ? 'Resetting...' : 'Reset Demo Swipes'}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
