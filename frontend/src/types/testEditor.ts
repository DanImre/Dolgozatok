export const TaskTypes = {
    MultipleChoice: 0,
    TrueFalse: 1,
    ShortAnswer: 2,
    Essay: 3,
    FillInTheBlanks: 4,
    Matching: 5,
    Numerical: 6
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
