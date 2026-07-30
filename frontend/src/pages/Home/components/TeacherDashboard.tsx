import React from 'react';
import { useTeacherDashboard } from './useTeacherDashboard';
import { Trash2, Home, BookOpen } from 'lucide-react';
import { ClassManagementModal } from './ClassManagementModal';

export const TeacherDashboard: React.FC = () => {
  const [isClassModalOpen, setIsClassModalOpen] = React.useState(false);
  const [selectedClassId, setSelectedClassId] = React.useState(0);
  const [selectedClassName, setSelectedClassName] = React.useState('');
  const [selectedJoinCode, setSelectedJoinCode] = React.useState('');
  const [selectedIsJoinCodeActive, setSelectedIsJoinCodeActive] = React.useState(false);

  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = React.useState(false);
  const [newClassName, setNewClassName] = React.useState('');
  const [isCreatingClass, setIsCreatingClass] = React.useState(false);
  const [createClassError, setCreateClassError] = React.useState('');

  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState('');
  const [isCreatingFolder, setIsCreatingFolder] = React.useState(false);
  const [createFolderError, setCreateFolderError] = React.useState('');

  const [editingItemId, setEditingItemId] = React.useState<number | null>(null);
  const [editingItemName, setEditingItemName] = React.useState('');

  const openClassModal = (id: number, name: string, joinCode: string, isActive: boolean) => {
    setSelectedClassId(id);
    setSelectedClassName(name);
    setSelectedJoinCode(joinCode);
    setSelectedIsJoinCodeActive(isActive);
    setIsClassModalOpen(true);
  };

  const handleCreateClass = async () => {
    if (!newClassName.trim()) return;
    
    setIsCreatingClass(true);
    setCreateClassError('');
    
    try {
      // Assuming classService is imported, wait I should add import
      const { classService } = await import('../../../services/classService');
      await classService.createClass(newClassName);
      setIsCreateClassModalOpen(false);
      setNewClassName('');
      fetchClasses();
    } catch (err: any) {
      console.error(err);
      setCreateClassError(err.response?.data?.message || 'Failed to create class');
    } finally {
      setIsCreatingClass(false);
    }
  };
  const {
    lang,
    language,
    currentPath,
    contents,
    classes,
    isLoading,
    selectedIds,
    contextMenu,
    handleCreateTest,
    handleOpenTest,
    handleGoToRoot,
    handleNavigateToBreadcrumb,
    handleFolderClick,
    handleCreateFolder,
    handleSelect,
    handleContextMenu,
    closeContextMenu,
    handleRenameItem,
    handleDeleteSelected,
    fetchClasses
  } = useTeacherDashboard();

  const handleCreateFolderSubmit = async () => {
    if (!newFolderName.trim()) return;
    setIsCreatingFolder(true);
    setCreateFolderError('');
    try {
      await handleCreateFolder(newFolderName);
      setIsCreateFolderModalOpen(false);
      setNewFolderName('');
    } catch (err: any) {
      setCreateFolderError(err.response?.data?.message || 'Failed to create folder');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const startRename = () => {
    if (selectedIds.size !== 1) return;
    const id = Array.from(selectedIds)[0];
    const item = contents.find(c => c.id === id);
    if (!item) return;
    if (item.type !== 0) {
      alert("Renaming tests is not implemented on the backend yet.");
      closeContextMenu();
      return;
    }
    setEditingItemId(id);
    setEditingItemName(item.name);
    closeContextMenu();
  };

  const submitRename = async () => {
    if (editingItemId === null) return;
    await handleRenameItem(editingItemId, editingItemName);
    setEditingItemId(null);
  };

  const cancelRename = () => {
    setEditingItemId(null);
  };

  // Removed empty useEffect

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
          
          <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between relative z-10">
            <h3 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2">
              📁 {lang.teacherDashboard?.myFolders || 'My Folders'}
            </h3>
            <button
              onClick={() => setIsCreateFolderModalOpen(true)}
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
                  const isEditing = editingItemId === item.id;
                  
                  return (
                    <div 
                      key={`${isFolder ? 'folder' : 'test'}-${item.id}`}
                      onClick={(e) => {
                        if (!isEditing) handleSelect(e, item.id);
                      }}
                      onDoubleClick={() => { 
                        if (isEditing) return;
                        if (isFolder) handleFolderClick(item); 
                        else handleOpenTest(item.id); 
                      }}
                      onContextMenu={(e) => {
                        if (!isEditing) handleContextMenu(e, item.id);
                      }}
                      className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-3 py-2 rounded-lg cursor-pointer transition-colors border border-transparent ${
                        isSelected && !isEditing
                          ? 'bg-blue-50/60 border-blue-200/50' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-6 flex justify-center text-lg drop-shadow-sm opacity-90">
                        {isFolder ? '📁' : '📄'}
                      </div>
                      <div className={`font-medium text-sm truncate ${isSelected && !isEditing ? 'text-blue-900' : 'text-slate-700'}`}>
                        {isEditing ? (
                          <input
                            type="text"
                            autoFocus
                            value={editingItemName}
                            onChange={(e) => setEditingItemName(e.target.value)}
                            onBlur={submitRename}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') submitRename();
                              if (e.key === 'Escape') cancelRename();
                            }}
                            className="w-full px-2 py-1 border border-indigo-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          item.name
                        )}
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
                    onClick={() => { setIsCreateFolderModalOpen(true); closeContextMenu(); }}
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
                        onClick={startRename}
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
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 relative z-10">
            <h3 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2">
              🎓 {lang.teacherDashboard?.classes || 'Classes'}
            </h3>
            <button
              onClick={() => setIsCreateClassModalOpen(true)}
              className="flex items-center justify-center w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors shadow-sm"
              title={lang.teacherDashboard?.createClass || 'Create Class'}
            >
              <span className="text-xs">➕</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-2 relative z-10 overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
            {classes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-2 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <span className="text-3xl opacity-50">🎓</span>
                <p className="text-slate-500 font-medium">{lang.teacherDashboard?.noClassesFound || 'No classes yet.'}</p>
                <p className="text-xs text-slate-400 max-w-[200px]">{lang.teacherDashboard?.noClassesSubtext || 'Click the + button above to create your first class.'}</p>
              </div>
            ) : (
              classes.map(c => (
                <div 
                  key={c.id}
                  onClick={() => openClassModal(c.id, c.className, c.joinCode, c.isJoinCodeActive)}
                  className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group/class"
                >
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 text-sm max-w-[100px] truncate">
                      {c.className.substring(0, 5)}...
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm truncate max-w-[120px]">{c.className}</div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">
                        {c.studentCount} {lang.teacherDashboard?.students || 'Students'} • {c.teacherCount} {lang.teacherDashboard?.teachers || 'Teachers'}
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover/class:text-indigo-500 transition-colors group-hover/class:translate-x-1 duration-300 text-sm">➔</span>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>

      <ClassManagementModal 
        isOpen={isClassModalOpen} 
        onClose={() => setIsClassModalOpen(false)} 
        classId={selectedClassId}
        className={selectedClassName}
        initialJoinCode={selectedJoinCode}
        initialIsJoinCodeActive={selectedIsJoinCodeActive}
        onRename={(_, newName) => {
          setSelectedClassName(newName);
          fetchClasses();
        }}
        onCodeChange={() => {
          fetchClasses();
        }}
        lang={lang}
      />

      {/* Create Class Modal */}
      {isCreateClassModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              e.currentTarget.setAttribute('data-mousedown-target', 'true');
            } else {
              e.currentTarget.removeAttribute('data-mousedown-target');
            }
          }}
          onMouseUp={(e) => {
            if (e.target === e.currentTarget && e.currentTarget.getAttribute('data-mousedown-target') === 'true') {
              setIsCreateClassModalOpen(false);
            }
            e.currentTarget.removeAttribute('data-mousedown-target');
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col relative"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">
                {lang.teacherDashboard?.createClass || 'Create New Class'}
              </h2>
              <button 
                onClick={() => setIsCreateClassModalOpen(false)} 
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {createClassError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
                  {createClassError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {lang.teacherDashboard?.className || 'Class Name'}
                </label>
                <input 
                  type="text" 
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder={lang.teacherDashboard?.placeholderClass || 'e.g. 10.A Math'}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsCreateClassModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                {lang.teacherDashboard?.cancel || 'Cancel'}
              </button>
              <button 
                onClick={handleCreateClass}
                disabled={isCreatingClass || !newClassName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isCreatingClass ? '...' : (lang.teacherDashboard?.create || 'Create')}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Create Folder Modal */}
      {isCreateFolderModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              e.currentTarget.setAttribute('data-mousedown-target', 'true');
            } else {
              e.currentTarget.removeAttribute('data-mousedown-target');
            }
          }}
          onMouseUp={(e) => {
            if (e.target === e.currentTarget && e.currentTarget.getAttribute('data-mousedown-target') === 'true') {
              setIsCreateFolderModalOpen(false);
            }
            e.currentTarget.removeAttribute('data-mousedown-target');
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col relative"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">
                {lang.teacherDashboard?.createFolder || 'Create New Folder'}
              </h2>
              <button 
                onClick={() => setIsCreateFolderModalOpen(false)} 
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {createFolderError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
                  {createFolderError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {lang.teacherDashboard?.nameColumn || 'Folder Name'}
                </label>
                <input 
                  type="text" 
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newFolderName.trim()) {
                      handleCreateFolderSubmit();
                    }
                  }}
                  placeholder={lang.teacherDashboard?.placeholderFolder || 'e.g. Science Quizzes'}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsCreateFolderModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                {lang.teacherDashboard?.cancel || 'Cancel'}
              </button>
              <button 
                onClick={handleCreateFolderSubmit}
                disabled={isCreatingFolder || !newFolderName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isCreatingFolder ? '...' : (lang.teacherDashboard?.create || 'Create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

