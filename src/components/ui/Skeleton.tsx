import React from 'react';
import { cn } from '@/lib/utils';

/** Placeholder neutro de carregamento. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn('lh-skeleton rounded-lh-sm', className)} {...props} />;
}

/** Bloco de skeleton com linhas de texto, para cartões e listas. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}

/** Indica carregamento para leitores de tela enquanto skeletons são exibidos. */
export function LoadingRegion({ label = 'Carregando…', children }: { label?: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
