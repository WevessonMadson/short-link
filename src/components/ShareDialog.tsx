import { useState } from 'react';
import { X, Mail, Send, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useShareLinks } from '@/hooks/useCollaboration';
import { useToast } from '@/hooks/use-toast';
import type { Permission } from '@/lib/collaborationApi';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkIds: (string | number)[];
  onShared?: () => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ShareDialog({ open, onOpenChange, linkIds, onShared }: ShareDialogProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [permission, setPermission] = useState<Permission>('VIEW');
  const { toast } = useToast();
  const shareMutation = useShareLinks();

  const resetAndClose = () => {
    setEmails([]);
    setEmailInput('');
    setPermission('VIEW');
    onOpenChange(false);
  };

  const addEmail = (raw: string) => {
    const value = raw.trim().toLowerCase();
    if (!value) return;
    if (!emailRegex.test(value)) {
      toast({
        title: 'E-mail inválido',
        description: `"${value}" não é um e-mail válido.`,
        variant: 'destructive',
      });
      return;
    }
    if (emails.includes(value)) return;
    setEmails((prev) => [...prev, value]);
    setEmailInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addEmail(emailInput);
    } else if (e.key === 'Backspace' && !emailInput && emails.length) {
      setEmails((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmails = [...emails];
    if (emailInput.trim()) {
      const value = emailInput.trim().toLowerCase();
      if (emailRegex.test(value) && !finalEmails.includes(value)) {
        finalEmails.push(value);
      }
    }
    if (!finalEmails.length) {
      toast({
        title: 'Adicione ao menos um e-mail',
        variant: 'destructive',
      });
      return;
    }
    if (!linkIds.length) {
      toast({
        title: 'Nenhum link selecionado',
        variant: 'destructive',
      });
      return;
    }

    try {
      await shareMutation.mutateAsync({
        emails: finalEmails,
        linkIds,
        permission,
      });
      onShared?.();
      resetAndClose();
    } catch {
      // handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : resetAndClose())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar links</DialogTitle>
          <DialogDescription>
            {linkIds.length === 1
              ? 'Compartilhando 1 link selecionado.'
              : `Compartilhando ${linkIds.length} links selecionados.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emails">E-mails</Label>
            <div className="min-h-11 flex flex-wrap items-center gap-2 rounded-md border border-input bg-background px-2 py-2 focus-within:ring-2 focus-within:ring-ring">
              {emails.map((email) => (
                <Badge key={email} variant="secondary" className="gap-1 pr-1">
                  {email}
                  <button
                    type="button"
                    onClick={() => setEmails((prev) => prev.filter((e) => e !== email))}
                    className="ml-1 rounded-sm hover:bg-background/50 p-0.5"
                    aria-label={`Remover ${email}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <div className="flex-1 min-w-[8rem] flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input
                  id="emails"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => emailInput && addEmail(emailInput)}
                  placeholder={emails.length ? '' : 'digite@email.com'}
                  className="border-0 bg-transparent p-0 h-6 focus-visible:ring-0"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Pressione Enter, vírgula ou espaço para adicionar cada e-mail.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="permission">Permissão</Label>
            <Select value={permission} onValueChange={(v) => setPermission(v as Permission)}>
              <SelectTrigger id="permission">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEW">Visualizar — apenas leitura</SelectItem>
                <SelectItem value="EDIT">Editar — pode alterar o link</SelectItem>
                <SelectItem value="MANAGE">Gerenciar — controle total</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={resetAndClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={shareMutation.isPending}
              className="gradient-primary text-primary-foreground"
            >
              {shareMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar convite
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
