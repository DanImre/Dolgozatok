import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../locales/LanguageContext';
import { api } from '../../services/api';

export interface TestItem {
  id: number;
  name: string;
  created: string;
  edited: string;
}

export const useHome = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { lang, language, setLanguage } = useTranslation();
  
  const [tests, setTests] = useState<TestItem[]>([]);
  const [testsLoading, setTestsLoading] = useState(false);
  const [testsError, setTestsError] = useState<string | null>(null);
  
  const [newTestName, setNewTestName] = useState('');
  const [addingTest, setAddingTest] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const fetchTests = async () => {
    if (!isAuthenticated) return;
    setTestsLoading(true);
    setTestsError(null);
    try {
      const data = await api.get<TestItem[]>('/Test');
      setTests(data || []);
    } catch (err: any) {
      console.error('Failed to fetch tests:', err);
      setTestsError(err.message || 'Error fetching tests');
    } finally {
      setTestsLoading(false);
    }
  };

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim()) return;

    setAddingTest(true);
    setTestsError(null);
    setAddSuccess(false);

    try {
      // Create a test object
      // Note: FolderId is hardcoded to 1 (which assumes a folder exists or DB constraints are bypassed)
      await api.post('/Test', {
        name: newTestName.trim(),
        created: new Date().toISOString(),
        edited: new Date().toISOString(),
        folderId: null,
        originalTestId: 0,
        isDeleted: false
      });

      setNewTestName('');
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
      await fetchTests(); // Reload the list
    } catch (err: any) {
      console.error('Failed to add test:', err);
      setTestsError(lang.common.errorTitle + ': ' + (err.message || 'Failed to add test'));
    } finally {
      setAddingTest(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTests();
    }
  }, [isAuthenticated]);

  const toggleLanguage = () => {
    setLanguage(language === 'hu' ? 'en' : 'hu');
  };

  return {
    user,
    logout,
    isAuthenticated,
    lang,
    language,
    toggleLanguage,
    tests,
    testsLoading,
    testsError,
    newTestName,
    setNewTestName,
    addingTest,
    addSuccess,
    handleAddTest,
    refetchTests: fetchTests
  };
};
