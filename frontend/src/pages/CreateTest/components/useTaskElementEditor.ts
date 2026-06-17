import type { TaskElement } from '../../../types/testEditor';

export const useTaskElementEditor = (element: TaskElement, onUpdate: (updated: TaskElement) => void) => {
    const updateBody = (body: string) => {
        onUpdate({ ...element, body });
    };

    const updateCorrectAnswer = (correctAnswer: string) => {
        onUpdate({ ...element, correctAnswer });
    };

    const updatePoints = (points: number) => {
        onUpdate({ ...element, points });
    };

    const toggleManualGrading = () => {
        onUpdate({ ...element, requiresManualGrading: !element.requiresManualGrading });
    };

    const toggleRandomized = () => {
        onUpdate({ ...element, isRandomized: !element.isRandomized });
    };

    return {
        updateBody,
        updateCorrectAnswer,
        updatePoints,
        toggleManualGrading,
        toggleRandomized
    };
};
