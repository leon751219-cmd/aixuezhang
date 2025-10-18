'use client';

import { useState } from 'react';
import type { Question } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Award, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type AnswerState = {
  selectedOption: string | null;
  isCorrect: boolean | null;
};

export function Quiz({ questions, onRetry }: { questions: Question[]; onRetry: () => void }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>(Array(questions.length).fill({ selectedOption: null, isCorrect: null }));
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswerState = answers[currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    if (currentAnswerState.selectedOption !== null) return;

    const isCorrect = option === currentQuestion.answer;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = { selectedOption: option, isCorrect };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const score = answers.filter(a => a.isCorrect).length;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (showResults) {
    return (
      <Card className="w-full max-w-2xl text-center shadow-2xl animate-in fade-in-0 zoom-in-95 rounded-2xl bg-white/80 border-none backdrop-blur-md">
        <CardHeader>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
            <Award className="h-12 w-12 text-accent" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline mt-4 text-gray-800">测验完成！</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-600">干得漂亮，你完成了测验！</p>
          <p className="text-6xl font-bold my-4 text-primary">
            {score} / {questions.length}
          </p>
          <p className="text-2xl font-semibold text-gray-800">你的得分是 {((score / questions.length) * 100).toFixed(0)}%</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onRetry} className="w-full" size="lg">
            <RotateCw className="mr-2 h-4 w-4" />
            再试一次
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl shadow-2xl animate-in fade-in-0 rounded-2xl bg-white/80 border-none backdrop-blur-md">
      <CardHeader>
        <Progress value={progress} className="mb-4 h-2" />
        <CardTitle className="text-base font-semibold text-gray-500">
          第 {currentQuestionIndex + 1} 题 / 共 {questions.length} 题
        </CardTitle>
        <p className="text-2xl pt-2 font-bold text-gray-800">{currentQuestion.question}</p>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={currentAnswerState.selectedOption ?? undefined}
          onValueChange={handleOptionSelect}
          className="space-y-3"
          disabled={currentAnswerState.selectedOption !== null}
        >
          {currentQuestion.options.map((option, index) => {
            const isSelected = currentAnswerState.selectedOption === option;
            const isCorrectAnswer = currentQuestion.answer === option;
            const showFeedback = currentAnswerState.selectedOption !== null;

            return (
              <Label
                key={index}
                htmlFor={`option-${index}`}
                className={cn(
                  "flex items-center space-x-3 rounded-lg border p-4 text-base transition-all text-gray-800 border-gray-300",
                  showFeedback && isCorrectAnswer && "border-green-500 bg-green-500/10 ring-2 ring-green-500",
                  showFeedback && isSelected && !isCorrectAnswer && "border-destructive bg-destructive/10 ring-2 ring-destructive",
                  !showFeedback && "hover:bg-gray-200/50 cursor-pointer",
                  showFeedback && "cursor-not-allowed"
                )}
              >
                <RadioGroupItem value={option} id={`option-${index}`} className="h-5 w-5" />
                <span className="flex-1">
                  {option}
                </span>
                {showFeedback && isCorrectAnswer && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                {showFeedback && isSelected && !isCorrectAnswer && <XCircle className="h-5 w-5 text-destructive" />}
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleNext} disabled={currentAnswerState.selectedOption === null} size="lg">
          {currentQuestionIndex < questions.length - 1 ? '下一题' : '完成测验'}
        </Button>
      </CardFooter>
    </Card>
  );
}
