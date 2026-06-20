import React from 'react';
import type { BaseTaskEditorProps } from './types';
import { useMultipleChoiceEditor } from './useMultipleChoiceEditor';

export const MultipleChoiceEditor: React.FC<BaseTaskEditorProps> = (props) => {
    const { t, index, isCorrect, toggleAnswer, handleBodyChange } = useMultipleChoiceEditor(props);

    return (
        <div className="flex-1 flex gap-4 items-center">
            <div 
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                    isCorrect 
                        ? 'border-emerald-500 bg-emerald-500 shadow-sm shadow-emerald-200' 
                        : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                }`}
                onClick={toggleAnswer}
            >
                <div className={`w-2 h-2 rounded-full bg-white transition-transform ${isCorrect ? 'scale-100' : 'scale-0'}`} />
            </div>
            <input 
                type="text" 
                value={props.element.body} 
                onChange={handleBodyChange} 
                placeholder={`${t.placeholders.option}${index + 1}...`} 
                className={`flex-1 border-b px-2 py-1 outline-none transition-colors bg-transparent ${isCorrect ? 'border-emerald-300 focus:border-emerald-500 font-medium text-emerald-900' : 'border-slate-300 focus:border-emerald-500'}`} 
            />
        </div>
    );
};
