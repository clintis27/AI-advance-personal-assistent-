
/**
 * LangChain Integration Hook
 * Provides interface for LangChain agents and chains
 * 
 * Note: This requires a backend service to run LangChain
 */

import { useCallback, useState } from 'react';
import { SecureStorage } from '@/utils/secureStorage';

export interface LangChainAgent {
  id: string;
  name: string;
  type: 'conversational' | 'task' | 'research' | 'automation';
  tools: string[];
  memory: boolean;
}

export interface LangChainRequest {
  agentId: string;
  input: string;
  context?: Record<string, any>;
  tools?: string[];
}

export interface LangChainResponse {
  output: string;
  intermediateSteps?: Array<{
    action: string;
    observation: string;
  }>;
  toolsUsed: string[];
  executionTime: number;
}

type LangChainState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: LangChainResponse; error: null }
  | { status: 'error'; data: null; error: string };

export function useLangChain() {
  const [state, setState] = useState<LangChainState>({ 
    status: 'idle', 
    data: null, 
    error: null 
  });

  /**
   * Execute LangChain agent
   */
  const executeAgent = useCallback(async (
    request: LangChainRequest
  ): Promise<LangChainResponse | null> => {
    console.log('Executing LangChain agent:', request.agentId);
    
    setState({ status: 'loading', data: null, error: null });
    
    try {
      const apiEndpoint = await SecureStorage.getItem('langchain_endpoint');
      
      if (!apiEndpoint) {
        throw new Error('LangChain endpoint not configured. Please set up in AI Config.');
      }

      const response = await fetch(`${apiEndpoint}/agent/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      setState({ status: 'success', data, error: null });
      return data;
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to execute agent';
      console.error('LangChain error:', errorMessage);
      setState({ status: 'error', data: null, error: errorMessage });
      return null;
    }
  }, []);

  /**
   * Create automation workflow
   */
  const createWorkflow = useCallback(async (
    name: string,
    steps: Array<{ action: string; params: any }>
  ): Promise<{ workflowId: string } | null> => {
    console.log('Creating workflow:', name);
    
    try {
      const apiEndpoint = await SecureStorage.getItem('langchain_endpoint');
      
      if (!apiEndpoint) {
        throw new Error('LangChain endpoint not configured.');
      }

      const response = await fetch(`${apiEndpoint}/workflow/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, steps }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
      
    } catch (error: any) {
      console.error('Workflow creation error:', error.message);
      return null;
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null });
  }, []);

  return {
    loading: state.status === 'loading',
    error: state.status === 'error' ? state.error : null,
    data: state.status === 'success' ? state.data : null,
    executeAgent,
    createWorkflow,
    reset,
  };
}
