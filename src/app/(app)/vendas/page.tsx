'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  DollarSign,
  TrendingUp,
  Plus,
  CheckCircle,
  Clock,
  Check,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';

export default function VendasPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>({
    totalContracted: 0,
    totalReceived: 0,
    totalPending: 0,
    count: 0,
  });
  const [loading, setLoading] = useState(true);

  // Modal para cadastrar nova venda
  const [newDealModalOpen, setNewDealModalOpen] = useState(false);
  const [leadsList, setLeadsList] = useState<any[]>([]);

  // Campos do formulário
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [title, setTitle] = useState('Criação de Website Institucional + WhatsApp');
  const [closedValue, setClosedValue] = useState('2400');
  const [receivedValue, setReceivedValue] = useState('1200');
  const [paymentStatus, setPaymentStatus] = useState('pago_parcial');
  const [expectedPaymentDate, setExpectedPaymentDate] = useState('');
  const [notes, setNotes] = useState('50% de entrada pago via Pix.');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/deals');
      const json = await res.json();
      setDeals(json.deals || []);
      setTotals(json.totals || {});
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Erro ao carregar vendas',
        description: 'Não foi possível buscar os contratos fechados.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadsForSelect = async () => {
    try {
      const res = await fetch('/api/leads');
      const json = await res.json();
      setLeadsList(json.leads || []);
      if (json.leads && json.leads.length > 0) {
        setSelectedLeadId(json.leads[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeals();
    fetchLeadsForSelect();
  }, []);

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !closedValue) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLeadId,
          title,
          closedValue: parseFloat(closedValue),
          receivedValue: parseFloat(receivedValue || '0'),
          paymentStatus,
          expectedPaymentDate: expectedPaymentDate || null,
          notes,
        }),
      });

      if (!res.ok) throw new Error('Falha ao registrar venda');
      setNewDealModalOpen(false);
      addToast({
        title: 'Venda Registrada com Sucesso',
        description: `Contrato adicionado no valor de ${formatCurrency(parseFloat(closedValue))}.`,
        type: 'success',
      });
      fetchDeals();
    } catch (err: unknown) {
      addToast({
        title: 'Erro ao registrar venda',
        description: err instanceof Error ? err.message : 'Verifique os dados preenchidos.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsPaid = async (dealId: string, fullValue: number) => {
    try {
      await fetch('/api/deals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: dealId,
          paymentStatus: 'pago_total',
          receivedValue: fullValue,
        }),
      });
      addToast({
        title: 'Contrato Quitado',
        description: 'Status atualizado para integralmente quitado.',
        type: 'success',
      });
      fetchDeals();
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Erro ao quitar contrato',
        type: 'error',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pago_total':
        return <Badge variant="success">Quitado Integral</Badge>;
      case 'pago_parcial':
        return <Badge variant="warning">Entrada Paga (Parcial)</Badge>;
      default:
        return <Badge variant="danger">Pendente</Badge>;
    }
  };

  return (
    <PageContainer
      title="Gestão de Vendas & Faturamento"
      description="Acompanhamento de contratos fechados, faturamento contratado e receita efetivamente realizada"
      action={
        <Button variant="primary" size="sm" onClick={() => setNewDealModalOpen(true)}>
          <Plus className="w-4 h-4" /> Registrar Nova Venda
        </Button>
      }
    >
      {/* 4 Indicadores Financeiros Reais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Faturamento Contratado"
          value={formatCurrency(totals.totalContracted || 0)}
          icon={<DollarSign className="w-4 h-4 text-lh-primary" />}
          subtitle="Valor total acordado nos contratos"
        />

        <MetricCard
          title="Receita Realizada (Recebido)"
          value={formatCurrency(totals.totalReceived || 0)}
          icon={<CheckCircle className="w-4 h-4 text-lh-accent" />}
          subtitle="Valores quitados via Pix / TED"
          highlightGrowth={Boolean(totals.totalReceived && totals.totalReceived > 0)}
        />

        <MetricCard
          title="Saldo a Receber"
          value={formatCurrency(totals.totalPending || 0)}
          icon={<Clock className="w-4 h-4 text-lh-warning" />}
          subtitle="Valores pendentes na entrega"
        />

        <MetricCard
          title="Ticket Médio Fechado"
          value={formatCurrency(
            totals.count > 0 ? totals.totalContracted / totals.count : 0
          )}
          icon={<TrendingUp className="w-4 h-4 text-lh-primary" />}
          subtitle={`Total de ${totals.count || 0} contratos fechados`}
        />
      </div>

      {/* Tabela de Contratos e Vendas */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Histórico de Vendas Realizadas</CardTitle>
        </CardHeader>
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : deals.length === 0 ? (
          <EmptyState
            title="Nenhuma venda registrada ainda"
            description="Avance as negociações no funil comercial e registre seus contratos assinados para acompanhar faturamento e recebimentos."
            icon={CreditCard}
            action={
              <Button variant="primary" size="sm" onClick={() => setNewDealModalOpen(true)}>
                Registrar Primeiro Contrato
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-lh-surface-alt border-b border-lh-border text-lh-text-muted font-semibold">
                  <th className="py-3 px-4">Contrato / Projeto</th>
                  <th className="py-3 px-4">Cliente (Prospect)</th>
                  <th className="py-3 px-4">Data Venda</th>
                  <th className="py-3 px-4">Valor Contratado</th>
                  <th className="py-3 px-4">Valor Recebido</th>
                  <th className="py-3 px-4">Status Pagamento</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lh-border-subtle">
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-lh-bg/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-lh-text">{deal.title}</td>

                    <td className="py-3.5 px-4">
                      <Link
                        href={`/leads/${deal.lead.id}`}
                        className="font-medium text-lh-primary hover:underline"
                      >
                        {deal.lead.businessName}
                      </Link>
                      <span className="block text-[11px] text-lh-text-muted">{deal.lead.city}</span>
                    </td>

                    <td className="py-3.5 px-4 text-lh-text-secondary lh-tabular">{formatDate(deal.contractDate)}</td>

                    <td className="py-3.5 px-4 font-semibold text-lh-text lh-tabular">
                      {formatCurrency(deal.closedValue)}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-lh-accent lh-tabular">
                      {formatCurrency(deal.receivedValue)}
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(deal.paymentStatus)}</td>

                    <td className="py-3.5 px-4 text-right">
                      {deal.paymentStatus !== 'pago_total' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleMarkAsPaid(deal.id, deal.closedValue)}
                        >
                          <Check className="w-3.5 h-3.5 text-lh-accent" /> Marcar Quitado
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal de Cadastro de Venda */}
      <Modal
        isOpen={newDealModalOpen}
        onClose={() => setNewDealModalOpen(false)}
        title="Registrar Novo Contrato de Venda"
        description="Vincule a venda ao prospect para atualizar automaticamente as métricas"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateDeal} className="space-y-4">
          <Select
            label="Prospect / Cliente *"
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
          >
            {leadsList.map((l) => (
              <option key={l.id} value={l.id}>
                {l.businessName} ({l.category} - {l.city})
              </option>
            ))}
          </Select>

          <Input
            label="Título do Escopo Vendido"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Website Institucional Mobile-First + Botão WhatsApp"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Valor Fechado (R$) *"
              type="number"
              value={closedValue}
              onChange={(e) => setClosedValue(e.target.value)}
              placeholder="Ex: 2400"
              required
            />

            <Input
              label="Valor Já Recebido (Entrada)"
              type="number"
              value={receivedValue}
              onChange={(e) => setReceivedValue(e.target.value)}
              placeholder="Ex: 1200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Status do Pagamento"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="pago_parcial">Pago Parcial (Ex: 50% entrada)</option>
              <option value="pago_total">Totalmente Quitado (À vista)</option>
              <option value="pendente">Pendente de Pagamento</option>
            </Select>

            <Input
              label="Previsão do Saldo Final"
              type="date"
              value={expectedPaymentDate}
              onChange={(e) => setExpectedPaymentDate(e.target.value)}
            />
          </div>

          <Textarea
            label="Observações do Contrato"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Hospedagem inclusa por 1 ano, pagamento parcelado em 2x."
            rows={2}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-lh-border-subtle">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setNewDealModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Salvar Venda no Sistema
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
