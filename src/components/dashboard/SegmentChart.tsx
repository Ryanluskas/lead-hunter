'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

export interface SegmentChartProps {
  data: Array<{
    category: string;
    leads: number;
    sales: number;
  }>;
}

export function SegmentChart({ data }: SegmentChartProps) {
  const hasData =
    Array.isArray(data) &&
    data.length > 0 &&
    data.some((d) => (d.leads || 0) > 0 || (d.sales || 0) > 0);

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <div>
          <CardTitle>Desempenho por Segmento / Nicho</CardTitle>
          <CardDescription>
            Comparação entre oportunidades identificadas e fechamentos por nicho de mercado
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {!hasData ? (
          <div className="h-72 w-full flex items-center justify-center">
            <EmptyState
              kind="empty"
              compact
              title="Sem dados por segmento"
              description="Os nichos mais promissores serão exibidos à medida que você prospectar."
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
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCE5E8" />
                <XAxis
                  dataKey="category"
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
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', color: '#52656B' }}
                />
                <Bar
                  dataKey="leads"
                  name="Leads Mapeados"
                  fill="#145866"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                />
                <Bar
                  dataKey="sales"
                  name="Vendas Fechadas"
                  fill="#16845B"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
