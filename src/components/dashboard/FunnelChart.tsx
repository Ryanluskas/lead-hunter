'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export interface FunnelChartProps {
  data: Array<{
    stage: string;
    count: number;
    fill?: string;
  }>;
}

export function FunnelChart({ data }: FunnelChartProps) {
  const getStageColor = (stage: string, fallback?: string) => {
    const s = stage.toLowerCase();
    if (s.includes('venda') || s.includes('vendido') || s.includes('conclu')) {
      return '#C42759'; // Vibrant Cherry Blossom para vitórias
    }
    if (s.includes('perdid') || s.includes('descarte')) {
      return '#797878'; // Slate Gray para perdas
    }
    if (s.includes('qualifica') || s.includes('proposta') || s.includes('negocia')) {
      return '#550416'; // Rich Crimson Wine
    }
    if (s.includes('reuni') || s.includes('interess')) {
      return '#7E0A24'; // Crimson intermediário
    }
    return '#ABABAB'; // Medium Silver para estágios iniciais
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Funil Comercial (10 Etapas)</CardTitle>
          <CardDescription>
            Distribuição de oportunidades em cada estágio do processo comercial
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 45, bottom: 5 }}
            >
              <XAxis type="number" stroke="#797878" fontSize={11} allowDecimals={false} hide />
              <YAxis
                dataKey="stage"
                type="category"
                stroke="#1A0E12"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={100}
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
                formatter={(value: any) => [`${value} prospects`, 'Volume']}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={13}>
                {data.map((entry, index) => (
                  <Cell
                    key={`funnel-cell-${index}`}
                    fill={getStageColor(entry.stage, entry.fill)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
