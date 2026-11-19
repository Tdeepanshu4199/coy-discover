import React, { useState } from 'react';
import { MapPin, GraduationCap, MessageCircle, Heart, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const MatchCard = ({ match }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'C';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleSayHi = () => {
    toast.success(`You matched with ${match.name}! Mutual likes are 100% verified.`, {
      icon: '💖',
      duration: 3500,
    });
  };

  return (
    <div className="relative rounded-3xl bg-white border-2 border-[#191722] shadow-coy overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-coy-lg flex flex-col">
      {/* Photo Header */}
      <div className="relative w-full h-56 sm:h-64 bg-[#E9E0FF] overflow-hidden">
        {!imageError ? (
          <img
            src={match.photo}
            alt={match.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#E9E0FF] to-[#F5F2FA]">
            <div className="w-20 h-20 rounded-full bg-white border-2 border-[#191722] shadow-coy flex items-center justify-center text-2xl font-bold text-[#FF347F]">
              {getInitials(match.name)}
            </div>
          </div>
        )}

        {/* Mutual Match badge */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 border border-[#191722] shadow-coy-sm text-xs font-bold text-[#FF347F] flex items-center gap-1 backdrop-blur-sm">
          <Heart className="w-3.5 h-3.5 fill-[#FF347F]" />
          <span>Mutual</span>
        </div>

        {/* Gradient Overlay for bottom text */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#191722]/80 via-transparent to-transparent pointer-events-none" />

        {/* Name & Age Overlay */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl sm:text-2xl font-extrabold">{match.name}</h3>
            <span className="text-xl font-semibold opacity-90">{match.age}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-white/90 mt-0.5">
            {match.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FF347F]" />
                {match.city}
              </span>
            )}
            {match.college && (
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-[#E9E0FF]" />
                {match.college}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
        {match.bio && (
          <p className="text-xs sm:text-sm text-[#191722]/80 line-clamp-2 leading-relaxed">
            {match.bio}
          </p>
        )}

        {/* Interests */}
        {match.interests && match.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {match.interests.slice(0, 3).map((interest, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5F2FA] text-[#191722] border border-[#191722]/10"
              >
                {interest}
              </span>
            ))}
            {match.interests.length > 3 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold text-[#85818F]">
                +{match.interests.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Say Hi Button */}
        <button
          type="button"
          onClick={handleSayHi}
          className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#E9E0FF] text-[#191722] font-bold text-xs sm:text-sm border-2 border-[#191722] shadow-coy-sm hover:bg-[#FF347F] hover:text-white transition-all flex items-center justify-center gap-2 active:translate-x-[1px] active:translate-y-[1px]"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Say Hi</span>
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
