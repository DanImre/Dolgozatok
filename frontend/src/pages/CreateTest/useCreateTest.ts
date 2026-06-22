import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Test, Page } from '../../types/testEditor';
import { useTranslation } from '../../locales/LanguageContext';

import { api } from '../../services/api';

export const useCreateTest = () => {
    const { lang, language } = useTranslation();
    const { id } = useParams<{id: string}>();
    const [test, setTest] = useState<Test>({
        title: lang.createTest.defaultTestTitle,
        pages: []
    });
    
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (!id) return;
        
        const fetchTest = async () => {
            try {
                const data = await api.get<any>(`/api/Test/${id}`);
                setTest({
                    title: data.name,
                    pages: data.pages.map((p: any) => ({
                        id: p.id ? p.id.toString() : crypto.randomUUID(),
                        isRandomized: p.isRandomized,
                        tasks: p.tasks.map((t: any) => ({
                            id: t.id ? t.id.toString() : crypto.randomUUID(),
                            header: t.header,
                            type: t.type,
                            isRandomized: t.isRandomized,
                            taskElements: t.taskElements.map((te: any) => ({
                                id: te.id ? te.id.toString() : crypto.randomUUID(),
                                body: te.body,
                                correctAnswer: te.correctAnswer,
                                points: te.points,
                                requiresManualGrading: te.requiresManualGrading,
                                isRandomized: te.isRandomized
                            }))
                        }))
                    }))
                });
            } catch (error) {
                console.error('Failed to load test:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTest();
    }, [id]);

    useEffect(() => {
        setTest(prev => {
            if (!id && (prev.title === "Untitled Test" || prev.title === "Névtelen teszt")) {
                return { ...prev, title: lang.createTest.defaultTestTitle };
            }
            return prev;
        });
    }, [language, lang.createTest.defaultTestTitle, id]);

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
                id: id ? parseInt(id) : 0,
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

            if (id) {
                await api.put(`/api/Test/${id}`, payload);
            } else {
                await api.post('/api/Test', payload);
            }
            
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
        isLoading,
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
