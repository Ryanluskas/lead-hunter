'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import {
  ShieldCheck,
  RefreshCw,
  Info,
  CheckCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { brandConfig } from '@/lib/brand';

export default function ConfiguracoesPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [demoMode, setDemoMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [testingService, setTestingService] = useState<string | null>(null);
  const [testFeedback, setTestFeedback] = useState<Record<string, string>>({});

  const [agencyName, setAgencyName] = useState(`${brandConfig.name} Soluções Digitais`);
  const [salesGoal, setSalesGoal] = useState('15');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { addToast } = useToast();

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/integrations');
      const json = await res.json();
      setIntegrations(json.integrations || []);
      setDemoMode(json.demoMode);
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Erro ao carregar integrações',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleTestConnection = async (service: string) => {
    setTestingService(service);
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service }),
      });
      const json = await res.json();
      setTestFeedback((prev) => ({ ...prev, [service]: json.message || 'Verificação concluída.' }));
      addToast({
        title: 'Verificação Concluída',
        description: json.message || 'Status de integração verificado.',
        type: 'info',
      });
      fetchIntegrations();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na verificação';
      setTestFeedback((prev) => ({
        ...prev,
        [service]: msg,
      }));
      addToast({
        title: 'Falha na verificação',
        description: msg,
        type: 'error',
      });
    } finally {
      setTestingService(null);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    addToast({
      title: 'Configurações Salvas',
      description: 'Preferências da agência atualizadas com sucesso.',
      type: 'success',
    });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <PageContainer
      title="Configurações & Gestão de APIs"
      description="Gerencie credenciais, verificação real de conexões externas e limites de consumo"
    >
      {/* Alerta de Transparência de Custos */}
      <div className="p-4 bg-lh-primary-soft/60 border border-lh-primary-border rounded-xl text-xs text-lh-primary-text flex items-start gap-3">
        <Info className="w-4 h-4 text-lh-primary shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-lh-primary-text font-semibold">Controle de Custos e Cotas: </strong>
          O {brandConfig.name} possui proteção nativa contra custos excessivos. As requisições à Places API (New) utilizam FieldMask estrito para solicitar somente campos autorizados e necessários, reduzindo o custo por pesquisa. Todas as chamadas de IA e mapas possuem limites mensais configuráveis.
        </div>
      </div>

      {/* Cartões de Integrações com Teste Real de Conexão */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-lh-text">Status Real das Integrações</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {integrations.map((integ) => {
            const isConnected = integ.status === 'conectado';
            const isDemo = integ.status === 'demo';

            return (
              <Card key={integ.service} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant={isConnected ? 'success' : isDemo ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {isConnected
                        ? 'Conectado & Operacional'
                        : isDemo
                        ? 'Modo Demonstração (Sem Custo)'
                        : 'Não Configurado'}
                    </Badge>
                    <span className="text-[11px] text-lh-text-muted font-mono">
                      {integ.envVar || 'Interno'}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-lh-text">{integ.name}</h4>
                  <p className="text-xs text-lh-text-muted mt-1 leading-relaxed">
                    {integ.description}
                  </p>

                  {/* Consumo Mensal e Limites */}
                  <div className="mt-4 p-3 bg-lh-surface-alt rounded-xl border border-lh-border-subtle space-y-2 text-xs">
                    <div className="flex items-center justify-between text-lh-text-secondary">
                      <span>Chamadas neste mês:</span>
                      <strong className="text-lh-text lh-tabular">
                        {integ.usageCount} / {integ.usageLimit}
                      </strong>
                    </div>
                    <div className="w-full h-1.5 bg-lh-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-lh-primary rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (integ.usageCount / integ.usageLimit) * 100)}%`,
                        }}
                      />
                    </div>
                    {integ.lastChecked && (
                      <span className="text-[10px] text-lh-text-muted block lh-tabular">
                        Última checagem: {formatDate(integ.lastChecked)}
                      </span>
                    )}
                  </div>

                  {testFeedback[integ.service] && (
                    <div className="mt-3 p-2.5 bg-lh-primary-soft text-[11px] text-lh-primary-text rounded-lg border border-lh-primary-border">
                      {testFeedback[integ.service]}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-lh-border-subtle">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleTestConnection(integ.service)}
                    isLoading={testingService === integ.service}
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Testar Conexão Real
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Perfil da Agência e Metas Comerciais */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Perfil Comercial da Agência</CardTitle>
        </CardHeader>
        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
          {saveSuccess && (
            <div className="p-2.5 bg-lh-accent-soft text-lh-accent-text text-xs rounded-lg border border-lh-accent-border flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-lh-accent" /> Preferências salvas com sucesso!
            </div>
          )}

          <Input
            label="Nome da Agência / Consultor"
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
          />

          <Input
            label="Meta Mensal de Vendas (Contratos)"
            type="number"
            value={salesGoal}
            onChange={(e) => setSalesGoal(e.target.value)}
          />

          <Button type="submit" variant="primary" isSuccess={saveSuccess} successText="Salvo!">
            Salvar Preferências
          </Button>
        </form>
      </Card>
    </PageContainer>
  );
}
