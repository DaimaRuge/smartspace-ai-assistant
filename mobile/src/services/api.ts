import axios, { AxiosInstance } from 'axios';

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ChatResponse {
  id: string;
  role: 'assistant';
  content: string;
  timestamp: Date;
  taskId: string;
  usedSkills: string[];
  duration: number;
}

export interface VoiceProcessResponse {
  audioBuffer: string;
  duration: number;
  format: string;
}

class APIService {
  private client: AxiosInstance;
  private BASE_URL: string;

  constructor(baseURL: string = 'http://localhost:3000') {
    this.BASE_URL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Health check
  async healthCheck(): Promise<APIResponse<{ status: string }>> {
    try {
      const response = await this.client.get('/health');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  // Chat endpoints
  async chat(message: string, sessionId: string): Promise<APIResponse<ChatResponse>> {
    try {
      const response = await this.client.post('/api/chat', {
        message,
        sessionId,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  async clearConversation(sessionId: string): Promise<APIResponse<{ message: string }>> {
    try {
      const response = await this.client.post('/api/chat/clear', {
        sessionId,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  // Voice endpoints
  async processVoice(audioPath: string, sessionId: string): Promise<APIResponse<VoiceProcessResponse>> {
    try {
      const response = await this.client.post('/api/voice/process', {
        audioPath,
        sessionId,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  async transcribeAudio(audioPath: string): Promise<APIResponse<{ text: string }>> {
    try {
      const response = await this.client.post('/api/voice/asr', {
        audioPath,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  async synthesizeVoice(text: string): Promise<APIResponse<{ audioUrl: string }>> {
    try {
      const response = await this.client.post('/api/voice/tts', {
        text,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  // Device endpoints
  async getDevices(): Promise<APIResponse<{ devices: any[]; total: number }>> {
    try {
      const response = await this.client.get('/api/devices');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  async controlDevice(deviceId: string, command: any): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post(`/api/devices/${deviceId}/control`, {
        command,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  // Skill endpoints
  async getSkills(): Promise<APIResponse<{ skills: any[]; total: number }>> {
    try {
      const response = await this.client.get('/api/skills');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  async executeSkill(skillId: string, params: any): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post(`/api/skills/${skillId}/execute`, {
        params,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  // WebSocket connection helper
  connectWebSocket(url: string = 'ws://localhost:3000/ws/voice'): WebSocket {
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    return ws;
  }

  private handleError(error: any): string {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return `Server error: ${error.response.status} - ${error.response.data}`;
      } else if (error.request) {
        return 'Network error: No response from server';
      } else {
        return `Request error: ${error.message}`;
      }
    } else {
      return `Unknown error: ${error instanceof Error ? error.message : 'Unknown'}`;
    }
  }

  setBaseURL(baseURL: string): void {
    this.BASE_URL = baseURL;
    this.client.defaults.baseURL = baseURL;
  }
}

// Create singleton instance
const api = new APIService(process.env.API_BASE_URL || 'http://localhost:3000');

export default api;
