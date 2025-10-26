
/**
 * Automation Service
 * Handles workflow automation using n8n or custom LangChain agents
 */

import { SecureStorage } from '@/utils/secureStorage';

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'schedule' | 'event' | 'webhook' | 'manual';
    config: any;
  };
  actions: Array<{
    type: string;
    config: any;
  }>;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  logs: string[];
  result?: any;
}

export class AutomationService {
  private static instance: AutomationService;
  private n8nEndpoint?: string;

  private constructor() {
    this.loadConfig();
  }

  static getInstance(): AutomationService {
    if (!AutomationService.instance) {
      AutomationService.instance = new AutomationService();
    }
    return AutomationService.instance;
  }

  private async loadConfig() {
    this.n8nEndpoint = await SecureStorage.getItem('n8n_endpoint') || undefined;
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(workflow: Omit<AutomationWorkflow, 'id'>): Promise<string | null> {
    console.log('Creating automation workflow:', workflow.name);
    
    try {
      if (!this.n8nEndpoint) {
        throw new Error('n8n endpoint not configured');
      }

      const response = await fetch(`${this.n8nEndpoint}/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      });

      if (!response.ok) {
        throw new Error(`Failed to create workflow: ${response.status}`);
      }

      const data = await response.json();
      return data.id;
      
    } catch (error: any) {
      console.error('Workflow creation error:', error.message);
      return null;
    }
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string, input?: any): Promise<WorkflowExecution | null> {
    console.log('Executing workflow:', workflowId);
    
    try {
      if (!this.n8nEndpoint) {
        throw new Error('n8n endpoint not configured');
      }

      const response = await fetch(`${this.n8nEndpoint}/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error(`Failed to execute workflow: ${response.status}`);
      }

      return await response.json();
      
    } catch (error: any) {
      console.error('Workflow execution error:', error.message);
      return null;
    }
  }

  /**
   * Get workflow status
   */
  async getWorkflowStatus(workflowId: string): Promise<AutomationWorkflow | null> {
    try {
      if (!this.n8nEndpoint) {
        throw new Error('n8n endpoint not configured');
      }

      const response = await fetch(`${this.n8nEndpoint}/workflows/${workflowId}`);

      if (!response.ok) {
        throw new Error(`Failed to get workflow: ${response.status}`);
      }

      return await response.json();
      
    } catch (error: any) {
      console.error('Get workflow error:', error.message);
      return null;
    }
  }

  /**
   * List all workflows
   */
  async listWorkflows(): Promise<AutomationWorkflow[]> {
    try {
      if (!this.n8nEndpoint) {
        return [];
      }

      const response = await fetch(`${this.n8nEndpoint}/workflows`);

      if (!response.ok) {
        throw new Error(`Failed to list workflows: ${response.status}`);
      }

      const data = await response.json();
      return data.workflows || [];
      
    } catch (error: any) {
      console.error('List workflows error:', error.message);
      return [];
    }
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(workflowId: string): Promise<boolean> {
    try {
      if (!this.n8nEndpoint) {
        throw new Error('n8n endpoint not configured');
      }

      const response = await fetch(`${this.n8nEndpoint}/workflows/${workflowId}`, {
        method: 'DELETE',
      });

      return response.ok;
      
    } catch (error: any) {
      console.error('Delete workflow error:', error.message);
      return false;
    }
  }

  /**
   * Update n8n endpoint
   */
  async updateEndpoint(endpoint: string) {
    await SecureStorage.setItem('n8n_endpoint', endpoint);
    this.n8nEndpoint = endpoint;
  }
}

export const automationService = AutomationService.getInstance();
