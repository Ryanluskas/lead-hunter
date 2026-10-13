'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';

const fieldBase =
  'w-full rounded-lh-md border bg-lh-input text-sm text-lh-text placeholder:text-lh-text-muted ' +
  'transition-[border-color,box-shadow] duration-lh-fast ease-lh ' +
  'focus:outline-none focus:border-lh-primary focus:shadow-lh-focus ' +
  'disabled:cursor-not-allowed disabled:bg-lh-surface-alt disabled:text-lh-text-muted';

const fieldBorder = (error?: string) =>
  error ? 'border-lh-danger focus:border-lh-danger' : 'border-lh-border hover:border-lh-border-strong';

interface FieldWrapperProps {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

function FieldWrapper({ id, label, hint, error, required, children, className }: FieldWrapperProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-lh-text">
          {label}
          {required && (
            <span className="ml-0.5 text-lh-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-lh-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-lh-text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, label, hint, error, id, required, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id || autoId;
    return (
      <FieldWrapper id={fieldId} label={label} hint={hint} error={error} required={required} className={wrapperClassName}>
        <input
          id={fieldId}
          ref={ref}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, error, hint)}
          className={cn(fieldBase, fieldBorder(error), 'h-11 px-3', className)}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, wrapperClassName, label, hint, error, id, required, children, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id || autoId;
    return (
      <FieldWrapper id={fieldId} label={label} hint={hint} error={error} required={required} className={wrapperClassName}>
        <select
          id={fieldId}
          ref={ref}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, error, hint)}
          className={cn(fieldBase, fieldBorder(error), 'h-11 cursor-pointer px-3 pr-8', className)}
          {...props}
        >
          {children}
        </select>
      </FieldWrapper>
    );
  }
);
Select.displayName = 'Select';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, wrapperClassName, label, hint, error, id, required, rows = 3, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id || autoId;
    return (
      <FieldWrapper id={fieldId} label={label} hint={hint} error={error} required={required} className={wrapperClassName}>
        <textarea
          id={fieldId}
          ref={ref}
          rows={rows}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, error, hint)}
          className={cn(fieldBase, fieldBorder(error), 'resize-y px-3 py-2.5 leading-relaxed', className)}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Textarea.displayName = 'Textarea';
