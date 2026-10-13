'use client';

import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { FunnelChart } from '@/components/dashboard/FunnelChart';
import { SegmentChart } from '@/components/dashboard/SegmentChart';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Users,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d'>('30d');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stats?range=${period}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Falha ao carregar métricas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  const metrics = data?.metrics || {
    leadsFoundToday: 0,
    qualifiedMonth: 0,
    salesToday: 0,
    salesMonth: 0,
    revenueContractedMonth: 0,
    revenueReceivedMonth: 0,
    conversionRate: 0,
    averageTicket: 0,
  };

  return (
    <PageContainer
      title="Visão Geral"
      description="Acompanhe suas oportunidades e resultados comerciais em tempo real."
      action={
        <div className="flex items-center gap-2.5">
          {/* Seletor de Período Oficial */}
          <div className="bg-lh-surface p-1 rounded-lh-md border border-lh-border flex items-center gap-1 text-xs shadow-xs">
            <button
              onClick={() => setPeriod('7d')}
              className={`px-3 py-1.5 rounded-lh-sm font-medium transition-colors cursor-pointer ${
                period === '7d'
                  ? 'bg-lh-primary text-white font-semibold shadow-xs'
                  : 'text-lh-text-secondary hover:text-lh-text'
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setPeriod('30d')}
              className={`px-3 py-1.5 rounded-lh-sm font-medium transition-colors cursor-pointer ${
                period === '30d'
                  ? 'bg-lh-primary text-white font-semibold shadow-xs'
                  : 'text-lh-text-secondary hover:text-lh-text'
              }`}
            >
              Este Mês
            </button>
          </div>

          <Link href="/leads/buscar">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-1.5" /> Buscar Empresas
            </Button>
          </Link>
        </div>
      }
    >
      {/* 6 Indicadores Principais com layout adaptativo que nunca quebra */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-3.5 sm:gap-4">
        <MetricCard
          title="Leads hoje"
          value={metrics.leadsFoundToday}
          icon={<MapPin className="w-4 h-4 text-lh-primary" />}
          comparison={{
            text: 'vs. ontem',
            trend: metrics.leadsFoundToday > 0 ? 'up' : 'neutral',
            value: metrics.leadsFoundToday > 0 ? `+${metrics.leadsFoundToday}` : '0',
          }}
        />

        <MetricCard
          title="Leads qualificados"
          value={metrics.qualifiedMonth}
          icon={<CheckCircle2 className="w-4 h-4 text-lh-primary" />}
          comparison={{
            text: 'no mês',
            trend: metrics.qualifiedMonth > 0 ? 'up' : 'neutral',
            value: `${metrics.qualifiedMonth}`,
          }}
        />

        <MetricCard
          title="Vendas hoje"
          value={metrics.salesToday}
          icon={<DollarSign className="w-4 h-4 text-lh-accent" />}
          highlightGrowth={metrics.salesToday > 0}
          subtitle="Fechadas hoje"
        />

        <MetricCard
          title="Vendas no mês"
          value={metrics.salesMonth}
          icon={<TrendingUp className="w-4 h-4 text-lh-accent" />}
          highlightGrowth={metrics.salesMonth > 0}
          comparison={{
            text: 'contratos',
            trend: metrics.salesMonth > 0 ? 'up' : 'neutral',
            value: `+${metrics.salesMonth}`,
          }}
        />

        <MetricCard
          title="Faturamento recebido"
          value={formatCurrency(metrics.revenueReceivedMonth)}
          icon={<DollarSign className="w-4 h-4 text-lh-accent" />}
          highlightGrowth={metrics.revenueReceivedMonth > 0}
          subtitle={`Contratado: ${formatCurrency(metrics.revenueContractedMonth)}`}
        />

        <MetricCard
          title="Taxa de conversão"
          value={`${metrics.conversionRate.toFixed(1)}%`}
          icon={<TrendingUp className="w-4 h-4 text-lh-primary" />}
          subtitle={`Ticket: ${formatCurrency(metrics.averageTicket)}`}
        />
      </div>

      {/* Grid de Gráficos 1 & 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={data?.trendData || []} />
        <FunnelChart data={data?.funnelData || []} />
      </div>

      {/* Grid de Gráficos 3 & 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SegmentChart data={data?.segmentData || []} />
        <RevenueChart
          data={data?.trendData || []}
          totalContracted={metrics.revenueContractedMonth}
          totalReceived={metrics.revenueReceivedMonth}
        />
      </div>

      {/* Seção Inferior: Atividades Recentes & Próximas Tarefas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividades Recentes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <Link href="/leads" className="text-xs text-lh-primary hover:underline font-medium flex items-center gap-1">
                Ver todos os leads <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="divide-y divide-lh-border p-0">
              {(data?.recentActivities || []).map((act: any) => (
                <div key={act.id} className="p-4 flex items-start gap-3 hover:bg-lh-surface-alt transition-colors">
                  <div className="w-8 h-8 rounded-lh-sm bg-lh-primary-soft text-lh-primary flex items-center justify-center shrink-0 mt-0.5 border border-lh-primary-border">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-lh-text truncate">{act.title}</h4>
                      <span className="text-[11px] text-lh-text-muted">{formatDate(act.createdAt)}</span>
                    </div>
                    {act.lead && (
                      <p className="text-[11px] text-lh-primary-text font-medium mt-0.5">
                        {act.lead.businessName} • {act.lead.category}
                      </p>
                    )}
                    {act.description && (
                      <p className="text-xs text-lh-text-secondary mt-1 leading-relaxed">
                        {act.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {(!data?.recentActivities || data.recentActivities.length === 0) && (
                <EmptyState
                  kind="empty"
                  title="Nenhuma atividade recente registrada"
                  description="As interações comerciais aparecerão aqui automaticamente conforme você cadastrar e atualizar prospects."
                  compact
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tarefas Prioritárias */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Próximas Tarefas</CardTitle>
              <Link href="/tarefas" className="text-xs text-lh-primary hover:underline font-medium flex items-center gap-1">
                Ver todas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {(data?.pendingTasks || []).map((task: any) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lh-md bg-lh-surface-alt border border-lh-border hover:border-lh-primary transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge
                      variant={task.priority === 'alta' ? 'danger' : 'neutral'}
                      size="sm"
                    >
                      {task.priority === 'alta' ? 'Alta Prioridade' : 'Normal'}
                    </Badge>
                    <span className="text-[11px] text-lh-text-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formatDate(task.dueDate)}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-lh-text">{task.title}</h5>
                  {task.lead && (
                    <p className="text-[11px] text-lh-text-muted mt-1 truncate">
                      Prospect: {task.lead.businessName}
                    </p>
                  )}
                </div>
              ))}

              {(!data?.pendingTasks || data.pendingTasks.length === 0) && (
                <EmptyState
                  kind="empty"
                  title="Todas as tarefas concluídas"
                  description="Nenhum follow-up pendente no momento."
                  compact
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
