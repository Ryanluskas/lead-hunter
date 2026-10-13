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

export interface SegmentChartProps {
  data: Array<{
    category: string;
    leads: number;
    sales: number;
  }>;
}

export function SegmentChart({ data }: SegmentChartProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Desempenho por Segmento / Nicho</CardTitle>
          <CardDescription>
            Comparação entre oportunidades identificadas e fechamentos por nicho de mercado
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D8D6D7" />
              <XAxis
                dataKey="category"
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
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', color: '#554E50' }}
              />
              <Bar
                dataKey="leads"
                name="Leads Mapeados"
                fill="#550416"
                radius={[4, 4, 0, 0]}
                barSize={16}
              />
              <Bar
                dataKey="sales"
                name="Vendas Fechadas"
                fill="#C42759"
                radius={[4, 4, 0, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
