import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Globe, BookOpen, Wallet, GraduationCap, Sparkles, Check, Zap } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface QuestionData {
  targetCountry: string;
  fieldOfStudy: string;
  budgetRange: string;
  degreeLevel: string;
}

interface QuestionFormProps {
  onSubmit: (data: QuestionData) => void;
  className?: string;
}

const steps = [
  {
    id: 'country',
    title: 'Target Country',
    description: 'Where would you like to study?',
    icon: Globe,
    color: 'from-blue-500 to-cyan-500',
    bgImage: '🌍',
  },
  {
    id: 'field',
    title: 'Field of Study',
    description: 'What do you want to study?',
    icon: BookOpen,
    color: 'from-purple-500 to-pink-500',
    bgImage: '📚',
  },
  {
    id: 'budget',
    title: 'Budget Range',
    description: 'What is your budget per year?',
    icon: Wallet,
    color: 'from-amber-500 to-orange-500',
    bgImage: '💰',
  },
  {
    id: 'degree',
    title: 'Degree Level',
    description: 'What degree are you pursuing?',
    icon: GraduationCap,
    color: 'from-emerald-500 to-teal-500',
    bgImage: '🎓',
  },
];

const countries = [
  { value: 'usa', label: 'United States', emoji: '🇺🇸', desc: 'Land of opportunity' },
  { value: 'uk', label: 'United Kingdom', emoji: '🇬🇧', desc: 'Rich academic tradition' },
  { value: 'canada', label: 'Canada', emoji: '🇨🇦', desc: 'Quality education & nature' },
  { value: 'australia', label: 'Australia', emoji: '🇦🇺', desc: 'Sunny lifestyle' },
  { value: 'germany', label: 'Germany', emoji: '🇩🇪', desc: 'Engineering excellence' },
  { value: 'france', label: 'France', emoji: '🇫🇷', desc: 'Art & culture hub' },
  { value: 'netherlands', label: 'Netherlands', emoji: '🇳🇱', desc: 'Innovation center' },
  { value: 'singapore', label: 'Singapore', emoji: '🇸🇬', desc: 'Asian financial hub' },
  { value: 'japan', label: 'Japan', emoji: '🇯🇵', desc: 'Technology & tradition' },
  { value: 'any', label: 'No preference / Any', emoji: '🌐', desc: 'Keep options open' },
];

const fieldsOfStudy = [
  { value: 'computer_science', label: 'Computer Science & IT', emoji: '💻', desc: 'Build the future' },
  { value: 'business', label: 'Business & Management', emoji: '💼', desc: 'Lead organizations' },
  { value: 'engineering', label: 'Engineering', emoji: '⚙️', desc: 'Design solutions' },
  { value: 'medicine', label: 'Medicine & Healthcare', emoji: '🩺', desc: 'Save lives' },
  { value: 'arts', label: 'Arts & Humanities', emoji: '🎨', desc: 'Express creativity' },
  { value: 'science', label: 'Natural Sciences', emoji: '🔬', desc: 'Discover nature' },
  { value: 'social_science', label: 'Social Sciences', emoji: '👥', desc: 'Understand society' },
  { value: 'law', label: 'Law', emoji: '⚖️', desc: 'Uphold justice' },
  { value: 'education', label: 'Education', emoji: '📖', desc: 'Shape minds' },
];

const budgetRanges = [
  { value: '0_20000', label: 'Under $20,000', emoji: '💵', desc: 'Budget-friendly' },
  { value: '20000_40000', label: '$20,000 - $40,000', emoji: '💰', desc: 'Mid-range' },
  { value: '40000_60000', label: '$40,000 - $60,000', emoji: '💎', desc: 'Premium choice' },
  { value: '60000_plus', label: '$60,000+', emoji: '👑', desc: 'Top tier' },
  { value: 'flexible', label: 'Flexible / Scholarship', emoji: '🎓', desc: 'Financial aid available' },
];

const degreeLevels = [
  { value: 'bachelor', label: 'Bachelor\'s Degree', emoji: '🎓', desc: 'Undergraduate studies' },
  { value: 'master', label: 'Master\'s Degree', emoji: '📜', desc: 'Graduate studies' },
  { value: 'phd', label: 'PhD / Doctoral', emoji: '🔬', desc: 'Research excellence' },
  { value: 'diploma', label: 'Diploma / Certificate', emoji: '📄', desc: 'Professional certification' },
];

interface SelectionOptionProps {
  option: { value: string; label: string; emoji: string; desc: string };
  isSelected: boolean;
  onClick: () => void;
  delay: number;
}

function SelectionOption({ option, isSelected, onClick, delay }: SelectionOptionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl border-2 transition-all duration-300 text-left group relative overflow-hidden",
        isSelected
          ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
          : "border-gray-200 hover:border-primary/50 hover:bg-gray-50 hover:shadow-md",
      )}
      style={{
        animation: `scaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms both`,
      }}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110",
          isSelected ? "bg-gradient-primary shadow-md" : "bg-gray-100 group-hover:bg-primary/10"
        )}>
          {option.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 truncate">{option.label}</div>
          <div className={cn(
            "text-sm mt-0.5",
            isSelected ? "text-primary font-medium" : "text-gray-500"
          )}>
            {option.desc}
          </div>
        </div>
        <div className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
          isSelected ? "border-primary bg-primary text-white" : "border-gray-300"
        )}>
          {isSelected && <Check className="w-4 h-4" />}
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
          <div className="absolute top-2 right-2">
            <Sparkles className="w-4 h-4 text-primary animate-celebrate" />
          </div>
        </div>
      )}
    </button>
  );
}

export function QuestionForm({ onSubmit, className }: QuestionFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [isAnimating, setIsAnimating] = useState(false);
  const [data, setData] = useState<QuestionData>({
    targetCountry: '',
    fieldOfStudy: '',
    budgetRange: '',
    degreeLevel: '',
  });
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (currentStep === steps.length - 1 && completedSteps.length === steps.length) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, completedSteps]);

  const handleNext = () => {
    if (!canProceed()) return;
    
    setDirection('forward');
    setIsAnimating(true);
    
    if (currentStep < steps.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      onSubmit(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection('back');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.targetCountry !== '';
      case 1: return data.fieldOfStudy !== '';
      case 2: return data.budgetRange !== '';
      case 3: return data.degreeLevel !== '';
      default: return false;
    }
  };

  const getSelectOptions = () => {
    switch (currentStep) {
      case 0: return countries;
      case 1: return fieldsOfStudy;
      case 2: return budgetRanges;
      case 3: return degreeLevels;
      default: return [];
    }
  };

  const getCurrentValue = () => {
    switch (currentStep) {
      case 0: return data.targetCountry;
      case 1: return data.fieldOfStudy;
      case 2: return data.budgetRange;
      case 3: return data.degreeLevel;
      default: return '';
    }
  };

  const setCurrentValue = (value: string) => {
    switch (currentStep) {
      case 0: setData(prev => ({ ...prev, targetCountry: value })); break;
      case 1: setData(prev => ({ ...prev, fieldOfStudy: value })); break;
      case 2: setData(prev => ({ ...prev, budgetRange: value })); break;
      case 3: setData(prev => ({ ...prev, degreeLevel: value })); break;
    }
  };

  const progress = ((currentStep + (canProceed() ? 1 : 0)) / steps.length) * 100;

  return (
    <Card className={cn("w-full max-w-4xl mx-auto overflow-hidden relative", className)}>
      <CardHeader className="pb-4 pt-6">
        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-0 left-0 h-full w-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              backgroundSize: '1000px 100%',
              animation: 'shimmer 2s infinite',
            }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between items-center px-4">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isCompleted = idx < currentStep || completedSteps.includes(idx);
            const isCurrent = idx === currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative",
                    isCompleted ? "bg-gradient-primary shadow-lg" : "",
                    isCurrent ? "bg-white border-2 border-primary shadow-lg scale-110" : "",
                    !isCompleted && !isCurrent ? "bg-gray-100" : ""
                  )}
                  style={{
                    animation: isCurrent ? 'float 3s ease-in-out infinite' : undefined,
                  }}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  ) : (
                    <StepIcon className={cn(
                      "h-5 w-5 sm:h-6 sm:w-6",
                      isCurrent ? "text-primary" : "text-gray-400"
                    )} />
                  )}
                  {isCurrent && (
                    <div className="absolute -inset-1 bg-primary/20 rounded-2xl animate-pulse" />
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium transition-colors",
                  isCurrent ? "text-primary" : isCompleted ? "text-gray-700" : "text-gray-400"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-8 py-4">
        {/* Step Content */}
        <div
          className={cn(
            "transition-all duration-300",
            direction === 'forward' && isAnimating ? "animate-slide-in-right" : "",
            direction === 'back' && isAnimating ? "animate-slide-in-left" : "",
          )}
        >
          {/* Step Header */}
          <div className="text-center mb-8">
            <div className={cn(
              "w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-br flex items-center justify-center text-4xl sm:text-5xl mb-4 shadow-xl animate-scale-up",
              currentStepData.color
            )}>
              <span className="filter drop-shadow-lg">{currentStepData.bgImage}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-base sm:text-lg text-gray-500">
              {currentStepData.description}
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-primary font-medium">
              <Zap className="w-4 h-4" />
              <span>Step {currentStep + 1} of {steps.length}</span>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {getSelectOptions().map((option, idx) => {
              const currentValue = getCurrentValue();
              return (
                <SelectionOption
                  key={option.value}
                  option={option}
                  isSelected={currentValue === option.value}
                  onClick={() => setCurrentValue(option.value)}
                  delay={idx * 50}
                />
              );
            })}
          </div>

          {/* Summary Preview */}
          {currentStep === steps.length - 1 && canProceed() && (
            <div className="animate-scale-up mt-6">
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
                    <Sparkles className="w-5 h-5" />
                    <span>Your Journey Profile</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Country', value: countries.find(c => c.value === data.targetCountry)?.label, emoji: '🌍' },
                      { label: 'Field', value: fieldsOfStudy.find(f => f.value === data.fieldOfStudy)?.label, emoji: '📚' },
                      { label: 'Budget', value: budgetRanges.find(b => b.value === data.budgetRange)?.label, emoji: '💰' },
                      { label: 'Degree', value: degreeLevels.find(d => d.value === data.degreeLevel)?.label, emoji: '🎓' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 bg-white rounded-xl shadow-sm">
                        <span className="text-xl sm:text-2xl">{item.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-xs text-gray-500">{item.label}</div>
                          <div className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center px-4 sm:px-8 pb-6 pt-2">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-4 sm:px-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center gap-2">
          {canProceed() && currentStep === steps.length - 1 && (
            <div className="hidden sm:block mr-4 text-sm text-primary font-medium animate-pulse">
              🎉 Ready!
            </div>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              "px-4 sm:px-8 transition-all duration-300",
              canProceed() && "bg-gradient-primary hover:shadow-lg hover:scale-105"
            )}
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Find Schools
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardFooter>

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div className={cn(
                "w-3 h-3 rounded-sm",
                i % 3 === 0 ? "bg-primary" : i % 3 === 1 ? "bg-secondary" : "bg-amber-400"
              )} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
