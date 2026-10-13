'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  BarChart3,
  Building2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BRAND } from '@/lib/brand';
import { formatCurrency } from '@/lib/utils';

// Horários com receita acumulada no dia
const initialHourlyData = [
  { hour: '08:00', receita: 0 },
  { hour: '10:00', receita: 1297 },
  { hour: '12:00', receita: 1297 },
  { hour: '14:00', receita: 2594 },
  { hour: '16:00', receita: 2594 },
  { hour: '18:00', receita: 3891 },
  { hour: '20:00', receita: 3891 },
];

export default function SalaDeReceitaPage() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [salesCount, setSalesCount] = useState<number>(3);
  const [totalRevenue, setTotalRevenue] = useState<number>(3891);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  // Relógio ao vivo em tempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(`${dateStr} • ${timeStr} (Horário de Brasília)`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simular registro de nova venda
  const handleSimulateSale = () => {
    const saleValue = 1297;
    setSalesCount((prev) => prev + 1);
    setTotalRevenue((prev) => prev + saleValue);
    setRecentNotification(`Nova venda confirmada: +${formatCurrency(saleValue)}`);

    setTimeout(() => {
      setRecentNotification(null);
    }, 4000);
  };

  const avgTicket = salesCount > 0 ? totalRevenue / salesCount : 0;

  return (
    <div className="min-h-screen bg-lh-bg text-lh-text selection:bg-lh-primary-soft selection:text-lh-primary font-sans">
      {/* ------------------------------------------------------------- */}
      {/* CABEÇALHO EXECUTIVO                                           */}
      {/* ------------------------------------------------------------- */}
      <header className="bg-lh-surface border-b border-lh-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lh-sm text-lh-text-secondary hover:text-lh-text hover:bg-lh-surface-alt transition-colors"
              title="Voltar ao Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-lh-text flex items-center gap-2">
                Monitor de Receita em Tempo Real
                <Badge variant="success" size="sm">
                  Ao Vivo
                </Badge>
              </h1>
              <p className="text-xs text-lh-text-muted">{BRAND.name} • Gestão Financeira Executiva</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-lh-text-secondary bg-lh-surface-alt px-3 py-1.5 rounded-lh-md border border-lh-border">
              <Clock className="w-3.5 h-3.5 text-lh-primary" />
              <span>{currentTime}</span>
            </div>

            <Link href="/vendas">
              <Button variant="secondary" size="sm">
                <DollarSign className="w-3.5 h-3.5 mr-1 text-lh-accent" />
                Painel de Vendas
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Alerta de notificação temporária */}
      {recentNotification && (
        <div className="bg-lh-accent text-white px-4 py-2.5 text-center text-xs font-semibold shadow-xs flex items-center justify-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{recentNotification}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CONTEÚDO PRINCIPAL                                            */}
      {/* ------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* 4 KPIs de Receita */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-lh-text-secondary">Faturamento Fechado Hoje</span>
              <div className="p-1.5 rounded-lh-md bg-lh-accent-soft text-lh-accent">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-lh-accent mt-3 lh-tabular">
              {formatCurrency(totalRevenue)}
            </p>
            <span className="text-[11px] text-lh-text-muted mt-1 block">Receita confirmada do dia</span>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-lh-text-secondary">Contratos Fechados Hoje</span>
              <div className="p-1.5 rounded-lh-md bg-lh-primary-soft text-lh-primary">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-lh-text mt-3 lh-tabular">
              {salesCount}
            </p>
            <span className="text-[11px] text-lh-text-muted mt-1 block">Assinaturas e confirmações</span>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-lh-text-secondary">Ticket Médio</span>
              <div className="p-1.5 rounded-lh-md bg-lh-bg-subtle text-lh-text-secondary">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-lh-text mt-3 lh-tabular">
              {formatCurrency(avgTicket)}
            </p>
            <span className="text-[11px] text-lh-text-muted mt-1 block">Por oportunidade ganha</span>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-lh-text-secondary">Status de Operação</span>
              <div className="p-1.5 rounded-lh-md bg-lh-accent-soft text-lh-accent">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold text-lh-accent mt-3">Operando</p>
            <span className="text-[11px] text-lh-text-muted mt-1 block">Integração comercial ativa</span>
          </Card>
        </div>

        {/* Gráfico de Evolução ao Longo do Dia */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle>Curva de Faturamento Diário</CardTitle>
                <CardDescription>
                  Progressão de receita contratada e liquidada ao longo do horário comercial
                </CardDescription>
              </div>
              <Button variant="success" size="sm" onClick={handleSimulateSale}>
                <DollarSign className="w-3.5 h-3.5 mr-1" />
                Registrar Venda Simulada
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={initialHourlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16845B" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#16845B" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCE5E8" />
                  <XAxis dataKey="hour" stroke="#71838A" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#71838A"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `R$${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#DCE5E8',
                      borderRadius: '10px',
                      boxShadow: '0 4px 16px rgba(16, 59, 69, 0.08)',
                      fontSize: '12px',
                      color: '#182A2F',
                    }}
                    formatter={(val: any) => [formatCurrency(Number(val)), 'Receita Acumulada']}
                  />
                  <Area
                    type="monotone"
                    dataKey="receita"
                    stroke="#16845B"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGrowth)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Transações Recentes Confirmadas */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas Oportunidades Ganhas</CardTitle>
            <CardDescription>Transações registradas recentemente no sistema</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-lh-border p-0">
            <div className="p-4 flex items-center justify-between hover:bg-lh-surface-alt transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lh-sm bg-lh-accent-soft text-lh-accent flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-lh-text">Clínica Odontológica Sorriso</h4>
                  <p className="text-[11px] text-lh-text-muted">Contrato de Gestão Digital & Presença Web</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-lh-accent">{formatCurrency(1297)}</span>
                <span className="block text-[10px] text-lh-text-muted">Confirmado</span>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-lh-surface-alt transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lh-sm bg-lh-accent-soft text-lh-accent flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-lh-text">Auto Mecânica Central</h4>
                  <p className="text-[11px] text-lh-text-muted">Otimização Google Maps & Perfil de Empresa</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-lh-accent">{formatCurrency(1297)}</span>
                <span className="block text-[10px] text-lh-text-muted">Confirmado</span>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-lh-surface-alt transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lh-sm bg-lh-accent-soft text-lh-accent flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-lh-text">Restaurante & Pizzaria Bela Vista</h4>
                  <p className="text-[11px] text-lh-text-muted">Cardápio Online & Otimização de SEO Local</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-lh-accent">{formatCurrency(1297)}</span>
                <span className="block text-[10px] text-lh-text-muted">Confirmado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
