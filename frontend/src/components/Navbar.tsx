import React from 'react';
import { useNavbar } from './useNavbar';

export const Navbar: React.FC = () => {
  const { lang, language, toggleLanguage, logout, handleNavigateHome } = useNavbar();

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
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50 text-slate-600 rounded-lg cursor-pointer transition-all duration-300 font-semibold text-xs shadow-sm"
          >
            🌐 {language.toUpperCase()}
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg cursor-pointer transition-all duration-300 font-semibold text-sm shadow-sm"
          >
            {lang.navbar.logout}
          </button>
        </div>
      </div>
    </nav>
  );
};
