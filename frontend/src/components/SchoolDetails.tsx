import { MapPin, GraduationCap, DollarSign, Award, Globe, BookOpen, Users, Calendar, X, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { School } from './SchoolCard';

interface SchoolDetailsProps {
  school: School | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (school: School) => void;
}

export function SchoolDetails({ school, open, onOpenChange, onApply }: SchoolDetailsProps) {
  if (!school) return null;

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 80) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">
                {school.category}
              </Badge>
              <DialogTitle className="text-2xl font-bold text-primary">
                {school.name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4" />
                {school.location}
              </DialogDescription>
            </div>
            <div className={cn(
              "flex flex-col items-center justify-center w-20 h-20 rounded-full shadow-lg text-white",
              getMatchScoreColor(school.matchScore)
            )}>
              <span className="text-3xl font-bold">{school.matchScore}%</span>
              <span className="text-[10px] uppercase tracking-wider">Match</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {school.description && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">About</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {school.description}
              </p>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            {school.tuitionRange && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tuition Range</p>
                  <p className="text-sm font-medium">{school.tuitionRange}</p>
                </div>
              </div>
            )}

            {school.ranking && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">National Ranking</p>
                  <p className="text-sm font-medium">#{school.ranking}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Acceptance Rate</p>
                <p className="text-sm font-medium">15-25%</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Application Deadline</p>
                <p className="text-sm font-medium">Rolling Admissions</p>
              </div>
            </div>
          </div>

          <Separator />

          {school.programs && school.programs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <h4 className="text-sm font-semibold text-gray-900">Available Programs</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {school.programs.map((program, idx) => (
                  <Badge key={idx} variant="outline" className="px-3 py-1">
                    {program}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-gray-500">Website</p>
              <a 
                href={school.website || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
              >
                {school.website || 'www.university.edu'}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          <Button onClick={() => onApply(school)}>
            <GraduationCap className="h-4 w-4 mr-2" />
            Apply Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
