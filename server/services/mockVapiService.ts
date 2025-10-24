/**
 * Mock Vapi Service for demonstration and testing
 * Simulates Vapi API responses without requiring real credentials
 */

interface MockCredential {
  id: string;
  provider: string;
  createdAt: string;
  [key: string]: any;
}

interface MockAgent {
  id: string;
  name: string;
  model: {
    provider: string;
    model: string;
  };
  voice?: {
    provider: string;
    voiceId?: string;
  };
  phoneNumberId?: string;
  credentialIds?: string[];
  createdAt: string;
  [key: string]: any;
}

interface MockCall {
  id: string;
  agentId: string;
  customerNumber: string;
  status: string;
  duration: number;
  transcript?: string;
  recordingUrl?: string;
  createdAt: string;
  [key: string]: any;
}

class MockVapiService {
  private mockCredentials: Map<string, MockCredential> = new Map();
  private mockAgents: Map<string, MockAgent> = new Map();
  private mockCalls: Map<string, MockCall> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Add some demo credentials
    const demoCredential: MockCredential = {
      id: 'cred_demo_twilio_001',
      provider: 'twilio',
      createdAt: new Date().toISOString(),
    };
    this.mockCredentials.set(demoCredential.id, demoCredential);

    // Add some demo agents
    const demoAgent: MockAgent = {
      id: 'agent_demo_001',
      name: 'Demo Customer Support Agent',
      model: {
        provider: 'openai',
        model: 'gpt-4',
      },
      voice: {
        provider: 'elevenlabs',
        voiceId: 'EXAVITQu4vr4xnSDxMaL',
      },
      phoneNumberId: 'phone_demo_001',
      credentialIds: ['cred_demo_twilio_001'],
      createdAt: new Date().toISOString(),
    };
    this.mockAgents.set(demoAgent.id, demoAgent);
  }

  /**
   * Create a credential for authentication with external services
   */
  async createCredential(credential: any) {
    const id = `cred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newCredential: MockCredential = {
      id,
      provider: credential.provider || 'twilio',
      createdAt: new Date().toISOString(),
      ...credential,
    };
    this.mockCredentials.set(id, newCredential);
    return newCredential;
  }

  /**
   * Get a credential by ID
   */
  async getCredential(credentialId: string) {
    const credential = this.mockCredentials.get(credentialId);
    if (!credential) {
      throw new Error(`Credential ${credentialId} not found`);
    }
    return credential;
  }

  /**
   * List all credentials
   */
  async listCredentials() {
    return Array.from(this.mockCredentials.values());
  }

  /**
   * Delete a credential
   */
  async deleteCredential(credentialId: string) {
    this.mockCredentials.delete(credentialId);
    return { success: true };
  }

  /**
   * Create a Vapi agent
   */
  async createAgent(agent: any) {
    const id = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newAgent: MockAgent = {
      id,
      name: agent.name || 'Unnamed Agent',
      model: agent.model || {
        provider: 'openai',
        model: 'gpt-4',
      },
      voice: agent.voice || {
        provider: 'elevenlabs',
        voiceId: 'EXAVITQu4vr4xnSDxMaL',
      },
      phoneNumberId: agent.phoneNumberId,
      credentialIds: agent.credentialIds || [],
      createdAt: new Date().toISOString(),
      ...agent,
    };
    this.mockAgents.set(id, newAgent);
    return newAgent;
  }

  /**
   * Get an agent by ID
   */
  async getAgent(agentId: string) {
    const agent = this.mockAgents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }
    return agent;
  }

  /**
   * List all agents
   */
  async listAgents() {
    return Array.from(this.mockAgents.values());
  }

  /**
   * Update an agent
   */
  async updateAgent(agentId: string, updates: any) {
    const agent = this.mockAgents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }
    const updated = { ...agent, ...updates };
    this.mockAgents.set(agentId, updated);
    return updated;
  }

  /**
   * Delete an agent
   */
  async deleteAgent(agentId: string) {
    this.mockAgents.delete(agentId);
    return { success: true };
  }

  /**
   * Create a phone number
   */
  async createPhoneNumber(phoneNumber: any) {
    const id = `phone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id,
      phoneNumber: phoneNumber.phoneNumber,
      credentialId: phoneNumber.credentialId,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Get a phone number by ID
   */
  async getPhoneNumber(phoneNumberId: string) {
    return {
      id: phoneNumberId,
      phoneNumber: '+1 (555) 123-4567',
      credentialId: 'cred_demo_001',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * List all phone numbers
   */
  async listPhoneNumbers() {
    return [
      {
        id: 'phone_demo_001',
        phoneNumber: '+1 (555) 123-4567',
        credentialId: 'cred_demo_twilio_001',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  /**
   * Delete a phone number
   */
  async deletePhoneNumber(phoneNumberId: string) {
    return { success: true };
  }

  /**
   * Create a call
   */
  async createCall(callData: any) {
    const id = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newCall: MockCall = {
      id,
      agentId: callData.agentId,
      customerNumber: callData.customerNumber,
      status: 'initiated',
      duration: 0,
      createdAt: new Date().toISOString(),
    };
    this.mockCalls.set(id, newCall);

    // Simulate call progression
    setTimeout(() => {
      const call = this.mockCalls.get(id);
      if (call) {
        call.status = 'ringing';
        this.mockCalls.set(id, call);
      }
    }, 2000);

    setTimeout(() => {
      const call = this.mockCalls.get(id);
      if (call) {
        call.status = 'connected';
        this.mockCalls.set(id, call);
      }
    }, 5000);

    return newCall;
  }

  /**
   * Get a call by ID
   */
  async getCall(callId: string) {
    const call = this.mockCalls.get(callId);
    if (!call) {
      throw new Error(`Call ${callId} not found`);
    }
    return call;
  }

  /**
   * List all calls
   */
  async listCalls(filters?: any) {
    return Array.from(this.mockCalls.values());
  }

  /**
   * Get assistant by ID
   */
  async getAssistant(assistantId: string) {
    return {
      id: assistantId,
      name: 'Demo Assistant',
      model: {
        provider: 'openai',
        model: 'gpt-4',
      },
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Create an assistant
   */
  async createAssistant(assistantData: any) {
    const id = `asst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id,
      name: assistantData.name || 'Unnamed Assistant',
      model: assistantData.model || {
        provider: 'openai',
        model: 'gpt-4',
      },
      voice: assistantData.voice || {
        provider: 'elevenlabs',
        voiceId: 'EXAVITQu4vr4xnSDxMaL',
      },
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * List all assistants
   */
  async listAssistants() {
    return [
      {
        id: 'asst_demo_001',
        name: 'Demo Assistant',
        model: {
          provider: 'openai',
          model: 'gpt-4',
        },
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

export default MockVapiService;

