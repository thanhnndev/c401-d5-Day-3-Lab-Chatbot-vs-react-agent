import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  steps?: Array<{
    type: 'thought' | 'action' | 'observation';
    content: string;
    timestamp: number;
  }>;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  className?: string;
}

export function ChatInterface({ messages, onSendMessage, isLoading, className }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const renderSteps = (steps?: ChatMessage['steps']) => {
    if (!steps || steps.length === 0) return null;

    return (
      <div className="mt-2 space-y-1.5">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={cn(
              "text-xs px-2 py-1 rounded border-l-2",
              step.type === 'thought' && "bg-blue-50 border-blue-400 text-blue-700",
              step.type === 'action' && "bg-amber-50 border-amber-400 text-amber-700",
              step.type === 'observation' && "bg-emerald-50 border-emerald-400 text-emerald-700"
            )}
          >
            <span className="font-semibold uppercase text-[10px] opacity-70">
              {step.type}
            </span>
            <p className="mt-0.5 leading-snug">{step.content}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={cn("w-full h-[600px] flex flex-col", className)}>
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Study Abroad Assistant</CardTitle>
            <p className="text-xs text-gray-500">AI-powered school finder</p>
          </div>
          {isLoading && (
            <Badge variant="secondary" className="ml-auto animate-pulse">
              Thinking...
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
            <Bot className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">Welcome to Study Abroad Assistant!</p>
            <p className="text-sm mt-2">Start by answering the questions or type your query below.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                message.role === 'user'
                  ? "bg-secondary text-white"
                  : "bg-primary text-white"
              )}
            >
              {message.role === 'user' ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-3",
                message.role === 'user'
                  ? "bg-secondary text-white rounded-tr-none"
                  : "bg-gray-100 text-gray-900 rounded-tl-none"
              )}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              {message.role === 'assistant' && renderSteps(message.steps)}
              <span className="text-[10px] opacity-60 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
