import type { Task, TaskElement } from '../../../../types/testEditor';

export interface TaskRendererProps {
    task: Task;
    t: any;
    onUpdate: (updatedTask: Task) => void;
    addElement: (initialProps?: Partial<TaskElement>, index?: number) => void;
    updateElement: (elementId: string, updatedElement: TaskElement) => void;
    deleteElement: (elementId: string) => void;
    moveElement: (index: number, direction: -1 | 1) => void;
}

export interface FillInTheBlanksRendererProps extends TaskRendererProps {
    deleteBlankElement: (group: { textIndex: number, textEl: TaskElement, blanks: { el: TaskElement, idx: number }[] }, blankElId: string) => void;
    updateBlankId: (group: { textIndex: number, textEl: TaskElement, blanks: { el: TaskElement, idx: number }[] }, blankEl: TaskElement, blankIdx: number, newId: string) => void;
}
