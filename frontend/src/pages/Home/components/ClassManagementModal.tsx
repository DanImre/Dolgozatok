import React from 'react';
import { Trash2, Eye, EyeOff, RefreshCw, UserPlus, ArrowLeft, Mail, Clock } from 'lucide-react';
import { useClassManagementModal } from './useClassManagementModal';
import { Modal } from '../../../components/ui/Modal';

interface ClassManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: number;
  className: string;
  initialJoinCode?: string | null;
  initialIsJoinCodeActive?: boolean;
  onRename?: (id: number, newName: string) => void;
  onCodeChange?: () => void;
  onRequestDelete?: (id: number, name: string) => void;
  lang: any;
}

const ThreeDotsLoading: React.FC<{ className?: string }> = ({ className = 'text-current' }) => (
  <span className={`inline-flex items-center gap-1.5 py-1 justify-center ${className}`}>
    <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
    <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
    <span className="w-2 h-2 rounded-full bg-current animate-bounce" />
  </span>
);

export const ClassManagementModal: React.FC<ClassManagementModalProps> = ({
  isOpen,
  onClose,
  classId,
  className: initialClassName,
  initialJoinCode = null,
  initialIsJoinCodeActive = false,
  onRename,
  onCodeChange,
  onRequestDelete,
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
    emailCheckStatus,
    isAlreadyInClass,
    isSubmitting,
    successMsg,
    errorMsg,
    isLoadingStudents,
    handleGenerateCode,
    handleToggleCode,
    handleRemoveClick,
    handleConfirmRemove,
    handleEmailChange,
    handleEmailCheck,
    handleStudentSubmit,
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

  React.useEffect(() => {
    if (!isOpen) {
      closeAddStudentModal();
    }
  }, [isOpen, closeAddStudentModal]);

  if (!isOpen) return null;

  const modalTitle = (
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
    </div>
  );

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isEmailValid = isValidEmail(newStudentEmail);
  const showEmailError = newStudentEmail.length > 0 && !isEmailValid && emailCheckStatus === 'idle';

  const canSubmit = 
    !isSubmitting && 
    !isAlreadyInClass && 
    isEmailValid && 
    (emailCheckStatus === 'exists' || (emailCheckStatus === 'new' && newStudentName.trim().length > 0));

  const getButtonText = () => {
    if (isAlreadyInClass) {
      return lang.teacherDashboard?.alreadyInClass || "Student is already in this class";
    }
    if (emailCheckStatus === 'exists') {
      return lang.teacherDashboard?.addStudent || "Diák Hozzáadása";
    }
    if (emailCheckStatus === 'new') {
      return lang.teacherDashboard?.registerUser || "Felhasználó Regisztrálása";
    }
    return lang.teacherDashboard?.addStudent || "Diák Hozzáadása";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} maxWidth="max-w-3xl">
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
            {isAddingStudent ? (
              <button 
                onClick={closeAddStudentModal} 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                title={lang.teacherDashboard?.back || "Back"}
              >
                <ArrowLeft size={28} />
              </button>
            ) : (
              <button 
                onClick={() => setIsAddingStudent(true)} 
                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                title={lang.teacherDashboard?.addStudent || "Add Student"}
              >
                <UserPlus size={28} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/50">
          
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200 animate-in fade-in duration-200">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm font-medium border border-emerald-200 animate-in fade-in duration-200">
              ✓ {successMsg}
            </div>
          )}

          {isAddingStudent ? (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">{lang.teacherDashboard?.addStudent || "Add Student"}</h3>
              </div>

              <form onSubmit={handleStudentSubmit} className="space-y-5">
                {/* 1. Student Email Input (on top) */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    {lang.teacherDashboard?.studentEmail || "Student Email"}
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={newStudentEmail} 
                    onChange={handleEmailChange}
                    onBlur={() => handleEmailCheck()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleEmailCheck();
                      }
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg border ${showEmailError ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-emerald-500'} focus:ring-2 outline-none transition-colors`}
                    placeholder={lang.teacherDashboard?.placeholderStudentEmail || "john@example.com"}
                  />
                  {showEmailError && (
                    <p className="text-xs text-red-500 mt-1 font-medium">Please enter a valid email address</p>
                  )}
                  {isAlreadyInClass && (
                    <p className="text-xs text-amber-600 mt-1 font-medium">
                      ⚠️ {lang.teacherDashboard?.alreadyInClass || "Student is already in this class."}
                    </p>
                  )}
                </div>

                {/* 2. Student Name Input (below email) */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    {lang.teacherDashboard?.studentName || "Student Name"}
                  </label>

                  {emailCheckStatus === 'checking' ? (
                    <div className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-emerald-600 min-h-[44px]">
                      <ThreeDotsLoading />
                    </div>
                  ) : emailCheckStatus === 'idle' ? (
                    <div className="w-full px-4 py-2.5 rounded-lg border border-emerald-200/80 bg-emerald-50/50 flex items-center justify-center min-h-[44px] cursor-not-allowed select-none shadow-sm transition-colors">
                      <span className="text-xs font-medium text-emerald-700/80 flex items-center gap-1.5 select-none">
                        🔒 {lang.teacherDashboard?.enterEmailFirst || "Add meg az email címet a név megadásához"}
                      </span>
                    </div>
                  ) : emailCheckStatus === 'exists' ? (
                    <div className="relative">
                      <input 
                        type="text" 
                        disabled 
                        readOnly
                        value={newStudentName} 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-700 cursor-not-allowed font-medium shadow-sm transition-colors"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        ✓ {lang.teacherDashboard?.studentName || "Registered User"}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input 
                        type="text" 
                        required 
                        value={newStudentName} 
                        onChange={e => setNewStudentName(e.target.value)} 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-emerald-500 focus:ring-2 outline-none transition-colors text-slate-800"
                        placeholder={lang.teacherDashboard?.placeholderStudentName || "John Doe"} 
                      />
                    </div>
                  )}
                </div>

                {/* 3. Action Submit Button */}
                <div className="pt-4 border-t border-slate-100">
                  <button 
                    type="submit" 
                    disabled={!canSubmit}
                    className={`w-full py-3 text-white font-bold rounded-lg transition-all shadow-sm flex items-center justify-center min-h-[48px] ${
                      canSubmit 
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 cursor-pointer' 
                        : 'bg-slate-300 cursor-not-allowed opacity-75'
                    }`}
                  >
                    {isSubmitting || emailCheckStatus === 'checking' ? (
                      <ThreeDotsLoading className="text-white" />
                    ) : (
                      getButtonText()
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
              {/* Students List */}
              <div className="divide-y divide-slate-100">
                {isLoadingStudents ? (
                  <div className="p-8 text-center text-slate-500 italic flex items-center justify-center gap-2">
                    <ThreeDotsLoading className="text-emerald-600" />
                    <span>{lang.teacherDashboard?.loadingStudents || "Loading students..."}</span>
                  </div>
                ) : students.length > 0 ? (
                  students.map(student => {
                    const isInvited = !!student.isInvited;
                    return (
                      <div 
                        key={`${isInvited ? 'invited-' : 'enrolled-'}${student.id}`} 
                        className={`flex items-center justify-between p-4 transition-colors ${
                          isInvited 
                            ? 'bg-slate-100/70 hover:bg-slate-100 text-slate-600' 
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${isInvited ? 'text-slate-600' : 'text-slate-800'}`}>
                              {student.name}
                            </span>
                            {isInvited && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-600 border border-slate-300">
                                <Clock size={12} />
                                {lang.teacherDashboard?.invited || "Meghívva"}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Mail size={13} className="text-slate-400" />
                            {student.email}
                          </div>
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
                                onClick={() => handleConfirmRemove(student.id, isInvited)}
                                className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-500/20"
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
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-slate-500 italic">{lang.teacherDashboard?.noStudentsYet || "No students in this class yet."}</div>
                )}
              </div>
            </div>

            {/* Danger Zone: Delete Class */}
            {onRequestDelete && (
              <div className="pt-2">
                <div className="bg-red-50/40 border border-red-200/70 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-red-900 flex items-center gap-1.5">
                      <Trash2 size={16} className="text-red-600 shrink-0" />
                      <span>{lang.teacherDashboard?.deleteClass || "Osztály törlése"}</span>
                    </h4>
                    <p className="text-xs text-red-600/80 mt-0.5">
                      {lang.teacherDashboard?.deleteClassWarning || "Az osztály végleges törlése és a hozzárendelt diákok lekapcsolása."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRequestDelete(classId, className)}
                    className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Trash2 size={15} />
                    <span>{lang.teacherDashboard?.deleteClass || "Osztály törlése"}</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        </div>
    </Modal>
  );
};
