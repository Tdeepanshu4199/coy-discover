import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Compass, Users, Home, RotateCcw, ShieldCheck } from 'lucide-react';

const Navbar = ({ onReset, isResetting = false, matchesCount = 0 }) => {
  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'Matches', path: '/matches', icon: Heart, badge: matchesCount },
  ];

  return (
    <header className="hidden md:block w-full bg-white/90 backdrop-blur-md border-b border-[#EAE6F0] sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Coy Brand Logo */}
        <NavLink to="/discover" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#FF347F] border-2 border-[#191722] shadow-coy-sm flex items-center justify-center transition-transform group-hover:scale-105">
            <Heart className="w-5 h-5 fill-white text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-[#191722]">
              coy<span className="text-[#FF347F]">.</span>
            </span>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="flex items-center gap-2 bg-[#F5F2FA] p-1.5 rounded-2xl border border-[#EAE6F0]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-white text-[#FF347F] border-2 border-[#191722] shadow-coy-sm'
                      : 'text-[#85818F] hover:text-[#191722] hover:bg-white/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF347F]' : 'text-[#85818F]'}`} />
                    <span>{item.name}</span>
                    {item.badge > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#FF347F] text-white">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Controls: Privacy Indicator & Reset Button */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E9E0FF] text-[11px] font-bold text-[#191722] border border-[#191722]/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF347F]" />
            <span>Mutual-Only Privacy</span>
          </div>

          {onReset && (
            <button
              type="button"
              disabled={isResetting}
              onClick={onReset}
              title="Reset Demo Swipes & Matches"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#191722] border-2 border-[#191722] shadow-coy-sm hover:bg-[#F5F2FA] text-xs font-bold active:translate-x-[1px] active:translate-y-[1px] transition-all disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span>Reset Demo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
