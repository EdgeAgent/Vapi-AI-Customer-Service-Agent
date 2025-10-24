import axios, { AxiosInstance } from 'axios';

interface VapiCredential {
  provider: string;
  authorizationHeader?: string;
  apiKey?: string;
  [key: string]: any;
}

interface VapiAgent {
  name: string;
  model: {
    provider: string;
    model: string;
    messages?: Array<{ role: string; content: string }>;
    temperature?: number;
  };
  voice?: {
    provider: string;
    voiceId?: string;
  };
  phoneNumberId?: string;
  credentialIds?: string[];
  [key: string]: any;
}

interface VapiPhoneNumber {
  phoneNumber: string;
  credentialId: string;
  [key: string]: any;
}

class VapiService {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://api.vapi.ai',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Create a credential for authentication with external services
   */
  async createCredential(credential: VapiCredential) {
    try {
      const response = await this.client.post('/credential', credential);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create credential: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get a credential by ID
   */
  async getCredential(credentialId: string) {
    try {
      const response = await this.client.get(`/credential/${credentialId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get credential: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * List all credentials
   */
  async listCredentials() {
    try {
      const response = await this.client.get('/credential');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to list credentials: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Delete a credential
   */
  async deleteCredential(credentialId: string) {
    try {
      const response = await this.client.delete(`/credential/${credentialId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to delete credential: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create a Vapi agent
   */
  async createAgent(agent: VapiAgent) {
    try {
      const response = await this.client.post('/agent', agent);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create agent: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get an agent by ID
   */
  async getAgent(agentId: string) {
    try {
      const response = await this.client.get(`/agent/${agentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get agent: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * List all agents
   */
  async listAgents() {
    try {
      const response = await this.client.get('/agent');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to list agents: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Update an agent
   */
  async updateAgent(agentId: string, updates: Partial<VapiAgent>) {
    try {
      const response = await this.client.patch(`/agent/${agentId}`, updates);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to update agent: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Delete an agent
   */
  async deleteAgent(agentId: string) {
    try {
      const response = await this.client.delete(`/agent/${agentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to delete agent: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create a phone number
   */
  async createPhoneNumber(phoneNumber: VapiPhoneNumber) {
    try {
      const response = await this.client.post('/phone-number', phoneNumber);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create phone number: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get a phone number by ID
   */
  async getPhoneNumber(phoneNumberId: string) {
    try {
      const response = await this.client.get(`/phone-number/${phoneNumberId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get phone number: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * List all phone numbers
   */
  async listPhoneNumbers() {
    try {
      const response = await this.client.get('/phone-number');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to list phone numbers: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Delete a phone number
   */
  async deletePhoneNumber(phoneNumberId: string) {
    try {
      const response = await this.client.delete(`/phone-number/${phoneNumberId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to delete phone number: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create a call
   */
  async createCall(callData: {
    phoneNumberId?: string;
    assistantId?: string;
    agentId?: string;
    customerNumber: string;
    [key: string]: any;
  }) {
    try {
      const response = await this.client.post('/call', callData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create call: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get a call by ID
   */
  async getCall(callId: string) {
    try {
      const response = await this.client.get(`/call/${callId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get call: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * List all calls
   */
  async listCalls(filters?: { limit?: number; offset?: number }) {
    try {
      const response = await this.client.get('/call', { params: filters });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to list calls: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get assistant by ID
   */
  async getAssistant(assistantId: string) {
    try {
      const response = await this.client.get(`/assistant/${assistantId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get assistant: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create an assistant
   */
  async createAssistant(assistantData: {
    name: string;
    model?: { provider: string; model: string };
    voice?: { provider: string; voiceId: string };
    [key: string]: any;
  }) {
    try {
      const response = await this.client.post('/assistant', assistantData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create assistant: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * List all assistants
   */
  async listAssistants() {
    try {
      const response = await this.client.get('/assistant');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to list assistants: ${error.response?.data?.message || error.message}`);
    }
  }
}

export default VapiService;

