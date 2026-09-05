import { api } from './api';

export interface StudentListItem {
  id: number;
  name: string;
  email: string;
  isInvited?: boolean;
}

export interface CheckStudentEmailResponse {
  exists: boolean;
  name: string;
  isAlreadyInClass: boolean;
}

export interface RegistrationDetailsResponse {
  status: 'Valid' | 'Expired' | 'AlreadyRegistered';
  email?: string;
  name?: string;
  classes?: string[];
}

export const classService = {
  getClasses: async (): Promise<Array<{ id: number, className: string, studentCount: number, teacherCount: number, joinCode: string, isJoinCodeActive: boolean }>> => {
    return api.get<Array<{ id: number, className: string, studentCount: number, teacherCount: number, joinCode: string, isJoinCodeActive: boolean }>>(`/api/class`);
  },
  getStudents: async (classId: number): Promise<StudentListItem[]> => {
    return api.get<StudentListItem[]>(`/api/class/${classId}/students`);
  },
  generateJoinCode: async (classId: number): Promise<{ code: string }> => {
    return api.post<{ code: string }>(`/api/class/${classId}/generate-code`, {});
  },
  toggleJoinCode: async (classId: number, isActive: boolean): Promise<void> => {
    return api.post<void>(`/api/class/${classId}/toggle-code`, { isActive });
  },
  joinClass: async (code: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>(`/api/class/join`, { code });
  },
  removeStudent: async (classId: number, studentId: number, isInvited: boolean = false): Promise<void> => {
    return api.delete(`/api/class/${classId}/students/${studentId}?isInvited=${isInvited}`);
  },
  checkStudentEmail: async (classId: number, email: string): Promise<CheckStudentEmailResponse> => {
    return api.get<CheckStudentEmailResponse>(`/api/class/${classId}/check-student?email=${encodeURIComponent(email)}`);
  },
  addExistingStudent: async (classId: number, email: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>(`/api/class/${classId}/students/add-existing`, { email });
  },
  registerStudent: async (classId: number, name: string, email: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>(`/api/class/${classId}/students/register`, { name, email });
  },
  manuallyCreateStudent: async (classId: number, name: string, email: string): Promise<{ token: string }> => {
    return api.post<{ token: string }>(`/api/class/${classId}/students/manual`, { name, email });
  },
  createClass: async (className: string): Promise<{ id: number, className: string, joinCode: string }> => {
    return api.post<{ id: number, className: string, joinCode: string }>(`/api/class`, { className });
  },
  renameClass: async (classId: number, name: string): Promise<void> => {
    return api.post<void>(`/api/class/${classId}/rename`, { name });
  },
  deleteClass: async (classId: number): Promise<void> => {
    return api.delete(`/api/class/${classId}`);
  },
  getRegistrationDetails: async (token: string): Promise<RegistrationDetailsResponse> => {
    return api.get<RegistrationDetailsResponse>(`/api/register/${encodeURIComponent(token)}`);
  },
  completeRegistration: async (token: string, password: string, confirmPassword: string): Promise<{ message: string; email?: string }> => {
    return api.post<{ message: string; email?: string }>(`/api/register/${encodeURIComponent(token)}/complete`, { password, confirmPassword });
  }
};
