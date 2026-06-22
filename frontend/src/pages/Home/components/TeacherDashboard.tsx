import React from 'react';
import { useTeacherDashboard } from './useTeacherDashboard';
import { Trash2, Home, BookOpen } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    lang,
    language,
    currentPath,
    contents,
    isLoading,
    handleCreateTest,
    handleCreateFolder,
    handleOpenTest,
    handleGoToRoot,
    handleNavigateToBreadcrumb,
    handleFolderClick,
    selectedIds,
    contextMenu,
    handleSelect,
    handleContextMenu,
    closeContextMenu,
    handleRenameItem,
    handleDeleteSelected
  } = useTeacherDashboard();

  const dummyTests = [
    { id: 1, name: 'Midterm Math', className: '10.A', dateRange: '2026-06-25 10:00 - 11:30', status: 'scheduled' },
    { id: 2, name: 'History Quiz', className: '11.B', dateRange: '2026-06-21 08:00 - 08:45', status: 'reviewable' },
    { id: 3, name: 'Physics Final', className: '12.A', dateRange: '2026-06-28 12:00 - 14:00', status: 'scheduled' },
  ];

  return (
    <div className="flex-1 flex flex-col space-y-4">
      
      {/* Create Test Action Banner */}
      <div 
        onClick={handleCreateTest}
        className="group relative bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl p-4 shadow-sm cursor-pointer overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5"
      >
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-0.5">
              {lang.teacherDashboard?.createTestButton || 'Create New Test'}
            </h2>
            <p className="text-emerald-50 text-xs">
              {lang.teacherDashboard?.createTestDesc || 'Design and publish a new assessment for your students.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tests Overview Section */}
      <div className="bg-[#fcfdfc] border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-100/30 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-3 relative z-10">
          <h3 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2">
            📋 {lang.teacherDashboard?.testsOverview || 'Tests Overview'}
          </h3>
          <button
            onClick={handleCreateTest}
            className="flex items-center justify-center w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors shadow-sm"
            title={lang.teacherDashboard?.addTest || 'Add Test'}
          >
            <span className="text-xs">➕</span>
          </button>
        </div>
        
        <div 
          className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar snap-x relative z-10"
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
        >
          {dummyTests.map(test => (
            <div 
              key={`dummy-${test.id}`}
              className={`min-w-[280px] sm:min-w-[320px] snap-start border p-3 rounded-xl flex flex-col gap-2 transition-all hover:shadow-md cursor-pointer ${
                test.status === 'scheduled' 
                  ? 'bg-blue-50/30 border-blue-100 hover:border-blue-300' 
                  : 'bg-orange-50/30 border-orange-100 hover:border-orange-300'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="font-bold text-slate-800 text-sm truncate" title={test.name}>{test.name}</div>
                <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded flex-shrink-0 ${
                  test.status === 'scheduled' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {test.status === 'scheduled' ? (lang.teacherDashboard?.scheduled || 'Scheduled') : (lang.teacherDashboard?.reviewable || 'Reviewable')}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200/50 shadow-sm flex-shrink-0">{test.className}</span>
                  <span className="truncate" title={test.dateRange}>{test.dateRange}</span>
                </div>
                <span className="text-slate-300 transition-colors text-sm">➔</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row: Folders and Classes */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[350px]">
        
        {/* Left Column: Folders */}
        <div className="lg:col-span-2 bg-[#fcfdfc] border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-100/30 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between relative z-10">
            <h3 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2">
              📁 {lang.teacherDashboard?.myFolders || 'My Folders'}
            </h3>
            <button
              onClick={handleCreateFolder}
              className="flex items-center justify-center w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors shadow-sm"
              title={lang.teacherDashboard?.createFolder || 'Create Folder'}
            >
              <span className="text-xs">➕</span>
            </button>
          </div>

          {/* Breadcrumb Path */}
          <div className="flex items-center gap-1 mb-3 bg-slate-50 p-1.5 rounded-lg border border-slate-200 overflow-x-auto relative z-10 custom-scrollbar">
            <button 
              onClick={handleGoToRoot}
              className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors flex-shrink-0"
              title="Go to root"
            >
              <Home size={16} />
            </button>
            {currentPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <span className="text-slate-400 select-none flex-shrink-0 text-sm">/</span>
                <button
                  onClick={() => handleNavigateToBreadcrumb(index)}
                  className="px-1.5 py-0.5 hover:bg-slate-200 rounded text-xs font-medium text-slate-700 transition-colors whitespace-nowrap"
                >
                  {folder.name}
                </button>
              </React.Fragment>
            ))}
          </div>
          
          {/* Items List */}
          <div 
            className="space-y-1 relative z-10 flex-1 overflow-y-auto custom-scrollbar"
            onContextMenu={(e) => handleContextMenu(e, null)}
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="text-sm text-slate-400 italic">Loading...</div>
              </div>
            ) : contents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                <span className="text-3xl">📂</span>
                <div className="text-sm text-slate-400">{lang.teacherDashboard?.emptyFolder || 'This folder is empty'}</div>
              </div>
            ) : (
              <div className="flex flex-col min-w-full pb-20 pt-2">
                {contents.map(item => {
                  const isSelected = selectedIds.has(item.id);
                  const isFolder = item.type === 0;
                  
                  return (
                    <div 
                      key={`${isFolder ? 'folder' : 'test'}-${item.id}`}
                      onClick={(e) => handleSelect(e, item.id)}
                      onDoubleClick={() => { if (isFolder) handleFolderClick(item); else handleOpenTest(item.id); }}
                      onContextMenu={(e) => handleContextMenu(e, item.id)}
                      className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-3 py-2 rounded-lg cursor-pointer transition-colors border border-transparent ${
                        isSelected 
                          ? 'bg-blue-50/60 border-blue-200/50' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-6 flex justify-center text-lg drop-shadow-sm opacity-90">
                        {isFolder ? '📁' : '📄'}
                      </div>
                      <div className={`font-medium text-sm truncate ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                        {item.name}
                      </div>
                      <div className="w-24 text-right text-xs text-slate-400 truncate" title="Created">
                        {item.created ? new Date(item.created).toLocaleDateString(language === 'hu' ? 'hu-HU' : 'en-US') : '--'}
                      </div>
                      <div className="w-24 text-right text-xs text-slate-400 truncate" title="Edited">
                        {item.edited ? new Date(item.edited).toLocaleDateString(language === 'hu' ? 'hu-HU' : 'en-US') : '--'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Context Menu */}
          {contextMenu.isOpen && (
            <div 
              className="fixed z-50 bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-xl rounded-xl py-1 min-w-[180px] text-sm overflow-hidden animate-in fade-in zoom-in-95 duration-100"
              style={{ top: contextMenu.y, left: contextMenu.x }}
              onClick={(e) => e.stopPropagation()}
            >
              {contextMenu.targetId === null ? (
                <>
                  <button 
                    onClick={() => { handleCreateFolder(); closeContextMenu(); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100/80 transition-colors flex items-center gap-2"
                  >
                    <span className="text-slate-400">📁</span> {lang.teacherDashboard?.createFolder || 'Create Folder'}
                  </button>
                  <button 
                    onClick={() => { handleCreateTest(); closeContextMenu(); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100/80 transition-colors flex items-center gap-2"
                  >
                    <span className="text-slate-400">📄</span> {lang.teacherDashboard?.addTest || 'Create Test'}
                  </button>
                </>
              ) : (
                <>
                  {selectedIds.size === 1 && (
                    <>
                      {contents.find(i => i.id === Array.from(selectedIds)[0])?.type === 1 && (
                        <button 
                          onClick={() => { handleOpenTest(Array.from(selectedIds)[0]); closeContextMenu(); }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-100/80 transition-colors flex items-center gap-2"
                        >
                          <BookOpen size={16} className="text-slate-400" /> {lang.teacherDashboard?.open || 'Open'}
                        </button>
                      )}
                      <button 
                        onClick={() => { handleRenameItem(); closeContextMenu(); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-100/80 transition-colors flex items-center gap-2"
                      >
                        <span className="text-slate-400">✏️</span> {lang.teacherDashboard?.rename || 'Rename'}
                      </button>
                    </>
                  )}
                  <button 
                    disabled
                    className="w-full text-left px-4 py-2 opacity-50 flex items-center gap-2 cursor-not-allowed"
                  >
                    <span className="text-slate-400">✂️</span> {lang.teacherDashboard?.cut || 'Cut'}
                  </button>
                  <button 
                    disabled
                    className="w-full text-left px-4 py-2 opacity-50 flex items-center gap-2 cursor-not-allowed"
                  >
                    <span className="text-slate-400">📋</span> {lang.teacherDashboard?.copy || 'Copy'}
                  </button>
                  <div className="h-px bg-slate-200/60 my-1"></div>
                  <button 
                    onClick={() => { handleDeleteSelected(); closeContextMenu(); }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={16} className="opacity-70" /> {lang.teacherDashboard?.delete || 'Delete'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Classes */}
        <div className="lg:col-span-1 bg-[#fcfdfc] border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col">
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none"></div>
          
          <h3 className="font-display font-bold text-lg text-slate-800 border-b border-slate-100 pb-3 mb-3 flex items-center gap-2 relative z-10">
            🎓 {lang.teacherDashboard?.classes || 'Classes'}
          </h3>
          
          <div className="grid grid-cols-1 gap-2 relative z-10 overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
            <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group/class">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 text-sm">
                  10.A
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">32 {lang.teacherDashboard?.students || 'Students'}</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">2 {lang.teacherDashboard?.teachers || 'Teachers'}</div>
                </div>
              </div>
              <span className="text-slate-300 group-hover/class:text-indigo-500 transition-colors group-hover/class:translate-x-1 duration-300 text-sm">➔</span>
            </div>
            
            <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group/class">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 text-sm">
                  11.B
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">28 {lang.teacherDashboard?.students || 'Students'}</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">3 {lang.teacherDashboard?.teachers || 'Teachers'}</div>
                </div>
              </div>
              <span className="text-slate-300 group-hover/class:text-indigo-500 transition-colors group-hover/class:translate-x-1 duration-300 text-sm">➔</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

