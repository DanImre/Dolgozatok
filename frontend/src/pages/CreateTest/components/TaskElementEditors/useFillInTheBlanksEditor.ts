import { useCallback, useRef } from 'react';
import type { BaseTaskEditorProps } from './types';
import { useTranslation } from '../../../../locales/LanguageContext';

export const useFillInTheBlanksEditor = ({ 
    element, 
    updateBody, 
    updateCorrectAnswer, 
    textInputData, 
    onTextAndBlanksChange,
    onBlankIdChange 
}: BaseTaskEditorProps) => {
    const { lang } = useTranslation();
    const t = lang.createTest;

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleTextChange = useCallback((newText: string) => {
        const newMatches = [...newText.matchAll(/\[\[(.*?)\]\]/g)].map(m => m[1]);
        
        if (onTextAndBlanksChange) {
            onTextAndBlanksChange(newText, newMatches);
        } else {
            updateBody(JSON.stringify({ ...textInputData, text: newText }));
        }
    }, [onTextAndBlanksChange, textInputData, updateBody]);

    const handleAddBlankClick = useCallback(() => {
        const defaultText = t.defaultBlankText || "Blank";
        const textarea = textareaRef.current;
        let newText = textInputData?.text || "";
        let selectionStartToSet = newText.length;
        let selectionEndToSet = newText.length;

        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = newText.substring(start, end);
            const textToWrap = selectedText || defaultText;
            
            const before = newText.substring(0, start);
            const after = newText.substring(end);
            
            newText = `${before}[[${textToWrap}]]${after}`;
            selectionStartToSet = start + 2;
            selectionEndToSet = start + 2 + textToWrap.length;
        } else {
            newText = newText + (newText.endsWith(' ') ? '' : ' ') + `[[${defaultText}]]`;
            selectionStartToSet = newText.length - 2 - defaultText.length;
            selectionEndToSet = newText.length - 2;
        }

        handleTextChange(newText);
        
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(selectionStartToSet, selectionEndToSet);
            }
        }, 0);
    }, [t.defaultBlankText, textInputData?.text, handleTextChange]);

    const handleCorrectAnswerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (onBlankIdChange) {
            onBlankIdChange(e.target.value);
        } else {
            updateCorrectAnswer(e.target.value);
        }
    }, [onBlankIdChange, updateCorrectAnswer]);

    return {
        t,
        element,
        textInputData,
        textareaRef,
        handleTextChange,
        handleAddBlankClick,
        handleCorrectAnswerChange
    };
};
