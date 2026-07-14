import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptInvitation,
  cancelInvitation,
  getReceivedInvitations,
  getSentInvitations,
  getSharedLinksByMe,
  getSharedLinksForMe,
  rejectInvitation,
  removeSharedLink,
  shareLinks,
  updateSharedLinkOriginalUrl,
  updateSharedLinkPermission,
  type Permission,
  type ShareRequest,
} from '@/lib/collaborationApi';
import { useToast } from '@/hooks/use-toast';

export const collaborationKeys = {
  receivedInvitations: ['collaboration', 'invitations', 'received'] as const,
  sentInvitations: ['collaboration', 'invitations', 'sent'] as const,
  sharedForMe: ['collaboration', 'shared', 'for-me'] as const,
  sharedByMe: ['collaboration', 'shared', 'by-me'] as const,
};

function errorMessage(error: unknown, fallback: string) {
  const err = error as { response?: { data?: { message?: string } } };
  return err?.response?.data?.message || fallback;
}

export function useReceivedInvitations() {
  return useQuery({
    queryKey: collaborationKeys.receivedInvitations,
    queryFn: getReceivedInvitations,
  });
}

export function useSentInvitations() {
  return useQuery({
    queryKey: collaborationKeys.sentInvitations,
    queryFn: getSentInvitations,
  });
}

export function useSharedLinksForMe() {
  return useQuery({
    queryKey: collaborationKeys.sharedForMe,
    queryFn: getSharedLinksForMe,
  });
}

export function useSharedLinksByMe() {
  return useQuery({
    queryKey: collaborationKeys.sharedByMe,
    queryFn: getSharedLinksByMe,
  });
}

export function useShareLinks() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: ShareRequest) => shareLinks(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collaborationKeys.sentInvitations });
      qc.invalidateQueries({ queryKey: collaborationKeys.sharedByMe });
      toast({
        title: 'Compartilhamento enviado!',
        description: 'Convite enviado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao compartilhar',
        description: errorMessage(error, 'Não foi possível enviar o convite.'),
        variant: 'destructive',
      });
    },
  });
}

export function useAcceptInvitation() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string | number) => acceptInvitation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collaborationKeys.receivedInvitations });
      qc.invalidateQueries({ queryKey: collaborationKeys.sharedForMe });
      toast({ title: 'Convite aceito!' });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: errorMessage(error, 'Não foi possível aceitar o convite.'),
        variant: 'destructive',
      });
    },
  });
}

export function useRejectInvitation() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string | number) => rejectInvitation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collaborationKeys.receivedInvitations });
      toast({ title: 'Convite recusado' });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: errorMessage(error, 'Não foi possível recusar o convite.'),
        variant: 'destructive',
      });
    },
  });
}

export function useCancelInvitation() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string | number) => cancelInvitation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collaborationKeys.sentInvitations });
      toast({ title: 'Convite cancelado' });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: errorMessage(error, 'Não foi possível cancelar o convite.'),
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateSharedPermission() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, permission }: { id: string | number; permission: Permission }) =>
      updateSharedLinkPermission(id, permission),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collaborationKeys.sharedByMe });
      toast({ title: 'Permissão atualizada' });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: errorMessage(error, 'Não foi possível atualizar a permissão.'),
        variant: 'destructive',
      });
    },
  });
}

export function useRemoveSharedLink() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string | number) => removeSharedLink(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collaborationKeys.sharedByMe });
      toast({ title: 'Compartilhamento removido' });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: errorMessage(error, 'Não foi possível remover.'),
        variant: 'destructive',
      });
    },
  });
}
