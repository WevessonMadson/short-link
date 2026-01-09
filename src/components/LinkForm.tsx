import { useState } from 'react';
import { Link2, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { CreateLinkPayload, LinkData } from '@/lib/api';

interface LinkFormProps {
  onSubmit: (payload: CreateLinkPayload) => Promise<LinkData>;
}

export function LinkForm({ onSubmit }: LinkFormProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<LinkData | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) return;

    // Validate URL
    try {
      new URL(url);
    } catch {
      toast({
        title: 'URL inválida',
        description: 'Por favor, insira uma URL válida.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const link = await onSubmit({
        originalUrl: url,
      });
      setCreatedLink(link);
      setUrl('');
      toast({
        title: 'Link criado!',
        description: 'Seu link encurtado está pronto.',
      });
    } catch (error) {
      // Error handled in useLinks hook
    } finally {
      setIsLoading(false);
    }
  };

  const getShortUrl = (shortCode: string) => {
    return `${window.location.origin}/r/${shortCode}`;
  };

  const handleCopy = async () => {
    if (!createdLink) return;
    
    await navigator.clipboard.writeText(getShortUrl(createdLink.shortCode));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateAnother = () => {
    setCreatedLink(null);
    setCopied(false);
  };

  if (createdLink) {
    return (
      <Card className="shadow-soft border-0 overflow-hidden">
        <div className="h-1 gradient-primary" />
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full gradient-primary mx-auto flex items-center justify-center shadow-glow">
              <Check className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Link criado com sucesso!</h3>
              <p className="text-muted-foreground text-sm">
                Seu link está pronto para ser compartilhado
              </p>
            </div>
            
            <div className="bg-secondary rounded-lg p-4 flex items-center gap-3">
              <Input
                value={getShortUrl(createdLink.shortCode)}
                readOnly
                className="bg-transparent border-0 text-center font-mono text-lg focus-visible:ring-0"
              />
              <Button
                onClick={handleCopy}
                variant="ghost"
                size="icon"
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-accent" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Destino:</span>{' '}
              <a 
                href={createdLink.originalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {createdLink.originalUrl}
              </a>
            </div>

            <Button onClick={handleCreateAnother} className="gradient-primary text-primary-foreground">
              <Sparkles className="w-4 h-4 mr-2" />
              Criar outro link
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft border-0 overflow-hidden">
      <div className="h-1 gradient-primary" />
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="url">
              Cole sua URL longa
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="url"
                type="url"
                placeholder="https://exemplo.com/sua-url-muito-longa-aqui"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-11 h-12 text-base"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !url}
            className="w-full h-12 text-base gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {isLoading ? (
              'Criando...'
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Encurtar Link
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
