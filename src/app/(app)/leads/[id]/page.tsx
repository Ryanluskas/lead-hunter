'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { formatDate, formatDateTime, formatCurrency } from '@/lib/utils';
import {
  Phone,
  Globe,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  Clock,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KANBAN_STAGES } from '@/components/pipeline/KanbanBoard';

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Formulário de nova atividade / nota
  const [activityTitle, setActivityTitle] = useState('');
  const [activityType, setActivityType] = useState('whatsapp');

  // Formulário de nova tarefa
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');

  const fetchLead = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/leads/${params.id}`);
      if (!res.ok) throw new Error('Lead não encontrado');
      const json = await res.json();
      setLead(json.lead);
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Erro ao carregar prospect',
        description: 'Não foi possível encontrar os dados deste lead.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [params.id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar etapa');
      addToast({
        title: 'Etapa atualizada',
        description: `Lead alterado para a etapa comercial correspondente.`,
        type: 'success',
      });
      fetchLead();
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível alterar a etapa comercial.',
        type: 'error',
      });
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTitle.trim()) return;

    try {
      await fetch(`/api/leads/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: `${lead.notes || ''}\n[${activityType.toUpperCase()}] ${activityTitle.trim()}` }),
      });
      setActivityTitle('');
      addToast({
        title: 'Interação registrada',
        description: 'Histórico comercial atualizado com sucesso.',
        type: 'success',
      });
      fetchLead();
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Erro ao salvar interação',
        type: 'error',
      });
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskTitle.trim(),
          dueDate: taskDueDate || null,
          leadId: params.id,
          priority: 'alta',
        }),
      });
      if (!res.ok) throw new Error('Falha ao criar tarefa');
      setTaskTitle('');
      setTaskDueDate('');
      addToast({
        title: 'Lembrete adicionado',
        description: 'Tarefa agendada para acompanhamento deste prospect.',
        type: 'success',
      });
      fetchLead();
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Erro ao criar tarefa',
        type: 'error',
      });
    }
  };

  const handleDeleteLead = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/leads/${params.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir');
      addToast({
        title: 'Prospect removido',
        description: 'O lead foi excluído com sucesso do CRM.',
        type: 'info',
      });
      router.push('/leads');
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Erro ao excluir prospect',
        type: 'error',
      });
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Carregando prospect..." description="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 w-full" />
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!lead) {
    return (
      <PageContainer title="Prospect não encontrado" description="">
        <Card className="p-12 text-center">
          <p className="text-sm text-lh-text-muted mb-4">O registro comercial solicitado não existe ou foi removido.</p>
          <Link href="/leads">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4" /> Voltar para a lista de prospects
            </Button>
          </Link>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={lead.businessName}
      description={`Cadastrado em ${formatDate(lead.createdAt)} via ${lead.source}`}
      action={
        <div className="flex items-center gap-2">
          <Link
            href={`/ia?businessName=${encodeURIComponent(lead.businessName)}&category=${encodeURIComponent(
              lead.category
            )}&city=${encodeURIComponent(lead.city)}&leadId=${lead.id}`}
          >
            <Button variant="primary" size="sm">
              <Sparkles className="w-4 h-4" /> Assistente Comercial Gemini
            </Button>
          </Link>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-lh-danger hover:border-lh-danger/40"
            title="Excluir do CRM"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      }
    >
      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Ficha Cadastral e Dados Independentes */}
        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-lh-border-subtle">
              <span className="text-xs font-semibold text-lh-text-muted">Etapa no Funil:</span>
              <Select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-44 text-xs font-semibold"
              >
                {KANBAN_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Score e Justificativa */}
            <div className="p-3.5 bg-lh-primary-soft/60 rounded-xl border border-lh-primary-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-lh-primary">Pontuação de Oportunidade</span>
                <span className="text-base font-bold text-lh-primary lh-tabular">★ {lead.score}/100</span>
              </div>
              {lead.scoreRationale && (
                <p className="text-[11px] text-lh-text-secondary mt-1.5 leading-relaxed">
                  {lead.scoreRationale}
                </p>
              )}
            </div>

            {/* Dados Cadastrais */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-lh-text-muted block text-[11px]">Segmento</span>
                <span className="font-semibold text-lh-text">{lead.category}</span>
              </div>

              <div>
                <span className="text-lh-text-muted block text-[11px]">Localização</span>
                <span className="text-lh-text">
                  {lead.address ? `${lead.address}, ` : ''}{lead.city} - {lead.state}
                </span>
              </div>

              <div>
                <span className="text-lh-text-muted block text-[11px]">Telefone / WhatsApp</span>
                <span className="text-lh-text font-medium">{lead.phone || 'Não informado'}</span>
              </div>

              <div>
                <span className="text-lh-text-muted block text-[11px]">Website Verificado</span>
                {lead.website ? (
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lh-primary hover:underline flex items-center gap-1 font-medium"
                  >
                    <Globe className="w-3.5 h-3.5" /> {lead.website}
                  </a>
                ) : (
                  <Badge variant="primary" size="sm">
                    Sem website oficial
                  </Badge>
                )}
              </div>

              {lead.website && (
                <Link href={`/auditorias?url=${encodeURIComponent(lead.website)}&leadId=${lead.id}`}>
                  <Button variant="secondary" size="sm" className="w-full mt-2">
                    <ShieldCheck className="w-4 h-4 text-lh-primary" /> Executar Nova Auditoria
                  </Button>
                </Link>
              )}
            </div>
          </Card>

          {/* Tarefas Pendentes Vinculadas */}
          <Card className="p-5">
            <h4 className="text-xs font-bold text-lh-text mb-3">Lembretes & Tarefas</h4>
            <div className="space-y-2 mb-4">
              {lead.tasks?.map((t: any) => (
                <div
                  key={t.id}
                  className="p-2.5 rounded-lg bg-lh-surface-alt border border-lh-border-subtle text-xs flex items-center justify-between"
                >
                  <span className="font-medium text-lh-text">{t.title}</span>
                  <span className="text-[10px] text-lh-text-muted lh-tabular">{formatDate(t.dueDate)}</span>
                </div>
              ))}
              {(!lead.tasks || lead.tasks.length === 0) && (
                <p className="text-xs text-lh-text-muted">Nenhum lembrete pendente para este prospect.</p>
              )}
            </div>

            <form onSubmit={handleCreateTask} className="space-y-2 pt-2 border-t border-lh-border-subtle">
              <Input
                placeholder="Ex: Ligar para decisor às 15h"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <Input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
              />
              <Button type="submit" variant="secondary" size="sm" className="w-full">
                <Plus className="w-3.5 h-3.5" /> Adicionar Tarefa
              </Button>
            </form>
          </Card>
        </div>

        {/* Coluna Central e Direita: Linha do Tempo e Vendas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendas / Contratos Fechados */}
          {lead.deals && lead.deals.length > 0 && (
            <Card className="p-5 bg-lh-accent-soft/70 border-lh-accent-border">
              <h4 className="text-xs font-bold text-lh-accent-text uppercase tracking-wider mb-2">
                Contrato Fechado
              </h4>
              {lead.deals.map((d: any) => (
                <div key={d.id} className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-lh-text">{d.title}</h5>
                    <p className="text-xs text-lh-text-muted">Contrato assinado em {formatDate(d.contractDate)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-lh-accent lh-tabular">
                      {formatCurrency(d.closedValue)}
                    </span>
                    <span className="block text-[11px] text-lh-text-muted">
                      Status: {d.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </Card>
          )}

          {/* Histórico Cronológico de Atividades */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Interações & Atividades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="divide-y divide-lh-border-subtle">
                {lead.activities?.map((act: any) => (
                  <div key={act.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-lh-primary-soft text-lh-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-semibold text-lh-text">{act.title}</h5>
                        <span className="text-[10px] text-lh-text-muted lh-tabular">
                          {formatDateTime(act.createdAt)}
                        </span>
                      </div>
                      {act.description && (
                        <p className="text-xs text-lh-text-secondary mt-1 leading-relaxed">
                          {act.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {(!lead.activities || lead.activities.length === 0) && (
                  <p className="py-4 text-xs text-lh-text-muted text-center">
                    Nenhuma interação anterior registrada neste prospect.
                  </p>
                )}
              </div>

              {/* Registro de Nova Nota / Contato */}
              <form onSubmit={handleCreateActivity} className="pt-4 border-t border-lh-border-subtle space-y-3">
                <Input
                  label="Registrar Nova Interação"
                  placeholder="Ex: Liguei e proprietário pediu proposta por WhatsApp"
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                />
                <Button type="submit" variant="secondary" size="sm">
                  Salvar Interação no Histórico
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmação de Exclusão */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteLead}
        title="Excluir Prospect do CRM"
        description={`Deseja realmente remover permanentemente o prospect "${lead.businessName}"? Esta ação removerá o histórico e as tarefas associadas.`}
        confirmText="Excluir Definitivamente"
        variant="danger"
        isLoading={isDeleting}
      />
    </PageContainer>
  );
}
