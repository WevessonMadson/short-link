import { useMemo, useState } from 'react';
import {
  BarChart3,
  Check,
  Copy,
  ExternalLink,
  Pencil,
  Save,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { LinkForm } from '@/components/LinkForm';
import { ShareDialog } from '@/components/ShareDialog';
import { useLinks } from '@/hooks/useLinks';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { LinkData } from '@/lib/api';

export function MyLinksTab() {
  const { links, createLink, deleteLink, updateLink, isLoading } = useLinks();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [editShortCode, setEditShortCode] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareTargetIds, setShareTargetIds] = useState<(string | number)[]>([]);

  const selectedArray = useMemo(() => Array.from(selectedIds), [selectedIds]);
  const allSelected = links.length > 0 && selectedIds.size === links.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(links.map((l) => l.id)));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getShortUrl = (shortCode: string) =>
    `${window.location.origin}/r/${shortCode}`;

  const handleCopy = async (link: LinkData) => {
    await navigator.clipboard.writeText(getShortUrl(link.shortCode));
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startEdit = (link: LinkData) => {
    setEditingId(link.id);
    setEditUrl(link.originalUrl);
    setEditShortCode(link.shortCode);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditUrl('');
    setEditShortCode('');
  };

  const saveEdit = (id: string) => {
    if (editUrl.trim()) {
      updateLink(id, editUrl.trim(), editShortCode.trim());
      cancelEdit();
    }
  };

  const openShareForSelected = () => {
    if (!selectedIds.size) return;
    setShareTargetIds(selectedArray);
    setShareOpen(true);
  };

  const openShareForOne = (id: string) => {
    setShareTargetIds([id]);
    setShareOpen(true);
  };

  return (
    <div className="space-y-6">
      <LinkForm onSubmit={createLink} />

      <Card className="shadow-soft border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Seus Links
              {links.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({links.length})
                </span>
              )}
            </CardTitle>

            {links.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    id="select-all"
                    checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                    onCheckedChange={toggleAll}
                  />
                  <label htmlFor="select-all" className="cursor-pointer">
                    {selectedIds.size > 0
                      ? `${selectedIds.size} selecionado(s)`
                      : 'Selecionar todos'}
                  </label>
                </div>
                <Button
                  size="sm"
                  disabled={!selectedIds.size}
                  onClick={openShareForSelected}
                  className="gradient-primary text-primary-foreground"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && (
            <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
          )}
          {!isLoading && links.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum link ainda. Crie seu primeiro link acima!
            </p>
          )}
          {links.map((link) => (
            <div
              key={link.id}
              className="group p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedIds.has(link.id)}
                  onCheckedChange={() => toggleOne(link.id)}
                  className="mt-1"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {editingId === link.id ? (
                      <Input
                        value={editShortCode}
                        onChange={(e) => setEditShortCode(e.target.value)}
                        className="h-8 text-sm w-auto"
                        placeholder="Novo link curto"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(link.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                      />
                    ) : (
                      <>
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
                      </>
                    )}
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
                      {link.clicks} visitas
                    </span>
                  </div>
                </div>
                {editingId !== link.id && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => openShareForOne(link.id)}
                      title="Compartilhar"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => startEdit(link)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
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
                      onClick={() => deleteLink(link.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        linkIds={shareTargetIds}
        onShared={() => setSelectedIds(new Set())}
      />
    </div>
  );
}
