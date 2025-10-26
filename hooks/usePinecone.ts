
/**
 * Pinecone Vector Database Hook
 * Provides interface for semantic search and memory storage
 * 
 * Note: This requires a backend service to interact with Pinecone
 */

import { useCallback, useState } from 'react';
import { SecureStorage } from '@/utils/secureStorage';

export interface VectorDocument {
  id: string;
  text: string;
  metadata?: Record<string, any>;
  embedding?: number[];
}

export interface SearchResult {
  id: string;
  score: number;
  text: string;
  metadata?: Record<string, any>;
}

export interface PineconeRequest {
  query: string;
  topK?: number;
  filter?: Record<string, any>;
  namespace?: string;
}

type PineconeState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: SearchResult[]; error: null }
  | { status: 'error'; data: null; error: string };

export function usePinecone() {
  const [state, setState] = useState<PineconeState>({ 
    status: 'idle', 
    data: null, 
    error: null 
  });

  /**
   * Search for similar documents
   */
  const search = useCallback(async (
    request: PineconeRequest
  ): Promise<SearchResult[] | null> => {
    console.log('Searching Pinecone:', request.query);
    
    setState({ status: 'loading', data: null, error: null });
    
    try {
      const apiEndpoint = await SecureStorage.getItem('pinecone_endpoint');
      
      if (!apiEndpoint) {
        throw new Error('Pinecone endpoint not configured. Please set up in AI Config.');
      }

      const response = await fetch(`${apiEndpoint}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: request.query,
          top_k: request.topK || 5,
          filter: request.filter,
          namespace: request.namespace,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const results = data.matches || data.results || [];
      
      setState({ status: 'success', data: results, error: null });
      return results;
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to search';
      console.error('Pinecone error:', errorMessage);
      setState({ status: 'error', data: null, error: errorMessage });
      return null;
    }
  }, []);

  /**
   * Store document in vector database
   */
  const upsert = useCallback(async (
    documents: VectorDocument[]
  ): Promise<boolean> => {
    console.log('Upserting documents to Pinecone:', documents.length);
    
    try {
      const apiEndpoint = await SecureStorage.getItem('pinecone_endpoint');
      
      if (!apiEndpoint) {
        throw new Error('Pinecone endpoint not configured.');
      }

      const response = await fetch(`${apiEndpoint}/upsert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documents }),
      });

      return response.ok;
      
    } catch (error: any) {
      console.error('Upsert error:', error.message);
      return false;
    }
  }, []);

  /**
   * Delete documents
   */
  const deleteDocuments = useCallback(async (
    ids: string[]
  ): Promise<boolean> => {
    console.log('Deleting documents from Pinecone:', ids.length);
    
    try {
      const apiEndpoint = await SecureStorage.getItem('pinecone_endpoint');
      
      if (!apiEndpoint) {
        throw new Error('Pinecone endpoint not configured.');
      }

      const response = await fetch(`${apiEndpoint}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });

      return response.ok;
      
    } catch (error: any) {
      console.error('Delete error:', error.message);
      return false;
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
    results: state.status === 'success' ? state.data : null,
    search,
    upsert,
    deleteDocuments,
    reset,
  };
}
