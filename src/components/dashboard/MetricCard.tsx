'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  comparison?: {
    text: string;
    trend: 'up' | 'down' | 'neutral';
    value?: string;
  };
  icon?: React.ReactNode;
  /** Se `highlightGrowth` for true, o valor numérico recebe tom verde indicando resultado positivo */
  highlightGrowth?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  comparison,
  icon,
  highlightGrowth = false,
}: MetricCardProps) {
  const reduceMotion = useReducedMotion();
  const valStr = String(value);

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
      className="h-full"
    >
      <Card
        flush
        className="p-4 sm:p-4.5 xl:p-4 2xl:p-5 h-full flex flex-col justify-between transition-all duration-lh-fast hover:border-lh-border-strong hover:shadow-lh-card overflow-hidden"
      >
        <div>
          {/* Top Header: Título e Ícone */}
          <div className="flex items-start justify-between gap-2">
            <p className="text-[12px] sm:text-[13px] font-medium text-lh-text-secondary leading-snug line-clamp-2">
              {title}
            </p>
            {icon && (
              <div className="p-1.5 rounded-lh-md bg-lh-bg-subtle text-lh-primary shrink-0 border border-lh-border/80">
                {icon}
              </div>
            )}
          </div>

          {/* Indicador principal com ajuste dinâmico de fonte para nunca quebrar ou estourar */}
          <div className="mt-2.5 flex items-baseline gap-1.5 min-w-0">
            <h2
              className={cn(
                'font-bold tracking-tight lh-tabular truncate',
                valStr.length > 9
                  ? 'text-[19px] sm:text-[21px] xl:text-[20px] 2xl:text-[24px]'
                  : valStr.length > 5
                  ? 'text-[24px] sm:text-[27px] xl:text-[23px] 2xl:text-[28px]'
                  : 'text-[28px] sm:text-[32px]',
                highlightGrowth ? 'text-lh-accent' : 'text-lh-text'
              )}
              title={valStr}
            >
              {value}
            </h2>
          </div>
        </div>

        {/* Comparativo de período com semântica estrita e sem corte de texto */}
        {(comparison || subtitle) && (
          <div className="mt-2.5 pt-1.5 flex flex-wrap items-center gap-1.5 text-xs min-w-0">
            {comparison ? (
              <>
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-lh-sm text-[10px] shrink-0',
                    comparison.trend === 'up' && 'text-lh-accent bg-lh-accent-soft border border-lh-accent-border',
                    comparison.trend === 'down' && 'text-lh-danger bg-lh-danger-soft border border-lh-danger/20',
                    comparison.trend === 'neutral' && 'text-lh-text-muted bg-lh-bg-subtle border border-lh-border'
                  )}
                >
                  {comparison.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                  {comparison.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                  {comparison.trend === 'neutral' && <Minus className="w-3 h-3" />}
                  {comparison.value}
                </span>
                <span className="text-lh-text-muted text-[11px] truncate flex-1 min-w-0" title={comparison.text}>
                  {comparison.text}
                </span>
              </>
            ) : (
              <span className="text-lh-text-muted text-[11px] truncate flex-1 min-w-0" title={subtitle}>
                {subtitle}
              </span>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
