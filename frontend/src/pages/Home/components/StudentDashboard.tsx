import React from 'react';
import { useStudentDashboard } from './useStudentDashboard';

export const StudentDashboard: React.FC = () => {
  const { lang } = useStudentDashboard();

  return (
    <div className="space-y-6">
      <div className="bg-[#fcfdfc] border border-slate-200 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="font-display font-bold text-xl text-slate-800 border-b border-slate-100 pb-4 mb-5 flex items-center gap-2">
          📝 {lang.studentDashboard.availableTests}
        </h3>
        
        {/* Dummy UI for Available Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-100 hover:border-emerald-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
            <div className="font-bold text-slate-800 mb-1">Mathematics Mid-term</div>
            <div className="text-xs text-slate-500 font-medium">Time limit: 45 mins</div>
          </div>
          <div className="bg-white border border-slate-100 hover:border-emerald-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
            <div className="font-bold text-slate-800 mb-1">History Pop Quiz</div>
            <div className="text-xs text-slate-500 font-medium">Time limit: 15 mins</div>
          </div>
        </div>
      </div>

      <div className="bg-[#fcfdfc] border border-slate-200 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="font-display font-bold text-xl text-slate-800 border-b border-slate-100 pb-4 mb-5 flex items-center gap-2">
          ✅ {lang.studentDashboard.completedTests}
        </h3>
        
        {/* Dummy UI for Completed Tests */}
        <div className="space-y-3">
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex justify-between items-center">
            <div>
              <div className="font-bold text-slate-800 mb-1">English Literature Basics</div>
              <div className="text-xs text-slate-500 font-medium">Submitted: 2 days ago</div>
            </div>
            <div className="text-emerald-600 font-bold">95%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
