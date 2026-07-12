import { Copy, ExternalLink, Inbox, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PermissionBadge } from '@/components/PermissionBadge';
import { useSharedLinksForMe } from '@/hooks/useCollaboration';
import { useToast } from '@/hooks/use-toast';

export function SharedWithMeTab() {
  const { data = [], isLoading } = useSharedLinksForMe();
  const { toast } = useToast();

  const getShortUrl = (shortCode: string) =>
    `${window.location.origin}/r/${shortCode}`;

  const handleCopy = async (shortCode: string) => {
    await navigator.clipboard.writeText(getShortUrl(shortCode));
    toast({ title: 'Copiado!' });
  };

  return (
    <Card className="shadow-soft border-0">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Inbox className="w-5 h-5 text-primary" />
          Compartilhados comigo
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
            Nenhum link foi compartilhado com você ainda.
          </p>
        )}
        {data.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <a
                    href={getShortUrl(item.link.shortCode)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-primary font-medium hover:underline truncate"
                  >
                    /r/{item.link.shortCode}
                  </a>
                  <PermissionBadge permission={item.permission} />
                </div>
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
                  Proprietário:{' '}
                  <span className="font-medium text-foreground">
                    {item.owner.name || item.owner.email}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => handleCopy(item.link.shortCode)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => window.open(item.link.originalUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
