import { api } from './api';

export const classService = {
  getClasses: async (): Promise<Array<{ id: number, className: string, studentCount: number, teacherCount: number, joinCode: string, isJoinCodeActive: boolean }>> => {
    return api.get<Array<{ id: number, className: string, studentCount: number, teacherCount: number, joinCode: string, isJoinCodeActive: boolean }>>(`/api/class`);
  },
  getStudents: async (classId: number): Promise<Array<{ id: number, name: string, email: string }>> => {
    return api.get<Array<{ id: number, name: string, email: string }>>(`/api/class/${classId}/students`);
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
  removeStudent: async (classId: number, studentId: number): Promise<void> => {
    return api.delete(`/api/class/${classId}/students/${studentId}`);
  },
  manuallyCreateStudent: async (classId: number, name: string, email: string): Promise<{ token: string }> => {
    return api.post<{ token: string }>(`/api/class/${classId}/students/manual`, { name, email });
  },
  createClass: async (className: string): Promise<{ id: number, className: string, joinCode: string }> => {
    return api.post<{ id: number, className: string, joinCode: string }>(`/api/class`, { className });
  },
  renameClass: async (classId: number, name: string): Promise<void> => {
    return api.post<void>(`/api/class/${classId}/rename`, { name });
  }
};
