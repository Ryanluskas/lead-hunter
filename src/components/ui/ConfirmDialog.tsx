'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  confirmText?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'primary' | 'success';
  variant?: 'danger' | 'primary' | 'success';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
}

/** Substitui `window.confirm` com um diálogo acessível e consistente. */
export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  confirmText = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone,
  variant = 'danger',
  isLoading,
  onConfirm,
  onCancel,
  onClose,
  children,
}: ConfirmDialogProps) {
  const handleClose = onCancel || onClose || (() => {});
  const finalConfirmText = confirmLabel || confirmText;
  const finalVariant = tone || variant;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      maxWidth="md"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant={finalVariant} onClick={onConfirm} isLoading={isLoading}>
            {finalConfirmText}
          </Button>
        </>
      }
    >
      {description && <p className="text-sm text-lh-text-secondary leading-relaxed">{description}</p>}
      {children}
    </Modal>
  );
}
