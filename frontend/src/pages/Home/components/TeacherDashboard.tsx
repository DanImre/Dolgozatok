import React from 'react';
import { useTeacherDashboard } from './useTeacherDashboard';

export const TeacherDashboard: React.FC = () => {
  const {
    lang,
    currentPath,
    contents,
    isLoading,
    handleCreateTest,
    handleCreateFolder,
    handleDeleteFolder,
    handleGoToRoot,
    handleNavigateToBreadcrumb,
    handleFolderClick
  } = useTeacherDashboard();

  return (
    <div className="space-y-6">
      
      {/* Action Bar */}
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={handleCreateFolder}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl shadow-sm transition-all duration-300 font-semibold text-sm"
        >
          📁 Create Folder
        </button>
        <button
          onClick={handleCreateTest}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md hover:shadow-emerald-600/20 transition-all duration-300 font-bold text-sm"
        >
          ➕ {lang.teacherDashboard?.createTestButton || 'Create Test'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Folders & Tests Section */}
        <div className="bg-[#fcfdfc] border border-slate-200 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-100/40 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-200/40 transition-all duration-700"></div>
          
          <h3 className="font-display font-bold text-xl text-slate-800 border-b border-slate-100 pb-4 mb-4 flex items-center gap-2 relative">
            📁 {lang.teacherDashboard?.myFolders || 'My Folders'}
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
            {isLoading ? (
              <div className="text-sm text-slate-400 italic p-4 text-center">Loading...</div>
            ) : contents.length === 0 ? (
              <div className="text-sm text-slate-400 italic p-4 text-center">Empty folder</div>
            ) : (
              contents.map(item => {
                if (item.type === 0) { // Folder
                  return (
                    <div 
                      key={`folder-${item.id}`}
                      onClick={() => handleFolderClick(item)}
                      className="flex flex-row items-center justify-between p-3 rounded-xl border border-transparent hover:bg-slate-50 hover:border-slate-200 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📁</span>
                        <span className="font-semibold text-slate-700">{item.name}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteFolder(e, item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete folder recursively"
                      >
                        🗑️
                      </button>
                    </div>
                  );
                } else { // Test
                  return (
                    <div 
                      key={`test-${item.id}`}
                      className="flex items-center justify-between p-3 rounded-xl border bg-white border-slate-100 cursor-default shadow-sm transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📄</span>
                        <div>
                          <div className="font-semibold text-slate-700">{item.name}</div>
                          {item.edited && (
                            <div className="text-xs text-slate-400">Edited: {new Date(item.edited).toLocaleDateString()}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              })
            )}
          </div>
        </div>

        {/* Classes Section */}
        <div className="bg-[#fcfdfc] border border-slate-200 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100/40 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-200/40 transition-all duration-700"></div>
          
          <h3 className="font-display font-bold text-xl text-slate-800 border-b border-slate-100 pb-4 mb-5 flex items-center gap-2 relative">
            🎓 {lang.teacherDashboard?.myClasses || 'My Classes'}
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
