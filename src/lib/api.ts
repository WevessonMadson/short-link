// API configuration - update these when deploying
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface LinkData {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  clicks: number;
}

export interface CreateLinkPayload {
  originalUrl: string;
  shortCode?: string;
}

// Generate a random short code
export function generateShortCode(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create a new shortened link
export async function createLink(payload: CreateLinkPayload): Promise<LinkData> {
  const shortCode = payload.shortCode || generateShortCode();
  
  const linkData: LinkData = {
    id: crypto.randomUUID(),
    originalUrl: payload.originalUrl,
    shortCode,
    createdAt: new Date().toISOString(),
    clicks: 0,
  };

  const response = await fetch(`${API_BASE_URL}/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(linkData),
  });

  if (!response.ok) {
    throw new Error('Failed to create link');
  }

  return linkData;
}

// Get all links
export async function getLinks(): Promise<LinkData[]> {
  const response = await fetch(`${API_BASE_URL}/links`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch links');
  }

  return response.json();
}

// Get a single link by short code
export async function getLinkByCode(shortCode: string): Promise<LinkData | null> {
  const response = await fetch(`${API_BASE_URL}/links/${shortCode}`);
  
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch link');
  }

  return response.json();
}

// Delete a link
export async function deleteLink(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/links/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete link');
  }
}
