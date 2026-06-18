import React from 'react';
import { TaskTypes } from '../../../types/testEditor';
import type { Task } from '../../../types/testEditor';
import { useTaskEditor } from './useTaskEditor';
import { TaskElementEditor } from './TaskElementEditor';
import { formatLocalizedNumber } from '../../../components/LocalizedNumberInput';
import { Trash2, Shuffle, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from '../../../locales/LanguageContext';

interface TaskEditorProps {
    task: Task;
    taskIndex: number;
    onUpdate: (updatedTask: Task) => void;
    onDelete: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}

export const TaskEditor: React.FC<TaskEditorProps> = ({ task, taskIndex, onUpdate, onDelete, onMoveUp, onMoveDown }) => {
    const { 
        updateHeader, toggleRandomized, 
        addElement, updateElement, deleteElement, moveElement 
    } = useTaskEditor(task, onUpdate);
    const { lang, language } = useTranslation();
    const t = lang.createTest;

    const taskTypeOptions = [
        { value: TaskTypes.MultipleChoice, label: t.taskTypes.multipleChoice },
        { value: TaskTypes.TrueOrFalse, label: t.taskTypes.trueOrFalse },
        { value: TaskTypes.TextInput, label: t.taskTypes.textInput },
        { value: TaskTypes.FillInTheBlanks, label: t.taskTypes.fillInTheBlanks },
        { value: TaskTypes.Matching, label: t.taskTypes.matching },
        { value: TaskTypes.Numerical, label: t.taskTypes.numerical }
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
            {/* Task Header Area */}
            <div className="p-4 border-b border-slate-100 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 flex gap-3 items-center">
                        <span className="font-semibold text-slate-400 text-lg">{taskIndex + 1}.</span>
                        <input
                            type="text"
                            value={task.header}
                            onChange={(e) => updateHeader(e.target.value)}
                            placeholder={t.placeholders.taskHeader}
                            className="flex-1 text-lg font-medium bg-transparent border-none outline-none focus:ring-0 placeholder-slate-300"
                        />
                    </div>
                    <div className="flex items-center border-l border-slate-200">
                    <div className="flex flex-col px-2 border-r border-slate-200 justify-center">
                        <button onClick={onMoveUp} disabled={!onMoveUp} className={`p-1 ${onMoveUp ? 'text-slate-400 hover:text-emerald-600' : 'text-slate-200 cursor-not-allowed'} transition-colors`} title={t.tooltips.moveUp}>
                            <ChevronUp size={16} />
                        </button>
                        <button onClick={onMoveDown} disabled={!onMoveDown} className={`p-1 ${onMoveDown ? 'text-slate-400 hover:text-emerald-600' : 'text-slate-200 cursor-not-allowed'} transition-colors`} title={t.tooltips.moveDown}>
                            <ChevronDown size={16} />
                        </button>
                    </div>
                    <button 
                        onClick={onDelete}
                        className="p-4 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title={t.tooltips.deleteTask}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
                </div>

                <div className="flex items-center gap-6 text-sm ml-7">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500">{t.typeLabel}</span>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-medium text-xs">
                            {taskTypeOptions.find(opt => opt.value === task.type)?.label}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-medium text-xs shadow-sm">
                        <span className="text-slate-500">{t.ptsLabel}</span>
                        <span className="text-slate-700">{formatLocalizedNumber(task.taskElements.reduce((sum, el) => sum + (el.points || 0), 0), language)}</span>
                    </div>

                    <label className="flex items-center cursor-pointer gap-2 group">
                        <div className="relative flex items-center">
                            <input 
                                type="checkbox" 
                                checked={task.isRandomized}
                                onChange={toggleRandomized}
                                className="sr-only"
                            />
                            <div className={`block w-8 h-4 rounded-full transition-colors ${task.isRandomized ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                            <div className={`absolute left-[2px] top-[2px] bg-white w-3 h-3 rounded-full transition-transform ${task.isRandomized ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                        <span className="text-xs text-slate-500 font-medium group-hover:text-slate-700 transition-colors flex items-center gap-1.5">
                            <Shuffle size={12} className={task.isRandomized ? 'text-emerald-500' : 'text-slate-400'} />
                            {t.randomizeTask}
                        </span>
                    </label>
                </div>
            </div>

            {/* Elements Area */}
            <div className="p-4 bg-slate-50/50">
                <div className="flex flex-col gap-3 mb-4">
                    {task.taskElements.map((element, i) => {
                        const isBlankElement = task.type === TaskTypes.FillInTheBlanks && element.body.includes('"type":"blank"');
                        return (
                        <TaskElementEditor 
                            key={element.id}
                            element={element}
                            taskType={task.type}
                            index={i}
                            onUpdate={(updated) => updateElement(element.id, updated)}
                            onDelete={() => {
                                if (task.type === TaskTypes.FillInTheBlanks) {
                                    if (isBlankElement) {
                                        let textElementIndex = -1;
                                        for (let j = i - 1; j >= 0; j--) {
                                            if (task.taskElements[j].body.includes('"type":"text"')) {
                                                textElementIndex = j;
                                                break;
                                            }
                                        }
                                        if (textElementIndex !== -1) {
                                            const textElement = task.taskElements[textElementIndex];
                                            const parsedTextBody = JSON.parse(textElement.body);
                                            
                                            let blankIndex = 0;
                                            for (let j = textElementIndex + 1; j < i; j++) {
                                                if (task.taskElements[j].body.includes('"type":"blank"')) blankIndex++;
                                            }
                                            
                                            let matches = [...parsedTextBody.text.matchAll(/\[\[(.*?)\]\]/g)];
                                            if (matches[blankIndex]) {
                                                const matchStart = matches[blankIndex].index!;
                                                const matchLength = matches[blankIndex][0].length;
                                                
                                                let start = matchStart;
                                                let end = matchStart + matchLength;
                                                if (start > 0 && parsedTextBody.text[start - 1] === ' ') {
                                                    start--;
                                                } else if (end < parsedTextBody.text.length && parsedTextBody.text[end] === ' ') {
                                                    end++;
                                                }
                                                parsedTextBody.text = parsedTextBody.text.substring(0, start) + parsedTextBody.text.substring(end);
                                                
                                                const updatedTextElement = { ...textElement, body: JSON.stringify(parsedTextBody) };
                                                
                                                const newElements = task.taskElements.filter(e => e.id !== element.id);
                                                const newTextElIndex = newElements.findIndex(e => e.id === textElement.id);
                                                newElements[newTextElIndex] = updatedTextElement;
                                                
                                                onUpdate({ ...task, taskElements: newElements });
                                                return;
                                            }
                                        }
                                    } else {
                                        let j = i + 1;
                                        while (j < task.taskElements.length && task.taskElements[j].body.includes('"type":"blank"')) {
                                            j++;
                                        }
                                        const newElements = [...task.taskElements.slice(0, i), ...task.taskElements.slice(j)];
                                        onUpdate({ ...task, taskElements: newElements });
                                        return;
                                    }
                                }
                                deleteElement(element.id);
                            }}
                            onMoveUp={i > 0 && !isBlankElement ? () => {
                                if (task.type === TaskTypes.FillInTheBlanks) {
                                    let j = i + 1;
                                    while (j < task.taskElements.length && task.taskElements[j].body.includes('"type":"blank"')) j++;
                                    const currentGroup = task.taskElements.slice(i, j);
                                    
                                    let prevStart = i - 1;
                                    while (prevStart >= 0 && !task.taskElements[prevStart].body.includes('"type":"text"')) prevStart--;
                                    
                                    if (prevStart >= 0) {
                                        const prevGroup = task.taskElements.slice(prevStart, i);
                                        const beforePrev = task.taskElements.slice(0, prevStart);
                                        const afterCurrent = task.taskElements.slice(j);
                                        onUpdate({ ...task, taskElements: [...beforePrev, ...currentGroup, ...prevGroup, ...afterCurrent] });
                                    } else {
                                        moveElement(i, -1);
                                    }
                                } else {
                                    moveElement(i, -1);
                                }
                            } : undefined}
                            onMoveDown={i < task.taskElements.length - 1 && !isBlankElement ? () => {
                                if (task.type === TaskTypes.FillInTheBlanks) {
                                    let j = i + 1;
                                    while (j < task.taskElements.length && task.taskElements[j].body.includes('"type":"blank"')) j++;
                                    const currentGroup = task.taskElements.slice(i, j);
                                    
                                    if (j < task.taskElements.length) {
                                        let nextEnd = j + 1;
                                        while (nextEnd < task.taskElements.length && task.taskElements[nextEnd].body.includes('"type":"blank"')) nextEnd++;
                                        const nextGroup = task.taskElements.slice(j, nextEnd);
                                        
                                        const beforeCurrent = task.taskElements.slice(0, i);
                                        const afterNext = task.taskElements.slice(nextEnd);
                                        
                                        onUpdate({ ...task, taskElements: [...beforeCurrent, ...nextGroup, ...currentGroup, ...afterNext] });
                                    } else {
                                        moveElement(i, 1);
                                    }
                                } else {
                                    moveElement(i, 1);
                                }
                            } : undefined}
                            onTextAndBlanksChange={task.type === TaskTypes.FillInTheBlanks ? (newText, allBlanks) => {
                                const updatedElement = { ...element, body: JSON.stringify({ type: 'text', text: newText }) };
                                
                                const beforeElements = task.taskElements.slice(0, i);
                                
                                let blanksForThisText = [];
                                let j = i + 1;
                                while (j < task.taskElements.length) {
                                    const nextEl = task.taskElements[j];
                                    if (nextEl.body.includes('"type":"text"')) break;
                                    blanksForThisText.push(nextEl);
                                    j++;
                                }
                                
                                const afterElements = task.taskElements.slice(j);
                                
                                const newBlankElements = allBlanks.map((blankStr, idx) => {
                                    if (idx < blanksForThisText.length) {
                                        return { ...blanksForThisText[idx], correctAnswer: blankStr };
                                    } else {
                                        return {
                                            id: crypto.randomUUID(),
                                            body: JSON.stringify({ type: 'blank' }),
                                            correctAnswer: blankStr,
                                            points: 1,
                                            requiresManualGrading: false,
                                            isRandomized: false
                                        };
                                    }
                                });
                                
                                onUpdate({ 
                                    ...task, 
                                    taskElements: [...beforeElements, updatedElement, ...newBlankElements, ...afterElements] 
                                });
                            } : undefined}
                            onBlankIdChange={isBlankElement ? (newId) => {
                                const updatedBlank = { ...element, correctAnswer: newId };
                                
                                let textElementIndex = -1;
                                for (let j = i - 1; j >= 0; j--) {
                                    if (task.taskElements[j].body.includes('"type":"text"')) {
                                        textElementIndex = j;
                                        break;
                                    }
                                }
                                
                                if (textElementIndex !== -1) {
                                    const textElement = task.taskElements[textElementIndex];
                                    const parsedTextBody = JSON.parse(textElement.body);
                                    
                                    let blankIndex = 0;
                                    for (let j = textElementIndex + 1; j < i; j++) {
                                        if (task.taskElements[j].body.includes('"type":"blank"')) blankIndex++;
                                    }
                                    
                                    let matches = [...parsedTextBody.text.matchAll(/\[\[(.*?)\]\]/g)];
                                    if (matches[blankIndex]) {
                                        const matchStart = matches[blankIndex].index!;
                                        const matchLength = matches[blankIndex][0].length;
                                        parsedTextBody.text = parsedTextBody.text.substring(0, matchStart) + `[[${newId}]]` + parsedTextBody.text.substring(matchStart + matchLength);
                                    }
                                    
                                    const updatedTextElement = { ...textElement, body: JSON.stringify(parsedTextBody) };
                                    
                                    const newElements = [...task.taskElements];
                                    newElements[i] = updatedBlank;
                                    newElements[textElementIndex] = updatedTextElement;
                                    
                                    onUpdate({ ...task, taskElements: newElements });
                                } else {
                                    updateElement(element.id, updatedBlank);
                                }
                            } : undefined}
                        />
                        );
                    })}
                </div>

                {task.type === TaskTypes.TextInput ? (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => addElement({ body: JSON.stringify({ type: 'text', text: '' }), points: 0, requiresManualGrading: false, isRandomized: false })}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-300 hover:bg-emerald-200 hover:border-emerald-400 rounded-md transition-colors w-fit"
                        >
                            <Plus size={16} />
                            {t.addTextElement}
                        </button>
                        <button 
                            onClick={() => addElement({ body: JSON.stringify({ type: 'question', text: '' }) })}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-100 border border-indigo-300 hover:bg-indigo-200 hover:border-indigo-400 rounded-md transition-colors w-fit"
                        >
                            <Plus size={16} />
                            {t.addQuestionElement}
                        </button>
                    </div>
                ) : task.type === TaskTypes.FillInTheBlanks ? (
                    <button 
                        onClick={() => addElement({ body: JSON.stringify({ type: 'text', text: '' }), points: 0, requiresManualGrading: false, isRandomized: false })}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-300 hover:bg-emerald-200 hover:border-emerald-400 rounded-md transition-colors w-fit"
                    >
                        <Plus size={16} />
                        {t.addTextSegment}
                    </button>
                ) : (
                    <button 
                        onClick={() => addElement()}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-300 hover:bg-emerald-200 hover:border-emerald-400 rounded-md transition-colors w-fit"
                    >
                        <Plus size={16} />
                        {t.addElement}
                    </button>
                )}
            </div>
        </div>
    );
};
