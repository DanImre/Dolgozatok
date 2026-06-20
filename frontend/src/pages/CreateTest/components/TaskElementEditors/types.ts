import type { TaskElement } from '../../../../types/testEditor';

export interface BaseTaskEditorProps {
    element: TaskElement;
    index: number;
    updateBody: (val: string) => void;
    updateCorrectAnswer: (val: string) => void;
    updatePoints?: (val: number) => void;
    
    // Extracted JSON data for text/matching tasks
    textInputData?: any;
    
    // Optional callbacks used by specific parent wrappers
    onTextAndBlanksChange?: (newText: string, newBlanks: string[]) => void;
    onBlankIdChange?: (newId: string) => void;
}
