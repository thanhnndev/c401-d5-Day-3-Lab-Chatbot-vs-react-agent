import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingAgentProps {
  message?: string;
  className?: string;
}

export function LoadingAgent({ 
  message = "AI Agent is thinking...", 
  className 
}: LoadingAgentProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-[spin_3s_linear_infinite]" 
          style={{ width: '80px', height: '80px', margin: '-8px' }} />
        
        {/* Middle pulsing ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse"
          style={{ width: '64px', height: '64px' }} />
        
        {/* Center icon with thinking animation */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-600 shadow-lg">
          <Sparkles className="h-8 w-8 text-white animate-thinking" />
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-[spin_2s_linear_infinite]" style={{ margin: '-16px' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-secondary rounded-full" />
        </div>
        <div className="absolute inset-0 animate-[spin_2s_linear_infinite_reverse]" style={{ margin: '-12px' }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-secondary/70 rounded-full" />
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-lg font-medium text-primary flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          {message}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Analyzing your preferences and searching for best matches...
        </p>
      </div>
      
      {/* Animated dots */}
      <div className="flex gap-1 mt-4">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
