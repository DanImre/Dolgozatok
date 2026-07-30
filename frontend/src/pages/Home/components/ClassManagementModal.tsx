import React from 'react';
import { Trash2, Eye, EyeOff, RefreshCw, UserPlus } from 'lucide-react';
import { useClassManagementModal } from './useClassManagementModal';

interface ClassManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: number;
  className: string;
  initialJoinCode?: string | null;
  initialIsJoinCodeActive?: boolean;
  onRename?: (id: number, newName: string) => void;
  onCodeChange?: () => void;
  lang: any;
}

export const ClassManagementModal: React.FC<ClassManagementModalProps> = ({
  isOpen,
  onClose,
  classId,
  className: initialClassName,
  initialJoinCode = null,
  initialIsJoinCodeActive = false,
  onRename,
  onCodeChange,
  lang
}) => {
  const {
    className,
    setClassName,
    joinCode,
    isJoinCodeActive,
    students,
    deleteConfirmId,
    setDeleteConfirmId,
    isAddingStudent,
    setIsAddingStudent,
    newStudentName,
    setNewStudentName,
    newStudentEmail,
    setNewStudentEmail,
    generatedToken,
    errorMsg,
    isLoadingStudents,
    handleGenerateCode,
    handleToggleCode,
    handleRemoveClick,
    handleConfirmRemove,
    handleManualAddStudent,
    handleRenameBlur,
    closeAddStudentModal
  } = useClassManagementModal({
    classId,
    initialClassName,
    initialJoinCode,
    initialIsJoinCodeActive,
    onRename,
    onCodeChange
  });

  if (!isOpen) return null;

  return (
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
          onClose();
        }
        e.currentTarget.removeAttribute('data-mousedown-target');
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                onBlur={handleRenameBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
                className="text-xl font-bold text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-48 truncate placeholder-slate-400 hover:bg-slate-100 rounded px-1 -ml-1 transition-colors"
              />
            </div>
            <span className="text-slate-400 text-sm">{lang.teacherDashboard?.classManagement || 'Class Management'}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            ✕
          </button>
        </div>

        {/* Code & Actions Bar */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <div className="flex-1"></div>
          
          <div className="flex items-center justify-center gap-6 flex-1">
            <button 
              onClick={handleToggleCode} 
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              title={isJoinCodeActive ? (lang.teacherDashboard?.deactivateCode || "Deactivate Code") : (lang.teacherDashboard?.activateCode || "Activate Code")}
            >
              {isJoinCodeActive ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>
            
            <div className="text-3xl font-mono font-bold tracking-widest text-slate-700 min-w-[200px] text-center select-all whitespace-nowrap">
              {isJoinCodeActive ? (joinCode || '------') : '------'}
            </div>
            
            <button 
              onClick={handleGenerateCode} 
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all hover:rotate-180"
              title={lang.teacherDashboard?.generateNewCode || "Generate New Code"}
            >
              <RefreshCw size={24} />
            </button>
          </div>
          
          <div className="flex-1 flex justify-end">
            <button 
              onClick={() => setIsAddingStudent(true)} 
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
              title={lang.teacherDashboard?.addStudent || "Add Student"}
            >
              <UserPlus size={28} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/50">
          
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Students List */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="divide-y divide-slate-100">
              {isLoadingStudents ? (
                <div className="p-8 text-center text-slate-500 italic">Loading students...</div>
              ) : students.length > 0 ? (
                students.map(student => (
                  <div key={student.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-slate-800">{student.name}</div>
                      <div className="text-sm text-slate-500">{student.email}</div>
                    </div>
                    
                    <div>
                      {deleteConfirmId === student.id ? (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-200">
                          <span className="text-xs text-red-500 font-medium mr-2">{lang.teacherDashboard?.areYouSure || "Are you sure?"}</span>
                          <button 
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-bold transition-colors"
                          >
                            {lang.teacherDashboard?.cancel || "Cancel"}
                          </button>
                          <button 
                            onClick={() => handleConfirmRemove(student.id)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-500/20`}
                          >
                            {lang.teacherDashboard?.removeStudent || "Remove Student"}
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleRemoveClick(student.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title={lang.teacherDashboard?.removeStudent || "Remove student from class"}
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 italic">No students in this class yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Add Student Modal Overlay */}
        {isAddingStudent && (
          <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">{lang.teacherDashboard?.addStudentManually || "Add Student Manually"}</h3>
                <button onClick={closeAddStudentModal} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500">✕</button>
              </div>

              {!generatedToken ? (
                <>
                  <p className="text-sm text-slate-500 mb-4">
                    {lang.teacherDashboard?.addStudentManuallyDesc || "Create an account for a student who cannot join themselves. You will receive a one-time token they can use to log in."}
                  </p>
                  <form onSubmit={handleManualAddStudent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">{lang.teacherDashboard?.studentName || "Student Name"}</label>
                      <input type="text" required value={newStudentName} onChange={e => setNewStudentName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">{lang.teacherDashboard?.studentEmail || "Student Email"}</label>
                      <input type="email" required value={newStudentEmail} onChange={e => setNewStudentEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="john@example.com" />
                    </div>
                    <div className="pt-2">
                      <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors shadow-sm shadow-emerald-500/20">
                        {lang.teacherDashboard?.addStudent || "Create Student"}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <UserPlus size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">Student Created!</h4>
                  <p className="text-sm text-slate-600">{lang.teacherDashboard?.generatedTokenMessage || "Save this token and give it to the student. They will need it for their first login."}</p>
                  <div className="mt-2 text-left bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <p className="font-mono text-xs break-all select-all text-slate-700">
                      https://yoursite.com/reset-password?token={generatedToken}&email={newStudentEmail}
                    </p>
                  </div>
                  <button onClick={closeAddStudentModal} className="mt-4 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors">
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
