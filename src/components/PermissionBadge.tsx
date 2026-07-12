import { Badge } from '@/components/ui/badge';
import type { Permission } from '@/lib/collaborationApi';
import { Eye, Pencil, Shield } from 'lucide-react';

const config: Record<Permission, { label: string; className: string; Icon: typeof Eye }> = {
  VIEW: {
    label: 'Visualizar',
    className: 'bg-muted text-muted-foreground border-transparent',
    Icon: Eye,
  },
  EDIT: {
    label: 'Editar',
    className: 'bg-primary/15 text-primary border-transparent',
    Icon: Pencil,
  },
  MANAGE: {
    label: 'Gerenciar',
    className: 'bg-accent/20 text-accent-foreground border-transparent',
    Icon: Shield,
  },
};

export function PermissionBadge({ permission }: { permission: Permission }) {
  const { label, className, Icon } = config[permission];
  return (
    <Badge className={`gap-1 font-medium ${className}`} variant="outline">
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
}
