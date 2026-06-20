import React from 'react';
import type { BaseTaskEditorProps } from './types';
import { useFillInTheBlanksEditor } from './useFillInTheBlanksEditor';

export const FillInTheBlanksEditor: React.FC<BaseTaskEditorProps> = (props) => {
    const { 
        t, textInputData, element, textareaRef, 
        handleTextChange, handleAddBlankClick, handleCorrectAnswerChange 
    } = useFillInTheBlanksEditor(props);

    if (textInputData?.type === 'text') {
        return (
            <div className="flex-1 w-full flex flex-col gap-2 relative">
                <div className="w-full relative grid">
                    <div className="col-[1_/_2] row-[1_/_2] invisible whitespace-pre-wrap break-words px-3 py-3 border border-transparent min-h-[80px]">
                        {(textInputData.text || '') + ' '}
                    </div>
                    <textarea 
                        ref={textareaRef}
                        value={textInputData.text || ''} 
                        onChange={(e) => handleTextChange(e.target.value)}
                        placeholder={t.placeholders.bodyText} 
                        className="col-[1_/_2] row-[1_/_2] w-full h-full border border-slate-200 rounded-lg bg-slate-50 px-3 py-3 outline-none focus:border-indigo-500 focus:bg-white resize-none overflow-hidden transition-colors" 
                    />
                </div>
                <div className="flex justify-end">
                    <button 
                        onClick={handleAddBlankClick}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 rounded-md transition-colors shadow-sm"
                    >
                        {t.addBlank}
                    </button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                <input 
                    type="text" 
                    value={element.correctAnswer} 
                    onChange={handleCorrectAnswerChange} 
                    placeholder={t.placeholders.correctAnswer} 
                    className="flex-1 bg-transparent outline-none text-slate-800 font-medium" 
                />
            </div>
        );
    }
};
