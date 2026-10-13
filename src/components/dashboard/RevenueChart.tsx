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
  return (
    <Card>
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
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D8D6D7" />
              <XAxis
                dataKey="date"
                stroke="#797878"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#797878"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `R$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D8D6D7',
                  borderRadius: '10px',
                  boxShadow: '0 4px 16px rgba(44, 1, 7, 0.08)',
                  fontSize: '12px',
                  color: '#1A0E12',
                }}
                formatter={(value: any) => [formatCurrency(Number(value)), 'Faturamento Fechado']}
              />
              <Bar
                dataKey="revenue"
                name="Faturamento Diário"
                fill="#550416"
                radius={[4, 4, 0, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
