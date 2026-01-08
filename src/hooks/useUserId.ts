// src/hooks/useUserId.ts
import { useState } from 'react';

interface UserData {
  userId: string;
  binId: string;
}

const STORAGE_KEY = 'shortlink_user_data';

/**
 * Hook responsável por gerenciar o usuário local e seu bin.
 * Não cria nada automaticamente — apenas lê e salva quando necessário.
 */
export function useUserId() {
  const [userData, setUserData] = useState<UserData | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const saveUserData = (data: UserData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUserData(data);
  };

  return { userData, saveUserData };
}
