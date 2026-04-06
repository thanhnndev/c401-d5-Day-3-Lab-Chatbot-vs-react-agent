import { useState } from 'react';
import { X, Send, User, Mail, Phone, FileText, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { School } from './SchoolCard';
import { cn } from '@/lib/utils';

interface ApplicationFormProps {
  school: School | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (schoolId: string, data: ApplicationData) => void;
}

export interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  previousEducation: string;
  gpa: string;
  statement: string;
}

export function ApplicationForm({ school, open, onOpenChange, onSubmit }: ApplicationFormProps) {
  const [data, setData] = useState<ApplicationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    previousEducation: '',
    gpa: '',
    statement: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!school) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(school.id, data);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onOpenChange(false);
        setData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          previousEducation: '',
          gpa: '',
          statement: '',
        });
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof ApplicationData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const isValid = () => {
    return data.firstName && data.lastName && data.email && data.previousEducation;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Application Submitted!
            </h3>
            <p className="text-sm text-gray-600">
              Your application to {school.name} has been received.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary">
                Apply to {school.name}
              </DialogTitle>
              <DialogDescription>
                Complete the form below to submit your application.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      value={data.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className="pl-10"
                      placeholder="John"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      value={data.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      className="pl-10"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="pl-10"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="pl-10"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="previousEducation">
                  Previous Education <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="previousEducation"
                    value={data.previousEducation}
                    onChange={(e) => updateField('previousEducation', e.target.value)}
                    className="pl-10"
                    placeholder="Bachelor's in Computer Science"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gpa">GPA / Academic Score</Label>
                <Input
                  id="gpa"
                  value={data.gpa}
                  onChange={(e) => updateField('gpa', e.target.value)}
                  placeholder="3.5 / 4.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="statement">Personal Statement</Label>
                <textarea
                  id="statement"
                  value={data.statement}
                  onChange={(e) => updateField('statement', e.target.value)}
                  className={cn(
                    "w-full min-h-[100px] px-3 py-2 rounded-md border border-input",
                    "bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                  )}
                  placeholder="Tell us why you want to study at this university..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!isValid() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
