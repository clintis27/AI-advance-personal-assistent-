
/**
 * OpenAI Integration Hook
 * Provides interface for GPT-5, text generation, and AI analysis
 * 
 * Note: This requires a backend service (Supabase Edge Function or Node.js API)
 * to securely handle OpenAI API calls. Never expose API keys in the frontend.
 */

import { useCallback, useState, useRef } from 'react';
import { SecureStorage } from '@/utils/secureStorage';

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  messages: OpenAIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface OpenAIResponse {
  id: string;
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
}

type OpenAIState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: OpenAIResponse; error: null }
  | { status: 'error'; data: null; error: string };

export function useOpenAI() {
  const [state, setState] = useState<OpenAIState>({ 
    status: 'idle', 
    data: null, 
    error: null 
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Generate text completion using GPT
   */
  const generateCompletion = useCallback(async (
    request: OpenAIRequest
  ): Promise<OpenAIResponse | null> => {
    console.log('Generating OpenAI completion...');
    
    setState({ status: 'loading', data: null, error: null });
    
    try {
      // Get API endpoint from secure storage
      const apiEndpoint = await SecureStorage.getItem('openai_endpoint');
      
      if (!apiEndpoint) {
        throw new Error('OpenAI endpoint not configured. Please set up in AI Config.');
      }

      // Create abort controller for cancellation
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Call backend API (Supabase Edge Function or Node.js)
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: request.messages,
          model: request.model || 'gpt-4o',
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      
      const result: OpenAIResponse = {
        id: data.id || Date.now().toString(),
        content: data.content || data.choices?.[0]?.message?.content || '',
        model: data.model || request.model || 'gpt-4o',
        usage: data.usage,
        finishReason: data.finish_reason || data.choices?.[0]?.finish_reason,
      };

      setState({ status: 'success', data: result, error: null });
      return result;
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
        return null;
      }
      
      const errorMessage = error.message || 'Failed to generate completion';
      console.error('OpenAI error:', errorMessage);
      setState({ status: 'error', data: null, error: errorMessage });
      return null;
      
    } finally {
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Analyze text with AI
   */
  const analyzeText = useCallback(async (
    text: string,
    context?: string
  ): Promise<OpenAIResponse | null> => {
    const systemMessage = context || 
      'You are an AI assistant that analyzes text and provides insights.';
    
    return generateCompletion({
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
    });
  }, [generateCompletion]);

  /**
   * Generate problem solutions
   */
  const generateSolutions = useCallback(async (
    problem: string
  ): Promise<OpenAIResponse | null> => {
    return generateCompletion({
      messages: [
        { 
          role: 'system', 
          content: 'You are a problem-solving AI. Analyze the problem and provide 3 actionable solutions with steps, impact, and effort estimates.' 
        },
        { role: 'user', content: problem },
      ],
      temperature: 0.7,
    });
  }, [generateCompletion]);

  /**
   * Detect travel intent
   */
  const detectTravelIntent = useCallback(async (
    text: string
  ): Promise<OpenAIResponse | null> => {
    return generateCompletion({
      messages: [
        { 
          role: 'system', 
          content: 'You are a travel intent detection AI. Extract destination, dates, purpose, and urgency from the text. Return as JSON.' 
        },
        { role: 'user', content: text },
      ],
      temperature: 0.2,
    });
  }, [generateCompletion]);

  /**
   * Generate email response
   */
  const generateEmailResponse = useCallback(async (
    emailContent: string,
    tone: 'professional' | 'casual' | 'friendly' = 'professional'
  ): Promise<OpenAIResponse | null> => {
    return generateCompletion({
      messages: [
        { 
          role: 'system', 
          content: `You are an email assistant. Generate a ${tone} response to the following email.` 
        },
        { role: 'user', content: emailContent },
      ],
      temperature: 0.7,
    });
  }, [generateCompletion]);

  /**
   * Predict next task
   */
  const predictNextTask = useCallback(async (
    context: string
  ): Promise<OpenAIResponse | null> => {
    return generateCompletion({
      messages: [
        { 
          role: 'system', 
          content: 'You are a predictive AI assistant. Based on user behavior and context, predict the next likely task with confidence score.' 
        },
        { role: 'user', content: context },
      ],
      temperature: 0.5,
    });
  }, [generateCompletion]);

  /**
   * Cancel ongoing request
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setState({ status: 'idle', data: null, error: null });
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null });
  }, []);

  return {
    // State
    loading: state.status === 'loading',
    error: state.status === 'error' ? state.error : null,
    data: state.status === 'success' ? state.data : null,
    
    // Methods
    generateCompletion,
    analyzeText,
    generateSolutions,
    detectTravelIntent,
    generateEmailResponse,
    predictNextTask,
    cancel,
    reset,
  };
}
