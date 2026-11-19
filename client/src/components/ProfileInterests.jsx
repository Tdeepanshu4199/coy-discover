import React from 'react';

const ProfileInterests = ({ interests = [] }) => {
  if (!interests || interests.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2.5">
      {interests.map((interest, index) => (
        <span
          key={`${interest}-${index}`}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E9E0FF] text-[#191722] border border-[#191722]/10 backdrop-blur-sm"
        >
          {interest}
        </span>
      ))}
    </div>
  );
};

export default ProfileInterests;
