import { useState, useEffect, useCallback } from 'react';
import type { LinkData, CreateLinkPayload } from '@/lib/api';
import { generateShortCode } from '@/lib/api';

const STORAGE_KEY = 'shortlinks_data';

// Local storage based hook for demo/development
// Replace with actual API calls when deploying with serverless functions
export function useLinks() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load links from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setLinks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored links:', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save links to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    }
  }, [links, isLoading]);

  const createLink = useCallback(async (payload: CreateLinkPayload): Promise<LinkData> => {
    const shortCode = payload.shortCode || generateShortCode();
    
    // Check if short code already exists
    const exists = links.some(link => link.shortCode === shortCode);
    if (exists) {
      throw new Error('Short code already exists');
    }

    const newLink: LinkData = {
      id: crypto.randomUUID(),
      originalUrl: payload.originalUrl,
      shortCode,
      createdAt: new Date().toISOString(),
      clicks: 0,
    };

    setLinks(prev => [newLink, ...prev]);
    return newLink;
  }, [links]);

  const deleteLink = useCallback((id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
  }, []);

  const getLinkByCode = useCallback((shortCode: string): LinkData | undefined => {
    return links.find(link => link.shortCode === shortCode);
  }, [links]);

  const incrementClicks = useCallback((shortCode: string) => {
    setLinks(prev => prev.map(link => 
      link.shortCode === shortCode 
        ? { ...link, clicks: link.clicks + 1 }
        : link
    ));
  }, []);

  return {
    links,
    isLoading,
    createLink,
    deleteLink,
    getLinkByCode,
    incrementClicks,
  };
}
