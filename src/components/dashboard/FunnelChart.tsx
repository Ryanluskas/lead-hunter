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
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Users } from 'lucide-react';
import Link from 'next/link';

export interface FunnelChartProps {
  data: Array<{
    stage: string;
    count: number;
    fill?: string;
  }>;
}

export function FunnelChart({ data }: FunnelChartProps) {
  const totalCount = Array.isArray(data) ? data.reduce((acc, curr) => acc + (curr.count || 0), 0) : 0;
  const hasData = totalCount > 0;

  const getStageColor = (stage: string) => {
    const s = stage.toLowerCase();
    // Venda / Ganho -> Verde crescimento oficial
    if (s.includes('venda') || s.includes('ganho') || s.includes('fechad') || s.includes('conclu')) {
      return '#16845B';
    }
    // Perda / Descarte -> Vermelho discreto semântico
    if (s.includes('perdid') || s.includes('descarte') || s.includes('recusad')) {
      return '#B42332';
    }
    // Avançados (Proposta, Negociação) -> Azul-petróleo escuro
    if (s.includes('negocia') || s.includes('proposta')) {
      return '#103B45';
    }
    // Intermediários (Reunião, Apresentação, Qualificado) -> Azul-petróleo primário
    if (s.includes('reuni') || s.includes('qualifica') || s.includes('apresenta')) {
      return '#145866';
    }
    // Iniciais -> Azul-petróleo suave
    return '#1A5660';
  };

  return (
    <Card className="h-full flex flex-col justify-between hover:shadow-lh-soft transition-all duration-200">
      <CardHeader>
        <div>
          <CardTitle>Funil Comercial</CardTitle>
          <CardDescription>
            Distribuição de oportunidades em cada estágio do processo comercial
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {!hasData ? (
          <div className="h-72 w-full flex items-center justify-center">
            <EmptyState
              kind="empty"
              compact
              title="Nenhuma oportunidade no funil"
              description="Cadastre ou atualize oportunidades para visualizar seu funil."
              action={
                <Link href="/leads">
                  <Button variant="primary" size="sm">
                    <Users className="w-3.5 h-3.5 mr-1" />
                    Ver meus leads
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 45, bottom: 5 }}
              >
                <XAxis type="number" stroke="#71838A" fontSize={11} allowDecimals={false} hide />
                <YAxis
                  dataKey="stage"
                  type="category"
                  stroke="#182A2F"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DCE5E8',
                    borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(16, 59, 69, 0.08)',
                    fontSize: '12px',
                    color: '#182A2F',
                  }}
                  formatter={(value: any) => [`${value} prospects`, 'Volume']}
                />
                <Bar
                  dataKey="count"
                  radius={[0, 4, 4, 0]}
                  barSize={14}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`funnel-cell-${index}`}
                      fill={getStageColor(entry.stage)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
