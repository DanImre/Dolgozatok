import React from 'react';
import { useHome } from './useHome';
import { useNavigate } from 'react-router-dom';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { Navbar } from '../../components/Navbar';

export const Home: React.FC = () => {
  const {
    user,
    isAuthenticated,
    lang
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
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col">
        {user?.role === 'Teacher' ? <TeacherDashboard /> : <StudentDashboard />}
      </main>
    </div>
  );
};
