import { GraduationCap } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="p-2 bg-primary/10 rounded-lg">
        <GraduationCap className="h-6 w-6 text-primary" />
      </div>
      <h1 className="text-2xl font-bold font-headline text-foreground tracking-tight">
        AI小学长
      </h1>
    </div>
  );
}
