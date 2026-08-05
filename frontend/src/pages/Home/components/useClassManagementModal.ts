import { useState, useEffect, useCallback } from 'react';
import { classService } from '../../../services/classService';

export interface Student {
  id: number;
  name: string;
  email: string;
}

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
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
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

  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const data = await classService.getStudents(classId);
      setStudents(data);
    } catch (err: any) {
      console.error('Failed to fetch students', err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchStudents();
    }
  }, [classId]);

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

  const handleConfirmRemove = async (studentId: number) => {
    if (deleteTimeout) return;
    try {
      await classService.removeStudent(classId, studentId);
      setStudents(students.filter(s => s.id !== studentId));
      setDeleteConfirmId(null);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to remove student');
    }
  };

  const handleManualAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await classService.manuallyCreateStudent(classId, newStudentName, newStudentEmail);
      setGeneratedToken(res.token);
      setStudents([...students, { id: Date.now(), name: newStudentName, email: newStudentEmail }]);
      setNewStudentName('');
      setNewStudentEmail('');
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create student manually');
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
    setGeneratedToken(null);
    setNewStudentName('');
    setNewStudentEmail('');
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
  };
};
