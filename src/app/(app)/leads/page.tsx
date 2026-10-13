'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Users,
  Search,
  Plus,
  Download,
  Phone,
  Globe,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { EnrichmentModal } from '@/components/leads/EnrichmentModal';
import { useToast } from '@/components/ui/Toast';

export default function LeadsListPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('todos');
  const [status, setStatus] = useState('todos');

  const [addModalOpen, setAddModalOpen] = useState(false);
  const { addToast } = useToast();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'todos') params.append('category', category);
      if (status !== 'todos') params.append('status', status);

      const res = await fetch(`/api/leads?${params.toString()}`);
      const json = await res.json();
      setLeads(json.leads || []);
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Erro ao carregar prospects',
        description: 'Não foi possível buscar a lista de leads no banco de dados.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [category, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleExportCsv = () => {
    if (leads.length === 0) return;

    // Exportar APENAS os dados comerciais independentes persistidos no CRM
    const headers = ['ID', 'Empresa', 'Segmento', 'Cidade', 'Estado', 'Telefone', 'Website', 'Score', 'Status', 'Origem'];
    const rows = leads.map((l) => [
      l.id,
      `"${(l.businessName || '').replace(/"/g, '""')}"`,
      l.category,
      l.city,
      l.state,
      l.phone || '',
      l.website || '',
      l.score,
      l.status,
      `"${(l.source || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leadhunter-prospects-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Exportação Concluída',
      description: `${leads.length} prospects exportados com sucesso em formato CSV.`,
      type: 'success',
    });
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'vendido':
        return <Badge variant="success">Vendido</Badge>;
      case 'perdido':
        return <Badge variant="danger">Perdido</Badge>;
      case 'qualificado':
        return <Badge variant="warning">Qualificado</Badge>;
      case 'proposta_enviada':
      case 'em_negociacao':
        return <Badge variant="primary">Proposta / Negociação</Badge>;
      default:
        return <Badge variant="neutral">{s.replace('_', ' ')}</Badge>;
    }
  };

  return (
    <PageContainer
      title="Prospects & CRM Comercial"
      description="Gerenciamento de leads verificados de forma independente para modernização de sites"
      action={
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleExportCsv} disabled={leads.length === 0}>
            <Download className="w-4 h-4" /> Exportar Dados (CSV)
          </Button>
          <Button variant="primary" size="sm" onClick={() => setAddModalOpen(true)}>
            <Plus className="w-4 h-4" /> Novo Prospect
          </Button>
        </div>
      }
    >
      {/* Filtros e Busca Textual */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome comercial, cidade ou anotações..."
            />
          </div>

          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="todos">Todos os Segmentos</option>
            <option value="Clínicas">Clínicas Médicas</option>
            <option value="Dentistas">Dentistas & Odontologia</option>
            <option value="Oficinas">Oficinas Mecânicas</option>
            <option value="Academias">Academias</option>
            <option value="Salões de Beleza">Salões de Beleza</option>
            <option value="Restaurantes">Restaurantes</option>
            <option value="Contabilidade">Contabilidade</option>
          </Select>

          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="todos">Todas as Etapas</option>
            <option value="novo">Novo</option>
            <option value="qualificado">Qualificado</option>
            <option value="contatado">Contatado</option>
            <option value="reuniao_agendada">Reunião Agendada</option>
            <option value="proposta_enviada">Proposta Enviada</option>
            <option value="vendido">Vendido</option>
            <option value="perdido">Perdido</option>
          </Select>
        </form>
      </Card>

      {/* Tabela Comercial de Prospects */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : leads.length === 0 ? (
          <EmptyState
            title="Nenhum prospect encontrado"
            description="Não há leads registrados no CRM correspondentes aos filtros aplicados. Realize uma busca no Google Maps ou cadastre manualmente."
            icon={Users}
            action={
              <div className="flex items-center gap-3">
                <Link href="/leads/buscar">
                  <Button variant="primary" size="sm">
                    Buscar no Google Maps
                  </Button>
                </Link>
                <Button variant="secondary" size="sm" onClick={() => setAddModalOpen(true)}>
                  Cadastrar Manualmente
                </Button>
              </div>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-lh-surface-alt border-b border-lh-border text-lh-text-muted font-semibold">
                  <th className="py-3 px-4">Empresa & Segmento</th>
                  <th className="py-3 px-4">Localização</th>
                  <th className="py-3 px-4">Contato</th>
                  <th className="py-3 px-4">Presença Web</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Etapa Comercial</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lh-border-subtle">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-lh-bg/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-semibold text-lh-text hover:text-lh-primary text-sm block"
                      >
                        {lead.businessName}
                      </Link>
                      <span className="text-lh-text-muted text-[11px]">{lead.category}</span>
                    </td>

                    <td className="py-3.5 px-4 text-lh-text-secondary">
                      {lead.city} - {lead.state}
                    </td>

                    <td className="py-3.5 px-4 text-lh-text-secondary">
                      {lead.phone ? (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-lh-text-muted" /> {lead.phone}
                        </span>
                      ) : (
                        <span className="text-lh-text-muted">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {lead.website ? (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lh-primary hover:underline flex items-center gap-1 truncate max-w-[150px]"
                        >
                          <Globe className="w-3 h-3 shrink-0" /> {lead.website}
                        </a>
                      ) : (
                        <Badge variant="primary" size="sm">
                          Sem website
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-xs text-lh-text lh-tabular">★ {lead.score}</span>
                      <span className="text-lh-text-muted text-[10px]">/100</span>
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(lead.status)}</td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/ia?businessName=${encodeURIComponent(lead.businessName)}&category=${encodeURIComponent(
                            lead.category
                          )}&city=${encodeURIComponent(lead.city)}&leadId=${lead.id}`}
                          className="p-1.5 text-lh-primary hover:bg-lh-primary-soft rounded-lg transition-colors"
                          title="Gerar Abordagem com Gemini Flash"
                        >
                          <Sparkles className="w-4 h-4" />
                        </Link>

                        <Link
                          href={`/leads/${lead.id}`}
                          className="p-1.5 text-lh-text-muted hover:text-lh-text hover:bg-lh-bg rounded-lg transition-colors"
                          title="Ver Detalhes Completos"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal de Cadastro Manual */}
      <EnrichmentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        place={null}
        onSuccess={() => fetchLeads()}
      />
    </PageContainer>
  );
}
