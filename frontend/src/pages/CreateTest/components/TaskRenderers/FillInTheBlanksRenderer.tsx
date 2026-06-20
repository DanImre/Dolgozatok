import React from 'react';
import { ChevronUp, ChevronDown, Plus, X } from 'lucide-react';
import { TaskElementEditor } from '../TaskElementEditor';
import type { TaskElement } from '../../../../types/testEditor';
import type { FillInTheBlanksRendererProps } from './types';

export const FillInTheBlanksRenderer: React.FC<FillInTheBlanksRendererProps> = ({
    task, t, onUpdate, addElement, updateElement, deleteBlankElement, updateBlankId
}) => {
    const groups: { textIndex: number, textEl: TaskElement, blanks: { el: TaskElement, idx: number }[] }[] = [];

    task.taskElements.forEach((el, idx) => {
        const isBlank = el.body.includes('"type":"blank"');
        if (!isBlank) {
            groups.push({ textIndex: idx, textEl: el, blanks: [] });
        } else if (groups.length > 0) {
            groups[groups.length - 1].blanks.push({ el, idx });
        }
    });

    return (
        <div className="flex flex-col gap-3 mb-4">
            {groups.map((group, groupIdx) => (
                <div key={group.textEl.id} className="mb-4 bg-slate-50 border border-slate-300 rounded-xl p-3 shadow-sm group/container flex gap-3 transition-all">
                    <div className="flex-1 min-w-0">
                        <div className="mb-3">
                            <TaskElementEditor
                                element={group.textEl}
                                taskType={task.type}
                                index={group.textIndex}
                                onUpdate={(updated) => updateElement(group.textEl.id, updated)}
                                onDelete={() => { }}
                                onTextAndBlanksChange={(newText, allBlanks) => {
                                    const updatedElement = { ...group.textEl, body: JSON.stringify({ type: 'text', text: newText }) };
                                    const beforeElements = task.taskElements.slice(0, group.textIndex);
                                    const afterElements = task.taskElements.slice(group.textIndex + 1 + group.blanks.length);

                                    const newBlankElements = allBlanks.map((blankStr, idx) => {
                                        if (idx < group.blanks.length) {
                                            return { ...group.blanks[idx].el, correctAnswer: blankStr };
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
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-2 pl-4 border-l-2 border-slate-200 ml-2">
                            {group.blanks.map(({ el: blankEl, idx: blankIdx }) => (
                                <div key={blankEl.id} className="relative">
                                    <TaskElementEditor
                                        element={blankEl}
                                        taskType={task.type}
                                        index={blankIdx}
                                        onUpdate={(updated) => updateElement(blankEl.id, updated)}
                                        onDelete={() => deleteBlankElement(group, blankEl.id)}
                                        onBlankIdChange={(newId) => updateBlankId(group, blankEl, blankIdx, newId)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-0.5 justify-center flex-shrink-0 mt-2">
                        <button
                            onClick={() => {
                                const prevGroup = groups[groupIdx - 1];
                                const beforePrev = task.taskElements.slice(0, prevGroup.textIndex);
                                const currentGroupItems = task.taskElements.slice(group.textIndex, group.textIndex + 1 + group.blanks.length);
                                const prevGroupItems = task.taskElements.slice(prevGroup.textIndex, group.textIndex);
                                const afterCurrent = task.taskElements.slice(group.textIndex + 1 + group.blanks.length);
                                onUpdate({ ...task, taskElements: [...beforePrev, ...currentGroupItems, ...prevGroupItems, ...afterCurrent] });
                            }}
                            disabled={groupIdx === 0}
                            className={`p-1.5 rounded ${groupIdx > 0 ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50' : 'text-slate-200 cursor-not-allowed'} transition-colors`}
                            title={t.tooltips.moveUp}
                        >
                            <ChevronUp size={16} />
                        </button>
                        <button
                            onClick={() => {
                                const idsToDelete = [group.textEl.id, ...group.blanks.map(b => b.el.id)];
                                onUpdate({ ...task, taskElements: task.taskElements.filter(e => !idsToDelete.includes(e.id)) });
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title={t.tooltips.deleteElement}
                        >
                            <X size={16} />
                        </button>
                        <button
                            onClick={() => {
                                const nextGroup = groups[groupIdx + 1];
                                const beforeCurrent = task.taskElements.slice(0, group.textIndex);
                                const currentGroupItems = task.taskElements.slice(group.textIndex, nextGroup.textIndex);
                                const nextGroupItems = task.taskElements.slice(nextGroup.textIndex, nextGroup.textIndex + 1 + nextGroup.blanks.length);
                                const afterNext = task.taskElements.slice(nextGroup.textIndex + 1 + nextGroup.blanks.length);
                                onUpdate({ ...task, taskElements: [...beforeCurrent, ...nextGroupItems, ...currentGroupItems, ...afterNext] });
                            }}
                            disabled={groupIdx === groups.length - 1}
                            className={`p-1.5 rounded ${groupIdx < groups.length - 1 ? 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50' : 'text-slate-200 cursor-not-allowed'} transition-colors`}
                            title={t.tooltips.moveDown}
                        >
                            <ChevronDown size={16} />
                        </button>
                    </div>
                </div>
            ))}
            <button
                onClick={() => addElement({ body: JSON.stringify({ type: 'text', text: '' }), points: 0, requiresManualGrading: false, isRandomized: false })}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-300 hover:bg-emerald-200 hover:border-emerald-400 rounded-md transition-colors w-fit"
            >
                <Plus size={16} />
                {t.addTextSegment}
            </button>
        </div>
    );
};
