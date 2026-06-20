import React from 'react';
import type { BaseTaskEditorProps } from './types';
import { useTrueOrFalseEditor } from './useTrueOrFalseEditor';
import { Check } from 'lucide-react';

export const TrueOrFalseEditor: React.FC<BaseTaskEditorProps> = (props) => {
    const { t, isTrue, toggleAnswer, handleBodyChange } = useTrueOrFalseEditor(props);

    return (
        <div className="flex-1 flex gap-4 items-center">
            <div 
                className={`w-6 h-6 rounded-[6px] border-2 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                    isTrue 
                        ? 'border-emerald-500 bg-emerald-500 shadow-sm shadow-emerald-200' 
                        : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                }`}
                onClick={toggleAnswer}
            >
                <Check size={16} strokeWidth={3} className={`text-white transition-opacity ${isTrue ? 'opacity-100' : 'opacity-0'}`} />
            </div>
            <input 
                type="text" 
                value={props.element.body} 
                onChange={handleBodyChange} 
                placeholder={t.placeholders.statement} 
                className={`flex-1 border-b px-2 py-1 outline-none transition-colors bg-transparent ${isTrue ? 'border-emerald-300 focus:border-emerald-500 font-medium text-emerald-900' : 'border-slate-300 focus:border-emerald-500'}`} 
            />
        </div>
    );
};
