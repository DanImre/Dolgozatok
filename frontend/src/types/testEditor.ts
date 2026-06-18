export const TaskTypes = {
    MultipleChoice: 0,
    TrueOrFalse: 1,
    TextInput: 2,
    FillInTheBlanks: 3,
    Matching: 4,
    Numerical: 5
} as const;

export type TaskTypes = typeof TaskTypes[keyof typeof TaskTypes];

export interface TaskElement {
    id: string;
    body: string;
    correctAnswer: string;
    points: number;
    requiresManualGrading: boolean;
    isRandomized: boolean;
}

export interface Task {
    id: string;
    header: string;
    type: TaskTypes;
    isRandomized: boolean;
    taskElements: TaskElement[];
}

export interface Page {
    id: string;
    isRandomized: boolean;
    tasks: Task[];
}

export interface Test {
    title: string;
    pages: Page[];
}
