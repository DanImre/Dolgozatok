import { useCallback } from 'react';
import type { BaseTaskEditorProps } from './types';
import { useTranslation } from '../../../../locales/LanguageContext';

export const useMultipleChoiceEditor = ({ element, updateBody, updateCorrectAnswer, index }: BaseTaskEditorProps) => {
    const { lang } = useTranslation();
    const t = lang.createTest;

    const isCorrect = element.correctAnswer === 'correct';

    const toggleAnswer = useCallback(() => {
        updateCorrectAnswer(isCorrect ? '' : 'correct');
    }, [isCorrect, updateCorrectAnswer]);

    const handleBodyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateBody(e.target.value);
    }, [updateBody]);

    return {
        t,
        index,
        isCorrect,
        toggleAnswer,
        handleBodyChange
    };
};
