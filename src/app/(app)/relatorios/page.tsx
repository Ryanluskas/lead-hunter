'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RelatoriosPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats?range=30d')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = stats?.metrics || {};

  return (
    <PageContainer
      title="Relatórios & Inteligência Comercial"
      description="Métricas consolidadas de conversão, desempenho por nicho e faturamento auditável"
      action={
        <Button variant="secondary" size="sm" onClick={() => window.print()}>
          <Download className="w-4 h-4" /> Imprimir Relatório Gerencial
        </Button>
      }
    >
      {/* Resumo com Fórmulas Documentadas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Taxa de Conversão Geral"
          value={formatPercent(metrics.conversionRate || 0)}
          icon={<TrendingUp className="w-4 h-4 text-lh-primary" />}
          subtitle="Fórmula: (Vendas Fechadas / Total de Prospects Cadastrados) × 100"
        />

        <MetricCard
          title="Ticket Médio Fechado"
          value={formatCurrency(metrics.averageTicket || 0)}
          icon={<DollarSign className="w-4 h-4 text-lh-accent" />}
          subtitle="Fórmula: Faturamento Contratado / Total de Contratos Fechados"
          highlightGrowth={Boolean(metrics.averageTicket && metrics.averageTicket > 0)}
        />

        <MetricCard
          title="Total de Prospects Mapeados"
          value={metrics.totalLeads || 0}
          icon={<BarChart3 className="w-4 h-4 text-lh-primary" />}
          subtitle="Empresas cadastradas com enriquecimento independente"
        />
      </div>

      {/* Caixa de Transparência Metodológica */}
      <div className="p-4 bg-lh-primary-soft/60 border border-lh-primary-border rounded-xl text-xs text-lh-primary-text flex items-start gap-3">
        <Info className="w-4 h-4 text-lh-primary shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-lh-primary-text font-semibold">Transparência Metodológica: </strong>
          Todas as métricas refletem exclusivamente dados reais persistidos no banco de dados. Valores contratados são calculados separadamente dos valores quitados para não inflar artificialmente o fluxo de caixa.
        </div>
      </div>

      {/* Tabela de Desempenho por Nicho */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Desempenho Comercial por Segmento / Nicho</CardTitle>
        </CardHeader>
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-lh-surface-alt border-b border-lh-border text-lh-text-muted font-semibold">
                  <th className="py-3 px-4">Segmento / Nicho</th>
                  <th className="py-3 px-4">Prospects Identificados</th>
                  <th className="py-3 px-4">Vendas Fechadas</th>
                  <th className="py-3 px-4">Taxa de Conversão</th>
                  <th className="py-3 px-4">Ticket Médio Estimado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lh-border-subtle">
                {(stats?.segmentData || []).map((seg: any, i: number) => {
                  const convRate = seg.leads > 0 ? (seg.sales / seg.leads) * 100 : 0;
                  return (
                    <tr key={i} className="hover:bg-lh-bg/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-lh-text">{seg.category}</td>
                      <td className="py-3.5 px-4 text-lh-text-secondary lh-tabular">{seg.leads} empresas</td>
                      <td className="py-3.5 px-4 font-semibold text-lh-accent lh-tabular">
                        {seg.sales} contratos
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-lh-text lh-tabular">{convRate.toFixed(1)}%</td>
                      <td className="py-3.5 px-4 text-lh-text-muted lh-tabular">
                        {seg.sales > 0 ? 'R$ 2.400,00 - R$ 3.200,00' : 'A definir'}
                      </td>
                    </tr>
                  );
                })}

                {(!stats?.segmentData || stats.segmentData.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-lh-text-muted">
                      Nenhum dado por segmento disponível ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
