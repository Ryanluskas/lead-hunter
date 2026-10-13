'use client';

import React from 'react';
import { WebsiteAuditResult } from '@/lib/site-auditor';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle,
  ExternalLink,
  Smartphone,
  Lock,
  Clock,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export function AuditReportCard({
  audit,
  leadId,
}: {
  audit: WebsiteAuditResult;
  leadId?: string;
}) {
  const getScoreVariant = (s: number) => {
    if (s >= 80) return 'success';
    if (s >= 50) return 'warning';
    return 'danger';
  };

  return (
    <div className="space-y-6">
      {/* Resumo Geral com Indicador de Maturidade */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-lh-border-subtle">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant={getScoreVariant(audit.score)} size="md">
                Nota Técnica: {audit.score}/100
              </Badge>
              <span className="text-xs text-lh-text-muted">
                {audit.score < 60
                  ? '• Alta oportunidade de venda de redesign / novo site'
                  : '• Site estruturado com oportunidades de otimização'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-lh-text flex items-center gap-2">
              <a
                href={audit.finalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1.5 text-lh-primary"
              >
                {audit.url} <ExternalLink className="w-4 h-4 text-lh-text-muted" />
              </a>
            </h3>
          </div>

          <Link
            href={`/ia?url=${encodeURIComponent(audit.finalUrl)}&issues=${encodeURIComponent(
              audit.issues.map((i) => i.title).join('; ')
            )}${leadId ? `&leadId=${leadId}` : ''}`}
          >
            <Button variant="primary" size="sm">
              <Sparkles className="w-4 h-4" /> Gerar Proposta Comercial na IA
            </Button>
          </Link>
        </div>

        {/* Grid de Verificações Críticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 bg-lh-surface-alt rounded-xl border border-lh-border-subtle">
            <div className="flex items-center gap-1.5 text-xs text-lh-text-muted">
              <Lock className="w-3.5 h-3.5" /> Conexão HTTPS
            </div>
            <p className="text-sm font-semibold text-lh-text mt-1 flex items-center gap-1">
              {audit.https ? (
                <span className="text-lh-accent">Ativa (SSL)</span>
              ) : (
                <span className="text-lh-danger">Insegura (Sem SSL)</span>
              )}
            </p>
          </div>

          <div className="p-3.5 bg-lh-surface-alt rounded-xl border border-lh-border-subtle">
            <div className="flex items-center gap-1.5 text-xs text-lh-text-muted">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Viewport
            </div>
            <p className="text-sm font-semibold text-lh-text mt-1">
              {audit.hasMobileViewport ? (
                <span className="text-lh-accent">Adaptado</span>
              ) : (
                <span className="text-lh-danger">Não Responsivo</span>
              )}
            </p>
          </div>

          <div className="p-3.5 bg-lh-surface-alt rounded-xl border border-lh-border-subtle">
            <div className="flex items-center gap-1.5 text-xs text-lh-text-muted">
              <Clock className="w-3.5 h-3.5" /> Tempo de Resposta
            </div>
            <p className="text-sm font-semibold text-lh-text mt-1 lh-tabular">
              {(audit.loadTimeMs / 1000).toFixed(2)}s
            </p>
          </div>

          <div className="p-3.5 bg-lh-surface-alt rounded-xl border border-lh-border-subtle">
            <div className="flex items-center gap-1.5 text-xs text-lh-text-muted">
              <CheckCircle className="w-3.5 h-3.5" /> Botão WhatsApp
            </div>
            <p className="text-sm font-semibold text-lh-text mt-1">
              {audit.hasContactLink ? (
                <span className="text-lh-accent">Presente</span>
              ) : (
                <span className="text-lh-danger">Ausente</span>
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* Lista de Problemas com Severidade, Evidência e Correção */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico Detalhado & Evidências Técnicas ({audit.issues.length})</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-lh-border-subtle">
          {audit.issues.map((issue, index) => {
            const isCritical = issue.severity === 'critical';
            const isWarning = issue.severity === 'warning';

            return (
              <div key={index} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  {isCritical && <ShieldAlert className="w-4 h-4 text-lh-danger shrink-0" />}
                  {isWarning && <AlertTriangle className="w-4 h-4 text-lh-warning shrink-0" />}
                  {!isCritical && !isWarning && <Info className="w-4 h-4 text-lh-primary shrink-0" />}
                  <h4 className="text-sm font-semibold text-lh-text">{issue.title}</h4>
                  <Badge
                    variant={isCritical ? 'danger' : isWarning ? 'warning' : 'neutral'}
                    size="sm"
                  >
                    {issue.severity.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-xs text-lh-text-secondary leading-relaxed">{issue.description}</p>

                {issue.evidence && (
                  <p className="text-xs text-lh-text-muted bg-lh-surface-alt px-2.5 py-1.5 rounded-lg border border-lh-border-subtle font-mono text-[11px]">
                    Evidência: {issue.evidence}
                  </p>
                )}

                <div className="text-xs text-lh-accent font-medium flex items-center gap-1">
                  <span>Recomendação:</span>
                  <span>{issue.recommendation}</span>
                </div>
              </div>
            );
          })}

          {audit.issues.length === 0 && (
            <div className="py-8 text-center text-xs text-lh-text-muted">
              Nenhum problema crítico detectado na varredura técnica inicial.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
