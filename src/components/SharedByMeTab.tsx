import { Send, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  useRemoveSharedLink,
  useSharedLinksByMe,
  useUpdateSharedPermission,
} from '@/hooks/useCollaboration';
import type { Permission } from '@/lib/collaborationApi';

export function SharedByMeTab() {
  const { data = [], isLoading } = useSharedLinksByMe();
  const updatePermission = useUpdateSharedPermission();
  const removeShare = useRemoveSharedLink();

  return (
    <Card className="shadow-soft border-0">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Send className="w-5 h-5 text-primary" />
          Compartilhados por mim
          {data.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">({data.length})</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && (
          <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
        )}
        {!isLoading && data.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Você ainda não compartilhou nenhum link.
          </p>
        )}
        {data.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0 flex-1">
                <a
                  href={`${window.location.origin}/r/${item.link.shortCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-primary font-medium hover:underline truncate"
                >
                  /r/{item.link.shortCode}
                </a>
                <a
                  href={item.link.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground truncate block"
                >
                  {item.link.originalUrl}
                </a>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  Destinatário:{' '}
                  <span className="font-medium text-foreground">
                    {item.receiver.name || item.receiver.email}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={item.permission}
                  onValueChange={(v) =>
                    updatePermission.mutate({ id: item.id, permission: v as Permission })
                  }
                >
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIEW">Visualizar</SelectItem>
                    <SelectItem value="EDIT">Editar</SelectItem>
                    <SelectItem value="MANAGE">Gerenciar</SelectItem>
                  </SelectContent>
                </Select>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover compartilhamento?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {item.receiver.name || item.receiver.email} perderá o acesso a este
                        link. Essa ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => removeShare.mutate(item.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
