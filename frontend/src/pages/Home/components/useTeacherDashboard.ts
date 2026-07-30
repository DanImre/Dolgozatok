import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../locales/LanguageContext';
import { api } from '../../../services/api';

import { classService } from '../../../services/classService';

export type FolderItemDTO = {
  id: number;
  name: string;
  type: 0 | 1; // 0 = Folder, 1 = Test (matching C# Enum)
  created: string | null;
  edited: string | null;
};

export type ClassItemDTO = {
  id: number;
  className: string;
  studentCount: number;
  teacherCount: number;
  joinCode: string;
  isJoinCodeActive: boolean;
};

export type BreadcrumbItem = {
  id: number;
  name: string;
};

export const useTeacherDashboard = () => {
  const { lang, language } = useTranslation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState<BreadcrumbItem[]>([]);
  const [contents, setContents] = useState<FolderItemDTO[]>([]);
  const [classes, setClasses] = useState<ClassItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, isOpen: boolean, targetId: number | null}>({x: 0, y: 0, isOpen: false, targetId: null});

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

  const fetchClasses = async () => {
    try {
      const data = await classService.getClasses();
      setClasses(data);
    } catch (error) {
      console.error('Failed to fetch classes', error);
    }
  };

  useEffect(() => {
    fetchContents(currentFolderId);
    setSelectedIds(new Set());
    setContextMenu(prev => ({...prev, isOpen: false}));
  }, [currentFolderId]);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    const handleGlobalClick = () => {
      setContextMenu(prev => ({...prev, isOpen: false}));
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const closeContextMenu = () => {
    setContextMenu(prev => ({...prev, isOpen: false}));
  };

  const handleCreateTest = () => {
    if (currentFolderId) {
      localStorage.setItem('selectedFolderId', currentFolderId.toString());
    } else {
      localStorage.removeItem('selectedFolderId');
    }
    navigate('/createtest');
  };

  const handleOpenTest = (testId: number) => {
    navigate(`/createtest/${testId}`);
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

  const handleSelect = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    closeContextMenu();
    const newSelected = new Set(selectedIds);
    if (e.ctrlKey || e.metaKey) {
      if (newSelected.has(id)) newSelected.delete(id);
      else newSelected.add(id);
    } else {
      newSelected.clear();
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleContextMenu = (e: React.MouseEvent, id: number | null) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (id !== null && !selectedIds.has(id)) {
      setSelectedIds(new Set([id]));
    } else if (id === null) {
      setSelectedIds(new Set());
    }
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      isOpen: true,
      targetId: id
    });
  };

  const handleCreateFolder = async (name: string) => {
    if (!name.trim()) return;
    
    await api.post('/api/Folder', { name: name.trim(), parentId: currentFolderId });
    await fetchContents(currentFolderId);
  };

  const handleRenameItem = async (id: number, newName: string) => {
    const item = contents.find(c => c.id === id);
    if (!item || !newName.trim() || newName === item.name) return;

    if (item.type !== 0) {
      alert("Renaming tests is not implemented on the backend yet.");
      return;
    }

    try {
      await api.put(`/api/Folder/${id}/Rename`, newName.trim());
      await fetchContents(currentFolderId);
    } catch (error) {
      console.error('Failed to rename', error);
      alert('Failed to rename item.');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (confirm(lang.teacherDashboard?.delete + '?')) {
      try {
        for (const id of Array.from(selectedIds)) {
          const item = contents.find(c => c.id === id);
          if (item?.type === 0) {
            await api.delete(`/api/Folder/${id}`);
          } else {
            // Delete test API could be added here later
            console.warn("Delete test not implemented");
          }
        }
        setSelectedIds(new Set());
        fetchContents(currentFolderId);
      } catch (error) {
        console.error('Failed to delete some items', error);
        alert('Failed to delete some items.');
      }
    }
  };

  return {
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
    fetchClasses,
    currentFolderId
  };
};
