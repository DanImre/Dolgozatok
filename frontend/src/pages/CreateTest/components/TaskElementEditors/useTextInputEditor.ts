import { useCallback } from 'react';
import type { BaseTaskEditorProps } from './types';
import { useTranslation } from '../../../../locales/LanguageContext';

export const useTextInputEditor = ({ element, updateBody, updateCorrectAnswer, textInputData }: BaseTaskEditorProps) => {
    const { lang } = useTranslation();
    const t = lang.createTest;

    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateBody(JSON.stringify({ ...textInputData, text: e.target.value }));
    }, [updateBody, textInputData]);

    const handleCorrectAnswerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateCorrectAnswer(e.target.value);
    }, [updateCorrectAnswer]);

    return {
        t,
        textInputData,
        element,
        handleTextChange,
        handleCorrectAnswerChange
    };
};
