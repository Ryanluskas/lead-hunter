'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import {
  Sparkles,
  MessageSquare,
  FileText,
  HelpCircle,
  TrendingUp,
  Copy,
  Check,
} from 'lucide-react';

export interface AiCommercialAssistantProps {
  initialBusinessName?: string;
  initialCategory?: string;
  initialCity?: string;
  initialIssues?: string;
  initialLeadId?: string;
}

export function AiCommercialAssistant({
  initialBusinessName = '',
  initialCategory = 'Clínicas',
  initialCity = 'Goiânia',
  initialIssues = '',
  initialLeadId,
}: AiCommercialAssistantProps) {
  const [activeTab, setActiveTab] = useState<'message' | 'opportunity' | 'proposal' | 'objection'>('message');

  const [businessName, setBusinessName] = useState(initialBusinessName || 'Clínica OdontoMais');
  const [category, setCategory] = useState(initialCategory || 'Dentistas');
  const [city, setCity] = useState(initialCity || 'Goiânia');
  const [tone, setTone] = useState<'consultivo' | 'direto' | 'amigavel'>('consultivo');
  const [issues, setIssues] = useState(initialIssues || 'Sem website oficial no celular; ausência de botão WhatsApp');

  const [objectionText, setObjectionText] = useState('Já tenho Instagram e não vejo motivo para ter site');

  // Outputs
  const [loading, setLoading] = useState(false);
  const [whatsappResult, setWhatsappResult] = useState('');
  const [emailResult, setEmailResult] = useState({ subject: '', body: '' });
  const [opportunityResult, setOpportunityResult] = useState<any>(null);
  const [proposalResult, setProposalResult] = useState('');
  const [objectionResult, setObjectionResult] = useState('');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { addToast } = useToast();

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast({
      title: 'Copiado para a área de transferência',
      description: 'Texto pronto para ser colado no WhatsApp ou E-mail.',
      type: 'success',
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerate = async (action: 'message' | 'opportunity' | 'proposal' | 'objection') => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          leadId: initialLeadId,
          context: {
            businessName,
            category,
            city,
            customTone: tone,
            auditIssues: issues ? issues.split(';').map((s) => s.trim()) : [],
          },
          objection: objectionText,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Falha ao processar na IA');

      if (action === 'message') {
        setWhatsappResult(json.data.whatsapp);
        setEmailResult(json.data.email);
        addToast({
          title: 'Mensagens Geradas',
          description: 'Abordagens comerciais criadas com tom consultivo.',
          type: 'success',
        });
      } else if (action === 'opportunity') {
        setOpportunityResult(json.data);
        addToast({
          title: 'Oportunidade Analisada',
          description: 'Diagnóstico e quick-wins estruturados com sucesso.',
          type: 'success',
        });
      } else if (action === 'proposal') {
        setProposalResult(json.data.proposalMarkdown);
        addToast({
          title: 'Proposta Comercial Criada',
          description: 'Estrutura completa em Markdown pronta para apresentação.',
          type: 'success',
        });
      } else if (action === 'objection') {
        setObjectionResult(json.data.response);
        addToast({
          title: 'Argumento de Contorno Gerado',
          description: 'Resposta persuasiva baseada em métricas comerciais.',
          type: 'success',
        });
      }
    } catch (err: unknown) {
      addToast({
        title: 'Erro na chamada da IA',
        description: err instanceof Error ? err.message : 'Não foi possível gerar o conteúdo.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Selector Banner */}
      <Card className="p-5 border-lh-primary-border bg-gradient-to-r from-lh-primary-soft/40 via-lh-surface to-lh-surface">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lh-primary text-white flex items-center justify-center shadow-sm shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-lh-text">Assistente Comercial Gemini Flash</h3>
              <p className="text-xs text-lh-text-muted">
                Geração inteligente de abordagens, roteiros e propostas baseadas em dados independentes
              </p>
            </div>
          </div>
          <Badge variant="primary" size="md">
            Modelo: gemini-3.8-flash
          </Badge>
        </div>

        {/* Formulário de Contexto Comercial */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-lh-border-subtle">
          <Input
            label="Empresa Alvo"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Nome da empresa"
          />
          <Input
            label="Segmento"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: Clínicas"
          />
          <Input
            label="Cidade"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Goiânia"
          />
          <Select
            label="Tom da Abordagem"
            value={tone}
            onChange={(e) => setTone(e.target.value as any)}
          >
            <option value="consultivo">Consultivo & Técnico</option>
            <option value="direto">Direto & Focado em Vendas</option>
            <option value="amigavel">Amigável & Relacional</option>
          </Select>
        </div>
      </Card>

      {/* Navegação por Abas */}
      <div className="flex gap-2 border-b border-lh-border-subtle pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('message')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'message'
              ? 'bg-lh-primary text-white shadow-sm'
              : 'text-lh-text-muted hover:bg-lh-bg hover:text-lh-text'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Mensagens WhatsApp / E-mail
        </button>

        <button
          onClick={() => setActiveTab('opportunity')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'opportunity'
              ? 'bg-lh-primary text-white shadow-sm'
              : 'text-lh-text-muted hover:bg-lh-bg hover:text-lh-text'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Análise de Oportunidade
        </button>

        <button
          onClick={() => setActiveTab('proposal')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'proposal'
              ? 'bg-lh-primary text-white shadow-sm'
              : 'text-lh-text-muted hover:bg-lh-bg hover:text-lh-text'
          }`}
        >
          <FileText className="w-4 h-4" /> Gerador de Propostas
        </button>

        <button
          onClick={() => setActiveTab('objection')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'objection'
              ? 'bg-lh-primary text-white shadow-sm'
              : 'text-lh-text-muted hover:bg-lh-bg hover:text-lh-text'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Quebra de Objeções
        </button>
      </div>

      {/* Conteúdo da Aba 1: Mensagens */}
      {activeTab === 'message' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              onClick={() => handleGenerate('message')}
              variant="primary"
              isLoading={loading}
            >
              <Sparkles className="w-4 h-4" /> Gerar Novas Mensagens de Abordagem
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-lh-accent" />
                    <CardTitle>Abordagem para WhatsApp</CardTitle>
                  </div>
                  {whatsappResult && (
                    <button
                      onClick={() => copyToClipboard(whatsappResult, 'wa')}
                      className="text-xs text-lh-text-muted hover:text-lh-text flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedKey === 'wa' ? (
                        <Check className="w-3.5 h-3.5 text-lh-accent" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedKey === 'wa' ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={whatsappResult}
                  onChange={(e) => setWhatsappResult(e.target.value)}
                  placeholder="Clique em 'Gerar Novas Mensagens' para receber o roteiro em português com tom consultivo..."
                  rows={7}
                />
              </CardContent>
            </Card>

            {/* E-mail */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-lh-primary" />
                    <CardTitle>E-mail Comercial Formal</CardTitle>
                  </div>
                  {emailResult.body && (
                    <button
                      onClick={() =>
                        copyToClipboard(`Assunto: ${emailResult.subject}\n\n${emailResult.body}`, 'em')
                      }
                      className="text-xs text-lh-text-muted hover:text-lh-text flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedKey === 'em' ? (
                        <Check className="w-3.5 h-3.5 text-lh-accent" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedKey === 'em' ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  label="Assunto do E-mail"
                  value={emailResult.subject}
                  onChange={(e) => setEmailResult({ ...emailResult, subject: e.target.value })}
                  placeholder="Assunto da mensagem"
                />
                <Textarea
                  label="Corpo do E-mail"
                  value={emailResult.body}
                  onChange={(e) => setEmailResult({ ...emailResult, body: e.target.value })}
                  rows={6}
                  placeholder="Rascunho do e-mail..."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba 2: Oportunidade */}
      {activeTab === 'opportunity' && (
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-lh-text">Diagnóstico Estratégico do Prospect</h4>
            <Button onClick={() => handleGenerate('opportunity')} variant="primary" isLoading={loading}>
              <Sparkles className="w-4 h-4" /> Analisar Oportunidade
            </Button>
          </div>

          {opportunityResult ? (
            <div className="space-y-4 pt-4 border-t border-lh-border-subtle">
              <p className="text-xs text-lh-text leading-relaxed bg-lh-surface-alt p-4 rounded-xl border border-lh-border-subtle">
                {opportunityResult.analysis}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-lh-accent-soft/70 border border-lh-accent-border">
                  <h5 className="text-xs font-semibold text-lh-accent-text mb-2">Ganhos Rápidos (Quick Wins)</h5>
                  <ul className="text-xs text-lh-text-secondary space-y-1 list-disc list-inside">
                    {opportunityResult.quickWins?.map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-lh-warning-soft/70 border border-lh-warning-border">
                  <h5 className="text-xs font-semibold text-lh-warning-text mb-2">Pontos de Cuidado / Cautela</h5>
                  <ul className="text-xs text-lh-text-secondary space-y-1 list-disc list-inside">
                    {opportunityResult.riskPoints?.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-lh-text-muted">
              Clique no botão acima para rodar a análise de oportunidade com a inteligência do Gemini.
            </div>
          )}
        </Card>
      )}

      {/* Conteúdo da Aba 3: Proposta */}
      {activeTab === 'proposal' && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h4 className="text-sm font-semibold text-lh-text">Proposta Comercial em Markdown</h4>
              <p className="text-xs text-lh-text-muted">Pronta para exportar ou enviar ao cliente</p>
            </div>
            <div className="flex items-center gap-2">
              {proposalResult && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copyToClipboard(proposalResult, 'prop')}
                >
                  {copiedKey === 'prop' ? <Check className="w-3.5 h-3.5 text-lh-accent" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'prop' ? 'Copiado' : 'Copiar Markdown'}</span>
                </Button>
              )}
              <Button onClick={() => handleGenerate('proposal')} variant="primary" isLoading={loading}>
                <Sparkles className="w-4 h-4" /> Gerar Proposta Estruturada
              </Button>
            </div>
          </div>

          <Textarea
            value={proposalResult}
            onChange={(e) => setProposalResult(e.target.value)}
            rows={14}
            className="font-mono text-xs"
            placeholder="A proposta conterá Resumo, Escopo, Benefícios Realistas, Cronograma e Condições Comerciais..."
          />
        </Card>
      )}

      {/* Conteúdo da Aba 4: Quebra de Objeções */}
      {activeTab === 'objection' && (
        <Card className="p-6 space-y-4">
          <h4 className="text-sm font-semibold text-lh-text">Como Contornar Objeções Comerciais</h4>

          <div className="space-y-3">
            <Input
              label="Objeção do Cliente"
              value={objectionText}
              onChange={(e) => setObjectionText(e.target.value)}
              placeholder="Ex: 'Já tenho Instagram e não preciso de site', 'Achei caro', etc."
            />
            <Button onClick={() => handleGenerate('objection')} variant="primary" isLoading={loading}>
              <Sparkles className="w-4 h-4" /> Gerar Resposta Comercial Persuasiva
            </Button>
          </div>

          {objectionResult && (
            <div className="mt-4 p-4 rounded-xl bg-lh-surface-alt border border-lh-border-subtle text-xs text-lh-text leading-relaxed whitespace-pre-wrap">
              {objectionResult}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
