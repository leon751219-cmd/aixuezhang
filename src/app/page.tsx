'use client';

import { useState, useEffect, useActionState } from 'react';
import Image from 'next/image';
import { useMediaQuery } from '@/hooks/use-media-query';

import { createQuiz } from '@/app/actions';
import type { Question } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { Logo } from '@/components/logo';
import { QuizForm } from '@/components/quiz-form';
import { Quiz } from '@/components/quiz';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


const initialState: { questions?: Question[]; error?: string } = {};

const exampleTopics = [
  {
    title: '唐诗三百首',
    description: '测试你对中国古代诗歌的了解。',
    image: 'https://picsum.photos/seed/poem/600/400',
    imageHint: 'ancient chinese scroll'
  },
  {
    title: '恐龙王国',
    description: '探索史前巨兽的奥秘。',
    image: 'https://picsum.photos/seed/dino/600/400',
    imageHint: 'dinosaur roaring'
  },
  {
    title: '宇宙探秘',
    description: '关于行星、恒星和星系的知识问答。',
    image: 'https://picsum.photos/seed/galaxy/600/400',
    imageHint: 'galaxy nebula'
  },
];


export default function Home() {
  const [state, formAction] = useActionState(createQuiz, initialState);
  const { toast } = useToast();
  const [quizActive, setQuizActive] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (state.error) {
      toast({
        title: '生成测验出错',
        description: state.error,
        variant: 'destructive',
      });
      setQuizActive(false);
    }
    if (state.questions && state.questions.length > 0) {
      setQuizActive(true);
    }
  }, [state, toast]);

  const handleRetry = () => {
    setQuizActive(false);
    // Reset state by re-calling formAction with a special value could be an option
    // but for now, we just go back to the form. A full state reset is tricky with useActionState
    // without re-rendering the component tree.
  };
  
  if (quizActive && state.questions) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 animated-gradient-background">
        <Quiz questions={state.questions} onRetry={handleRetry} />
      </main>
    );
  }

  return (
    <div className="text-foreground animated-gradient-background">
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Logo />
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="hidden md:block text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">AI小学长来出题</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">让同学们在最前沿的科技氛围中学习新知识</p>
        </div>
        
        <div className="mb-16 md:mb-24">
          {isMobile ? (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-md mx-auto"
            >
              <CarouselContent>
                {exampleTopics.map((topic, index) => (
                  <CarouselItem key={index}>
                     <Card className="bg-white/50 border-0 rounded-xl overflow-hidden group shadow-lg hover:shadow-2xl transition-shadow duration-300 backdrop-blur-sm mx-2">
                       <div className="relative h-60 w-full">
                         <Image
                           src={topic.image}
                           alt={topic.title}
                           fill
                           style={{ objectFit: 'cover' }}
                           className="group-hover:scale-105 transition-transform duration-300"
                           data-ai-hint={topic.imageHint}
                         />
                       </div>
                       <CardContent className="p-6">
                         <h3 className="text-xl font-bold mb-2 text-gray-800">{topic.title}</h3>
                         <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
                         <span className="text-xs font-semibold text-primary">AI小学长</span>
                       </CardContent>
                     </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {exampleTopics.map((topic, index) => (
                <Card key={index} className="bg-white/50 border-0 rounded-xl overflow-hidden group shadow-lg hover:shadow-2xl transition-shadow duration-300 backdrop-blur-sm">
                  <div className="relative h-60 w-full">
                    <Image
                      src={topic.image}
                      alt={topic.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={topic.imageHint}
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{topic.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
                    <span className="text-xs font-semibold text-primary">AI小学长</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <section id="quiz-form-section" className="bg-white/50 rounded-2xl p-8 md:p-16 text-center shadow-lg backdrop-blur-sm mb-16">
           <h2 className="text-4xl font-bold mb-4 text-gray-800">开始使用 AI小学长</h2>
           <div className="max-w-2xl mx-auto">
             <QuizForm formAction={formAction} />
           </div>
        </section>
        
        <div className="block md:hidden text-center mt-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">AI小学长来出题</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">让同学们在最前沿的科技氛围中学习新知识</p>
        </div>
      </main>
      
      <footer className="text-center py-8 text-gray-600 text-sm">
        <p>© 2025 AI小学长. All rights reserved.</p>
      </footer>
    </div>
  );
}
