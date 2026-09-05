import { useState, useEffect, useCallback } from 'react';
import { classService, type StudentListItem } from '../../../services/classService';

export type Student = StudentListItem;
export type EmailCheckStatus = 'idle' | 'checking' | 'exists' | 'new';

export interface UseClassManagementModalProps {
  classId: number;
  initialClassName: string;
  initialJoinCode: string | null;
  initialIsJoinCodeActive: boolean;
  onRename?: (id: number, newName: string) => void;
  onCodeChange?: () => void;
}

export const useClassManagementModal = ({
  classId,
  initialClassName,
  initialJoinCode,
  initialIsJoinCodeActive,
  onRename,
  onCodeChange
}: UseClassManagementModalProps) => {
  const [className, setClassName] = useState(initialClassName);
  const [joinCode, setJoinCode] = useState<string | null>(initialJoinCode);
  const [isJoinCodeActive, setIsJoinCodeActive] = useState<boolean>(initialIsJoinCodeActive);

  const [students, setStudents] = useState<Student[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteTimeout, setDeleteTimeout] = useState<boolean>(false);
  
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [emailCheckStatus, setEmailCheckStatus] = useState<EmailCheckStatus>('idle');
  const [isAlreadyInClass, setIsAlreadyInClass] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  // Sync state when props change
  useEffect(() => {
    setClassName(initialClassName);
  }, [initialClassName]);

  useEffect(() => {
    setJoinCode(initialJoinCode);
    setIsJoinCodeActive(initialIsJoinCodeActive);
  }, [initialJoinCode, initialIsJoinCodeActive]);

  const fetchStudents = useCallback(async () => {
    setIsLoadingStudents(true);
    try {
      const data = await classService.getStudents(classId);
      setStudents(data);
    } catch (err: any) {
      console.error('Failed to fetch students', err);
    } finally {
      setIsLoadingStudents(false);
    }
  }, [classId]);

  useEffect(() => {
    if (classId) {
      fetchStudents();
    }
  }, [classId, fetchStudents]);

  const handleGenerateCode = async () => {
    try {
      const res = await classService.generateJoinCode(classId);
      setJoinCode(res.code);
      setIsJoinCodeActive(true);
      setErrorMsg(null);
      onCodeChange?.();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate code');
    }
  };

  const handleToggleCode = async () => {
    try {
      await classService.toggleJoinCode(classId, !isJoinCodeActive);
      setIsJoinCodeActive(!isJoinCodeActive);
      setErrorMsg(null);
      onCodeChange?.();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to toggle code');
    }
  };

  const handleRemoveClick = (studentId: number) => {
    setDeleteConfirmId(studentId);
    setDeleteTimeout(true);
    setTimeout(() => {
      setDeleteTimeout(false);
    }, 2000);
  };

  const handleConfirmRemove = async (studentId: number, isInvited: boolean = false) => {
    if (deleteTimeout) return;
    try {
      await classService.removeStudent(classId, studentId, isInvited);
      setStudents(prev => prev.filter(s => s.id !== studentId));
      setDeleteConfirmId(null);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to remove student');
    }
  };

  const handleEmailCheck = async (emailToCheck?: string) => {
    const email = (emailToCheck ?? newStudentEmail).trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    setEmailCheckStatus('checking');
    setErrorMsg(null);
    try {
      const result = await classService.checkStudentEmail(classId, email);
      if (result.exists) {
        setEmailCheckStatus('exists');
        setNewStudentName(result.name);
        setIsAlreadyInClass(result.isAlreadyInClass);
      } else {
        setEmailCheckStatus('new');
        setNewStudentName(result.name || '');
        setIsAlreadyInClass(result.isAlreadyInClass);
      }
    } catch (err: any) {
      console.error('Email check failed', err);
      setEmailCheckStatus('idle');
      setErrorMsg(err.message || 'Failed to check student email');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewStudentEmail(val);
    if (emailCheckStatus !== 'idle') {
      setEmailCheckStatus('idle');
      setNewStudentName('');
      setIsAlreadyInClass(false);
    }
    setErrorMsg(null);
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isAlreadyInClass) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      if (emailCheckStatus === 'exists') {
        await classService.addExistingStudent(classId, newStudentEmail.trim());
        setSuccessMsg('Student added successfully!');
      } else if (emailCheckStatus === 'new') {
        if (!newStudentName.trim()) {
          setErrorMsg('Please enter student name.');
          setIsSubmitting(false);
          return;
        }
        await classService.registerStudent(classId, newStudentName.trim(), newStudentEmail.trim());
        setSuccessMsg('Registration invitation sent!');
      }

      await fetchStudents();
      setTimeout(() => {
        closeAddStudentModal();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRenameBlur = async () => {
    if (className.trim() !== '' && className !== initialClassName) {
      try {
        await classService.renameClass(classId, className);
        onRename?.(classId, className);
      } catch (error) {
        console.error('Failed to rename class:', error);
        setClassName(initialClassName);
      }
    } else {
      setClassName(initialClassName);
    }
  };

  const closeAddStudentModal = useCallback(() => {
    setIsAddingStudent(false);
    setNewStudentName('');
    setNewStudentEmail('');
    setEmailCheckStatus('idle');
    setIsAlreadyInClass(false);
    setIsSubmitting(false);
    setSuccessMsg(null);
    setErrorMsg(null);
  }, []);

  return {
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
  };
};
