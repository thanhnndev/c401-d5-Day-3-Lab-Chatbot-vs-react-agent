import { useState } from 'react';
import { MapPin, GraduationCap, DollarSign, Award, ExternalLink, FileEdit } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface School {
  id: string;
  name: string;
  category: string;
  location: string;
  matchScore: number;
  description?: string;
  tuitionRange?: string;
  programs?: string[];
  website?: string;
  ranking?: number;
}

interface SchoolCardProps {
  school: School;
  onViewDetails: (school: School) => void;
  onApply: (school: School) => void;
  className?: string;
}

export function SchoolCard({ school, onViewDetails, onApply, className }: SchoolCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500 text-white';
    if (score >= 80) return 'bg-green-500 text-white';
    if (score >= 70) return 'bg-yellow-500 text-white';
    return 'bg-orange-500 text-white';
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        isHovered && "shadow-xl scale-[1.02]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Match Score Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={cn(
          "flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-lg transition-transform",
          isHovered && "scale-110",
          getMatchScoreColor(school.matchScore)
        )}>
          <span className="text-2xl font-bold">{school.matchScore}%</span>
          <span className="text-[10px] uppercase tracking-wider">Match</span>
        </div>
      </div>

      <CardHeader className="pb-2">
        <Badge variant="secondary" className="w-fit mb-2">
          {school.category}
        </Badge>
        <h3 className="text-xl font-bold text-primary pr-20">{school.name}</h3>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="text-sm">{school.location}</span>
        </div>

        {school.tuitionRange && (
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="h-4 w-4 shrink-0" />
            <span className="text-sm">{school.tuitionRange}</span>
          </div>
        )}

        {school.ranking && (
          <div className="flex items-center gap-2 text-gray-600">
            <Award className="h-4 w-4 shrink-0" />
            <span className="text-sm">Rank #{school.ranking} nationally</span>
          </div>
        )}

        {school.programs && school.programs.length > 0 && (
          <div className="flex items-start gap-2 text-gray-600">
            <GraduationCap className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {school.programs.slice(0, 3).map((program, idx) => (
                <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {program}
                </span>
              ))}
              {school.programs.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{school.programs.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className={cn(
          "text-xs font-medium",
          school.matchScore >= 80 ? "text-emerald-600" : "text-primary"
        )}>
          {getMatchScoreLabel(school.matchScore)}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onViewDetails(school)}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          onClick={() => onApply(school)}
        >
          <FileEdit className="h-4 w-4 mr-2" />
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
}
