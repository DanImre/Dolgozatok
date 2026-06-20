import { useCallback } from 'react';
import type { BaseTaskEditorProps } from './types';
import { useTranslation } from '../../../../locales/LanguageContext';

export const useTrueOrFalseEditor = ({ element, updateBody, updateCorrectAnswer }: BaseTaskEditorProps) => {
    const { lang } = useTranslation();
    const t = lang.createTest;

    const isTrue = element.correctAnswer === 'True';

    const toggleAnswer = useCallback(() => {
        updateCorrectAnswer(isTrue ? 'False' : 'True');
    }, [isTrue, updateCorrectAnswer]);

    const handleBodyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateBody(e.target.value);
    }, [updateBody]);

    return {
        t,
        isTrue,
        toggleAnswer,
        handleBodyChange
    };
};
