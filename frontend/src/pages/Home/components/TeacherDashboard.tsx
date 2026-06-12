import React from 'react';
import { useTeacherDashboard } from './useTeacherDashboard';

export const TeacherDashboard: React.FC = () => {
  const {
    lang,
    currentPath,
    currentFolderContents,
    handleCreateTest,
    handleGoToRoot,
    handleNavigateToBreadcrumb,
    handleItemClick
  } = useTeacherDashboard();

  return (
    <div className="space-y-6">
      
      {/* Action Bar */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCreateTest}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md hover:shadow-emerald-600/20 transition-all duration-300 font-bold text-sm"
        >
          ➕ {lang.teacherDashboard.createTestButton}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Folders Section (File Explorer Style) */}
        <div className="bg-[#fcfdfc] border border-slate-200 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-100/40 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-200/40 transition-all duration-700"></div>
          
          <h3 className="font-display font-bold text-xl text-slate-800 border-b border-slate-100 pb-4 mb-4 flex items-center gap-2 relative">
            📁 {lang.teacherDashboard.myFolders}
          </h3>

          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-200 overflow-x-auto relative z-10 custom-scrollbar">
            <button 
              onClick={handleGoToRoot}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors flex-shrink-0"
              title="Go to root"
            >
              🏠
            </button>
            {currentPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <span className="text-slate-400 select-none flex-shrink-0">/</span>
                <button
                  onClick={() => handleNavigateToBreadcrumb(index)}
                  className="px-2 py-1 hover:bg-slate-200 rounded text-sm font-medium text-slate-700 transition-colors whitespace-nowrap"
                >
                  {folder.name}
                </button>
              </React.Fragment>
            ))}
          </div>
          
          {/* Items List */}
          <div className="space-y-2 relative z-10 min-h-[150px]">
            {currentFolderContents.length === 0 ? (
              <div className="text-sm text-slate-400 italic p-4 text-center">Empty folder</div>
            ) : (
              currentFolderContents.map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${item.type === 'folder' ? 'border-transparent hover:bg-slate-50 hover:border-slate-200 cursor-pointer' : 'bg-white border-slate-100 cursor-default shadow-sm'}`}
                >
                  <span className="text-xl">{item.type === 'folder' ? '📁' : '📄'}</span>
                  <span className="font-semibold text-slate-700">{item.name}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Classes Section */}
        <div className="bg-[#fcfdfc] border border-slate-200 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100/40 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-200/40 transition-all duration-700"></div>
          
          <h3 className="font-display font-bold text-xl text-slate-800 border-b border-slate-100 pb-4 mb-5 flex items-center gap-2 relative">
            🎓 {lang.teacherDashboard.myClasses}
          </h3>
          
          {/* Dummy UI for Classes */}
          <div className="grid grid-cols-1 gap-3 relative">
            <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
              <div>
                <div className="font-bold text-slate-800">10.A</div>
                <div className="text-xs text-slate-500 font-medium">32 Students</div>
              </div>
              <span className="text-slate-400">➔</span>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
              <div>
                <div className="font-bold text-slate-800">11.B</div>
                <div className="text-xs text-slate-500 font-medium">28 Students</div>
              </div>
              <span className="text-slate-400">➔</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
