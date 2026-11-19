import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Heart } from 'lucide-react';

const BottomNav = ({ matchesCount = 0 }) => {
  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'Matches', path: '/matches', icon: Heart, badge: matchesCount },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#EAE6F0] px-4 py-2 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all ${
                  isActive ? 'text-[#FF347F]' : 'text-[#85818F] hover:text-[#191722]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon
                      className={`w-6 h-6 transition-transform ${
                        isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
                      }`}
                    />
                    {item.badge > 0 && (
                      <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#FF347F] text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] mt-1 font-bold tracking-tight ${
                      isActive ? 'text-[#FF347F]' : 'text-[#85818F]'
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#FF347F]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
