import { useState, useEffect } from 'react';
import type { Test, Page } from '../../types/testEditor';
import { useTranslation } from '../../locales/LanguageContext';

import { api } from '../../services/api';

export const useCreateTest = () => {
    const { lang, language } = useTranslation();
    const [test, setTest] = useState<Test>({
        title: lang.createTest.defaultTestTitle,
        pages: []
    });
    
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        setTest(prev => {
            if (prev.title === "Untitled Test" || prev.title === "Névtelen teszt") {
                return { ...prev, title: lang.createTest.defaultTestTitle };
            }
            return prev;
        });
    }, [language, lang.createTest.defaultTestTitle]);

    const addPage = () => {
        setTest(prev => ({
            ...prev,
            pages: [...prev.pages, { id: crypto.randomUUID(), isRandomized: false, tasks: [] }]
        }));
    };

    const updatePage = (pageId: string, updatedPage: Page) => {
        setTest(prev => ({
            ...prev,
            pages: prev.pages.map(p => p.id === pageId ? updatedPage : p)
        }));
    };

    const deletePage = (pageId: string) => {
        setTest(prev => ({
            ...prev,
            pages: prev.pages.filter(p => p.id !== pageId)
        }));
    };

    const updateTitle = (title: string) => {
        setTest(prev => ({ ...prev, title }));
    };

    const movePage = (index: number, direction: -1 | 1) => {
        setTest(prev => {
            const newPages = [...prev.pages];
            if (index + direction < 0 || index + direction >= newPages.length) return prev;
            const temp = newPages[index];
            newPages[index] = newPages[index + direction];
            newPages[index + direction] = temp;
            return { ...prev, pages: newPages };
        });
    };

    const saveTest = async () => {
        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            const payload = {
                name: test.title,
                created: new Date().toISOString(),
                edited: new Date().toISOString(),
                folderId: localStorage.getItem('selectedFolderId') ? parseInt(localStorage.getItem('selectedFolderId')!) : null,
                originalTestId: 0,
                isDeleted: false,
                pages: test.pages.map((p, pIndex) => ({
                    number: pIndex + 1,
                    isRandomized: p.isRandomized,
                    tasks: p.tasks.map((t, tIndex) => ({
                        header: t.header,
                        number: tIndex + 1,
                        isRandomized: t.isRandomized,
                        type: t.type,
                        taskElements: t.taskElements.map(te => ({
                            body: te.body,
                            correctAnswer: te.correctAnswer,
                            points: te.points,
                            requiresManualGrading: te.requiresManualGrading,
                            isRandomized: te.isRandomized
                        }))
                    }))
                }))
            };

            await api.post('/Test', payload);
            
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error: any) {
            console.error('Failed to save test:', error);
            setSaveError(error.message || 'Failed to save test');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        test,
        addPage,
        updatePage,
        deletePage,
        updateTitle,
        movePage,
        saveTest,
        isSaving,
        saveError,
        saveSuccess
    };
};
