import { Link } from 'react-router-dom';
import { Bell, Check, X, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PermissionBadge } from '@/components/PermissionBadge';
import {
  useAcceptInvitation,
  useReceivedInvitations,
  useRejectInvitation,
} from '@/hooks/useCollaboration';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function NotificationsBell() {
  const { data: invitations = [] } = useReceivedInvitations();
  const accept = useAcceptInvitation();
  const reject = useRejectInvitation();

  const pending = invitations.filter((i) => i.status === 'PENDING');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
          <Bell className="w-5 h-5" />
          {pending.length > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
              {pending.length > 9 ? '9+' : pending.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Notificações</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {pending.length === 0
              ? 'Sem notificações pendentes'
              : `${pending.length} convite(s) aguardando`}
          </p>
        </div>

        <ScrollArea className="max-h-80">
          {pending.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
              Você está em dia!
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {pending.map((inv) => (
                <li key={inv.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">
                          {inv.user.name || inv.user.email}
                        </span>{' '}
                        compartilhou {inv.linksCount === 1 ? '1 link' : `${inv.linksCount} links`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(inv.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    {/* <PermissionBadge permission={inv.permission} /> */}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 gradient-primary text-primary-foreground"
                      onClick={() => accept.mutate(inv.id)}
                      disabled={accept.isPending}
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Aceitar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => reject.mutate(inv.id)}
                      disabled={reject.isPending}
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Recusar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>

        <div className="p-2 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
            <Link to="/invitations">Ver todos os convites</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
