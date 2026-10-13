import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Ativa hover elevado suave — use em cartões clicáveis ou itens de lista. */
  interactive?: boolean;
  /** Remove o padding padrão (útil para tabelas e gráficos de borda a borda). */
  flush?: boolean;
  /** Superfície translúcida Apple Glassmorphism */
  glass?: boolean;
}

export function Card({ className, interactive, flush, glass, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lh-lg border transition-all duration-200',
        glass ? 'lh-glass' : 'bg-lh-surface border-lh-border shadow-lh-card',
        !flush && 'p-5 sm:p-6',
        interactive && 'lh-card-interactive cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-3', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-sm font-semibold text-lh-text tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('mt-0.5 text-[13px] text-lh-text-muted leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-5 flex items-center gap-3 border-t border-lh-border pt-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}
