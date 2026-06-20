import type { Task, TaskElement } from '../../../types/testEditor';

export const useTaskEditor = (task: Task, onUpdate: (updatedTask: Task) => void) => {
    const updateHeader = (header: string) => {
        onUpdate({ ...task, header });
    };

    const toggleRandomized = () => {
        onUpdate({ ...task, isRandomized: !task.isRandomized });
    };

    const addElement = (initialProps?: Partial<TaskElement>, index?: number) => {
        const newElement: TaskElement = {
            id: crypto.randomUUID(),
            body: '',
            correctAnswer: '',
            points: 1,
            requiresManualGrading: false,
            isRandomized: true,
            ...initialProps
        };
        if (index !== undefined) {
            const newElements = [...task.taskElements];
            newElements.splice(index, 0, newElement);
            onUpdate({ ...task, taskElements: newElements });
        } else {
            onUpdate({ ...task, taskElements: [...task.taskElements, newElement] });
        }
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

    const deleteBlankElement = (group: { textIndex: number, textEl: TaskElement, blanks: { el: TaskElement, idx: number }[] }, blankElId: string) => {
        const parsedTextBody = JSON.parse(group.textEl.body);
        let matches = [...parsedTextBody.text.matchAll(/\[\[(.*?)\]\]/g)];
        const blankPos = group.blanks.findIndex(b => b.el.id === blankElId);
        if (matches[blankPos]) {
            const matchStart = matches[blankPos].index!;
            const matchLength = matches[blankPos][0].length;
            let start = matchStart;
            let end = matchStart + matchLength;
            if (start > 0 && parsedTextBody.text[start - 1] === ' ') start--;
            else if (end < parsedTextBody.text.length && parsedTextBody.text[end] === ' ') end++;
            parsedTextBody.text = parsedTextBody.text.substring(0, start) + parsedTextBody.text.substring(end);
            const updatedTextElement = { ...group.textEl, body: JSON.stringify(parsedTextBody) };
            const newElements = task.taskElements.filter(e => e.id !== blankElId);
            const textElIndex = newElements.findIndex(e => e.id === group.textEl.id);
            newElements[textElIndex] = updatedTextElement;
            onUpdate({ ...task, taskElements: newElements });
        } else {
            onUpdate({ ...task, taskElements: task.taskElements.filter(e => e.id !== blankElId) });
        }
    };

    const updateBlankId = (group: { textIndex: number, textEl: TaskElement, blanks: { el: TaskElement, idx: number }[] }, blankEl: TaskElement, blankIdx: number, newId: string) => {
        const updatedBlank = { ...blankEl, correctAnswer: newId };
        const parsedTextBody = JSON.parse(group.textEl.body);
        let matches = [...parsedTextBody.text.matchAll(/\[\[(.*?)\]\]/g)];
        const blankPos = group.blanks.findIndex(b => b.el.id === blankEl.id);
        if (matches[blankPos]) {
            const matchStart = matches[blankPos].index!;
            const matchLength = matches[blankPos][0].length;
            parsedTextBody.text = parsedTextBody.text.substring(0, matchStart) + `[[${newId}]]` + parsedTextBody.text.substring(matchStart + matchLength);
        }
        const updatedTextElement = { ...group.textEl, body: JSON.stringify(parsedTextBody) };
        const newElements = [...task.taskElements];
        newElements[blankIdx] = updatedBlank;
        newElements[group.textIndex] = updatedTextElement;
        onUpdate({ ...task, taskElements: newElements });
    };

    return {
        updateHeader,
        toggleRandomized,
        addElement,
        updateElement,
        deleteElement,
        moveElement,
        deleteBlankElement,
        updateBlankId
    };
};
