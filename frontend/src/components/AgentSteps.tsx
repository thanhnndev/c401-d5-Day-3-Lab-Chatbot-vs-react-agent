import { useState, useEffect } from 'react';
import { Brain, Search, Eye, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentStep {
  type: 'thought' | 'action' | 'observation';
  content: string;
  timestamp: number;
}

interface AgentStepsProps {
  steps: AgentStep[];
  className?: string;
}

export function AgentSteps({ steps, className }: AgentStepsProps) {
  const [visibleSteps, setVisibleSteps] = useState<AgentStep[]>([]);

  useEffect(() => {
    // Animate steps appearing one by one
    steps.forEach((step, index) => {
      setTimeout(() => {
        setVisibleSteps(prev => {
          const exists = prev.find(s => s.timestamp === step.timestamp);
          if (exists) return prev;
          return [...prev, step];
        });
      }, index * 800);
    });
  }, [steps]);

  const getStepIcon = (type: AgentStep['type']) => {
    switch (type) {
      case 'thought':
        return <Brain className="h-4 w-4" />;
      case 'action':
        return <Search className="h-4 w-4" />;
      case 'observation':
        return <Eye className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStepColor = (type: AgentStep['type']) => {
    switch (type) {
      case 'thought':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'action':
        return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'observation':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getStepLabel = (type: AgentStep['type']) => {
    switch (type) {
      case 'thought':
        return 'Thought';
      case 'action':
        return 'Action';
      case 'observation':
        return 'Observation';
      default:
        return 'Step';
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {visibleSteps.map((step, index) => (
        <div
          key={step.timestamp + index}
          className={cn(
            "flex items-start gap-3 p-3 rounded-lg border animate-fade-in-up",
            getStepColor(step.type)
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="mt-0.5 shrink-0">{getStepIcon(step.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-80">
              {getStepLabel(step.type)}
            </div>
            <div className="text-sm leading-relaxed break-words">
              {step.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
