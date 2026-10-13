import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Shield, Compass } from 'lucide-react';
import { brandConfig } from '@/lib/brand';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-lh-bg p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-lh-primary hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-lh-primary" />
            <span className="font-bold text-sm text-lh-text">{brandConfig.name}</span>
          </div>
        </div>

        <Card className="p-6 sm:p-8 space-y-6 bg-lh-surface">
          <div>
            <h1 className="text-2xl font-bold text-lh-text">Política de Privacidade & Proteção de Dados</h1>
            <p className="text-xs text-lh-text-muted mt-1">Conformidade com a LGPD e Melhores Práticas Globais</p>
          </div>

          <section className="space-y-3 text-xs text-lh-text-secondary leading-relaxed">
            <h2 className="text-sm font-semibold text-lh-text flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-lh-accent" /> 1. Coleta e Finalidade do Tratamento
            </h2>
            <p>
              O **{brandConfig.name}** foi projetado para operações de inteligência e prospecção comercial entre empresas (B2B). Tratamos apenas os dados de cadastro da sua conta (nome, e-mail) e os dados comerciais de pessoas jurídicas e estabelecimentos cadastrados por você para fins de prospecção comercial, emissão de propostas e acompanhamento do funil de vendas.
            </p>
          </section>

          <section className="space-y-3 text-xs text-lh-text-secondary leading-relaxed border-t border-lh-border-subtle pt-4">
            <h2 className="text-sm font-semibold text-lh-text">2. Segurança das Credenciais e Segredos</h2>
            <p>
              Chaves de API como <code>GOOGLE_MAPS_PLACES_SERVER_KEY</code> e <code>GEMINI_API_KEY</code> são mantidas exclusivamente em variáveis de ambiente no servidor, nunca sendo expostas no código cliente (browser) ou transmitidas publicamente.
            </p>
          </section>

          <section className="space-y-3 text-xs text-lh-text-secondary leading-relaxed border-t border-lh-border-subtle pt-4">
            <h2 className="text-sm font-semibold text-lh-text">3. Direitos do Usuário</h2>
            <p>
              Você possui total controle sobre seus dados. É possível exportar seus prospects cadastrados em formato CSV ou solicitar a exclusão integral de leads, contratos e notas comerciais a qualquer momento diretamente pelo painel.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}
