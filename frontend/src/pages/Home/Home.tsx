import React from 'react';
import { useHome } from './useHome';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const {
    user,
    logout,
    isAuthenticated,
    lang,
    language,
    toggleLanguage,
    tests,
    testsLoading,
    testsError,
    newTestName,
    setNewTestName,
    addingTest,
    addSuccess,
    handleAddTest
  } = useHome();

  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-[#f3f7f5]">
        <div className="max-w-md w-full bg-[#fcfdfc] border border-slate-200 rounded-2xl p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-emerald-100/60 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-teal-100/60 rounded-full blur-2xl pointer-events-none"></div>

          <div className="text-4xl mb-4">🔒</div>
          <h2 className="font-display font-bold text-xl text-slate-800 mb-2">{lang.common.errorTitle}</h2>
          <p className="text-slate-500 mb-6 font-medium">{lang.home.needLogin}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all duration-300 cursor-pointer shadow-md hover:shadow-emerald-600/20"
          >
            {lang.home.loginButton}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f7f5] text-slate-800">
      {/* Premium Academic Navbar */}
      <nav className="bg-white/80 border-b border-slate-200 backdrop-blur-md sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent select-none">
            Dolgozatok
          </span>

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

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: User Profile Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#fcfdfc] border border-slate-200 rounded-2xl p-6 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-200/40 transition-all duration-700"></div>
            
            <h3 className="font-display font-bold text-xl text-slate-800 border-b border-slate-100 pb-4 mb-5 flex items-center gap-2">
              👤 {lang.home.profileInfo}
            </h3>

            <div className="space-y-4 font-medium text-sm">
              <div className="flex flex-col bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">{lang.home.realName}</span>
                <span className="text-slate-800 text-base font-bold">{user?.realName}</span>
              </div>

              <div className="flex flex-col bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">{lang.home.email}</span>
                <span className="text-slate-800 text-base font-bold">{user?.email || lang.home.notSelected}</span>
              </div>

              <div className="flex flex-col bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">{lang.home.classId}</span>
                <span className="text-slate-800 text-base font-bold">
                  {user?.classId !== null && user?.classId !== undefined ? user.classId : lang.home.notSelected}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Database Tests Testing Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#fcfdfc] border border-slate-200 rounded-2xl p-6 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-teal-100/40 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-200/40 transition-all duration-700"></div>

            <h3 className="font-display font-bold text-xl text-slate-800 border-b border-slate-100 pb-4 mb-5 flex items-center gap-2">
              ⚡ {lang.home.databaseTestTitle}
            </h3>

            {/* Add Test Form */}
            <form onSubmit={handleAddTest} className="mb-8 space-y-4">
              {addSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium animate-pulse">
                  ✓ {lang.home.addedSuccess}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 tracking-wide mb-2">
                  {lang.home.testNameLabel}
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    required
                    value={newTestName}
                    onChange={(e) => setNewTestName(e.target.value)}
                    placeholder={lang.home.testNamePlaceholder}
                    className="flex-1 px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 font-medium text-sm shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={addingTest}
                    className="px-6 py-3 border border-transparent rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer shadow-md hover:shadow-emerald-600/20 transition-all duration-300 disabled:opacity-60"
                  >
                    {addingTest ? lang.common.loading : lang.home.addTestButton}
                  </button>
                </div>
              </div>
            </form>

            {/* Tests List */}
            <div>
              <h4 className="font-semibold text-slate-700 tracking-wide mb-4 flex items-center gap-2 text-sm">
                📋 {lang.home.testListTitle}
              </h4>

              {testsError && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold shadow-sm">
                  ⚠️ {testsError}
                </div>
              )}

              {testsLoading ? (
                <div className="flex items-center gap-2 text-sm text-slate-500 py-4 font-medium">
                  <svg className="animate-spin h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {lang.common.loading}
                </div>
              ) : tests.length === 0 ? (
                <p className="text-sm text-slate-400 italic py-4 font-medium">
                  {lang.home.noTests}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[320px] overflow-y-auto pr-1">
                  {tests.map((test) => (
                    <div
                      key={test.id}
                      className="bg-white border border-slate-100 hover:border-emerald-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="font-bold text-slate-800 mb-1">{test.name}</div>
                      <div className="text-xs text-slate-500 font-medium">
                        ID: {test.id} • {new Date(test.created).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};
