import type { GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';

export type Question = GenerateQuizQuestionsOutput['questions'][0];
