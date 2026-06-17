import { TaskTypes } from '../../../types/testEditor';
import type { Task, TaskElement } from '../../../types/testEditor';

export const useTaskEditor = (task: Task, onUpdate: (updatedTask: Task) => void) => {
    const updateHeader = (header: string) => {
        onUpdate({ ...task, header });
    };

    const updateType = (type: TaskTypes) => {
        onUpdate({ ...task, type });
    };

    const toggleRandomized = () => {
        onUpdate({ ...task, isRandomized: !task.isRandomized });
    };

    const addElement = () => {
        const newElement: TaskElement = {
            id: crypto.randomUUID(),
            body: '',
            correctAnswer: '',
            points: 1,
            requiresManualGrading: false,
            isRandomized: true
        };
        onUpdate({ ...task, taskElements: [...task.taskElements, newElement] });
    };

    const updateElement = (elementId: string, updatedElement: TaskElement) => {
        onUpdate({
            ...task,
            taskElements: task.taskElements.map(e => e.id === elementId ? updatedElement : e)
        });
    };

    const deleteElement = (elementId: string) => {
        onUpdate({
            ...task,
            taskElements: task.taskElements.filter(e => e.id !== elementId)
        });
    };

    const moveElement = (index: number, direction: -1 | 1) => {
        const newElements = [...task.taskElements];
        if (index + direction < 0 || index + direction >= newElements.length) return;
        const temp = newElements[index];
        newElements[index] = newElements[index + direction];
        newElements[index + direction] = temp;
        onUpdate({ ...task, taskElements: newElements });
    };

    return {
        updateHeader,
        updateType,
        toggleRandomized,
        addElement,
        updateElement,
        deleteElement,
        moveElement
    };
};
