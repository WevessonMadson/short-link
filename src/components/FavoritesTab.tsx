import { Star, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function FavoritesTab() {
  return (
    <Card className="shadow-soft border-0">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Favoritos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <Info className="w-4 h-4" />
          <AlertTitle>Aguardando API</AlertTitle>
          <AlertDescription>
            A funcionalidade de Favoritos ainda não possui endpoints definidos no backend.
            Assim que a API expuser as rotas para listar, marcar e desmarcar favoritos, esta
            aba será ligada.
          </AlertDescription>
        </Alert>

        <div className="mt-8 flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Marque seus links mais importantes como favoritos para acessá-los rapidamente.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
