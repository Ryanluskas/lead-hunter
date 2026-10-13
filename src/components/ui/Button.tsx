import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

/**
 * Hierarquia de ações e microinterações táteis Apple:
 * - primary   → azul-petróleo: salvar, confirmar, avançar.
 * - success   → verde: conclusões positivas (registrar venda, confirmar recebimento).
 * - secondary → branco com borda neutra e sombra sutil.
 * - ghost     → transparente, ações terciárias e menus.
 * - danger    → exclusões e ações destrutivas.
 */
export type ButtonVariant = 'primary' | 'success' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  isSuccess?: boolean;
  successText?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-lh-primary text-lh-text-inverse hover:bg-lh-primary-hover active:bg-lh-primary-active border border-transparent shadow-xs hover:shadow-lh-soft',
  success:
    'bg-lh-accent text-lh-text-inverse hover:bg-lh-accent-hover active:bg-lh-accent-active border border-transparent shadow-xs hover:shadow-lh-soft',
  secondary:
    'bg-lh-surface text-lh-primary-text border border-lh-border hover:bg-lh-surface-alt hover:border-lh-border-strong active:bg-lh-bg-subtle shadow-xs',
  ghost:
    'bg-transparent text-lh-text-secondary border border-transparent hover:bg-lh-bg-subtle hover:text-lh-text active:bg-lh-border',
  danger:
    'bg-lh-danger text-lh-text-inverse border border-transparent hover:brightness-95 active:brightness-90 shadow-xs',
  outline: '',
  accent: '',
};
variantStyles.outline = variantStyles.secondary;
variantStyles.accent = variantStyles.success;

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-[13px] gap-1.5',
  md: 'h-[42px] px-4 text-sm gap-2',
  lg: 'h-[46px] px-5 text-[15px] gap-2',
  icon: 'h-9 w-9 p-0',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      isSuccess = false,
      successText,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lh-md font-medium select-none',
          'transition-all duration-150 ease-out',
          'active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:shadow-lh-focus',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
          isSuccess ? 'bg-lh-accent text-white border-transparent' : variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {loadingText || children}
          </>
        ) : isSuccess ? (
          <>
            <Check className="h-4 w-4 animate-in zoom-in-75 duration-200" />
            {successText || children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
