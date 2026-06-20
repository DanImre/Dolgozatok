import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../locales/LanguageContext';
import { api } from '../../../services/api';

export type FolderItemDTO = {
  id: number;
  name: string;
  type: 0 | 1; // 0 = Folder, 1 = Test (matching C# Enum)
  created: string | null;
  edited: string | null;
};

export type BreadcrumbItem = {
  id: number;
  name: string;
};

export const useTeacherDashboard = () => {
  const { lang } = useTranslation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState<BreadcrumbItem[]>([]);
  const [contents, setContents] = useState<FolderItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;

  const fetchContents = async (folderId: number | null) => {
    setIsLoading(true);
    try {
      if (folderId === null) {
        const data = await api.get<FolderItemDTO[]>('/api/Folder/Root');
        setContents(data);
      } else {
        const data = await api.get<FolderItemDTO[]>(`/api/Folder/${folderId}/Contents`);
        setContents(data);
      }
    } catch (error) {
      console.error('Failed to fetch folder contents', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContents(currentFolderId);
  }, [currentFolderId]);

  const handleCreateTest = () => {
    if (currentFolderId) {
      localStorage.setItem('selectedFolderId', currentFolderId.toString());
    } else {
      localStorage.removeItem('selectedFolderId');
    }
    navigate('/createtest');
  };

  const handleGoToRoot = () => {
    setCurrentPath([]);
  };

  const handleNavigateToBreadcrumb = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleFolderClick = (folder: FolderItemDTO) => {
    if (folder.type === 0) { // Only navigate if it's a folder
      setCurrentPath([...currentPath, { id: folder.id, name: folder.name }]);
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt('Folder Name:');
    if (!name?.trim()) return;
    
    try {
      await api.post('/api/Folder', { name: name.trim(), parentId: currentFolderId });
      fetchContents(currentFolderId);
    } catch (error) {
      console.error('Failed to create folder', error);
      alert('Failed to create folder.');
    }
  };

  const handleDeleteFolder = async (e: React.MouseEvent, folderId: number) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this folder and ALL its contents recursively?')) {
      try {
        await api.delete(`/api/Folder/${folderId}`);
        fetchContents(currentFolderId);
      } catch (error) {
        console.error('Failed to delete folder', error);
        alert('Failed to delete folder.');
      }
    }
  };

  return {
    lang,
    currentPath,
    contents,
    isLoading,
    handleCreateTest,
    handleGoToRoot,
    handleNavigateToBreadcrumb,
    handleFolderClick,
    handleCreateFolder,
    handleDeleteFolder
  };
};
