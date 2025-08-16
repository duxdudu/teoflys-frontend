import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://teoflys-backend.onrender.com';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private static instance: AuthService;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private constructor() {}

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  setTokens(tokens: Tokens) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  getTokens(): Tokens | null {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!accessToken || !refreshToken) return null;
    return { accessToken, refreshToken };
  }

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
        refreshToken
      });
      
      this.setTokens(response.data);
      return response.data.accessToken;
    } catch (error) {
      this.clearTokens();
      window.location.href = '/login';
      throw error;
    }
  }

  subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }
}

export default AuthService.getInstance();
