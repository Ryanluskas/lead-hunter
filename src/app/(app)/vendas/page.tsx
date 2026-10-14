'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency, formatDate } from '@/lib/utils';

type Deal = {
  id: string;
  title: string;
  contractDate: string;
  closedValue: number;
  receivedValue: number;
  paymentStatus: string;
  lead: { id: string; businessName: string; city: string };
};

export default function VendasPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [totals, setTotals] = useState({ totalContracted: 0, totalReceived: 0, totalPending: 0, count: 0 });
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
      setTotals(json.totals || { totalContracted: 0, totalReceived: 0, totalPending: 0, count: 0 });
    } catch {
      addToast({ title: 'Erro ao carregar vendas', description: 'Não foi possível buscar os contratos fechados.', type: 'error' });
    } finally {
      setLoading(false);
    }
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
      addToast({ title: 'Venda registrada', description: `${formatCurrency(parseFloat(closedValue))} adicionado ao faturamento.`, type: 'success' });
      fetchDeals();
    } catch (err: unknown) {
      addToast({ title: 'Erro ao registrar venda', description: err instanceof Error ? err.message : 'Verifique os dados preenchidos.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsPaid = async (dealId: string, fullValue: number) => {
    await fetch('/api/deals', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: dealId, paymentStatus: 'pago_total', receivedValue: fullValue }) });
    addToast({ title: 'Contrato quitado', description: 'Pagamento atualizado com sucesso.', type: 'success' });
    fetchDeals();
  };

  const statusLabel = (status: string) => status === 'pago_total' ? 'Pago' : status === 'pago_parcial' ? 'Parcial' : 'Pendente';
  const kpis = [
    ['Contratado', totals.totalContracted],
    ['Recebido', totals.totalReceived],
    ['A receber', totals.totalPending],
    ['Ticket médio', totals.count > 0 ? totals.totalContracted / totals.count : 0],
  ] as const;

  return (
    <main className="min-h-screen bg-[#070708] px-8 py-8 text-zinc-100">
      <div className="mx-auto max-w-[1120px]">
        <header className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-[28px] font-semibold leading-none tracking-[-0.03em] text-zinc-100">Vendas</h1>
            <p className="mt-2 text-[13px] text-zinc-500">Contratos fechados, recebido e a receber.</p>
          </div>
          <Button className="h-9 rounded-md bg-zinc-100 px-4 text-[13px] font-semibold text-zinc-950 hover:bg-zinc-200" onClick={() => setNewDealModalOpen(true)}>
            Nova venda
          </Button>
        </header>

        <section className="mt-10 grid grid-cols-2 divide-x divide-zinc-800 border-y border-zinc-800 md:grid-cols-4" aria-label="Indicadores financeiros">
          {kpis.map(([label, value]) => (
            <div key={label} className="px-5 py-5 first:pl-0 md:first:pl-0">
              <p className="text-xs text-zinc-500">{label}</p>
              <p className="mt-2 text-[32px] font-semibold leading-none tracking-[-0.04em] tabular-nums text-zinc-100">{formatCurrency(value)}</p>
            </div>
          ))}
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-zinc-100">Histórico</h2>
            <span className="text-xs text-zinc-600">{totals.count || 0} contratos</span>
          </div>
          {loading ? (
            <div className="border-t border-zinc-800 py-5"><Skeleton className="h-[72px] w-full" /></div>
          ) : (
            <div className="overflow-x-auto border-t border-zinc-800">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                    <th className="py-3 pr-4 font-normal">Empresa</th>
                    <th className="px-4 py-3 font-normal">Valor</th>
                    <th className="px-4 py-3 font-normal">Recebido</th>
                    <th className="px-4 py-3 font-normal">Status</th>
                    <th className="py-3 pl-4 font-normal">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.length === 0 ? (
                    <tr><td colSpan={5} className="h-[72px] text-center text-[13px] text-zinc-600">Nenhuma venda.</td></tr>
                  ) : deals.map((deal) => (
                    <tr key={deal.id} className="border-b border-zinc-900 text-[13px] text-zinc-300">
                      <td className="py-4 pr-4"><Link className="text-zinc-100 hover:underline" href={`/leads/${deal.lead.id}`}>{deal.lead.businessName}</Link></td>
                      <td className="px-4 py-4 tabular-nums">{formatCurrency(deal.closedValue)}</td>
                      <td className="px-4 py-4 tabular-nums">{formatCurrency(deal.receivedValue)}</td>
                      <td className="px-4 py-4">{statusLabel(deal.paymentStatus)}</td>
                      <td className="py-4 pl-4 tabular-nums text-zinc-500">{formatDate(deal.contractDate)}{deal.paymentStatus !== 'pago_total' && <button className="ml-4 text-zinc-400 underline-offset-4 hover:text-zinc-100 hover:underline" onClick={() => handleMarkAsPaid(deal.id, deal.closedValue)}>Quitar</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <Modal isOpen={newDealModalOpen} onClose={() => setNewDealModalOpen(false)} title="Registrar nova venda" description="Preencha os dados do contrato." maxWidth="lg">
        <form onSubmit={handleCreateDeal} className="flex flex-col gap-4">
          <Select label="Prospect / Cliente *" value={selectedLeadId} onChange={(e) => setSelectedLeadId(e.target.value)}>{leadsList.map((l) => <option key={l.id} value={l.id}>{l.businessName} ({l.category} - {l.city})</option>)}</Select>
          <Input label="Título do escopo vendido" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Input label="Valor fechado (R$) *" type="number" value={closedValue} onChange={(e) => setClosedValue(e.target.value)} required /><Input label="Valor já recebido" type="number" value={receivedValue} onChange={(e) => setReceivedValue(e.target.value)} /></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Select label="Status do pagamento" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}><option value="pago_parcial">Pago parcial</option><option value="pago_total">Totalmente quitado</option><option value="pendente">Pendente</option></Select><Input label="Previsão do saldo final" type="date" value={expectedPaymentDate} onChange={(e) => setExpectedPaymentDate(e.target.value)} /></div>
          <Textarea label="Observações do contrato" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4"><Button type="button" variant="secondary" onClick={() => setNewDealModalOpen(false)}>Cancelar</Button><Button type="submit" className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200" isLoading={submitting}>Salvar venda</Button></div>
        </form>
      </Modal>
    </main>
  );
}
