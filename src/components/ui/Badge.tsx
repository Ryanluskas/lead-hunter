import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Badges discretos: fundo suave + texto escuro do mesmo matiz.
 * Sempre acompanhe a cor de um texto explícito (e, quando útil, um ícone).
 */
export type BadgeVariant =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline'
  | 'default';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-lh-bg-subtle text-lh-text-secondary border-lh-border',
  default: 'bg-lh-bg-subtle text-lh-text-secondary border-lh-border',
  primary: 'bg-lh-primary-soft text-lh-primary-text border-lh-primary-border',
  success: 'bg-lh-success-soft text-lh-success-text border-lh-accent-border',
  warning: 'bg-lh-warning-soft text-lh-warning border-transparent',
  danger: 'bg-lh-danger-soft text-lh-danger border-transparent',
  info: 'bg-lh-info-soft text-lh-info border-transparent',
  outline: 'bg-transparent text-lh-text-secondary border-lh-border-strong',
};

const sizeStyles = {
  sm: 'h-5 px-2 text-[11px] gap-1',
  md: 'h-6 px-2.5 text-xs gap-1.5',
};

export function Badge({ className, variant = 'neutral', size = 'md', icon, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center whitespace-nowrap rounded-full border font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0 [&>svg]:h-3 [&>svg]:w-3" aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}
