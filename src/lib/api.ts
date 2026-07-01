import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

// Configure axios interceptor to inject JWT token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getLinks(): Promise<LinkData[]> {
  const response = await axios.get<LinkData[]>(`${API_URL}/links`);
  return response.data;
}

export async function createLink(payload: CreateLinkPayload): Promise<LinkData> {
  const response = await axios.post<LinkData>(`${API_URL}/links`, payload);
  return response.data;
}

export async function updateLink(id: string, originalUrl: string, shortCode: string): Promise<LinkData> {
  const response = await axios.put<LinkData>(`${API_URL}/links/${id}`, { originalUrl, shortCode });
  return response.data;
}

export async function deleteLink(id: string): Promise<void> {
  await axios.delete(`${API_URL}/links/${id}`);
}

export async function getLinkByShortCode(shortCode: string): Promise<LinkData> {
  const response = await axios.get<LinkData>(`${API_URL}/links/${shortCode}`);
  return response.data;
}
