import React, { useState, useRef, useEffect } from 'react';
import { Globe, User, LogOut } from 'lucide-react';
import { useNavbar } from './useNavbar';

export const Navbar: React.FC = () => {
  const { lang, language, toggleLanguage, user, logout, handleNavigateHome } = useNavbar();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white/80 border-b border-slate-200 backdrop-blur-md sticky top-0 z-50 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button 
          onClick={handleNavigateHome}
          className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent select-none cursor-pointer hover:opacity-80 transition-opacity"
        >
          Dolgozatok
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50 text-slate-600 rounded-lg cursor-pointer transition-all duration-300 font-semibold text-sm shadow-sm"
          >
            <Globe size={16} className="text-emerald-600" /> {language.toUpperCase()}
          </button>
          
          {user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-white text-slate-700 rounded-full cursor-pointer transition-all duration-300 font-semibold text-sm shadow-sm"
              >
                <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-full">
                  <User size={16} />
                </div>
                {user.realName}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 bg-slate-50 border-b border-slate-100">
                    <p className="font-bold text-slate-800">{user.realName}</p>
                    <p className="text-xs text-slate-500 font-medium truncate">{user.email || lang.navbar?.noEmail || 'No email provided'}</p>
                  </div>
                  <div className="p-2">
                    <div className="px-3 py-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">{lang.navbar?.roleAndClass || 'Role & Class'}</span>
                      <p className="text-sm text-slate-700 font-medium">
                        {user.role} {user.className ? `• ${user.className}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl cursor-pointer transition-all duration-300 font-bold text-sm shadow-sm"
                    >
                      <LogOut size={16} /> {lang.navbar?.logout || 'Logout'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
