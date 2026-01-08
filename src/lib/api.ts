// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface LinkData {
  id: string;
  ownerId: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  clicks: number;
}

export interface CreateLinkPayload {
  originalUrl: string;
  shortCode?: string;
  ownerId: string;
  binId: string;
}

// 🔹 Cria um bin para um novo usuário
export async function createUserBin(): Promise<{ binId: string }> {
  const response = await fetch(`${API_BASE_URL}/create-bin`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to create user bin');
  }

  return response.json();
}

// Gera short code aleatório
export function generateShortCode(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function getLinks(binId: string, userId: string): Promise<LinkData[]> {
  const response = await fetch(`${API_BASE_URL}/links`, {
    headers: {
      'x-bin-id': binId,
      'x-user-id': userId,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch links');
  const data = await response.json();
  return data.links;
}

export async function createLink(payload: CreateLinkPayload): Promise<LinkData> {
  const response = await fetch(`${API_BASE_URL}/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-bin-id': payload.binId,
      'x-user-id': payload.ownerId,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('Failed to create link');
  const data = await response.json();
  return data.link;
}

export async function updateLink(id: string, newUrl: string, binId: string, userId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/links/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-bin-id': binId,
      'x-user-id': userId,
    },
    body: JSON.stringify({ originalUrl: newUrl }),
  });
  if (!response.ok) throw new Error('Failed to update link');
}

export async function deleteLink(id: string, binId: string, userId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/links/${id}`, {
    method: 'DELETE',
    headers: {
      'x-bin-id': binId,
      'x-user-id': userId,
    },
  });
  if (!response.ok) throw new Error('Failed to delete link');
}
