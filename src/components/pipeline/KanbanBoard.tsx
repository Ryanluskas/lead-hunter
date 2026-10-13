'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Phone,
  Globe,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';

export interface KanbanLead {
  id: string;
  businessName: string;
  category: string;
  city: string;
  score: number;
  status: string;
  phone?: string | null;
  website?: string | null;
  notes?: string | null;
  lossReason?: string | null;
}

export const KANBAN_STAGES = [
  { id: 'novo', name: 'Novo', color: 'border-t-lh-border-strong' },
  { id: 'em_verificacao', name: 'Em Verificação', color: 'border-t-lh-primary-border' },
  { id: 'qualificado', name: 'Qualificado', color: 'border-t-lh-warning' },
  { id: 'contato_pendente', name: 'Contato Pendente', color: 'border-t-lh-primary-border' },
  { id: 'contatado', name: 'Contatado', color: 'border-t-lh-primary' },
  { id: 'interessado', name: 'Interessado', color: 'border-t-lh-primary' },
  { id: 'reuniao_agendada', name: 'Reunião Agendada', color: 'border-t-lh-primary-text' },
  { id: 'proposta_enviada', name: 'Proposta Enviada', color: 'border-t-lh-primary-text' },
  { id: 'em_negociacao', name: 'Em Negociação', color: 'border-t-lh-warning' },
  { id: 'vendido', name: 'Vendido', color: 'border-t-lh-accent' },
  { id: 'perdido', name: 'Perdido', color: 'border-t-lh-danger' },
];

export function KanbanBoard({
  initialLeads,
  onStatusChange,
}: {
  initialLeads: KanbanLead[];
  onStatusChange?: (leadId: string, newStatus: string, lossReason?: string) => void;
}) {
  const [leads, setLeads] = useState<KanbanLead[]>(initialLeads);
  const [lossModalLead, setLossModalLead] = useState<KanbanLead | null>(null);
  const [lossReasonText, setLossReasonText] = useState('');

  const moveStage = async (lead: KanbanLead, direction: 'next' | 'prev') => {
    const currentIndex = KANBAN_STAGES.findIndex((s) => s.id === lead.status);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex < 0 || targetIndex >= KANBAN_STAGES.length) return;

    const targetStage = KANBAN_STAGES[targetIndex].id;

    if (targetStage === 'perdido') {
      setLossModalLead(lead);
      return;
    }

    updateLeadStatus(lead.id, targetStage);
  };

  const updateLeadStatus = async (leadId: string, newStatus: string, lossReason?: string) => {
    // Atualização otimista
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, status: newStatus, lossReason: lossReason || l.lossReason } : l
      )
    );

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, lossReason }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar etapa');
      if (onStatusChange) onStatusChange(leadId, newStatus, lossReason);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmLoss = () => {
    if (!lossModalLead) return;
    updateLeadStatus(lossModalLead.id, 'perdido', lossReasonText || 'Cliente declinou a proposta');
    setLossModalLead(null);
    setLossReasonText('');
  };

  return (
    <div className="w-full">
      {/* Scroll horizontal fluido para as 11 colunas */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 select-none min-h-[600px] scrollbar-thin">
        {KANBAN_STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);

          return (
            <div
              key={stage.id}
              className={`w-72 shrink-0 bg-lh-surface-alt rounded-xl border border-lh-border-subtle border-t-4 ${stage.color} p-3 flex flex-col`}
            >
              {/* Cabeçalho da Coluna */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-semibold text-lh-text truncate">{stage.name}</span>
                <span className="text-[11px] font-semibold text-lh-text-muted bg-lh-surface px-2 py-0.5 rounded-full border border-lh-border lh-tabular">
                  {stageLeads.length}
                </span>
              </div>

              {/* Lista de Cartões */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[700px] pr-1">
                {stageLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="bg-lh-surface rounded-xl border border-lh-border/80 p-3.5 shadow-lh-card lh-card-interactive flex flex-col justify-between group"
                  >
                    <div>
                      {/* Categoria e Score */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-medium text-lh-text-muted truncate">
                          {lead.category}
                        </span>
                        <Badge
                          variant={lead.score >= 80 ? 'primary' : lead.score >= 60 ? 'warning' : 'neutral'}
                          size="sm"
                          className="font-semibold text-[10px] lh-tabular"
                        >
                          ★ {lead.score} pts
                        </Badge>
                      </div>

                      {/* Nome do Prospect */}
                      <Link
                        href={`/leads/${lead.id}`}
                        className="text-xs font-semibold text-lh-text hover:text-lh-primary transition-colors line-clamp-2"
                      >
                        {lead.businessName}
                      </Link>

                      <p className="text-[11px] text-lh-text-muted mt-1">{lead.city}</p>

                      {lead.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-lh-text-secondary mt-2">
                          <Phone className="w-3 h-3 text-lh-text-muted" />
                          <span>{lead.phone}</span>
                        </div>
                      )}

                      {lead.website ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-lh-primary mt-1 truncate">
                          <Globe className="w-3 h-3 text-lh-text-muted shrink-0" />
                          <span className="truncate">{lead.website}</span>
                        </div>
                      ) : (
                        <span className="inline-block text-[10px] text-lh-warning font-medium mt-1">
                          Sem website informado
                        </span>
                      )}

                      {lead.lossReason && (
                        <div className="mt-2 p-1.5 bg-lh-danger-soft text-[10px] text-lh-danger-text rounded border border-lh-danger/20">
                          Motivo: {lead.lossReason}
                        </div>
                      )}
                    </div>

                    {/* Controles de Navegação de Etapas */}
                    <div className="mt-3 pt-2.5 border-t border-lh-border-subtle flex items-center justify-between text-xs">
                      <button
                        onClick={() => moveStage(lead, 'prev')}
                        disabled={stage.id === KANBAN_STAGES[0].id}
                        className="p-1 text-lh-text-muted hover:text-lh-text hover:bg-lh-bg rounded disabled:opacity-20 cursor-pointer transition-colors"
                        title="Etapa anterior"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <Link
                        href={`/leads/${lead.id}`}
                        className="text-[10px] text-lh-text-muted hover:text-lh-primary font-medium transition-colors"
                      >
                        Ver Detalhes
                      </Link>

                      <button
                        onClick={() => moveStage(lead, 'next')}
                        disabled={stage.id === KANBAN_STAGES[KANBAN_STAGES.length - 1].id}
                        className="p-1 text-lh-text-muted hover:text-lh-text hover:bg-lh-bg rounded disabled:opacity-20 cursor-pointer transition-colors"
                        title="Próxima etapa"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="h-32 border border-dashed border-lh-border rounded-xl flex items-center justify-center text-xs text-lh-text-muted">
                    Nenhum prospect nesta etapa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal para Registrar Motivo da Perda */}
      <Modal
        isOpen={Boolean(lossModalLead)}
        onClose={() => setLossModalLead(null)}
        title="Registrar Oportunidade Perdida"
        description="Mapear o motivo da perda ajuda a refinar futuras abordagens comerciais"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-lh-text-secondary">
            Prospect: <strong className="text-lh-text">{lossModalLead?.businessName}</strong>
          </p>

          <Textarea
            label="Motivo do Descarte ou Perda"
            value={lossReasonText}
            onChange={(e) => setLossReasonText(e.target.value)}
            placeholder="Ex: Cliente fechou com sobrinho, não possui verba no momento, optou por continuar apenas no Instagram."
            rows={3}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setLossModalLead(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmLoss}>
              Confirmar como Perdido
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
