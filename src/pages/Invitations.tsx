import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Inbox, Link2, LogOut, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { PermissionBadge } from '@/components/PermissionBadge';
import { NotificationsBell } from '@/components/NotificationsBell';
import {
  useAcceptInvitation,
  useCancelInvitation,
  useReceivedInvitations,
  useRejectInvitation,
  useSentInvitations,
} from '@/hooks/useCollaboration';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusLabels: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Pendente', className: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400' },
  ACCEPTED: { label: 'Aceito', className: 'bg-green-500/15 text-green-700 dark:text-green-400' },
  REJECTED: { label: 'Recusado', className: 'bg-destructive/15 text-destructive' },
  CANCELED: { label: 'Cancelado', className: 'bg-muted text-muted-foreground' },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusLabels[status] || statusLabels.PENDING;
  return <Badge className={`${s.className} border-transparent`}>{s.label}</Badge>;
}

export default function Invitations() {
  const { logout } = useAuth();
  const { data: received = [], isLoading: loadingReceived } = useReceivedInvitations();
  const { data: sent = [], isLoading: loadingSent } = useSentInvitations();
  const accept = useAcceptInvitation();
  const reject = useRejectInvitation();
  const cancel = useCancelInvitation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                <Link2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ShortLink</span>
            </Link>
            <div className="flex items-center gap-2">
              <NotificationsBell />
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2 -ml-3">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Convites</h1>
            <p className="text-muted-foreground">
              Gerencie os convites de colaboração enviados e recebidos.
            </p>
          </div>

          <Tabs defaultValue="received" className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-sm">
              <TabsTrigger value="received">
                <Inbox className="w-4 h-4 mr-2" />
                Recebidos
              </TabsTrigger>
              <TabsTrigger value="sent">
                <Send className="w-4 h-4 mr-2" />
                Enviados
              </TabsTrigger>
            </TabsList>

            <TabsContent value="received" className="mt-4">
              <Card className="shadow-soft border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Convites recebidos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loadingReceived && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Carregando...
                    </p>
                  )}
                  {!loadingReceived && received.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Nenhum convite recebido.
                    </p>
                  )}
                  {received.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-4 rounded-lg bg-secondary/50 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-medium">
                            {inv.sender.name || inv.sender.email}
                          </span>
                          <PermissionBadge permission={inv.permission} />
                          <StatusBadge status={inv.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {inv.linksCount === 1
                            ? '1 link compartilhado'
                            : `${inv.linksCount} links compartilhados`}{' '}
                          ·{' '}
                          {formatDistanceToNow(new Date(inv.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                      {inv.status === 'PENDING' && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="gradient-primary text-primary-foreground"
                            onClick={() => accept.mutate(inv.id)}
                            disabled={accept.isPending}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Aceitar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => reject.mutate(inv.id)}
                            disabled={reject.isPending}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Recusar
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sent" className="mt-4">
              <Card className="shadow-soft border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Convites enviados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loadingSent && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Carregando...
                    </p>
                  )}
                  {!loadingSent && sent.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Nenhum convite enviado.
                    </p>
                  )}
                  {sent.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-4 rounded-lg bg-secondary/50 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-medium">
                            {inv.recipient.name || inv.recipient.email}
                          </span>
                          <PermissionBadge permission={inv.permission} />
                          <StatusBadge status={inv.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {inv.linksCount === 1
                            ? '1 link enviado'
                            : `${inv.linksCount} links enviados`}{' '}
                          ·{' '}
                          {formatDistanceToNow(new Date(inv.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                      {inv.status === 'PENDING' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <X className="w-4 h-4 mr-1" />
                              Cancelar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancelar convite?</AlertDialogTitle>
                              <AlertDialogDescription>
                                O convite enviado para{' '}
                                {inv.recipient.name || inv.recipient.email} será cancelado.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Voltar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => cancel.mutate(inv.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Cancelar convite
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
