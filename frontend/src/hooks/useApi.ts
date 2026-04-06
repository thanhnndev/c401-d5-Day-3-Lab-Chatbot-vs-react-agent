import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8000';

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  steps?: Array<{
    type: 'thought' | 'action' | 'observation';
    content: string;
    timestamp: number;
  }>;
}

export interface SchoolRecommendation {
  id: string;
  name: string;
  category: string;
  location: string;
  match_score: number;
  description?: string;
  tuition_range?: string;
  programs?: string[];
  website?: string;
  ranking?: number;
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendChatMessage = useCallback(async (message: string, context?: any): Promise<ApiResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.response || data,
        steps: (data.steps || []).map((s: any) => ({
          type: s.type as 'thought' | 'action' | 'observation',
          content: s.content,
          timestamp: s.timestamp || Date.now()
        })),
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSchoolDetails = useCallback(async (schoolId: string): Promise<ApiResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Get details for school ${schoolId}`,
          school_id: schoolId,
          action: 'get_school_details',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.school || data,
        steps: data.steps || [],
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitApplication = useCallback(async (schoolId: string, applicationData: any): Promise<ApiResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Submit application',
          school_id: schoolId,
          action: 'submit_application',
          application_data: applicationData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.confirmation || data,
        steps: data.steps || [],
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const findSchools = useCallback(async (preferences: {
    targetCountry: string;
    fieldOfStudy: string;
    budgetRange: string;
    degreeLevel: string;
  }): Promise<ApiResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Find schools for ${preferences.fieldOfStudy} in ${preferences.targetCountry} with budget ${preferences.budgetRange} for ${preferences.degreeLevel}`,
          action: 'find_schools',
          preferences,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.schools || data.recommendations || data,
        steps: data.steps || [],
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    sendChatMessage,
    getSchoolDetails,
    submitApplication,
    findSchools,
  };
}
