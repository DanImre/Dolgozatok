import React from 'react';
import { Globe, Eye, EyeOff, CheckCircle2, Clock, AlertTriangle, GraduationCap, Mail, User, ArrowRight, Circle, UserCheck } from 'lucide-react';
import { useRegister } from './useRegister';

export const Register: React.FC = () => {
  const {
    loading,
    status,
    studentDetails,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    hasMinLength,
    hasUpper,
    hasLower,
    hasDigit,
    passwordsMatch,
    isPasswordValid,
    submitting,
    error,
    success,
    handleSubmit,
    lang,
    language,
    toggleLanguage,
    goToLogin
  } = useRegister();

  return (
    <div className="relative min-h-screen flex flex-col justify-start sm:justify-center items-center pt-20 pb-12 px-3 sm:py-16 sm:px-6 lg:px-8 bg-slate-50 overflow-x-hidden w-full">
      {/* Language Switcher in top right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/90 border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50 text-slate-700 rounded-lg cursor-pointer transition-all duration-300 font-semibold text-xs sm:text-sm shadow-sm backdrop-blur-sm"
        >
          <Globe size={15} className="text-emerald-600" /> {language.toUpperCase()}
        </button>
      </div>

      <div className="max-w-md w-full space-y-5 sm:space-y-6">
        {/* Brand Header */}
        <div className="text-center pt-2 sm:pt-0">
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-relaxed pb-1 sm:pb-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent drop-shadow-sm select-none">
            Dolgozatok
          </h1>
        </div>

        {/* State 1: Loading */}
        {loading ? (
          <div className="bg-white border border-slate-200 py-12 px-6 sm:px-10 rounded-2xl shadow-sm text-center">
            <div className="flex items-center justify-center gap-3 text-emerald-600 font-semibold text-base">
              <svg className="animate-spin h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{lang.common?.loading || "Betöltés..."}</span>
            </div>
          </div>
        ) : status === 'Expired' ? (
          /* State 2: Expired Link */
          <div className="bg-white border border-slate-200 py-8 px-4 sm:py-10 sm:px-10 rounded-2xl shadow-sm text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
              <Clock size={32} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                {lang.register?.expiredTitle || "A regisztrációs link lejárt"}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
                {lang.register?.expiredSubtitle || "Ez a meghívó link több mint 1 hete készült, ezért érvényét vesztette. Kérj új meghívót a tanárodtól!"}
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={goToLogin}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all duration-300"
              >
                <span>{lang.register?.goToLogin || "Ugrás a bejelentkezéshez"}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : status === 'AlreadyRegistered' ? (
          /* State 2.5: Already Registered / Used Link */
          <div className="bg-white border border-slate-200 py-8 px-4 sm:py-10 sm:px-10 rounded-2xl shadow-sm text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-200">
              <UserCheck size={32} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                {lang.register?.alreadyRegisteredTitle || "A linket már felhasználták"}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
                {lang.register?.alreadyRegisteredSubtitle || "Ezzel a meghívó linkkel a regisztráció már sikeresen megtörtént. Kérjük, jelentkezz be a fiókodba a jelszavaddal!"}
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={goToLogin}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all duration-300"
              >
                <span>{lang.register?.goToLogin || "Ugrás a bejelentkezéshez"}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : status === 'NotFound' ? (
          /* State 3: Invalid Link */
          <div className="bg-white border border-slate-200 py-8 px-4 sm:py-10 sm:px-10 rounded-2xl shadow-sm text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                {lang.common?.errorTitle || "Érvénytelen link"}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
                A megadott regisztrációs link nem található vagy érvénytelen.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={goToLogin}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all duration-300"
              >
                <span>{lang.register?.goToLogin || "Ugrás a bejelentkezéshez"}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* State 4: Valid Registration Form */
          <div className="bg-white border border-slate-200 py-6 px-4 sm:py-8 sm:px-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5 sm:space-y-6 w-full overflow-hidden">
            <div className="text-center">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800 tracking-wide">
                {lang.register?.title || "Regisztráció Befejezése"}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                {lang.register?.subtitle || "Állítsd be a jelszavad a fiókod aktiválásához"}
              </p>
            </div>

            {error && (
              <div className="p-3.5 sm:p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
                <AlertTriangle size={18} className="shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 sm:p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
                <CheckCircle2 size={18} className="shrink-0" />
                <span>{lang.register?.successMessage || "Sikeres regisztráció! Átirányítás..."}</span>
              </div>
            )}

            {/* Read-only Student Info */}
            <div className="bg-slate-50/80 rounded-xl p-3.5 sm:p-4 border border-slate-200 space-y-2.5 sm:space-y-3 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-0.5 sm:gap-2">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium shrink-0">
                  <User size={15} className="text-slate-400 shrink-0" />
                  {lang.register?.nameLabel || "Név"}:
                </span>
                <span className="font-bold text-slate-800 break-words sm:text-right">
                  {studentDetails?.name}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-0.5 sm:gap-2">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium shrink-0">
                  <Mail size={15} className="text-slate-400 shrink-0" />
                  {lang.register?.emailLabel || "Email"}:
                </span>
                <span className="font-mono text-slate-700 text-xs sm:text-sm font-semibold break-all sm:text-right">
                  {studentDetails?.email}
                </span>
              </div>

              {studentDetails?.classes && studentDetails.classes.length > 0 ? (
                <div className="pt-2 border-t border-slate-200/70">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5 font-semibold mb-2">
                    <GraduationCap size={15} className="text-emerald-600 shrink-0" />
                    {lang.register?.futureClassesLabel || "Csatlakozás a következő osztályokhoz:"}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {studentDetails.classes.map((cls, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100/70 text-emerald-800 border border-emerald-200 break-words">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-200/70">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                    <GraduationCap size={15} className="text-slate-400 shrink-0" />
                    {lang.register?.noClassesAssigned || "Jelenleg nem vagy hozzárendelve egy osztályhoz sem. Később csatlakozhatsz osztálykóddal."}
                  </span>
                </div>
              )}
            </div>

            {/* Password Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {lang.register?.passwordLabel || "Új jelszó"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={lang.register?.passwordPlaceholder || "Legalább 8 karakter"}
                    className="w-full pl-4 pr-11 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 font-medium shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {lang.register?.confirmPasswordLabel || "Új jelszó megerősítése"}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder={lang.register?.confirmPasswordPlaceholder || "Jelszó újra"}
                    className={`w-full pl-4 pr-11 py-3 bg-slate-50/50 border ${
                      confirmPassword && password !== confirmPassword 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'
                    } rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 transition-all duration-300 font-medium shadow-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {lang.register?.passwordMismatch || "A jelszavak nem egyeznek"}
                  </p>
                )}
              </div>

              {/* Password Requirements Checklist */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 transition-all">
                <div className="text-xs font-bold text-slate-700">
                  {lang.register?.passwordCriteriaTitle || "A jelszónak meg kell felelnie a következőknek:"}
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className={`flex items-center gap-2 font-medium transition-colors duration-200 ${hasMinLength ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {hasMinLength ? (
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Circle size={15} className="text-slate-300 shrink-0" />
                    )}
                    <span>{lang.register?.criteriaMinLength || "Legalább 8 karakter hosszú"}</span>
                  </div>

                  <div className={`flex items-center gap-2 font-medium transition-colors duration-200 ${hasUpper ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {hasUpper ? (
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Circle size={15} className="text-slate-300 shrink-0" />
                    )}
                    <span>{lang.register?.criteriaUppercase || "Legalább egy nagybetű (A-Z)"}</span>
                  </div>

                  <div className={`flex items-center gap-2 font-medium transition-colors duration-200 ${hasLower ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {hasLower ? (
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Circle size={15} className="text-slate-300 shrink-0" />
                    )}
                    <span>{lang.register?.criteriaLowercase || "Legalább egy kisbetű (a-z)"}</span>
                  </div>

                  <div className={`flex items-center gap-2 font-medium transition-colors duration-200 ${hasDigit ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {hasDigit ? (
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Circle size={15} className="text-slate-300 shrink-0" />
                    )}
                    <span>{lang.register?.criteriaDigit || "Legalább egy szám (0-9)"}</span>
                  </div>

                  <div className={`flex items-center gap-2 font-medium transition-colors duration-200 ${passwordsMatch ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {passwordsMatch ? (
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Circle size={15} className="text-slate-300 shrink-0" />
                    )}
                    <span>{lang.register?.criteriaMatch || "A két jelszó megegyezik"}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || success || !isPasswordValid}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {lang.register?.loading || "Regisztráció folyamatban..."}
                    </span>
                  ) : (
                    lang.register?.submitButton || "Regisztráció Véglegesítése"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
