import { N8N_CONFIG } from './constants';
import { ErrorType } from './validation';

// Type definitions for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errorType?: ErrorType;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  interest: string;
  message: string;
}

// N8N specific response interface
export interface N8nContactResponse {
  status: string;
  showSubscribePrompt: boolean;
  recommended: {
    name: string;
    email: string;
    interest: string;
  };
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

  // Timeout utility
  private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), ms)
    );
    return Promise.race([promise, timeout]);
  }

  // Enhanced error handling
  private handleError(error: any, url: string): ApiResponse {
    console.error('API Request failed:', { url, error });
    
    let errorType = ErrorType.UNKNOWN;
    let errorMessage = 'An unexpected error occurred';

    if (error.name === 'TimeoutError' || error.message === 'Request timed out') {
      errorType = ErrorType.TIMEOUT;
      errorMessage = 'Request timed out. Please check your connection and try again.';
    } else if (error.message.includes('401') || error.message.includes('403')) {
      errorType = ErrorType.AUTHENTICATION;
      errorMessage = 'Authentication failed. Please contact support.';
    } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      errorType = ErrorType.SERVER;
      errorMessage = 'Server error. Please try again later.';
    } else if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
      errorType = ErrorType.NETWORK;
      errorMessage = 'Network error. Please check your internet connection.';
    }

    return {
      success: false,
      error: errorMessage,
      errorType,
    };
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
        ...options.headers,
      },
    };

    try {
      const response = await this.withTimeout(fetch(url, config), 15000); // 15 second timeout
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      return this.handleError(error, url);
    }
  }

  // Contact form submission with N8N field transformation
  async submitContact(data: ContactFormData): Promise<ApiResponse<N8nContactResponse>> {
    // Transform field names to match N8N requirements (case-sensitive)
    const transformedData = {
      Name: data.name,
      Email: data.email,
      Interest: data.interest,
      Subject: data.subject,
      Message: data.message,
    };

    return this.request<N8nContactResponse>(N8N_CONFIG.endpoints.contact, {
      method: 'POST',
      body: JSON.stringify(transformedData),
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