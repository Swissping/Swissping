export interface UserCredentials {
  email: string;
  password: string; // Storing password plain text as explicitly requested by user requirements
}

export interface Question {
  id: number;
  question: string;
  options?: string[];
  correctAnswer?: string; // If null, it's a free text question
  type: 'multiple-choice' | 'text';
}

export interface QuizSubmission {
  id: string;
  user: UserCredentials;
  answers: Record<number, string>;
  score: number;
  maxScore: number;
  timestamp: string;
  aiAnalysis?: string; // Optional analysis of the text answer
}

export enum ViewState {
  LOGIN = 'LOGIN',
  QUIZ = 'QUIZ',
  SUCCESS = 'SUCCESS',
  ADMIN = 'ADMIN',
}