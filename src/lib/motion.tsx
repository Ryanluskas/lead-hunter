'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants, type Transition } from 'framer-motion';

/**
 * ============================================================
 * LEAD HUNTER — Sistema Global de Animações (Apple Experience)
 * Centraliza tokens de movimento, presets, variantes e utilitários.
 * ============================================================
 */

export const motionTokens = {
  duration: {
    instant: 0.12,
    fast: 0.18,
    normal: 0.28,
    smooth: 0.42,
    entrance: 0.58,
  },
  ease: {
    smooth: [0.22, 1, 0.36, 1] as const,
    standard: [0.2, 0, 0, 1] as const,
    gentle: [0.25, 0.1, 0.25, 1] as const,
  },
  spring: {
    gentle: { type: 'spring', stiffness: 300, damping: 25 },
    snappy: { type: 'spring', stiffness: 450, damping: 30 },
    soft: { type: 'spring', stiffness: 200, damping: 22 },
  },
};

/**
 * Transição padrão de entrada para páginas inteiras.
 * Evita saltos no layout e assegura fluidez nativa.
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.smooth,
      ease: motionTokens.ease.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.standard,
    },
  },
};

/**
 * Entrada suave para seções de conteúdo.
 */
export const sectionVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.smooth,
      ease: motionTokens.ease.smooth,
    },
  },
};

/**
 * Contêiner com revelação coordenada (stagger) para grupos de itens.
 */
export const createStaggerContainer = (
  staggerChildren = 0.05,
  delayChildren = 0.02
): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const staggerContainer: Variants = createStaggerContainer();

/**
 * Item individual dentro de um grupo escalonado.
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.normal,
      ease: motionTokens.ease.smooth,
    },
  },
};

/**
 * Microinterações de cartões interativos.
 */
export const cardHoverVariants: Variants = {
  initial: { y: 0, opacity: 1 },
  hover: {
    y: -3,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.smooth,
    },
  },
  tap: {
    scale: 0.985,
    y: 0,
    transition: {
      duration: motionTokens.duration.instant,
    },
  },
};

/**
 * Botões com microinteração tátil estilo Apple.
 */
export const buttonTapTransition: Transition = {
  duration: motionTokens.duration.instant,
  ease: motionTokens.ease.standard,
};

/**
 * Modais com entrada desacelerada e backdrop translúcido.
 */
export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.97, y: 8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.normal,
      ease: motionTokens.ease.smooth,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 6,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.standard,
    },
  },
};

export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: motionTokens.duration.fast },
  },
  exit: {
    opacity: 0,
    transition: { duration: motionTokens.duration.instant },
  },
};

/**
 * Menus e Dropdowns flutuantes.
 */
export const dropdownVariants: Variants = {
  initial: { opacity: 0, scale: 0.96, y: -4 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.smooth,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -4,
    transition: {
      duration: motionTokens.duration.instant,
    },
  },
};

/**
 * Feedback de operação concluída (ex: checkmark animado de sucesso).
 */
export const feedbackScaleVariants: Variants = {
  initial: { scale: 0.7, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },
};

/**
 * -------------------------------------------------------------
 * Componente: ScrollReveal
 * Revelação suave de blocos conforme o usuário rola a página.
 * -------------------------------------------------------------
 */
export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
}

export function ScrollReveal({
  children,
  delay = 0,
  yOffset = 14,
  className,
  ...props
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: motionTokens.duration.smooth,
        ease: motionTokens.ease.smooth,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * -------------------------------------------------------------
 * Componente: AnimatedNumber
 * Animação contínua e suave de valores reais (0 -> valor final),
 * formatando moeda em BRL ou números sem saltos aleatórios.
 * Respeita estritamente prefers-reduced-motion.
 * -------------------------------------------------------------
 */
export interface AnimatedNumberProps {
  value: number | string;
  prefix?: string;
  suffix?: string;
  isCurrency?: boolean;
  className?: string;
}

export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  isCurrency = false,
  className,
}: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<number | null>(null);

  // Extrair número alvo
  let targetNumber = 0;
  if (typeof value === 'number') {
    targetNumber = value;
  } else {
    // Tenta extrair dígitos de strings como "R$ 1.250,00" ou "15.0%"
    const cleaned = String(value)
      .replace(/[^\d,-]/g, '')
      .replace(',', '.');
    targetNumber = parseFloat(cleaned) || 0;
  }

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(targetNumber);
      return;
    }

    let start = 0;
    const duration = 750; // ms
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Curva de desaceleração suave (easeOutCubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (targetNumber - start) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(targetNumber);
      }
    };

    const animFrame = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animFrame);
  }, [targetNumber, reduceMotion]);

  // Se o valor for string formatada e o displayValue ainda não rodou, exibe valor original
  if (displayValue === null || reduceMotion) {
    return <span className={className}>{String(value)}</span>;
  }

  let formatted = '';
  if (isCurrency) {
    formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(displayValue);
  } else if (Number.isInteger(targetNumber)) {
    formatted = Math.round(displayValue).toLocaleString('pt-BR');
  } else {
    formatted = displayValue.toFixed(1).replace('.', ',');
  }

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
