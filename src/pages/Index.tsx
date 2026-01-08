import { Link2 } from 'lucide-react';
import { LinkForm } from '@/components/LinkForm';
import { LinkList } from '@/components/LinkList';
import { useLinks } from '@/hooks/useLinks';

const Index = () => {
  const { links, createLink, deleteLink, isLoading } = useLinks();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
              <Link2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ShortLink</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Encurte seus links
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                de forma simples
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Transforme URLs longas em links curtos e fáceis de compartilhar.
            </p>
          </div>

          <div className="space-y-8">
            <LinkForm onSubmit={createLink} />
            
            {!isLoading && <LinkList links={links} onDelete={deleteLink} />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>ShortLink — Sistema de encurtamento de links</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
