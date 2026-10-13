import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Ativa hover elevado — use apenas em cartões clicáveis. */
  interactive?: boolean;
  /** Remove o padding padrão (útil para tabelas e gráficos de borda a borda). */
  flush?: boolean;
}

export function Card({ className, interactive, flush, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lh-lg border border-lh-border bg-lh-surface shadow-lh-card',
        !flush && 'p-5 sm:p-6',
        interactive &&
          'cursor-pointer transition-[box-shadow,border-color] duration-lh-normal ease-lh hover:border-lh-border-strong hover:shadow-lh-elevated',
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
    <h3 className={cn('text-sm font-medium text-lh-text', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('mt-0.5 text-[13px] text-lh-text-muted', className)} {...props}>
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
