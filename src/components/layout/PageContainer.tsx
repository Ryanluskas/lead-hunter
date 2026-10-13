'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pageVariants } from '@/lib/motion';

export interface PageContainerProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({
  title,
  description,
  action,
  children,
  className,
}: PageContainerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reduceMotion ? undefined : pageVariants}
      initial={reduceMotion ? undefined : 'initial'}
      animate={reduceMotion ? undefined : 'animate'}
      exit={reduceMotion ? undefined : 'exit'}
      className={cn('p-4 sm:p-6 md:p-8 max-w-[1536px] w-full mx-auto space-y-6', className)}
    >
      {/* Header da Página com tipografia e espaçamento executivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-tight text-lh-text">
            {title}
          </h1>
          {description && (
            <p className="text-[13px] sm:text-sm text-lh-text-secondary mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="flex items-center gap-2.5 shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Conteúdo Principal */}
      <div>{children}</div>
    </motion.div>
  );
}
