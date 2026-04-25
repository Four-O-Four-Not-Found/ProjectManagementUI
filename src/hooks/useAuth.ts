import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setAuth, logout as logoutAction, setLoading, setError } from '../redux/slices/authSlice';
import authService from '../services/authService';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const login = async (credentials: Record<string, string>) => {
    dispatch(setLoading(true));
    try {
      const data = await authService.login(credentials);
      dispatch(setAuth(data));
      localStorage.setItem('token', data.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    await authService.logout();
    dispatch(logoutAction());
    localStorage.removeItem('token');
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
  };
};
