import { useMemo, useState } from 'react';
import { ChevronRight, Send, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
} from '@/components/ui/alert-dialog';
import { PermissionBadge } from '@/components/PermissionBadge';
import {
  useRemoveSharedLink,
  useSharedLinksByMe,
  useUpdateSharedPermission,
} from '@/hooks/useCollaboration';
import type { Permission, SharedLinkByMe } from '@/lib/collaborationApi';

interface GroupedShare {
  linkId: string | number;
  link: SharedLinkByMe['link'];
  shares: SharedLinkByMe[];
}

export function SharedByMeTab() {
  const { data = [], isLoading } = useSharedLinksByMe();
  const updatePermission = useUpdateSharedPermission();
  const removeShare = useRemoveSharedLink();

  const [openGroup, setOpenGroup] = useState<GroupedShare | null>(null);
  const [pendingPermission, setPendingPermission] = useState<{
    id: string | number;
    receiverLabel: string;
    permission: Permission;
  } | null>(null);
  const [pendingRemove, setPendingRemove] = useState<{
    id: string | number;
    receiverLabel: string;
  } | null>(null);

  const grouped = useMemo<GroupedShare[]>(() => {
    const map = new Map<string, GroupedShare>();
    for (const item of data) {
      const key = String(item.link.id);
      const existing = map.get(key);
      if (existing) existing.shares.push(item);
      else map.set(key, { linkId: item.link.id, link: item.link, shares: [item] });
    }
    return Array.from(map.values());
  }, [data]);

  // keep openGroup in sync with fresh data
  const activeGroup = openGroup
    ? grouped.find((g) => String(g.linkId) === String(openGroup.linkId)) ?? null
    : null;

  return (
    <>
      <Card className="shadow-soft border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Compartilhados por mim
            {grouped.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({grouped.length})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && (
            <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
          )}
          {!isLoading && grouped.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Você ainda não compartilhou nenhum link.
            </p>
          )}
          {grouped.map((group) => (
            <button
              key={String(group.linkId)}
              type="button"
              onClick={() => setOpenGroup(group)}
              className="w-full text-left p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-primary font-medium truncate block">
                    /r/{group.link.shortCode}
                  </span>
                  <span className="text-sm text-muted-foreground truncate block">
                    {group.link.originalUrl}
                  </span>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    Compartilhado com{' '}
                    <span className="font-medium text-foreground">
                      {group.shares.length}{' '}
                      {group.shares.length === 1 ? 'pessoa' : 'pessoas'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Dialog
        open={!!activeGroup}
        onOpenChange={(o) => !o && setOpenGroup(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-mono">/r/{activeGroup?.link.shortCode}</DialogTitle>
            <DialogDescription className="truncate">
              {activeGroup?.link.originalUrl}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {activeGroup?.shares.map((item) => {
              const label = item.receiver.name || item.receiver.email;
              return (
                <div
                  key={String(item.id)}
                  className="flex items-center gap-3 p-3 rounded-md border border-border"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{label}</p>
                    {item.receiver.name && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.receiver.email}
                      </p>
                    )}
                    <div className="mt-1">
                      <PermissionBadge permission={item.permission} />
                    </div>
                  </div>
                  <Select
                    value={item.permission}
                    onValueChange={(v) => {
                      const next = v as Permission;
                      if (next === item.permission) return;
                      setPendingPermission({
                        id: item.id,
                        receiverLabel: label,
                        permission: next,
                      });
                    }}
                  >
                    <SelectTrigger className="w-[130px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIEW">Visualizar</SelectItem>
                      <SelectItem value="EDIT">Editar</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => setPendingRemove({ id: item.id, receiverLabel: label })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!pendingPermission}
        onOpenChange={(o) => !o && setPendingPermission(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alterar permissão?</AlertDialogTitle>
            <AlertDialogDescription>
              Confirmar alteração da permissão de{' '}
              <span className="font-medium">{pendingPermission?.receiverLabel}</span> para{' '}
              <span className="font-medium">
                {pendingPermission?.permission === 'EDIT' ? 'Editar' : 'Visualizar'}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingPermission) {
                  updatePermission.mutate({
                    id: pendingPermission.id,
                    permission: pendingPermission.permission,
                  });
                }
                setPendingPermission(null);
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!pendingRemove}
        onOpenChange={(o) => !o && setPendingRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover compartilhamento?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium">{pendingRemove?.receiverLabel}</span> perderá o
              acesso a este link. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingRemove) removeShare.mutate(pendingRemove.id);
                setPendingRemove(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
