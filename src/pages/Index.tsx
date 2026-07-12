import { Link2, LogOut, Link as LinkIcon, Inbox, Send, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MyLinksTab } from '@/components/MyLinksTab';
import { SharedWithMeTab } from '@/components/SharedWithMeTab';
import { SharedByMeTab } from '@/components/SharedByMeTab';
import { FavoritesTab } from '@/components/FavoritesTab';
import { NotificationsBell } from '@/components/NotificationsBell';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                <Link2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ShortLink</span>
            </div>
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

      {/* Hero */}
      <section className="container mx-auto px-4 pt-10 pb-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Encurte, compartilhe e{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              colabore
            </span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Gerencie seus links, compartilhe com sua equipe e acompanhe convites em um só lugar.
          </p>
        </div>
      </section>

      {/* Main tabs */}
      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="mine" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto w-full mb-6">
              <TabsTrigger value="mine" className="py-2">
                <LinkIcon className="w-4 h-4 mr-2" />
                Meus Links
              </TabsTrigger>
              <TabsTrigger value="shared-with-me" className="py-2">
                <Inbox className="w-4 h-4 mr-2" />
                Comigo
              </TabsTrigger>
              <TabsTrigger value="shared-by-me" className="py-2">
                <Send className="w-4 h-4 mr-2" />
                Por Mim
              </TabsTrigger>
              <TabsTrigger value="favorites" className="py-2">
                <Star className="w-4 h-4 mr-2" />
                Favoritos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mine" className="mt-0">
              <MyLinksTab />
            </TabsContent>
            <TabsContent value="shared-with-me" className="mt-0">
              <SharedWithMeTab />
            </TabsContent>
            <TabsContent value="shared-by-me" className="mt-0">
              <SharedByMeTab />
            </TabsContent>
            <TabsContent value="favorites" className="mt-0">
              <FavoritesTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t border-border/50">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          ShortLink — Sistema de encurtamento e colaboração
        </div>
      </footer>
    </div>
  );
};

export default Index;
