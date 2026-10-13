'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function PipelinePage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leads');
      const json = await res.json();
      setLeads(json.leads || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <PageContainer
      title="Funil de Vendas Comercial (Pipeline)"
      description="Acompanhe e movimente os prospects através das 11 etapas do processo comercial"
      action={
        <div className="flex items-center gap-2">
          <Link href="/leads/buscar">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4" /> Buscar Novos Prospects
            </Button>
          </Link>
        </div>
      }
    >
      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 select-none min-h-[500px]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-72 shrink-0 bg-lh-surface-alt rounded-xl border border-lh-border-subtle p-3 space-y-3">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <KanbanBoard initialLeads={leads} onStatusChange={() => fetchLeads()} />
      )}
    </PageContainer>
  );
}
