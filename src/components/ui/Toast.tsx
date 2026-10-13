'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motionTokens } from '@/lib/motion';

export type ToastTone = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

export interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastTone;
  tone?: ToastTone;
}

export interface ToastContextValue {
  notify: (toast: Omit<ToastItem, 'id'>) => void;
  addToast: (options: ToastOptions) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toneStyles: Record<ToastTone, { icon: React.ReactNode; className: string }> = {
  success: { icon: <CheckCircle2 className="h-4 w-4 text-lh-success" />, className: 'border-lh-accent-border' },
  error: { icon: <AlertTriangle className="h-4 w-4 text-lh-danger" />, className: 'border-lh-danger' },
  warning: { icon: <AlertTriangle className="h-4 w-4 text-lh-warning" />, className: 'border-lh-warning' },
  info: { icon: <Info className="h-4 w-4 text-lh-info" />, className: 'border-lh-info' },
};

/** Notificações discretas, translúcidas estilo Apple e não bloqueantes. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);
  const reduceMotion = useReducedMotion();

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      counter.current += 1;
      const id = counter.current;
      setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
      window.setTimeout(() => dismiss(id), toast.tone === 'error' ? 7000 : 4500);
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      notify,
      addToast: (opts) =>
        notify({
          tone: opts.tone || opts.type || 'info',
          title: opts.title,
          description: opts.description,
        }),
      success: (title, description) => notify({ tone: 'success', title, description }),
      error: (title, description) => notify({ tone: 'error', title, description }),
      info: (title, description) => notify({ tone: 'info', title, description }),
      warning: (title, description) => notify({ tone: 'warning', title, description }),
    }),
    [notify]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2.5"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout={!reduceMotion}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: motionTokens.duration.instant } }}
              transition={{ duration: motionTokens.duration.normal, ease: motionTokens.ease.smooth }}
              role={t.tone === 'error' ? 'alert' : 'status'}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-lh-lg border p-3.5 lh-glass shadow-lh-floating',
                toneStyles[t.tone].className
              )}
            >
              <span className="mt-0.5 shrink-0">{toneStyles[t.tone].icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-lh-text">{t.title}</p>
                {t.description && <p className="mt-0.5 text-[12px] text-lh-text-secondary leading-snug">{t.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dispensar notificação"
                className="shrink-0 rounded-lh-sm p-1 text-lh-text-muted hover:bg-lh-bg-subtle hover:text-lh-text transition-colors active:scale-90"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast deve ser usado dentro de <ToastProvider>.');
  }
  return ctx;
}
