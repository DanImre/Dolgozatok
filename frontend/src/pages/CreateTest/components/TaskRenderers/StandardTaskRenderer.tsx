import React from 'react';
import { Plus } from 'lucide-react';
import { TaskElementEditor } from '../TaskElementEditor';
import type { TaskRendererProps } from './types';

export const StandardTaskRenderer: React.FC<TaskRendererProps> = ({
    task, t, addElement, updateElement, deleteElement, moveElement
}) => {
    return (
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
            <button
                onClick={() => addElement()}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-300 hover:bg-emerald-200 hover:border-emerald-400 rounded-md transition-colors w-fit"
            >
                <Plus size={16} />
                {t.addElement}
            </button>
        </div>
    );
};
