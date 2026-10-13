'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { AuditReportCard } from '@/components/audit/AuditReportCard';
import { WebsiteAuditResult } from '@/lib/site-auditor';
import { formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  Shield,
  Search,
  ExternalLink,
  Lock,
  Smartphone,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AuditoriasContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('url') || '';
  const initialLeadId = searchParams.get('leadId') || '';

  const [url, setUrl] = useState(initialUrl);
  const [leadId, setLeadId] = useState(initialLeadId);
  const [leadsList, setLeadsList] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAudit, setCurrentAudit] = useState<WebsiteAuditResult | null>(null);

  const [auditHistory, setAuditHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/audit');
      const json = await res.json();
      setAuditHistory(json.audits || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const json = await res.json();
      setLeadsList(json.leads || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchLeads();
    if (initialUrl) {
      handleRunAudit(initialUrl);
    }
  }, []);

  const handleRunAudit = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl.trim(),
          leadId: leadId || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Falha na auditoria');

      setCurrentAudit(json.audit);
      fetchHistory();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao inspecionar website');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRunAudit(url);
  };

  return (
    <PageContainer
      title="Auditoria Técnica de Websites"
      description="Inspeção segura de websites para diagnosticar problemas de responsividade móvel, performance, ausência de SSL e canais de contato"
    >
      {/* Formulário de Auditoria com SSRF-Protection Notice */}
      <Card className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="URL do Website para Auditoria *"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Ex: https://clinicaodontologica.com.br"
                required
              />
            </div>

            <Select
              label="Vincular a um Prospect (Opcional)"
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
            >
              <option value="">Auditoria Avulsa</option>
              {leadsList.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.businessName} ({l.city})
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-lh-border-subtle">
            <div className="flex items-center gap-1.5 text-xs text-lh-text-muted">
              <Shield className="w-3.5 h-3.5 text-lh-primary shrink-0" />
              <span>Proteção ativa contra SSRF: redes privadas e metadados de nuvem são bloqueados por segurança.</span>
            </div>
            <Button type="submit" variant="primary" isLoading={loading}>
              <ShieldCheck className="w-4 h-4" /> Iniciar Auditoria Técnica
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <div className="p-4 bg-lh-danger-soft text-lh-danger-text text-xs rounded-xl border border-lh-danger/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-lh-danger" />
          <span><strong>Erro na inspeção: </strong> {error}</span>
        </div>
      )}

      {/* Relatório da Auditoria Atual */}
      {currentAudit && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-lh-text">Resultado da Auditoria Recente</h3>
          <AuditReportCard audit={currentAudit} leadId={leadId || undefined} />
        </div>
      )}

      {/* Histórico de Auditorias Executadas */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Histórico de Auditorias Executadas</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-lh-surface-alt border-b border-lh-border text-lh-text-muted font-semibold">
                <th className="py-3 px-4">Website Inspecionado</th>
                <th className="py-3 px-4">Prospect Vinculado</th>
                <th className="py-3 px-4">Nota Técnica</th>
                <th className="py-3 px-4">Segurança (SSL)</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Data da Varredura</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lh-border-subtle">
              {auditHistory.map((audit) => (
                <tr key={audit.id} className="hover:bg-lh-bg/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-lh-text max-w-[200px] truncate">
                    {audit.url}
                  </td>

                  <td className="py-3.5 px-4">
                    {audit.lead ? (
                      <Link
                        href={`/leads/${audit.lead.id}`}
                        className="text-lh-primary hover:underline font-medium"
                      >
                        {audit.lead.businessName}
                      </Link>
                    ) : (
                      <span className="text-lh-text-muted">Avulsa</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        audit.score >= 80 ? 'success' : audit.score >= 50 ? 'warning' : 'danger'
                      }
                      size="sm"
                    >
                      ★ {audit.score}/100
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4">
                    {audit.https ? (
                      <span className="text-lh-accent font-semibold">HTTPS Ativo</span>
                    ) : (
                      <span className="text-lh-danger font-semibold">Inseguro</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-lh-text-secondary">
                    {audit.hasMobileViewport ? 'Adaptado' : 'Sem Viewport'}
                  </td>

                  <td className="py-3.5 px-4 text-lh-text-muted lh-tabular">{formatDate(audit.createdAt)}</td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setCurrentAudit(audit);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Ver Detalhes
                    </Button>
                  </td>
                </tr>
              ))}

              {auditHistory.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-lh-text-muted">
                    Nenhuma auditoria executada ainda. Digite uma URL acima para testar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  );
}

export default function AuditoriasPage() {
  return (
    <Suspense
      fallback={
        <PageContainer title="Auditoria Técnica de Websites" description="">
          <div className="p-8 text-xs text-lh-text-muted">Carregando módulo de auditorias...</div>
        </PageContainer>
      }
    >
      <AuditoriasContent />
    </Suspense>
  );
}
