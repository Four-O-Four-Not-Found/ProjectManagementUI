import type { User } from '../types';
import { MOCK_USER } from '../mocks/data';

const authService = {
  login: async (credentials: Record<string, unknown>): Promise<{ user: User; token: string }> => {
    console.log('Logging in with:', credentials);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: MOCK_USER,
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
