import { useCallback } from 'react';
import type { BaseTaskEditorProps } from './types';
import { useTranslation } from '../../../../locales/LanguageContext';

export const useNumericalEditor = ({ element, updateBody, updateCorrectAnswer }: BaseTaskEditorProps) => {
    const { lang, language } = useTranslation();
    const t = lang.createTest;

    const handleBodyChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateBody(e.target.value);
    }, [updateBody]);

    return {
        t,
        language,
        element,
        handleBodyChange,
        updateCorrectAnswer
    };
};
