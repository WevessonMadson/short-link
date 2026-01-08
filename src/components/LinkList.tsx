import { useState } from 'react';
import { Copy, Check, Trash2, ExternalLink, BarChart3, Pencil, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LinkData } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LinkListProps {
  links: LinkData[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, newOriginalUrl: string) => void;
}

export function LinkList({ links, onDelete, onUpdate }: LinkListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');

  if (links.length === 0) {
    return null;
  }

  const getShortUrl = (shortCode: string) => {
    return `${window.location.origin}/r/${shortCode}`;
  };

  const handleCopy = async (link: LinkData) => {
    await navigator.clipboard.writeText(getShortUrl(link.shortCode));
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startEdit = (link: LinkData) => {
    setEditingId(link.id);
    setEditUrl(link.originalUrl);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditUrl('');
  };

  const saveEdit = (id: string) => {
    if (editUrl.trim()) {
      onUpdate(id, editUrl.trim());
      setEditingId(null);
      setEditUrl('');
    }
  };

  return (
    <Card className="shadow-soft border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Seus Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="group p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <a
                    href={getShortUrl(link.shortCode)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-primary font-medium hover:underline truncate"
                  >
                    /r/{link.shortCode}
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(link)}
                  >
                    {copiedId === link.id ? (
                      <Check className="w-4 h-4 text-accent" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {editingId === link.id ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="h-8 text-sm"
                      placeholder="Nova URL de destino"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(link.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-accent hover:text-accent"
                      onClick={() => saveEdit(link.id)}
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={cancelEdit}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground truncate block"
                  >
                    {link.originalUrl}
                  </a>
                )}
                
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>
                    {formatDistanceToNow(new Date(link.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    {link.clicks} cliques
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {editingId !== link.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => startEdit(link)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => window.open(link.originalUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(link.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
