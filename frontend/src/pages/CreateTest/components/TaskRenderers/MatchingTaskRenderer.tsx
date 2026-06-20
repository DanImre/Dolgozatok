import React from 'react';
import { Plus, Shuffle, X } from 'lucide-react';
import { TaskElementEditor } from '../TaskElementEditor';
import type { TaskRendererProps } from './types';

export const MatchingTaskRenderer: React.FC<TaskRendererProps> = ({ 
    task, t, onUpdate, addElement, updateElement, deleteElement 
}) => {
    return (
        <div className="flex flex-col gap-3 mb-4">
            {task.taskElements.filter(e => {
                try { return JSON.parse(e.body).type === 'region'; } catch { return false; }
            }).map((region) => {
                const regionIndex = task.taskElements.findIndex(e => e.id === region.id);
                const items = task.taskElements.map((e, idx) => ({ e, idx })).filter(({ e }) => {
                    try { return JSON.parse(e.body).ParentId === region.id; } catch { return false; }
                });

                return (
                    <div key={region.id} className="mb-4 bg-slate-50 border border-slate-300 rounded-xl p-3 pt-2 shadow-sm relative group">
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                            <label className="flex items-center cursor-pointer gap-2 group bg-white border border-slate-200 shadow-sm rounded-full px-2.5 py-1 hover:bg-slate-50 transition-colors" title={t.randomizeElement || "Randomize items"}>
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={region.isRandomized || false}
                                        onChange={() => {
                                            const newElements = task.taskElements.map(e => 
                                                e.id === region.id ? { ...e, isRandomized: !e.isRandomized } : e
                                            );
                                            onUpdate({ ...task, taskElements: newElements });
                                        }}
                                        className="sr-only"
                                    />
                                    <div className={`block w-7 h-3.5 rounded-full transition-colors ${region.isRandomized ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                    <div className={`absolute left-[2px] top-[2px] bg-white w-2.5 h-2.5 rounded-full transition-transform ${region.isRandomized ? 'translate-x-3.5' : 'translate-x-0'}`}></div>
                                </div>
                                <Shuffle size={12} className={region.isRandomized ? 'text-emerald-500' : 'text-slate-400'} />
                            </label>
                            <button
                                onClick={() => {
                                    const itemsToDelete = items.map(item => item.e.id);
                                    itemsToDelete.push(region.id);
                                    const newElements = task.taskElements.filter(e => !itemsToDelete.includes(e.id));
                                    onUpdate({ ...task, taskElements: newElements });
                                }}
                                className="p-1.5 bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title={t.tooltips.deleteElement || "Delete Category"}
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="mb-3 pr-8">
                            <TaskElementEditor
                                element={region}
                                taskType={task.type}
                                index={regionIndex}
                                onUpdate={(updated) => updateElement(region.id, updated)}
                                onDelete={() => { }}
                            />
                        </div>
                        <div className="flex flex-wrap items-start gap-3">
                            {items.map(({ e, idx }) => (
                                <TaskElementEditor
                                    key={e.id}
                                    element={e}
                                    taskType={task.type}
                                    index={idx}
                                    onUpdate={(updated) => updateElement(e.id, updated)}
                                    onDelete={() => deleteElement(e.id)}
                                />
                            ))}
                            <button
                                onClick={() => addElement({ body: JSON.stringify({ Text: '', ParentId: region.id }), points: 0, requiresManualGrading: false, isRandomized: false })}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-emerald-700 bg-white border border-dashed border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400 rounded-xl transition-colors h-[42px] mt-1"
                            >
                                <Plus size={16} />
                                {t.addItem || "Add Item"}
                            </button>
                        </div>
                    </div>
                );
            })}
            <button
                onClick={() => addElement({ body: JSON.stringify({ type: 'region', text: '' }), points: 0, requiresManualGrading: false, isRandomized: false })}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-300 hover:bg-emerald-200 hover:border-emerald-400 rounded-md transition-colors w-fit"
            >
                <Plus size={16} />
                {t.addCategory || "Add Category"}
            </button>
        </div>
    );
};
