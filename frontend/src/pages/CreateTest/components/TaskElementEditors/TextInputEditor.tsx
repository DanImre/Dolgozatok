import React from 'react';
import type { BaseTaskEditorProps } from './types';
import { useTextInputEditor } from './useTextInputEditor';

export const TextInputEditor: React.FC<BaseTaskEditorProps> = (props) => {
    const { t, textInputData, element, handleTextChange, handleCorrectAnswerChange } = useTextInputEditor(props);

    if (textInputData?.type === 'text') {
        return (
            <div className="flex-1 w-full relative grid">
                {/* Hidden div establishes the height of the grid cell perfectly */}
                <div className="col-[1_/_2] row-[1_/_2] invisible whitespace-pre-wrap break-words px-3 py-3 border border-transparent min-h-[80px]">
                    {(textInputData.text || '') + ' '}
                </div>
                <textarea 
                    value={textInputData.text || ''} 
                    onChange={handleTextChange}
                    placeholder={t.placeholders.bodyText} 
                    className="col-[1_/_2] row-[1_/_2] w-full h-full border border-slate-200 rounded-lg bg-slate-50 px-3 py-3 outline-none focus:border-emerald-500 focus:bg-white resize-none overflow-hidden transition-colors" 
                />
            </div>
        );
    } else {
        return (
            <div className="flex-1 flex flex-col gap-3 w-full">
                <div className="relative grid w-full">
                    <div className="col-[1_/_2] row-[1_/_2] invisible whitespace-pre-wrap break-words px-2 py-2 border-b border-transparent min-h-[40px]">
                        {(textInputData?.text || '') + ' '}
                    </div>
                    <textarea 
                        value={textInputData?.text || ''} 
                        onChange={handleTextChange} 
                        placeholder={t.placeholders.questionPart} 
                        className="col-[1_/_2] row-[1_/_2] w-full h-full border-b border-slate-300 bg-transparent px-2 py-2 outline-none focus:border-emerald-500 resize-none overflow-hidden" 
                    />
                </div>
                <div className="flex items-center gap-2 pl-2 border-l-2 border-indigo-200 ml-1">
                    <span className="text-xs text-slate-400 font-medium">Answer:</span>
                    <input 
                        type="text" 
                        value={element.correctAnswer} 
                        onChange={handleCorrectAnswerChange} 
                        placeholder={t.placeholders.correctAnswer} 
                        className="flex-1 border-b border-slate-200 bg-transparent px-2 py-1 outline-none focus:border-indigo-500 text-indigo-900" 
                    />
                </div>
            </div>
        );
    }
};
