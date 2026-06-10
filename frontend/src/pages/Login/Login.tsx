import React from 'react';
import { useLogin } from './useLogin';

export const Login: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
    lang,
    language,
    toggleLanguage,
    navigate
  } = useLogin();

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Language Switcher in top right */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50 text-slate-600 rounded-lg cursor-pointer transition-all duration-300 font-medium text-sm shadow-sm backdrop-blur-sm"
        >
          🌐 {language.toUpperCase()}
        </button>
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent drop-shadow-sm select-none">
            Dolgozatok
          </h1>
          <h2 className="mt-4 font-display font-bold text-2xl text-slate-800 tracking-wide">
            {lang.login.title}
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            {lang.login.subtitle}
          </p>
        </div>

        {/* Card Container with Tasteful Academic Styling */}
        <div className="mt-8 bg-[#fcfdfc] border border-slate-200 py-8 px-6 sm:px-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          {/* Decorative soft green glows behind the card content */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-200/50 transition-all duration-700"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-teal-100/60 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-200/50 transition-all duration-700"></div>

          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 tracking-wide mb-2">
                {lang.login.emailLabel}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang.login.emailPlaceholder}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 font-medium shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 tracking-wide mb-2">
                {lang.login.passwordLabel}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={lang.login.passwordPlaceholder}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 font-medium shadow-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all duration-300 transform active:scale-[0.98] cursor-pointer hover:shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {lang.login.loading}
                  </span>
                ) : (
                  lang.login.button
                )}
              </button>
            </div>
          </form>


        </div>
      </div>
    </div>
  );
};
