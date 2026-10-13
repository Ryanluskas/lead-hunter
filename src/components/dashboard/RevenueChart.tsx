'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { DollarSign } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
  }>;
  totalContracted: number;
  totalReceived: number;
}

export function RevenueChart({ data, totalContracted, totalReceived }: RevenueChartProps) {
  const hasData =
    (totalContracted > 0 || totalReceived > 0) ||
    (Array.isArray(data) && data.length > 0 && data.some((d) => (d.revenue || 0) > 0));

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <div>
          <CardTitle>Evolução do Faturamento</CardTitle>
          <CardDescription>
            Receita contratada vs. valores efetivamente quitados
          </CardDescription>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="text-right">
            <span className="text-lh-text-muted block text-[10px] font-medium">Contratado no Mês</span>
            <span className="font-bold text-lh-text lh-tabular">{formatCurrency(totalContracted)}</span>
          </div>
          <div className="w-px h-6 bg-lh-border" />
          <div className="text-right">
            <span className="text-lh-text-muted block text-[10px] font-medium">Recebido no Mês</span>
            <span className="font-bold text-lh-accent lh-tabular">{formatCurrency(totalReceived)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {!hasData ? (
          <div className="h-72 w-full flex items-center justify-center">
            <EmptyState
              kind="empty"
              compact
              title="Sem faturamento registrado no período"
              description="Registre suas vendas e pagamentos para acompanhar o faturamento."
              action={
                <Link href="/vendas">
                  <Button variant="success" size="sm">
                    <DollarSign className="w-3.5 h-3.5 mr-1" />
                    Registrar venda
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCE5E8" />
                <XAxis
                  dataKey="date"
                  stroke="#71838A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#71838A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `R$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
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
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Faturamento Fechado']}
                />
                <Bar
                  dataKey="revenue"
                  name="Faturamento Diário"
                  fill="#16845B"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
