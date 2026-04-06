import { useState } from 'react';
import { ChevronRight, ChevronLeft, Globe, BookOpen, Wallet, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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
  },
  {
    id: 'field',
    title: 'Field of Study',
    description: 'What do you want to study?',
    icon: BookOpen,
  },
  {
    id: 'budget',
    title: 'Budget Range',
    description: 'What is your budget per year?',
    icon: Wallet,
  },
  {
    id: 'degree',
    title: 'Degree Level',
    description: 'What degree are you pursuing?',
    icon: GraduationCap,
  },
];

const countries = [
  { value: 'usa', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'canada', label: 'Canada' },
  { value: 'australia', label: 'Australia' },
  { value: 'germany', label: 'Germany' },
  { value: 'france', label: 'France' },
  { value: 'netherlands', label: 'Netherlands' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'japan', label: 'Japan' },
  { value: 'any', label: 'No preference / Any' },
];

const fieldsOfStudy = [
  { value: 'computer_science', label: 'Computer Science & IT' },
  { value: 'business', label: 'Business & Management' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'medicine', label: 'Medicine & Healthcare' },
  { value: 'arts', label: 'Arts & Humanities' },
  { value: 'science', label: 'Natural Sciences' },
  { value: 'social_science', label: 'Social Sciences' },
  { value: 'law', label: 'Law' },
  { value: 'education', label: 'Education' },
];

const budgetRanges = [
  { value: '0_20000', label: 'Under $20,000 / year' },
  { value: '20000_40000', label: '$20,000 - $40,000 / year' },
  { value: '40000_60000', label: '$40,000 - $60,000 / year' },
  { value: '60000_plus', label: '$60,000+ / year' },
  { value: 'flexible', label: 'Flexible / Scholarship needed' },
];

const degreeLevels = [
  { value: 'bachelor', label: 'Bachelor\'s Degree' },
  { value: 'master', label: 'Master\'s Degree' },
  { value: 'phd', label: 'PhD / Doctoral' },
  { value: 'diploma', label: 'Diploma / Certificate' },
];

export function QuestionForm({ onSubmit, className }: QuestionFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<QuestionData>({
    targetCountry: '',
    fieldOfStudy: '',
    budgetRange: '',
    degreeLevel: '',
  });

  const currentStepData = steps[currentStep];
  const CurrentIcon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onSubmit(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
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

  return (
    <Card className={cn("w-full max-w-xl mx-auto", className)}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <CurrentIcon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
        <CardDescription>{currentStepData.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    idx <= currentStep
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  <StepIcon className="h-5 w-5" />
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 h-0.5 mx-1",
                      idx < currentStep ? "bg-primary" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Counter */}
        <div className="text-center text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </div>

        {/* Question Input */}
        <div className="space-y-3">
          <Label htmlFor="select-value">Select an option</Label>
          <Select value={getCurrentValue()} onValueChange={setCurrentValue}>
            <SelectTrigger id="select-value" className="w-full h-12">
              <SelectValue placeholder={`Choose your ${currentStepData.title.toLowerCase()}...`} />
            </SelectTrigger>
            <SelectContent>
              {getSelectOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary Preview (shown on last step) */}
        {currentStep === steps.length - 1 && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <h4 className="font-semibold text-gray-900">Your Selections:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-500">Country:</div>
              <div className="font-medium">
                {countries.find(c => c.value === data.targetCountry)?.label}
              </div>
              <div className="text-gray-500">Field:</div>
              <div className="font-medium">
                {fieldsOfStudy.find(f => f.value === data.fieldOfStudy)?.label}
              </div>
              <div className="text-gray-500">Budget:</div>
              <div className="font-medium">
                {budgetRanges.find(b => b.value === data.budgetRange)?.label}
              </div>
              <div className="text-gray-500">Degree:</div>
              <div className="font-medium">
                {degreeLevels.find(d => d.value === data.degreeLevel)?.label}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <div className="flex justify-between p-6 pt-0">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {currentStep === steps.length - 1 ? 'Find Schools' : 'Next'}
          {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </Card>
  );
}
