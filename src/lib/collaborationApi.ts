import axios from 'axios';
import type { LinkData } from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export type Permission = 'VIEW' | 'EDIT' | 'MANAGE';

export interface ShareRequest {
  emails: string[];
  linkIds: (string | number)[];
  permission: Permission;
}

export interface InvitationUser {
  id: string | number;
  name?: string;
  email: string;
}

export interface ReceivedInvitation {
  id: string | number;
  sender: InvitationUser;
  linksCount: number;
  permission: Permission;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED';
  createdAt: string;
}

export interface SentInvitation {
  id: string | number;
  recipient: InvitationUser;
  linksCount: number;
  permission: Permission;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED';
  createdAt: string;
}

export interface SharedLinkForMe {
  id: string | number;
  link: LinkData;
  owner: InvitationUser;
  permission: Permission;
}

export interface SharedLinkByMe {
  id: string | number;
  link: LinkData;
  recipient: InvitationUser;
  permission: Permission;
}

// ---------- Share ----------
export async function shareLinks(payload: ShareRequest): Promise<void> {
  await axios.post(`${API_URL}/collaboration/share`, payload);
}

// ---------- Invitations ----------
export async function getReceivedInvitations(): Promise<ReceivedInvitation[]> {
  const { data } = await axios.get<ReceivedInvitation[]>(
    `${API_URL}/collaboration/invitations/received`,
  );
  return data;
}

export async function getSentInvitations(): Promise<SentInvitation[]> {
  const { data } = await axios.get<SentInvitation[]>(
    `${API_URL}/collaboration/invitations/sent`,
  );
  return data;
}

export async function acceptInvitation(id: string | number): Promise<void> {
  await axios.post(`${API_URL}/collaboration/invitations/${id}/accept`);
}

export async function rejectInvitation(id: string | number): Promise<void> {
  await axios.post(`${API_URL}/collaboration/invitations/${id}/reject`);
}

export async function cancelInvitation(id: string | number): Promise<void> {
  await axios.post(`${API_URL}/collaboration/invitations/${id}/cancel`);
}

// ---------- Shared links ----------
export async function getSharedLinksForMe(): Promise<SharedLinkForMe[]> {
  const { data } = await axios.get<SharedLinkForMe[]>(
    `${API_URL}/collaboration/shared-links-for-me`,
  );
  return data;
}

export async function getSharedLinksByMe(): Promise<SharedLinkByMe[]> {
  const { data } = await axios.get<SharedLinkByMe[]>(
    `${API_URL}/collaboration/shared-links-by-me`,
  );
  return data;
}

export async function updateSharedLinkPermission(
  id: string | number,
  permission: Permission,
): Promise<void> {
  await axios.put(`${API_URL}/collaboration/shared-links/${id}/permission`, {
    permission,
  });
}

export async function removeSharedLink(id: string | number): Promise<void> {
  await axios.delete(`${API_URL}/collaboration/shared-links/${id}`);
}
