import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, ShieldCheck, Compass } from 'lucide-react';
import { brandConfig } from '@/lib/brand';

export default function TermosPage() {
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
            <h1 className="text-2xl font-bold text-lh-text">Termos de Uso & Atribuição de Provedores</h1>
            <p className="text-xs text-lh-text-muted mt-1">Última atualização: Outubro de 2026</p>
          </div>

          <section className="space-y-3 text-xs text-lh-text-secondary leading-relaxed">
            <h2 className="text-sm font-semibold text-lh-text flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-lh-accent" /> 1. Conformidade com a Google Maps Platform
            </h2>
            <p>
              O **{brandConfig.name}** utiliza a API oficial **Places API (New)** da Google Maps Platform para consultas geográficas e identificação de estabelecimentos comerciais locais. O uso do serviço obedece rigorosamente aos{' '}
              <a
                href="https://cloud.google.com/maps-platform/terms?utm_campaign=gmp_git_agentskills_v1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lh-primary underline font-medium"
              >
                Termos de Serviço da Google Maps Platform
              </a>.
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Identificador de Rastreamento Documentado: <code>gmp_git_agentskills_v1</code>.</li>
              <li>Não realizamos scraping de páginas HTML, engenharia reversa ou contorno de limites do Google Maps.</li>
              <li>Conteúdos temporários da Places API (como nomes, avaliações, fotos e endereços) não são salvos em lote ou persistidos para criar bases paralelas. Apenas o identificador <code>place_id</code> é referenciado em conformidade com as diretrizes vigentes.</li>
              <li>O cadastro persistente no CRM ocorre através de **enriquecimento independente** verificado pelo usuário em fontes públicas oficiais (site da empresa, redes sociais ou contato direto).</li>
            </ul>
          </section>

          <section className="space-y-3 text-xs text-lh-text-secondary leading-relaxed border-t border-lh-border-subtle pt-4">
            <h2 className="text-sm font-semibold text-lh-text">2. Uso da Inteligência Artificial Google Gemini</h2>
            <p>
              As funcionalidades do assistente comercial e gerador de propostas utilizam a API oficial Google Gemini Flash (SDK <code>@google/genai</code>) exclusivamente no servidor. Dados do Google Maps não são enviados ao Gemini para treinamento ou retenção indevida. O assistente opera unicamente com os dados comerciais independentes e laudos de auditoria de websites informados pelo usuário.
            </p>
          </section>

          <section className="space-y-3 text-xs text-lh-text-secondary leading-relaxed border-t border-lh-border-subtle pt-4">
            <h2 className="text-sm font-semibold text-lh-text">3. Auditoria Técnica e Segurança contra SSRF</h2>
            <p>
              O módulo de auditoria de websites executa requisições HTTP seguras restritas a protocolos públicos (HTTP/HTTPS padrão). A ferramenta implementa mitigação estrita contra Server-Side Request Forgery (SSRF), bloqueando requisições para endereços de loopback (<code>localhost</code>, <code>127.0.0.1</code>), faixas de rede privada (RFC 1918) e serviços de metadados de provedores de nuvem (<code>169.254.169.254</code>).
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}
