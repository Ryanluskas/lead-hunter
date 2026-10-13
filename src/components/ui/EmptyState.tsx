import React from 'react';
import { AlertTriangle, Inbox, Lock, PlugZap, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';

export type EmptyStateKind = 'empty' | 'no-results' | 'error' | 'no-permission' | 'integration';

const kindIcon: Record<EmptyStateKind, React.ReactNode> = {
  empty: <Inbox className="h-5 w-5" />,
  'no-results': <SearchX className="h-5 w-5" />,
  error: <AlertTriangle className="h-5 w-5" />,
  'no-permission': <Lock className="h-5 w-5" />,
  integration: <PlugZap className="h-5 w-5" />,
};

const kindTone: Record<EmptyStateKind, string> = {
  empty: 'bg-lh-primary-soft text-lh-primary',
  'no-results': 'bg-lh-bg-subtle text-lh-text-secondary',
  error: 'bg-lh-danger-soft text-lh-danger',
  'no-permission': 'bg-lh-warning-soft text-lh-warning',
  integration: 'bg-lh-info-soft text-lh-info',
};

export interface EmptyStateProps {
  kind?: EmptyStateKind;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  className?: string;
  compact?: boolean;
}

/**
 * Estado vazio / erro / sem permissão / integração indisponível.
 * Use em vez de inventar dados para preencher espaço.
 */
export function EmptyState({
  kind = 'empty',
  title,
  description,
  action,
  icon,
  className,
  compact,
}: EmptyStateProps) {
  const renderedIcon = React.isValidElement(icon)
    ? icon
    : typeof icon === 'function' || (typeof icon === 'object' && icon !== null && 'render' in (icon as any))
    ? React.createElement(icon as React.ComponentType<{ className?: string }>, { className: 'h-5 w-5' })
    : (icon as React.ReactNode) ?? kindIcon[kind];

  return (
    <div
      role={kind === 'error' ? 'alert' : undefined}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'px-4 py-8' : 'px-6 py-12',
        className
      )}
    >
      <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-full', kindTone[kind])}>
        {renderedIcon}
      </div>
      <h3 className="text-sm font-semibold text-lh-text">{title}</h3>
      {description && <div className="mt-1 max-w-md text-[13px] leading-relaxed text-lh-text-muted">{description}</div>}
      {action && <div className="mt-4 flex flex-wrap items-center justify-center gap-2">{action}</div>}
    </div>
  );
}
