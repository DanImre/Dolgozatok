import { TaskTypes } from '../../../types/testEditor';
import type { Page, Task } from '../../../types/testEditor';

export const usePageEditor = (page: Page, onUpdate: (updatedPage: Page) => void) => {
    const toggleRandomized = () => {
        onUpdate({ ...page, isRandomized: !page.isRandomized });
    };

    const addTask = () => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            header: '',
            type: TaskTypes.MultipleChoice,
            isRandomized: false,
            taskElements: []
        };
        onUpdate({ ...page, tasks: [...page.tasks, newTask] });
    };

    const updateTask = (taskId: string, updatedTask: Task) => {
        onUpdate({
            ...page,
            tasks: page.tasks.map(t => t.id === taskId ? updatedTask : t)
        });
    };

    const deleteTask = (taskId: string) => {
        onUpdate({
            ...page,
            tasks: page.tasks.filter(t => t.id !== taskId)
        });
    };

    const moveTask = (index: number, direction: -1 | 1) => {
        const newTasks = [...page.tasks];
        if (index + direction < 0 || index + direction >= newTasks.length) return;
        const temp = newTasks[index];
        newTasks[index] = newTasks[index + direction];
        newTasks[index + direction] = temp;
        onUpdate({ ...page, tasks: newTasks });
    };

    return {
        toggleRandomized,
        addTask,
        updateTask,
        deleteTask,
        moveTask
    };
};
