// src/hooks/useLinks.ts
import { useState, useEffect, useCallback } from 'react';
import type { LinkData, CreateLinkPayload } from '@/lib/api';
import {
  getLinks as apiGetLinks,
  createLink as apiCreateLink,
  updateLink as apiUpdateLink,
  deleteLink as apiDeleteLink,
  createUserBin,
  generateShortCode,
} from '@/lib/api';
import { useUserId } from './useUserId';

export function useLinks() {
  const { userData, saveUserData } = useUserId();
  const [links, setLinks] = useState<LinkData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega os links somente se o usuário já existir
  useEffect(() => {
    if (!userData) return;
    (async () => {
      setIsLoading(true);
      try {
        const data = await apiGetLinks(userData.binId, userData.userId);
        setLinks(data);
      } catch (err) {
        console.error('Failed to load links:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userData]);

  // 🔹 Cria um link (e cria o bin se for o primeiro)
  const createLink = useCallback(
    async (payload: Omit<CreateLinkPayload, 'ownerId' | 'binId'>): Promise<LinkData> => {
      let currentUser = userData;

      // Se ainda não existe usuário/bin, cria agora
      if (!currentUser) {
        const userId = crypto.randomUUID();
        const { binId } = await createUserBin();
        currentUser = { userId, binId };
        saveUserData(currentUser);
      }

      const newLink = await apiCreateLink({
        ...payload,
        ownerId: currentUser.userId,
        binId: currentUser.binId,
      });

      setLinks(prev => [newLink, ...prev]);
      return newLink;
    },
    [userData, saveUserData]
  );

  const updateLink = useCallback(
    async (id: string, newOriginalUrl: string) => {
      if (!userData) return;
      await apiUpdateLink(id, newOriginalUrl, userData.binId, userData.userId);
      setLinks(prev =>
        prev.map(link =>
          link.id === id ? { ...link, originalUrl: newOriginalUrl } : link
        )
      );
    },
    [userData]
  );

  const deleteLink = useCallback(
    async (id: string) => {
      if (!userData) return;
      await apiDeleteLink(id, userData.binId, userData.userId);
      setLinks(prev => prev.filter(link => link.id !== id));
    },
    [userData]
  );

  const getLinkByCode = useCallback(
    (shortCode: string): LinkData | undefined =>
      links.find(link => link.shortCode === shortCode),
    [links]
  );

  const incrementClicks = useCallback((shortCode: string) => {
    setLinks(prev =>
      prev.map(link =>
        link.shortCode === shortCode
          ? { ...link, clicks: link.clicks + 1 }
          : link
      )
    );
  }, []);

  return { links, isLoading, createLink, deleteLink, updateLink, getLinkByCode, incrementClicks };
}
