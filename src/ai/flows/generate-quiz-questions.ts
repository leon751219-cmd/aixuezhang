'use server';

/**
 * @fileOverview AI-powered quiz question generator.
 *
 * - generateQuizQuestions - A function that generates multiple-choice questions based on a given topic.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  topic: z.string().describe('需要生成选择题的主题 (例如, "五年级语文古诗词")'),
});
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const GenerateQuizQuestionsOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('测验问题'),
      options: z.array(z.string()).describe('问题的多个选项'),
      answer: z.string().describe('问题的正确答案'),
    })
  ).describe('一个包含多个选择题的数组'),
});
export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;

export async function generateQuizQuestions(input: GenerateQuizQuestionsInput): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
  prompt: `你是一位专门为中国大陆小学1-6年级学生出题的教育专家。你的任务是根据提供的主题生成选择题。

**重要规则：**
1.  **范围限制**：你必须严格确保所有问题都在中国大陆小学一至六年级的知识范围内。
2.  **主题验证**：如果主题（例如“初中物理”、“高等数学”）明显超出了小学范畴，你必须拒绝生成问题，并返回一个空的问题数组。
3.  **语言和格式**：所有问题和选项都必须使用简体中文。每个问题提供四个选项，并明确指出正确答案。
4.  **内容质量**：确保问题的难度和内容完全适合对应年级的学生，避免任何可能引起困惑或超出他们知识范围的“幻觉”内容。

主题: {{{topic}}}

请严格按照以上规则，并以 JSON 格式输出问题。如果主题不合适，请返回空的 questions 数组。`,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
