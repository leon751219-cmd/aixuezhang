'use client';

import { useFormStatus } from 'react-dom';
import { BrainCircuit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" disabled={pending} aria-disabled={pending}>
      {pending ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          正在生成...
        </>
      ) : (
        <>
          <BrainCircuit className="mr-2 h-5 w-5" />
          生成测验
        </>
      )}
    </Button>
  );
}

export function QuizForm({ formAction }: { formAction: (payload: FormData) => void }) {
  
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
        <form action={formAction} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label htmlFor="topic" className="sr-only">测验主题</label>
            <Input
              name="topic"
              id="topic"
              placeholder="输入任何你感兴趣的主题，例如：五年级语文古诗词"
              required
              minLength={3}
              className="text-base h-12 flex-grow w-full rounded-lg bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500"
              autoFocus
            />
            <SubmitButton />
          </div>
        </form>
         <p className="text-xs text-gray-600 mt-3 text-center sm:text-left">
            我们的 AI 将会为你量身定制一份专属测验。
          </p>
    </div>
  );
}
