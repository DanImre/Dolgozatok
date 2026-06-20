import React from 'react';
import type { BaseTaskEditorProps } from './types';
import { useMatchingEditor } from './useMatchingEditor';
import { LocalizedNumberInput } from '../../../../components/LocalizedNumberInput';

export const MatchingEditor: React.FC<BaseTaskEditorProps> = (props) => {
    const { 
        t, language, element, textInputData, isMatchingRegion, 
        handleTextChange, handlePointsChange 
    } = useMatchingEditor(props);

    if (isMatchingRegion) {
        return (
            <div className="flex-1 flex gap-4 items-center">
                <input 
                    type="text" 
                    value={textInputData?.text || ''} 
                    onChange={handleTextChange} 
                    placeholder={t.placeholders?.categoryName || "Category Name"} 
                    className="flex-1 bg-transparent border-none outline-none font-semibold text-slate-800 text-2xl focus:ring-0 placeholder-slate-400" 
                />
            </div>
        );
    } else {
        return (
            <div className="flex flex-col min-w-[120px] max-w-full">
                <div className="relative grid flex-1 pt-3 pb-2 px-3">
                    <div className="col-[1_/_2] row-[1_/_2] invisible whitespace-pre-wrap break-words font-medium text-center min-h-[1.5rem] leading-snug">
                        {(textInputData?.Text || '') + '\u200b'}
                    </div>
                    <textarea 
                        value={textInputData?.Text || ''} 
                        onChange={handleTextChange} 
                        placeholder={t.placeholders?.itemText || "Item text"} 
                        className="col-[1_/_2] row-[1_/_2] w-full h-full bg-transparent outline-none resize-none overflow-hidden text-center font-medium text-slate-700 focus:text-slate-900 placeholder-slate-300 p-0 m-0 leading-snug" 
                        rows={1}
                    />
                </div>
                <div className="flex items-center justify-center gap-2 px-2 py-1.5 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
                    <span className="text-xs text-slate-500 font-medium">{t.ptsLabel || "Points:"}</span>
                    <LocalizedNumberInput 
                        value={element.points || 0} 
                        onChange={handlePointsChange} 
                        language={language} 
                    />
                </div>
            </div>
        );
    }
};
