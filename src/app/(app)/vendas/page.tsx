'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, CheckCircle2, Clock3, CreditCard, DollarSign, Plus, Target, TrendingUp, Trophy } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency, formatDate } from '@/lib/utils';

const kpis = [
  { key: 'totalContracted', label: 'Faturamento Contratado', hint: 'Valor total em contratos', icon: DollarSign, tone: 'gold' },
  { key: 'totalReceived', label: 'Receita Realizada (Recebido)', hint: 'Dinheiro já no caixa', icon: CheckCircle2, tone: 'emerald' },
  { key: 'totalPending', label: 'Saldo a Receber', hint: 'Próximo dinheiro a entrar', icon: Clock3, tone: 'red' },
  { key: 'average', label: 'Ticket Médio Fechado', hint: 'Média por contrato', icon: TrendingUp, tone: 'gold' },
] as const;

export default function VendasPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>({ totalContracted: 0, totalReceived: 0, totalPending: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [newDealModalOpen, setNewDealModalOpen] = useState(false);
  const [leadsList, setLeadsList] = useState<any[]>([]);
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
    } catch {
      addToast({ title: 'Erro ao carregar vendas', description: 'Não foi possível buscar os contratos fechados.', type: 'error' });
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchDeals();
    fetch('/api/leads').then((res) => res.json()).then((json) => {
      setLeadsList(json.leads || []);
      if (json.leads?.[0]) setSelectedLeadId(json.leads[0].id);
    }).catch(() => undefined);
  }, []);

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !closedValue) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/deals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId: selectedLeadId, title, closedValue: parseFloat(closedValue), receivedValue: parseFloat(receivedValue || '0'), paymentStatus, expectedPaymentDate: expectedPaymentDate || null, notes }) });
      if (!res.ok) throw new Error('Falha ao registrar venda');
      setNewDealModalOpen(false);
      addToast({ title: 'Contrato no placar', description: `${formatCurrency(parseFloat(closedValue))} adicionado ao faturamento.`, type: 'success' });
      fetchDeals();
    } catch (err: unknown) {
      addToast({ title: 'Erro ao registrar venda', description: err instanceof Error ? err.message : 'Verifique os dados preenchidos.', type: 'error' });
    } finally { setSubmitting(false); }
  };

  const handleMarkAsPaid = async (dealId: string, fullValue: number) => {
    await fetch('/api/deals', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: dealId, paymentStatus: 'pago_total', receivedValue: fullValue }) });
    addToast({ title: 'Contrato quitado', description: 'Mais dinheiro realizado no caixa.', type: 'success' });
    fetchDeals();
  };

  const statusBadge = (status: string) => status === 'pago_total' ? <span className="sales-badge sales-badge-gold"><Check className="h-3 w-3" /> Fechado</span> : status === 'pago_parcial' ? <span className="sales-badge sales-badge-amber"><Clock3 className="h-3 w-3" /> Parcial</span> : <span className="sales-badge sales-badge-red">Pendente</span>;

  return (
    <div className="sales-page">
      <PageContainer title="Gestão de Vendas & Faturamento" description="O cockpit financeiro de quem transforma oportunidade em dinheiro." action={<Button variant="primary" size="sm" onClick={() => setNewDealModalOpen(true)}><Plus className="h-4 w-4" /> Registrar Nova Venda</Button>}>
        <div className="sales-kicker"><span className="sales-live-dot" /> SALA DE RECEITA <span className="sales-kicker-line" /> PERFORMANCE EM TEMPO REAL</div>
        <section className="sales-kpis" aria-label="Indicadores financeiros">
          {kpis.map(({ key, label, hint, icon: Icon, tone }) => {
            const value = key === 'average' ? (totals.count > 0 ? totals.totalContracted / totals.count : 0) : totals[key] || 0;
            return <article key={key} className={`sales-kpi sales-kpi-${tone}`}><div className="sales-kpi-top"><span>{label}</span><div className="sales-kpi-icon"><Icon className="h-4 w-4" /></div></div><strong>{formatCurrency(value)}</strong><small>{hint}</small></article>;
          })}
        </section>

        <section className="sales-history">
          <div className="sales-section-head"><div><div className="sales-eyebrow"><Trophy className="h-3.5 w-3.5" /> PLACAR DE FECHAMENTOS</div><h2>Histórico de Vendas Realizadas</h2></div><span className="sales-count">{totals.count || 0} CONTRATOS</span></div>
          {loading ? <div className="p-6 space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-12 w-full" /></div> : deals.length === 0 ? <div className="sales-empty"><div className="sales-empty-icon"><CreditCard className="h-7 w-7" /></div><p className="sales-empty-title">Ainda zero no placar.</p><p className="sales-empty-subtitle">O próximo deal começa agora.</p><p className="sales-empty-copy">Toda grande operação começa com um primeiro contrato assinado.</p><Button variant="primary" onClick={() => setNewDealModalOpen(true)}><Plus className="h-4 w-4" /> Fechar o Primeiro</Button></div> : <div className="overflow-x-auto"><table className="sales-table"><thead><tr><th>Contrato / Projeto</th><th>Cliente</th><th>Data</th><th>Valor contratado</th><th>Recebido</th><th>Status</th><th /></tr></thead><tbody>{deals.map((deal) => <tr key={deal.id}><td><strong>{deal.title}</strong></td><td><Link href={`/leads/${deal.lead.id}`}>{deal.lead.businessName}</Link><small>{deal.lead.city}</small></td><td>{formatDate(deal.contractDate)}</td><td className="sales-money">{formatCurrency(deal.closedValue)}</td><td className="sales-realized">{formatCurrency(deal.receivedValue)}</td><td>{statusBadge(deal.paymentStatus)}</td><td className="text-right">{deal.paymentStatus !== 'pago_total' && <button className="sales-quiet-button" onClick={() => handleMarkAsPaid(deal.id, deal.closedValue)}><Check className="h-3.5 w-3.5" /> Quitar</button>}</td></tr>)}</tbody></table></div>}
        </section>

        <div className="sales-target"><div className="sales-target-icon"><Target className="h-5 w-5" /></div><div className="flex-1"><div className="flex items-center justify-between gap-4"><div><p className="sales-eyebrow">META DO MÊS</p><h3>Rumo ao próximo nível</h3></div><strong>0%</strong></div><div className="sales-progress"><span /></div><small>Registre seu primeiro fechamento para começar a contar.</small></div></div>
      </PageContainer>

      <Modal isOpen={newDealModalOpen} onClose={() => setNewDealModalOpen(false)} title="Registrar Novo Contrato" description="Coloque mais uma vitória no placar." maxWidth="lg"><form onSubmit={handleCreateDeal} className="space-y-4"><Select label="Prospect / Cliente *" value={selectedLeadId} onChange={(e) => setSelectedLeadId(e.target.value)}>{leadsList.map((l) => <option key={l.id} value={l.id}>{l.businessName} ({l.category} - {l.city})</option>)}</Select><Input label="Título do Escopo Vendido" value={title} onChange={(e) => setTitle(e.target.value)} required /><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Input label="Valor Fechado (R$) *" type="number" value={closedValue} onChange={(e) => setClosedValue(e.target.value)} required /><Input label="Valor Já Recebido" type="number" value={receivedValue} onChange={(e) => setReceivedValue(e.target.value)} /></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Select label="Status do Pagamento" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}><option value="pago_parcial">Pago Parcial</option><option value="pago_total">Totalmente Quitado</option><option value="pendente">Pendente</option></Select><Input label="Previsão do Saldo Final" type="date" value={expectedPaymentDate} onChange={(e) => setExpectedPaymentDate(e.target.value)} /></div><Textarea label="Observações do Contrato" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} /><div className="flex justify-end gap-3 pt-3 border-t border-lh-border-subtle"><Button type="button" variant="secondary" onClick={() => setNewDealModalOpen(false)}>Cancelar</Button><Button type="submit" variant="primary" isLoading={submitting}>Salvar no Placar</Button></div></form></Modal>
    </div>
  );
}
