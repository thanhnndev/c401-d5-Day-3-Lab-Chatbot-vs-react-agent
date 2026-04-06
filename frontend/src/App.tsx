import { useState, useCallback } from 'react';
import { GraduationCap, MessageCircle, School as SchoolIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChatInterface, type ChatMessage } from '@/components/ChatInterface';
import { QuestionForm, type QuestionData } from '@/components/QuestionForm';
import { SchoolCard, type School } from '@/components/SchoolCard';
import { SchoolDetails } from '@/components/SchoolDetails';
import { ApplicationForm, type ApplicationData } from '@/components/ApplicationForm';
import { LoadingAgent } from '@/components/LoadingAgent';
import { AgentSteps } from '@/components/AgentSteps';
import { useApi } from '@/hooks/useApi';
import { cn } from '@/lib/utils';

type AppStep = 'welcome' | 'questions' | 'processing' | 'results' | 'chat';

const mockSchools: School[] = [
  {
    id: '1',
    name: 'Stanford University',
    category: 'Private Research University',
    location: 'Stanford, California, USA',
    matchScore: 95,
    description: 'A world-leading research university known for its entrepreneurial spirit and innovation. Located in the heart of Silicon Valley.',
    tuitionRange: '$55,000 - $60,000 / year',
    programs: ['Computer Science', 'Engineering', 'Business', 'Medicine'],
    website: 'https://www.stanford.edu',
    ranking: 3,
  },
  {
    id: '2',
    name: 'MIT',
    category: 'Private Research University',
    location: 'Cambridge, Massachusetts, USA',
    matchScore: 92,
    description: 'The Massachusetts Institute of Technology is renowned for its engineering, physical sciences, and technology programs.',
    tuitionRange: '$53,000 - $58,000 / year',
    programs: ['Engineering', 'Computer Science', 'Physics', 'Mathematics'],
    website: 'https://www.mit.edu',
    ranking: 2,
  },
  {
    id: '3',
    name: 'University of Cambridge',
    category: 'Public Research University',
    location: 'Cambridge, United Kingdom',
    matchScore: 88,
    description: 'One of the oldest and most prestigious universities in the world, known for academic excellence across all disciplines.',
    tuitionRange: '$35,000 - $45,000 / year',
    programs: ['Computer Science', 'Engineering', 'Mathematics', 'Natural Sciences'],
    website: 'https://www.cam.ac.uk',
    ranking: 4,
  },
];

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agentSteps, setAgentSteps] = useState<Array<{
    type: 'thought' | 'action' | 'observation';
    content: string;
    timestamp: number;
  }>>([]);
  
  const { isLoading, findSchools, getSchoolDetails, submitApplication } = useApi();

  const handleStartQuestions = () => {
    setCurrentStep('questions');
  };

  const handleQuestionsSubmit = useCallback(async (data: QuestionData) => {
    setCurrentStep('processing');
    setAgentSteps([]);

    // Simulate agent steps for demonstration
    const steps = [
      { type: 'thought' as const, content: 'User wants to study in ' + data.targetCountry + ' in the field of ' + data.fieldOfStudy, timestamp: Date.now() },
      { type: 'action' as const, content: 'Searching for universities matching criteria...', timestamp: Date.now() + 1000 },
      { type: 'observation' as const, content: 'Found 15 potential matches, filtering by budget ' + data.budgetRange, timestamp: Date.now() + 2000 },
      { type: 'thought' as const, content: 'Ranked schools by match score and reputation', timestamp: Date.now() + 3000 },
      { type: 'action' as const, content: 'Preparing final recommendations...', timestamp: Date.now() + 4000 },
    ];

    // Animate steps appearing
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setAgentSteps(prev => [...prev, step]);
      }, idx * 1000);
    });

    // Try to get real data from API, fallback to mock data
    try {
      const response = await findSchools(data);
      if (response.success && response.data) {
        // If API returns schools, use them (map to our format if needed)
        const apiSchools = Array.isArray(response.data) ? response.data : mockSchools;
        setSchools(apiSchools.map((s: Record<string, unknown>) => ({
          ...(s as unknown as School),
          matchScore: (s.match_score as number) || (s.matchScore as number) || 80,
        })));
      } else {
        setSchools(mockSchools);
      }
    } catch {
      setSchools(mockSchools);
    }

    // Show results after steps animation
    setTimeout(() => {
      setCurrentStep('results');
    }, 5500);
  }, [findSchools]);

  const handleViewDetails = async (school: School) => {
    setSelectedSchool(school);
    
    try {
      const response = await getSchoolDetails(school.id);
      if (response.success && response.data) {
        setSelectedSchool((prev: School | null) => prev ? { ...prev, ...response.data as Partial<School> } : null);
      }
    } catch {
      // Keep existing school data
    }
    
    setDetailsOpen(true);
  };

  const handleApply = (school: School) => {
    setSelectedSchool(school);
    setApplicationOpen(true);
  };

  const handleApplicationSubmit = async (schoolId: string, data: ApplicationData) => {
    const response = await submitApplication(schoolId, data);
    
    if (response.success) {
      // Add success message to chat
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Application submitted successfully for ${selectedSchool?.name}! You will receive a confirmation email at ${data.email} within 24 hours.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
    }
    
    return response;
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate agent response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I can help you with that! Based on your previous preferences, I recommend exploring the schools we found. Would you like me to provide more details about any specific university?',
        timestamp: new Date(),
        steps: [
          { type: 'thought', content: 'User asked: ' + message, timestamp: Date.now() },
          { type: 'action', content: 'Retrieving information from knowledge base...', timestamp: Date.now() + 500 },
          { type: 'observation', content: 'Found relevant information about study abroad options', timestamp: Date.now() + 1000 },
        ],
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">StudyAbroad AI</h1>
                <p className="text-xs text-white/70">Find your perfect university</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {currentStep !== 'welcome' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={() => setCurrentStep('welcome')}
                >
                  Start Over
                </Button>
              )}
              <Badge variant="outline" className="text-white border-white/30">
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'welcome' && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-primary mb-6 shadow-xl">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-primary mb-4">
              Find Your Dream University
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Our AI-powered assistant will help you discover the best schools abroad 
              based on your preferences, budget, and academic goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 text-lg px-8"
                onClick={handleStartQuestions}
              >
                Start Finding Schools
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8"
                onClick={() => setCurrentStep('chat')}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat with AI
              </Button>
            </div>
            
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: SchoolIcon, title: '2000+ Universities', desc: 'Access top schools worldwide' },
                { icon: GraduationCap, title: 'AI Matching', desc: 'Smart recommendations based on your profile' },
                { icon: MessageCircle, title: '24/7 Support', desc: 'Get answers to all your questions' },
              ].map((feature, idx) => (
                <Card key={idx} className="text-center p-6 hover-lift">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'questions' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary mb-2">
                Let's Find Your Perfect Match
              </h2>
              <p className="text-gray-600">
                Answer a few questions to get personalized recommendations
              </p>
            </div>
            <QuestionForm onSubmit={handleQuestionsSubmit} />
          </div>
        )}

        {currentStep === 'processing' && (
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-primary">
                  AI Agent is Working
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <LoadingAgent message="Analyzing your preferences..." />
                <div className="mt-8 max-w-xl mx-auto">
                  <AgentSteps steps={agentSteps} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'results' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-2">
                Top Recommendations for You
              </h2>
              <p className="text-gray-600">
                Based on your preferences, here are the best matching schools
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {schools.map((school) => (
                <SchoolCard
                  key={school.id}
                  school={school}
                  onViewDetails={handleViewDetails}
                  onApply={handleApply}
                />
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Button 
                variant="outline"
                onClick={() => setCurrentStep('questions')}
              >
                Modify Preferences
              </Button>
              <Button 
                onClick={() => setCurrentStep('chat')}
                className="bg-gradient-secondary hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with AI Assistant
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2">
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setCurrentStep('questions')}
                  >
                    <SchoolIcon className="h-4 w-4 mr-2" />
                    Find New Schools
                  </Button>
                  {schools.length > 0 && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setCurrentStep('results')}
                    >
                      <GraduationCap className="h-4 w-4 mr-2" />
                      View Recommendations
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              {schools.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Matches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {schools.slice(0, 3).map((school) => (
                        <button
                          key={school.id}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={() => handleViewDetails(school)}
                        >
                          <div className="font-medium text-sm">{school.name}</div>
                          <div className="text-xs text-gray-500">
                            {school.matchScore}% match
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-white/70">
            © 2024 StudyAbroad AI. Helping students find their perfect university.
          </p>
        </div>
      </footer>

      {/* Dialogs */}
      <SchoolDetails
        school={selectedSchool}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onApply={handleApply}
      />

      <ApplicationForm
        school={selectedSchool}
        open={applicationOpen}
        onOpenChange={setApplicationOpen}
        onSubmit={handleApplicationSubmit}
      />
    </div>
  );
}

export default App;
