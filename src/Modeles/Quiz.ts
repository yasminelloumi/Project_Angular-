export interface QuizQuestion {
    id: number;
    text: string;
    type: 'multiple-choice' | 'true-false';
    options: QuizOption[];
  }
  
  export interface QuizOption {
    id: number;
    text: string;
    isCorrect: boolean;
  }
  
  export interface Quiz {
    questions: QuizQuestion[];
  }