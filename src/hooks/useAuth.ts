import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService, LoginData, RegisterData } from '@/lib/authService';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    setIsLoading(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: (response) => {
      authService.setToken(response.access_token);
      setIsAuthenticated(true);
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo de volta!',
      });
      navigate('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao fazer login';
      toast({
        title: 'Erro no login',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (response) => {
      authService.setToken(response.access_token);
      setIsAuthenticated(true);
      toast({
        title: 'Conta criada!',
        description: 'Sua conta foi criada com sucesso!',
      });
      navigate('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao criar conta';
      toast({
        title: 'Erro no registro',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado.',
    });
    navigate('/login');
  }, [navigate, toast]);

  const googleLogin = useCallback(() => {
    authService.googleLogin();
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    googleLogin,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}
