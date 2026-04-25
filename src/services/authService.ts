import type { User } from '../types';

const authService = {
  login: async (credentials: Record<string, unknown>): Promise<{ user: User; token: string }> => {
    console.log('Logging in with:', credentials);
    // Mocking API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: { 
            id: '1', 
            displayName: 'John Doe', 
            email: 'john@example.com', 
            role: 'Admin', 
            avatarUrl: 'JD' 
          },
          token: 'mock-jwt-token'
        });
      }, 1000);
    });
  },

  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }
};

export default authService;
