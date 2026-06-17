import { useState, useEffect } from 'react';
import type { Test, Page } from '../../types/testEditor';
import { useTranslation } from '../../locales/LanguageContext';

export const useCreateTest = () => {
    const { lang, language } = useTranslation();
    const [test, setTest] = useState<Test>({
        title: lang.createTest.defaultTestTitle,
        pages: []
    });

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
        // Placeholder for saving the test to the API
        console.log('Saving test payload:', test);
        alert('Test saved (check console)');
    };

    return {
        test,
        addPage,
        updatePage,
        deletePage,
        updateTitle,
        movePage,
        saveTest
    };
};
