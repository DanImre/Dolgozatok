import React from 'react';
import { TaskTypes } from '../../../types/testEditor';
import type { TaskElement } from '../../../types/testEditor';
import { useTaskElementEditor } from './useTaskElementEditor';
import { X, Shuffle, ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from '../../../locales/LanguageContext';

import { TrueOrFalseEditor } from './TaskElementEditors/TrueOrFalseEditor';
import { MultipleChoiceEditor } from './TaskElementEditors/MultipleChoiceEditor';
import { TextInputEditor } from './TaskElementEditors/TextInputEditor';
import { FillInTheBlanksEditor } from './TaskElementEditors/FillInTheBlanksEditor';
import { NumericalEditor } from './TaskElementEditors/NumericalEditor';
import { MatchingEditor } from './TaskElementEditors/MatchingEditor';
import type { BaseTaskEditorProps } from './TaskElementEditors/types';
import { LocalizedNumberInput } from '../../../components/LocalizedNumberInput';

interface TaskElementEditorProps {
    element: TaskElement;
    taskType: TaskTypes;
    index: number;
    onUpdate: (updated: TaskElement) => void;
    onDelete: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onTextAndBlanksChange?: (newText: string, newBlanks: string[]) => void;
    onBlankIdChange?: (newId: string) => void;
}

export const TaskElementEditor: React.FC<TaskElementEditorProps> = ({
    element, taskType, index, onUpdate, onDelete, onMoveUp, onMoveDown, onTextAndBlanksChange, onBlankIdChange
}) => {
    const {
        updateBody, updateCorrectAnswer,
        updatePoints, toggleManualGrading, toggleRandomized
    } = useTaskElementEditor(element, onUpdate);
    const { lang, language } = useTranslation();
    const t = lang.createTest;

    const isTextInput = taskType === TaskTypes.TextInput;
    const isFillInTheBlanks = taskType === TaskTypes.FillInTheBlanks;
    const isMatching = taskType === TaskTypes.Matching;

    let textInputData: { type: string; text: string; Text?: string; ParentId?: string; blankId?: string;[key: string]: any } = { type: 'text', text: element.body || '' };
    if (isTextInput || isFillInTheBlanks || isMatching) {
        try {
            const parsed = JSON.parse(element.body);
            if (parsed && typeof parsed === 'object') {
                textInputData = { ...textInputData, ...parsed };
                if (typeof textInputData.text !== 'string' && typeof textInputData.Text !== 'string') textInputData.text = '';
            }
        } catch (e) { /* ignore fallback to text */ }
    }

    const showOptions = !(isTextInput && textInputData.type === 'text') && !isMatching;

    const isMatchingRegion = isMatching && textInputData.type === 'region';
    const isMatchingItem = isMatching && textInputData.type !== 'region';

    const baseProps: BaseTaskEditorProps = {
        element,
        index,
        updateBody,
        updateCorrectAnswer,
        updatePoints,
        textInputData,
        onTextAndBlanksChange,
        onBlankIdChange
    };

    const getEditorUI = () => {
        switch (taskType) {
            case TaskTypes.TrueOrFalse:
                return <TrueOrFalseEditor {...baseProps} />;
            case TaskTypes.MultipleChoice:
                return <MultipleChoiceEditor {...baseProps} />;
            case TaskTypes.TextInput:
                return <TextInputEditor {...baseProps} />;
            case TaskTypes.FillInTheBlanks:
                return <FillInTheBlanksEditor {...baseProps} />;
            case TaskTypes.Numerical:
                return <NumericalEditor {...baseProps} />;
            case TaskTypes.Matching:
                return <MatchingEditor {...baseProps} />;
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
        <div className={`relative flex items-start gap-2 group ${isMatchingItem ? 'w-fit' : 'w-full'}`}>
            <div className={`
                ${isMatchingRegion ? 'flex-1 flex flex-col gap-3' : ''}
                ${isMatchingItem ? 'bg-white rounded-xl border border-slate-300 shadow-sm flex flex-col transition-shadow hover:shadow-md' : ''}
                ${!isMatchingRegion && !isMatchingItem ? 'flex-1 bg-white p-3 rounded border border-slate-200 shadow-sm flex flex-col gap-3' : ''}
            `}>
                <div className={`flex flex-col sm:flex-row sm:items-center gap-3 ${isMatchingItem ? 'h-full' : ''}`}>
                    {getEditorUI()}
                </div>

                {showOptions && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 pt-3 border-t border-slate-100">
                        {!(isFillInTheBlanks && textInputData.type === 'text') && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                {t.ptsLabel}
                                <LocalizedNumberInput
                                    value={element.points || 0}
                                    onChange={(v) => updatePoints(isNaN(v) ? 0 : v)}
                                    language={language}
                                />
                            </div>
                        )}
                        {textInputData.type !== 'blank' && (
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
                        )}
                        {!(isFillInTheBlanks && textInputData.type === 'text') && (
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
                        )}
                        {isFillInTheBlanks && textInputData.type !== 'text' && (
                            <button onClick={onDelete} className="p-1.5 ml-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors border border-transparent hover:border-red-100 flex items-center justify-center" title={t.tooltips.deleteElement}>
                                <X size={16} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isMatchingItem ? (
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button onClick={onDelete} className="p-1 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 shadow-sm rounded-full transition-colors" title={t.tooltips.deleteElement}>
                        <X size={14} />
                    </button>
                </div>
            ) : isMatchingRegion || isFillInTheBlanks ? null : (
                <div className="flex flex-col gap-0.5 justify-center flex-shrink-0 mt-2">
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
            )}
        </div>
    );
};
