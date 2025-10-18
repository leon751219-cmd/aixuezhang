'use server';

import { generateQuizQuestions } from '@/ai/flows/generate-quiz-questions';
import type { Question } from '@/lib/types';
import { z } from 'zod';

const TopicSchema = z.string().min(3, { message: '请输入至少3个字符的主题。' }).max(100, { message: '主题太长了。' });

export async function createQuiz(
  prevState: any,
  formData: FormData
): Promise<{ questions?: Question[]; error?: string }> {
  const validatedTopic = TopicSchema.safeParse(formData.get('topic'));

  if (!validatedTopic.success) {
    return { error: validatedTopic.error.errors[0].message };
  }

  try {
    const result = await generateQuizQuestions({ topic: validatedTopic.data });
    if (!result.questions || result.questions.length === 0) {
      return { error: '无法为此主题生成测验。请尝试其他主题。' };
    }
    return { questions: result.questions };
  } catch (e) {
    console.error(e);
    return { error: '生成测验时发生意外错误。请稍后再试。' };
  }
}
