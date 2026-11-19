import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, GraduationCap, Sparkles } from 'lucide-react';
import ProfileInterests from './ProfileInterests';

const SWIPE_THRESHOLD = 110;

const ProfileCard = ({ profile, onSwipe, isTop = false, exitDirection = null }) => {
  const [imageError, setImageError] = useState(false);
  const x = useMotionValue(0);

  // Rotate card as it is dragged
  const rotate = useTransform(x, [-200, 0, 200], [-14, 0, 14]);

  // Opacity of LIKE and PASS stamps
  const likeOpacity = useTransform(x, [30, 120], [0, 1]);
  const passOpacity = useTransform(x, [-30, -120], [0, 1]);

  // Fallback initial generator
  const getInitials = (name) => {
    if (!name) return 'C';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleDragEnd = (_, info) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;

    if (offsetX > SWIPE_THRESHOLD || velocityX > 400) {
      onSwipe('like');
    } else if (offsetX < -SWIPE_THRESHOLD || velocityX < -400) {
      onSwipe('pass');
    }
  };

  // Exit animation variants
  const variants = {
    initial: { scale: 0.96, opacity: 0.8, y: 12 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: (direction) => ({
      x: direction === 'like' ? 600 : -600,
      opacity: 0,
      rotate: direction === 'like' ? 24 : -24,
      transition: { duration: 0.35, ease: 'easeOut' },
    }),
  };

  if (!profile) return null;

  return (
    <motion.div
      className={`touch-card absolute w-full max-w-[390px] h-[540px] sm:h-[570px] rounded-3xl bg-white border-2 border-[#191722] shadow-coy overflow-hidden select-none cursor-grab active:cursor-grabbing ${
        isTop ? 'z-20' : 'z-10 pointer-events-none'
      }`}
      style={isTop ? { x, rotate } : {}}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      variants={variants}
      initial={isTop ? 'animate' : 'initial'}
      animate="animate"
      exit="exit"
      custom={exitDirection}
      transition={{ duration: 0.25 }}
    >
      {/* Visual Stamps for feedback while dragging */}
      {isTop && (
        <>
          {/* LIKE STAMP */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 z-30 px-4 py-1.5 rounded-xl border-3 border-[#FF347F] text-[#FF347F] bg-white/95 shadow-coy -rotate-12 pointer-events-none font-black text-2xl tracking-wider uppercase"
          >
            LIKE
          </motion.div>

          {/* PASS STAMP */}
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-6 right-6 z-30 px-4 py-1.5 rounded-xl border-3 border-[#191722] text-[#191722] bg-white/95 shadow-coy rotate-12 pointer-events-none font-black text-2xl tracking-wider uppercase"
          >
            PASS
          </motion.div>
        </>
      )}

      {/* Profile Image with Fallback */}
      <div className="relative w-full h-full bg-[#E9E0FF]">
        {!imageError ? (
          <img
            src={profile.photo}
            alt={profile.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover pointer-events-none"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#E9E0FF] via-[#F5F2FA] to-[#FF347F]/20 text-[#191722]">
            <div className="w-28 h-28 rounded-full bg-white border-2 border-[#191722] shadow-coy flex items-center justify-center text-3xl font-extrabold text-[#FF347F]">
              {getInitials(profile.name)}
            </div>
            <span className="mt-3 text-sm font-semibold text-[#85818F]">{profile.name}</span>
          </div>
        )}

        {/* Gradient Overlay for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#191722] via-[#191722]/50 to-transparent pointer-events-none" />

        {/* Card Content & Details */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white z-20 pointer-events-none">
          {/* Name & Age */}
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
              {profile.name}
            </h2>
            <span className="text-2xl sm:text-3xl font-semibold opacity-90">{profile.age}</span>
          </div>

          {/* City / College tags */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs sm:text-sm text-white/90 font-medium">
            {profile.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF347F]" />
                {profile.city}
              </span>
            )}
            {profile.college && (
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#E9E0FF]" />
                {profile.college}
              </span>
            )}
          </div>

          {/* Short Bio */}
          {profile.bio && (
            <p className="mt-2.5 text-xs sm:text-sm text-white/90 line-clamp-2 leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Interests Chips */}
          <ProfileInterests interests={profile.interests} />
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
