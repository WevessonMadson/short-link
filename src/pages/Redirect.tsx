import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLinks } from '@/hooks/useLinks';

export default function Redirect() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const { getLinkByCode, incrementClicks, isLoading } = useLinks();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isLoading || !shortCode) return;

    const link = getLinkByCode(shortCode);
    
    if (link) {
      incrementClicks(shortCode);
      window.location.href = link.originalUrl;
    } else {
      setError(true);
    }
  }, [shortCode, getLinkByCode, incrementClicks, isLoading]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 rounded-full bg-destructive/10 mx-auto flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Link não encontrado</h1>
            <p className="text-muted-foreground">
              O link que você está tentando acessar não existe ou foi removido.
            </p>
          </div>
          <Button onClick={() => navigate('/')} className="gradient-primary text-primary-foreground">
            <Link2 className="w-4 h-4 mr-2" />
            Ir para página inicial
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full gradient-primary mx-auto flex items-center justify-center shadow-glow animate-pulse">
          <Link2 className="w-8 h-8 text-primary-foreground" />
        </div>
        <p className="text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
}
