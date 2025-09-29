import { N8N_CONFIG } from './constants';

// Type definitions for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SubscriptionData {
  email: string;
  interests?: string[];
}

export interface ChatQuery {
  chatInput: string;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = N8N_CONFIG.baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Request failed:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Contact form submission
  async submitContact(data: ContactFormData): Promise<ApiResponse> {
    return this.request(N8N_CONFIG.endpoints.contact, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Subscription submission
  async submitSubscription(data: SubscriptionData): Promise<ApiResponse> {
    return this.request(N8N_CONFIG.endpoints.subscribe, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // AI Chat query
  async sendChatQuery(query: string): Promise<ApiResponse<ChatResponse>> {
    return this.request<ChatResponse>(N8N_CONFIG.endpoints.chat, {
      method: 'POST',
      body: JSON.stringify({ chatInput: query }),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      return {
        success: response.ok,
        data: { status: response.ok ? 'healthy' : 'unhealthy' },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Health check failed',
      };
    }
  }
}

export const apiClient = new ApiClient();