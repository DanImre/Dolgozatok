import { useCallback } from 'react';
import type { BaseTaskEditorProps } from './types';
import { useTranslation } from '../../../../locales/LanguageContext';

export const useMatchingEditor = ({ element, updateBody, updatePoints, textInputData }: BaseTaskEditorProps) => {
    const { lang, language } = useTranslation();
    const t = lang.createTest;

    const isMatchingRegion = textInputData?.type === 'region';

    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (isMatchingRegion) {
            updateBody(JSON.stringify({ ...textInputData, text: e.target.value }));
        } else {
            updateBody(JSON.stringify({ ...textInputData, Text: e.target.value }));
        }
    }, [isMatchingRegion, updateBody, textInputData]);

    const handlePointsChange = useCallback((v: number) => {
        if (updatePoints) {
            updatePoints(isNaN(v) ? 0 : v);
        }
    }, [updatePoints]);

    return {
        t,
        language,
        element,
        textInputData,
        isMatchingRegion,
        handleTextChange,
        handlePointsChange
    };
};
