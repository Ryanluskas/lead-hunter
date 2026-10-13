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
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

export interface TrendChartProps {
  data: Array<{
    date: string;
    leads: number;
    sales: number;
    revenue: number;
  }>;
}

export function TrendChart({ data }: TrendChartProps) {
  const hasData =
    Array.isArray(data) &&
    data.length > 0 &&
    data.some((d) => (d.leads || 0) > 0 || (d.sales || 0) > 0 || (d.revenue || 0) > 0);

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <div>
          <CardTitle>Evolução Comercial</CardTitle>
          <CardDescription>
            Atividade diária de novos prospects mapeados vs. vendas fechadas
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {!hasData ? (
          <div className="h-72 w-full flex items-center justify-center">
            <EmptyState
              kind="empty"
              compact
              title="Sem dados de evolução no período"
              description="Seus resultados aparecerão aqui conforme novas oportunidades forem registradas."
              action={
                <Link href="/leads/buscar">
                  <Button variant="primary" size="sm">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    Buscar empresas
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {/* Azul-petróleo para leads mapeados (#145866) */}
                  <linearGradient id="lhColorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#145866" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#145866" stopOpacity={0.01} />
                  </linearGradient>
                  {/* Verde crescimento para vendas fechadas (#16845B) */}
                  <linearGradient id="lhColorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16845B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16845B" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
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
                  allowDecimals={false}
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
                  formatter={(value: any, name: any) => [
                    value,
                    name === 'leads' ? 'Prospects Identificados' : 'Vendas Fechadas',
                  ]}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', color: '#52656B' }}
                  formatter={(val) => (val === 'leads' ? 'Leads Mapeados' : 'Vendas Fechadas')}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#145866"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#lhColorLeads)"
                  name="leads"
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#16845B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#lhColorSales)"
                  name="sales"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
