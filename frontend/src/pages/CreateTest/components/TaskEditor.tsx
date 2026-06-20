import React from 'react';
import { TaskTypes } from '../../../types/testEditor';
import type { Task } from '../../../types/testEditor';
import { useTaskEditor } from './useTaskEditor';
import { formatLocalizedNumber } from '../../../components/LocalizedNumberInput';
import { Trash2, Shuffle, ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from '../../../locales/LanguageContext';

import { MatchingTaskRenderer } from './TaskRenderers/MatchingTaskRenderer';
import { FillInTheBlanksRenderer } from './TaskRenderers/FillInTheBlanksRenderer';
import { TextInputRenderer } from './TaskRenderers/TextInputRenderer';
import { StandardTaskRenderer } from './TaskRenderers/StandardTaskRenderer';
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
        addElement, updateElement, deleteElement, moveElement,
        deleteBlankElement, updateBlankId
    } = useTaskEditor(task, onUpdate);
    const { lang, language } = useTranslation();
    const t = lang.createTest;

    const taskTypeOptions = [
        { value: TaskTypes.TrueOrFalse, label: t.taskTypes.trueOrFalse },
        { value: TaskTypes.MultipleChoice, label: t.taskTypes.multipleChoice },
        { value: TaskTypes.Numerical, label: t.taskTypes.numerical },
        { value: TaskTypes.TextInput, label: t.taskTypes.textInput },
        { value: TaskTypes.Matching, label: t.taskTypes.matching },
        { value: TaskTypes.FillInTheBlanks, label: t.taskTypes.fillInTheBlanks }
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
                {task.type === TaskTypes.Matching ? (
                    <MatchingTaskRenderer 
                        task={task} t={t} onUpdate={onUpdate} 
                        addElement={addElement} updateElement={updateElement} deleteElement={deleteElement} moveElement={moveElement}
                    />
                ) : task.type === TaskTypes.FillInTheBlanks ? (
                    <FillInTheBlanksRenderer 
                        task={task} t={t} onUpdate={onUpdate} 
                        addElement={addElement} updateElement={updateElement} deleteElement={deleteElement} moveElement={moveElement}
                        deleteBlankElement={deleteBlankElement} updateBlankId={updateBlankId}
                    />
                ) : task.type === TaskTypes.TextInput ? (
                    <TextInputRenderer 
                        task={task} t={t} onUpdate={onUpdate} 
                        addElement={addElement} updateElement={updateElement} deleteElement={deleteElement} moveElement={moveElement}
                    />
                ) : (
                    <StandardTaskRenderer 
                        task={task} t={t} onUpdate={onUpdate} 
                        addElement={addElement} updateElement={updateElement} deleteElement={deleteElement} moveElement={moveElement}
                    />
                )}
            </div>
        </div>
    );
};
