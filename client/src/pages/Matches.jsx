import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import MatchCard from '../components/MatchCard';
import EmptyState from '../components/EmptyState';
import { getMatches } from '../services/api';
import toast from 'react-hot-toast';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMatches();
      if (data.success) {
        setMatches(data.matches || []);
      } else {
        throw new Error(data.message || 'Failed to load matches');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error fetching matches';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#191722] tracking-tight">
              Mutual Matches
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#FF347F] text-white">
              {matches.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#85818F] mt-1">
            People who liked you back. 100% mutual and verified.
          </p>
        </div>

        <div className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E9E0FF] text-xs font-bold text-[#191722] border border-[#191722]/10">
          <ShieldCheck className="w-4 h-4 text-[#FF347F]" />
          <span>Zero Unreciprocated Likes</span>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#191722] shadow-coy flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-[#FF347F] animate-spin" />
          </div>
          <p className="text-xs font-bold text-[#85818F] tracking-wide uppercase">
            Loading your matches...
          </p>
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-white rounded-3xl border-2 border-[#191722] shadow-coy max-w-sm mx-auto">
          <p className="text-sm font-semibold text-red-500 mb-3">{error}</p>
          <button
            type="button"
            onClick={fetchMatches}
            className="px-4 py-2 rounded-xl bg-[#191722] text-white text-xs font-bold"
          >
            Retry
          </button>
        </div>
      ) : matches.length === 0 ? (
        <div className="py-12">
          <EmptyState type="matches" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {matches.map((match) => (
            <MatchCard key={match.matchId || match._id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
