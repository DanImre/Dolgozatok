import React from 'react';
import type { BaseTaskEditorProps } from './types';
import { useNumericalEditor } from './useNumericalEditor';
import { LocalizedExpressionInput } from '../../../../components/LocalizedExpressionInput';

export const NumericalEditor: React.FC<BaseTaskEditorProps> = (props) => {
    const { t, language, element, handleBodyChange, updateCorrectAnswer } = useNumericalEditor(props);

    return (
        <div className="flex-1 flex flex-col gap-3 w-full">
            <div className="relative grid w-full">
                <div className="col-[1_/_2] row-[1_/_2] invisible whitespace-pre-wrap break-words px-2 py-2 border-b border-transparent min-h-[40px]">
                    {(element.body || '') + ' '}
                </div>
                <textarea 
                    value={element.body || ''} 
                    onChange={handleBodyChange} 
                    placeholder={t.placeholders.questionPart} 
                    className="col-[1_/_2] row-[1_/_2] w-full h-full border-b border-slate-300 bg-transparent px-2 py-2 outline-none focus:border-emerald-500 resize-none overflow-hidden" 
                />
            </div>
            <div className="flex items-start gap-2 pl-2 border-l-2 border-indigo-200 ml-1 pt-1">
                <span className="text-xs text-slate-400 font-medium mt-1.5">Answer:</span>
                <LocalizedExpressionInput 
                    value={element.correctAnswer || ''} 
                    onChange={updateCorrectAnswer} 
                    language={language} 
                    showButtons={true}
                    className="flex-1 border-b border-slate-200 bg-transparent px-2 py-1 outline-none focus-within:border-indigo-500 text-indigo-900"
                    placeholder={t.placeholders.exactNumber}
                />
            </div>
        </div>
    );
};
