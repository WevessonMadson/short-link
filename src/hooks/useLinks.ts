import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLinks,
  createLink as apiCreateLink,
  updateLink as apiUpdateLink,
  deleteLink as apiDeleteLink,
  CreateLinkPayload,
  LinkData,
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function useLinks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['links'],
    queryFn: getLinks,
  });

  const createMutation = useMutation({
    mutationFn: apiCreateLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao criar link';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, originalUrl }: { id: string; originalUrl: string }) =>
      apiUpdateLink(id, originalUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast({
        title: 'Link atualizado!',
        description: 'O destino do link foi alterado com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao atualizar link';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiDeleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast({
        title: 'Link excluído!',
        description: 'O link foi removido com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao excluir link';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const createLink = async (payload: CreateLinkPayload): Promise<LinkData> => {
    return createMutation.mutateAsync(payload);
  };

  const updateLink = async (id: string, originalUrl: string) => {
    return updateMutation.mutateAsync({ id, originalUrl });
  };

  const deleteLink = async (id: string) => {
    return deleteMutation.mutateAsync(id);
  };

  return {
    links,
    isLoading,
    createLink,
    updateLink,
    deleteLink,
    isCreating: createMutation.isPending,
  };
}
