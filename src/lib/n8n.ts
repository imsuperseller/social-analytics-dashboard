const N8N_API_URL = process.env.N8N_API_URL || "https://n8n.superseller.agency/api/v1"
const N8N_API_KEY = process.env.N8N_API_KEY

export interface N8NWorkflow {
  id: string
  name: string
  active: boolean
  nodes: any[]
  connections: any
}

export interface N8NExecution {
  id: string
  workflowId: string
  status: 'success' | 'error' | 'running' | 'waiting'
  startedAt: string
  finishedAt?: string
  data?: any
}

export class N8NService {
  private baseUrl: string
  private apiKey?: string

  constructor() {
    this.baseUrl = N8N_API_URL
    this.apiKey = N8N_API_KEY
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['X-N8N-API-KEY'] = this.apiKey
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`N8N API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getWorkflows(): Promise<N8NWorkflow[]> {
    return this.makeRequest('/workflows')
  }

  async getWorkflow(id: string): Promise<N8NWorkflow> {
    return this.makeRequest(`/workflows/${id}`)
  }

  async triggerWorkflow(id: string, data?: any): Promise<N8NExecution> {
    return this.makeRequest(`/workflows/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify(data || {})
    })
  }

  async getExecutions(workflowId?: string): Promise<N8NExecution[]> {
    const params = workflowId ? `?workflowId=${workflowId}` : ''
    return this.makeRequest(`/executions${params}`)
  }

  async getExecution(id: string): Promise<N8NExecution> {
    return this.makeRequest(`/executions/${id}`)
  }

  async activateWorkflow(id: string): Promise<void> {
    await this.makeRequest(`/workflows/${id}/activate`, {
      method: 'POST'
    })
  }

  async deactivateWorkflow(id: string): Promise<void> {
    await this.makeRequest(`/workflows/${id}/deactivate`, {
      method: 'POST'
    })
  }

  // Specific methods for your social media workflows
  async triggerFacebookSync(): Promise<N8NExecution> {
    return this.triggerWorkflow('R2z4uMg9xXzmgxA6')
  }

  async triggerInstagramSync(): Promise<N8NExecution> {
    return this.triggerWorkflow('mh7iPzRyOtFXDdJ4')
  }

  async getFacebookData(): Promise<any> {
    try {
      // Get recent executions from Facebook workflow
      const executions = await this.getExecutions('R2z4uMg9xXzmgxA6')
      const latestExecution = executions[0]
      
      if (latestExecution && latestExecution.status === 'success') {
        return this.getExecution(latestExecution.id)
      }
      
      return null
    } catch (error) {
      console.error('Error fetching Facebook data:', error)
      return null
    }
  }

  async getInstagramData(): Promise<any> {
    try {
      // Get recent executions from Instagram workflow
      const executions = await this.getExecutions('mh7iPzRyOtFXDdJ4')
      const latestExecution = executions[0]
      
      if (latestExecution && latestExecution.status === 'success') {
        return this.getExecution(latestExecution.id)
      }
      
      return null
    } catch (error) {
      console.error('Error fetching Instagram data:', error)
      return null
    }
  }
}

export const n8nService = new N8NService()

// MCP Integration - Use your existing MCP tools as fallback
export async function triggerWorkflowViaMCP(workflowId: string, data?: any) {
  // This would integrate with your existing MCP n8n tools
  // Implementation depends on how you want to bridge Next.js with MCP
  console.log(`Triggering workflow ${workflowId} via MCP`)
}