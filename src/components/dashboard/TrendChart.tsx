'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export interface TrendChartProps {
  data: Array<{
    date: string;
    leads: number;
    sales: number;
    revenue: number;
  }>;
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Evolução Comercial</CardTitle>
          <CardDescription>
            Atividade diária de novos prospects mapeados vs. vendas fechadas
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {/* Crimson para leads mapeados (#550416) */}
                <linearGradient id="lhColorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#550416" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#550416" stopOpacity={0.01} />
                </linearGradient>
                {/* Cherry vibrante para vendas fechadas (#C42759) */}
                <linearGradient id="lhColorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C42759" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#C42759" stopOpacity={0.01} />
                </linearGradient>
              </defs>
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
                allowDecimals={false}
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
                formatter={(value: any, name: any) => [
                  value,
                  name === 'leads' ? 'Prospects Identificados' : 'Vendas Fechadas',
                ]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', color: '#554E50' }}
                formatter={(val) => (val === 'leads' ? 'Leads Mapeados' : 'Vendas Fechadas')}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#550416"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#lhColorLeads)"
                name="leads"
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#C42759"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#lhColorSales)"
                name="sales"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
