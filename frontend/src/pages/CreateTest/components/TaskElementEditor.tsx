import React from 'react';
import { TaskTypes } from '../../../types/testEditor';
import type { TaskElement } from '../../../types/testEditor';
import { useTaskElementEditor } from './useTaskElementEditor';
import { X, Shuffle, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '../../../locales/LanguageContext';

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
    let isFillInTheBlanks = taskType === TaskTypes.FillInTheBlanks;
    
    let textInputData: { type: string; text: string; blankId?: string; [key: string]: any } = { type: 'text', text: element.body || '' };
    if (isTextInput || isFillInTheBlanks) {
        try {
            const parsed = JSON.parse(element.body);
            if (parsed && typeof parsed === 'object') {
                textInputData = { ...textInputData, ...parsed };
                if (typeof textInputData.text !== 'string') textInputData.text = '';
            }
        } catch (e) { /* ignore fallback to text */ }
    }
    
    const showOptions = !((isTextInput || isFillInTheBlanks) && textInputData.type === 'text');

    // Render slightly different UI based on TaskTypes just to tell them apart as requested
    const getEditorUI = () => {
        switch (taskType) {
            case TaskTypes.TrueOrFalse: {
                const isTrue = element.correctAnswer === 'True';
                return (
                    <div className="flex-1 flex gap-4 items-center">
                        <div 
                            className={`w-6 h-6 rounded-[6px] border-2 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                                isTrue 
                                    ? 'border-emerald-500 bg-emerald-500 shadow-sm shadow-emerald-200' 
                                    : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                            }`}
                            onClick={() => updateCorrectAnswer(isTrue ? 'False' : 'True')}
                        >
                            <Check size={16} strokeWidth={3} className={`text-white transition-opacity ${isTrue ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                        <input 
                            type="text" 
                            value={element.body} 
                            onChange={(e) => updateBody(e.target.value)} 
                            placeholder={t.placeholders.statement} 
                            className={`flex-1 border-b px-2 py-1 outline-none transition-colors bg-transparent ${isTrue ? 'border-emerald-300 focus:border-emerald-500 font-medium text-emerald-900' : 'border-slate-300 focus:border-emerald-500'}`} 
                        />
                    </div>
                );
            }
            case TaskTypes.MultipleChoice: {
                const isCorrect = element.correctAnswer === 'correct';
                return (
                    <div className="flex-1 flex gap-4 items-center">
                        <div 
                            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                                isCorrect 
                                    ? 'border-emerald-500 bg-emerald-500 shadow-sm shadow-emerald-200' 
                                    : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                            }`}
                            onClick={() => updateCorrectAnswer(isCorrect ? '' : 'correct')}
                        >
                            <div className={`w-2 h-2 rounded-full bg-white transition-transform ${isCorrect ? 'scale-100' : 'scale-0'}`} />
                        </div>
                        <input 
                            type="text" 
                            value={element.body} 
                            onChange={(e) => updateBody(e.target.value)} 
                            placeholder={`${t.placeholders.option}${index + 1}...`} 
                            className={`flex-1 border-b px-2 py-1 outline-none transition-colors bg-transparent ${isCorrect ? 'border-emerald-300 focus:border-emerald-500 font-medium text-emerald-900' : 'border-slate-300 focus:border-emerald-500'}`} 
                        />
                        {/* The 'Mark Correct' button was removed as requested, the radio button on the left is sufficient */}
                    </div>
                );
            }
            case TaskTypes.TextInput: {
                const handleTextChange = (newText: string) => {
                    updateBody(JSON.stringify({ ...textInputData, text: newText }));
                };

                if (textInputData.type === 'text') {
                    return (
                        <div className="flex-1 w-full relative grid">
                            {/* Hidden div establishes the height of the grid cell perfectly */}
                            <div className="col-[1_/_2] row-[1_/_2] invisible whitespace-pre-wrap break-words px-3 py-3 border border-transparent min-h-[80px]">
                                {textInputData.text + ' '}
                            </div>
                            <textarea 
                                value={textInputData.text} 
                                onChange={(e) => handleTextChange(e.target.value)}
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
                                    {textInputData.text + ' '}
                                </div>
                                <textarea 
                                    value={textInputData.text} 
                                    onChange={(e) => handleTextChange(e.target.value)} 
                                    placeholder={t.placeholders.questionPart} 
                                    className="col-[1_/_2] row-[1_/_2] w-full h-full border-b border-slate-300 bg-transparent px-2 py-2 outline-none focus:border-emerald-500 resize-none overflow-hidden" 
                                />
                            </div>
                            <div className="flex items-center gap-2 pl-2 border-l-2 border-indigo-200 ml-1">
                                <span className="text-xs text-slate-400 font-medium">Answer:</span>
                                <input 
                                    type="text" 
                                    value={element.correctAnswer} 
                                    onChange={(e) => updateCorrectAnswer(e.target.value)} 
                                    placeholder={t.placeholders.correctAnswer} 
                                    className="flex-1 border-b border-slate-200 bg-transparent px-2 py-1 outline-none focus:border-indigo-500 text-indigo-900" 
                                />
                            </div>
                        </div>
                    );
                }
            }
            case TaskTypes.FillInTheBlanks: {
                if (textInputData.type === 'text') {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

                    const handleTextChange = (newText: string) => {
                        const newMatches = [...newText.matchAll(/\[\[(.*?)\]\]/g)].map(m => m[1]);
                        
                        if (onTextAndBlanksChange) {
                            onTextAndBlanksChange(newText, newMatches);
                        } else {
                            updateBody(JSON.stringify({ ...textInputData, text: newText }));
                        }
                    };

                    const handleAddBlankClick = () => {
                        const defaultText = t.defaultBlankText || "Blank";
                        const newText = textInputData.text + (textInputData.text.endsWith(' ') ? '' : ' ') + `[[${defaultText}]]`;
                        handleTextChange(newText);
                        
                        setTimeout(() => {
                            if (textareaRef.current) {
                                textareaRef.current.focus();
                                const startIndex = newText.length - 2 - defaultText.length;
                                const endIndex = newText.length - 2;
                                textareaRef.current.setSelectionRange(startIndex, endIndex);
                            }
                        }, 0);
                    };

                    return (
                        <div className="flex-1 w-full flex flex-col gap-2 relative">
                            <div className="w-full relative grid">
                                <div className="col-[1_/_2] row-[1_/_2] invisible whitespace-pre-wrap break-words px-3 py-3 border border-transparent min-h-[80px]">
                                    {textInputData.text + ' '}
                                </div>
                                <textarea 
                                    ref={textareaRef}
                                    value={textInputData.text} 
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
                                onChange={(e) => {
                                    if (onBlankIdChange) {
                                        onBlankIdChange(e.target.value);
                                    } else {
                                        updateCorrectAnswer(e.target.value);
                                    }
                                }} 
                                placeholder={t.placeholders.correctAnswer} 
                                className="flex-1 bg-transparent outline-none text-slate-800 font-medium" 
                            />
                        </div>
                    );
                }
            }
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
                
                {showOptions && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            {t.ptsLabel}
                            <LocalizedNumberInput 
                                value={element.points || 0} 
                                onChange={updatePoints} 
                                language={language} 
                            />
                        </div>
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
                )}
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
