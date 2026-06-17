import React from 'react';
import { TaskTypes } from '../../../types/testEditor';
import type { TaskElement } from '../../../types/testEditor';
import { useTaskElementEditor } from './useTaskElementEditor';
import { X, Shuffle, ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from '../../../locales/LanguageContext';

interface TaskElementEditorProps {
    element: TaskElement;
    taskType: TaskTypes;
    index: number;
    onUpdate: (updated: TaskElement) => void;
    onDelete: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}

export const TaskElementEditor: React.FC<TaskElementEditorProps> = ({ 
    element, taskType, index, onUpdate, onDelete, onMoveUp, onMoveDown 
}) => {
    const { 
        updateBody, updateCorrectAnswer, 
        updatePoints, toggleManualGrading, toggleRandomized 
    } = useTaskElementEditor(element, onUpdate);
    const { lang } = useTranslation();
    const t = lang.createTest;

    // Render slightly different UI based on TaskTypes just to tell them apart as requested
    const getEditorUI = () => {
        switch (taskType) {
            case TaskTypes.TrueFalse:
                return (
                    <div className="flex-1 flex gap-4">
                        <input 
                            type="text" 
                            value={element.body} 
                            onChange={(e) => updateBody(e.target.value)} 
                            placeholder={t.placeholders.statement} 
                            className="flex-1 border-b border-slate-300 bg-transparent px-2 py-1 outline-none focus:border-emerald-500" 
                        />
                        <select 
                            value={element.correctAnswer} 
                            onChange={(e) => updateCorrectAnswer(e.target.value)}
                            className="w-32 border border-slate-200 rounded px-2 py-1 bg-white outline-none"
                        >
                            <option value="">{t.placeholders.select}</option>
                            <option value="True">{t.placeholders.trueOption}</option>
                            <option value="False">{t.placeholders.falseOption}</option>
                        </select>
                    </div>
                );
            case TaskTypes.MultipleChoice:
                return (
                    <div className="flex-1 flex gap-4 items-center">
                        <div className="w-4 h-4 rounded-full border border-slate-400 flex-shrink-0" />
                        <input 
                            type="text" 
                            value={element.body} 
                            onChange={(e) => updateBody(e.target.value)} 
                            placeholder={`${t.placeholders.option}${index + 1}...`} 
                            className="flex-1 border-b border-slate-300 bg-transparent px-2 py-1 outline-none focus:border-emerald-500" 
                        />
                        <label className="flex items-center gap-2 text-xs text-slate-500">
                            <input 
                                type="checkbox" 
                                checked={element.correctAnswer === 'correct'}
                                onChange={(e) => updateCorrectAnswer(e.target.checked ? 'correct' : '')}
                            />
                            Is Correct
                        </label>
                    </div>
                );
            case TaskTypes.Numerical:
                return (
                    <div className="flex-1 flex gap-4">
                        <input 
                            type="text" 
                            value={element.body} 
                            onChange={(e) => updateBody(e.target.value)} 
                            placeholder={t.placeholders.questionPart} 
                            className="flex-1 border-b border-slate-300 bg-transparent px-2 py-1 outline-none focus:border-emerald-500" 
                        />
                        <input 
                            type="number" 
                            value={element.correctAnswer} 
                            onChange={(e) => updateCorrectAnswer(e.target.value)} 
                            placeholder={t.placeholders.exactNumber} 
                            className="w-32 border-b border-slate-300 bg-transparent px-2 py-1 outline-none focus:border-emerald-500" 
                        />
                    </div>
                );
            default:
                // Generic fallback for others
                return (
                    <div className="flex-1 flex gap-4">
                        <input 
                            type="text" 
                            value={element.body} 
                            onChange={(e) => updateBody(e.target.value)} 
                            placeholder={t.placeholders.bodyText} 
                            className="flex-1 border-b border-slate-300 bg-transparent px-2 py-1 outline-none focus:border-emerald-500" 
                        />
                        <input 
                            type="text" 
                            value={element.correctAnswer} 
                            onChange={(e) => updateCorrectAnswer(e.target.value)} 
                            placeholder={t.placeholders.correctAnswer} 
                            className="flex-1 border-b border-slate-300 bg-transparent px-2 py-1 outline-none focus:border-indigo-500" 
                        />
                    </div>
                );
        }
    };

    return (
        <div className="flex items-center gap-2 group">
            <div className="flex-1 bg-white p-3 rounded border border-slate-200 shadow-sm flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {getEditorUI()}
                </div>
                
                <div className="flex flex-wrap items-center justify-end gap-4 pt-3 border-t border-slate-100">
                    <label className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        {t.ptsLabel}
                        <input 
                            type="number" 
                            min="0"
                            value={element.points || 0}
                            onChange={(e) => updatePoints(Number(e.target.value))}
                            className="w-14 border border-slate-200 rounded px-1.5 py-1 text-slate-700 outline-none focus:border-emerald-400"
                        />
                    </label>
                    <label className="flex items-center cursor-pointer gap-2 group ml-2">
                        <div className="relative flex items-center">
                            <input 
                                type="checkbox" 
                                checked={element.isRandomized || false}
                                onChange={toggleRandomized}
                                className="sr-only"
                            />
                            <div className={`block w-8 h-4 rounded-full transition-colors ${element.isRandomized ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                            <div className={`absolute left-[2px] top-[2px] bg-white w-3 h-3 rounded-full transition-transform ${element.isRandomized ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                        <span className="text-xs text-slate-500 font-medium group-hover:text-slate-700 transition-colors flex items-center gap-1.5" title={t.randomizeElement}>
                            <Shuffle size={12} className={element.isRandomized ? 'text-emerald-500' : 'text-slate-400'} />
                        </span>
                    </label>
                    <label className="flex items-center cursor-pointer gap-2 group ml-2">
                        <div className="relative flex items-center">
                            <input 
                                type="checkbox" 
                                checked={element.requiresManualGrading || false}
                                onChange={toggleManualGrading}
                                className="sr-only"
                            />
                            <div className={`block w-8 h-4 rounded-full transition-colors ${element.requiresManualGrading ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                            <div className={`absolute left-[2px] top-[2px] bg-white w-3 h-3 rounded-full transition-transform ${element.requiresManualGrading ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                        <span className="text-xs text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
                            {t.manualGrade}
                        </span>
                    </label>
                </div>
            </div>
            <div className="flex flex-col gap-0.5 justify-center flex-shrink-0">
                <button onClick={onMoveUp} disabled={!onMoveUp} className={`p-1.5 rounded ${onMoveUp ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50' : 'text-slate-200 cursor-not-allowed'} transition-colors`} title={t.tooltips.moveUp}>
                    <ChevronUp size={16} />
                </button>
                <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title={t.tooltips.deleteElement}>
                    <X size={16} />
                </button>
                <button onClick={onMoveDown} disabled={!onMoveDown} className={`p-1.5 rounded ${onMoveDown ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50' : 'text-slate-200 cursor-not-allowed'} transition-colors`} title={t.tooltips.moveDown}>
                    <ChevronDown size={16} />
                </button>
            </div>
        </div>
    );
};
