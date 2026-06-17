import React from 'react';
import type { Page } from '../../../types/testEditor';
import { usePageEditor } from './usePageEditor';
import { TaskEditor } from './TaskEditor';
import { Trash2, Plus, Shuffle, ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslation } from '../../../locales/LanguageContext';

interface PageEditorProps {
    page: Page;
    pageIndex: number;
    onUpdate: (updatedPage: Page) => void;
    onDelete: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}

export const PageEditor: React.FC<PageEditorProps> = ({ page, pageIndex, onUpdate, onDelete, onMoveUp, onMoveDown }) => {
    const { toggleRandomized, addTask, updateTask, deleteTask, moveTask } = usePageEditor(page, onUpdate);
    const { lang } = useTranslation();
    const t = lang.createTest;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Page Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-slate-700">{t.page} {pageIndex + 1}</h3>
                    <label className="flex items-center cursor-pointer gap-2 group">
                        <div className="relative flex items-center">
                            <input 
                                type="checkbox" 
                                checked={page.isRandomized}
                                onChange={toggleRandomized}
                                className="sr-only"
                            />
                            <div className={`block w-8 h-4 rounded-full transition-colors ${page.isRandomized ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                            <div className={`absolute left-[2px] top-[2px] bg-white w-3 h-3 rounded-full transition-transform ${page.isRandomized ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                        <span className="text-xs text-slate-500 font-medium group-hover:text-slate-700 transition-colors flex items-center gap-1.5">
                            <Shuffle size={12} className={page.isRandomized ? 'text-emerald-500' : 'text-slate-400'} />
                            {t.randomizePage}
                        </span>
                    </label>
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
                        title={t.tooltips.deletePage}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Page Content (Tasks) */}
            <div className="p-6 flex flex-col gap-6">
                {page.tasks.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-100 rounded-lg bg-slate-50/50">
                        {t.noTasks}
                    </div>
                ) : (
                    page.tasks.map((task, index) => (
                        <TaskEditor 
                            key={task.id}
                            task={task}
                            taskIndex={index}
                            onUpdate={(updated) => updateTask(task.id, updated)}
                            onDelete={() => deleteTask(task.id)}
                            onMoveUp={index > 0 ? () => moveTask(index, -1) : undefined}
                            onMoveDown={index < page.tasks.length - 1 ? () => moveTask(index, 1) : undefined}
                        />
                    ))
                )}

                <div className="flex justify-start">
                    <button 
                        onClick={addTask}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 rounded-lg transition-colors shadow-sm"
                    >
                        <Plus size={16} />
                        {t.addTask}
                    </button>
                </div>
            </div>
        </div>
    );
};
