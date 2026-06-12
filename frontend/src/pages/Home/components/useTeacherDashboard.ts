import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../locales/LanguageContext';

export type FileItem = {
  id: string;
  name: string;
  type: 'folder' | 'test';
  children?: FileItem[];
};

export const dummyFileSystem: FileItem[] = [
  {
    id: 'f1',
    name: '2026 Fall Semester',
    type: 'folder',
    children: [
      {
        id: 'f2',
        name: 'Mathematics',
        type: 'folder',
        children: [
          { id: 't1', name: 'Mid-term Exam', type: 'test' },
          { id: 't2', name: 'Final Exam', type: 'test' }
        ]
      },
      { id: 't3', name: 'General Survey', type: 'test' }
    ]
  },
  {
    id: 'f3',
    name: 'Archived',
    type: 'folder',
    children: []
  }
];

export const useTeacherDashboard = () => {
  const { lang } = useTranslation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState<FileItem[]>([]);

  const currentFolderContents = currentPath.length === 0 
    ? dummyFileSystem 
    : currentPath[currentPath.length - 1].children || [];

  const handleCreateTest = () => {
    navigate('/createtest');
  };

  const handleGoToRoot = () => {
    setCurrentPath([]);
  };

  const handleNavigateToBreadcrumb = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item]);
    }
  };

  return {
    lang,
    currentPath,
    currentFolderContents,
    handleCreateTest,
    handleGoToRoot,
    handleNavigateToBreadcrumb,
    handleItemClick
  };
};
