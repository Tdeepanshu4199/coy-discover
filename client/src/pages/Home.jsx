import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Compass } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto">
      {/* Coy Minimal Brand Placeholder */}
      <div className="w-16 h-16 rounded-3xl bg-[#FF347F] border-2 border-[#191722] shadow-coy flex items-center justify-center mb-4">
        <Heart className="w-8 h-8 fill-white text-white" />
      </div>

      <h1 className="text-3xl font-black text-[#191722] tracking-tight">
        coy<span className="text-[#FF347F]">.</span>
      </h1>

      <p className="mt-2 text-sm text-[#85818F] max-w-xs">
        Home is a simple placeholder. Head over to Discover to explore new connections!
      </p>

      <NavLink
        to="/discover"
        className="mt-6 inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-[#FF347F] text-white font-bold text-sm border-2 border-[#191722] shadow-coy hover:bg-[#e6246e] active:shadow-coy-sm active:translate-x-[2px] active:translate-y-[2px] transition-all"
      >
        <Compass className="w-4 h-4" />
        <span>Go to Discover</span>
      </NavLink>
    </div>
  );
};

export default Home;
