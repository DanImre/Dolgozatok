import React from 'react';
import { TaskTypes } from '../../../types/testEditor';
import type { Task } from '../../../types/testEditor';
import { useTaskEditor } from './useTaskEditor';
import { TaskElementEditor } from './TaskElementEditor';
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
        updateHeader, updateType, toggleRandomized, 
        addElement, updateElement, deleteElement, moveElement 
    } = useTaskEditor(task, onUpdate);
    const { lang } = useTranslation();
    const t = lang.createTest;

    const taskTypeOptions = [
        { value: TaskTypes.MultipleChoice, label: t.taskTypes.multipleChoice },
        { value: TaskTypes.TrueFalse, label: t.taskTypes.trueFalse },
        { value: TaskTypes.ShortAnswer, label: t.taskTypes.shortAnswer },
        { value: TaskTypes.Essay, label: t.taskTypes.essay },
        { value: TaskTypes.FillInTheBlanks, label: t.taskTypes.fillInTheBlanks },
        { value: TaskTypes.Matching, label: t.taskTypes.matching },
        { value: TaskTypes.Numerical, label: t.taskTypes.numerical },
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
                        <select 
                            value={task.type}
                            onChange={(e) => updateType(Number(e.target.value) as TaskTypes)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-md px-2 py-1 outline-none focus:border-emerald-300"
                        >
                            {taskTypeOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
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
                    {task.taskElements.map((element, i) => (
                        <TaskElementEditor 
                            key={element.id}
                            element={element}
                            taskType={task.type}
                            index={i}
                            onUpdate={(updated) => updateElement(element.id, updated)}
                            onDelete={() => deleteElement(element.id)}
                            onMoveUp={i > 0 ? () => moveElement(i, -1) : undefined}
                            onMoveDown={i < task.taskElements.length - 1 ? () => moveElement(i, 1) : undefined}
                        />
                    ))}
                </div>

                <button 
                    onClick={addElement}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-300 hover:bg-emerald-200 hover:border-emerald-400 rounded-md transition-colors w-fit"
                >
                    <Plus size={16} />
                    {t.addElement}
                </button>
            </div>
        </div>
    );
};
