'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  Search,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Sparkles,
  ShieldCheck,
  Kanban,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { formatCurrency } from '@/lib/utils';
import { AnimatedNumber, ScrollReveal } from '@/lib/motion';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [closedDeals, setClosedDeals] = useState<number>(5);
  const [averageTicket, setAverageTicket] = useState<number>(1500);

  const projectedMonthlyRevenue = closedDeals * averageTicket;
  const projectedAnnualRevenue = projectedMonthlyRevenue * 12;

  return (
    <div className="min-h-screen bg-lh-bg text-lh-text selection:bg-lh-primary-soft selection:text-lh-primary font-sans">
      {/* ------------------------------------------------------------- */}
      {/* HEADER: Navbar Executiva Translúcida Apple                    */}
      {/* ------------------------------------------------------------- */}
      <header className="fixed top-0 left-0 right-0 z-50 lh-glass border-b border-lh-border/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo Oficial */}
          <Link href="/" className="flex items-center gap-2.5 active:scale-98 transition-transform">
            <div className="w-9 h-9 rounded-lh-md bg-lh-primary text-white flex items-center justify-center font-bold shadow-xs">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-lh-text">{BRAND.name}</span>
              <span className="text-[10px] text-lh-text-muted leading-none font-medium">
                Inteligência Comercial B2B
              </span>
            </div>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-lh-text-secondary">
            <a href="#solucao" className="hover:text-lh-primary transition-colors">
              Solução
            </a>
            <a href="#recursos" className="hover:text-lh-primary transition-colors">
              Recursos
            </a>
            <a href="#simulador" className="hover:text-lh-primary transition-colors">
              Simulador de Receita
            </a>
            <Link href="/leads/buscar" className="hover:text-lh-primary transition-colors flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-lh-accent" />
              Radar de Empresas
            </Link>
          </nav>

          {/* Botões de Ação */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-lh-md bg-lh-primary hover:bg-lh-primary-hover text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              Acessar Plataforma
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-lh-text-secondary hover:text-lh-text rounded-lh-sm active:scale-90 transition-transform"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-lh-surface/95 backdrop-blur-md border-b border-lh-border/80 px-4 py-4 space-y-3">
            <a
              href="#solucao"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-sm font-medium text-lh-text-secondary hover:text-lh-primary"
            >
              Solução
            </a>
            <a
              href="#recursos"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-sm font-medium text-lh-text-secondary hover:text-lh-primary"
            >
              Recursos
            </a>
            <a
              href="#simulador"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-sm font-medium text-lh-text-secondary hover:text-lh-primary"
            >
              Simulador de Receita
            </a>
            <Link
              href="/leads/buscar"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-sm font-medium text-lh-text-secondary hover:text-lh-primary"
            >
              Radar de Empresas
            </Link>
            <div className="pt-2 border-t border-lh-border/80">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center h-10 rounded-lh-md bg-lh-primary text-white text-sm font-semibold active:scale-98"
              >
                Acessar Plataforma
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION: Executiva e Direta                             */}
      {/* ------------------------------------------------------------- */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge de Destaque */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lh-primary-soft/80 border border-lh-primary-border text-lh-primary text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inteligência Comercial & Prospecção Ativa B2B</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-lh-text tracking-tight leading-[1.15]">
            Acelere sua prospecção com <span className="text-lh-primary">dados verificados</span> e <span className="text-lh-accent">CRM inteligente</span>.
          </h1>

          {/* Descrição */}
          <p className="text-base sm:text-lg text-lh-text-secondary max-w-2xl mx-auto leading-relaxed">
            Identifique empresas promissoras em qualquer região do Brasil, audite a maturidade digital com IA e converta oportunidades em um fluxo de vendas estruturado.
          </p>

          {/* Chamada para Ação */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/leads/buscar"
              className="w-full sm:w-auto inline-flex items-center justify-center h-11 px-6 rounded-lh-md bg-lh-primary hover:bg-lh-primary-hover text-white text-sm font-semibold shadow-xs transition-all active:scale-95"
            >
              <Search className="w-4 h-4 mr-2" />
              Buscar Oportunidades no Radar
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center h-11 px-6 rounded-lh-md bg-lh-surface hover:bg-lh-surface-alt border border-lh-border/80 text-lh-text text-sm font-semibold transition-all active:scale-95 shadow-xs"
            >
              <BarChart3 className="w-4 h-4 mr-2 text-lh-primary" />
              Ver Dashboard Comercial
            </Link>
          </div>

          {/* Indicadores de Credibilidade */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto border-t border-lh-border/80 text-left">
            <div>
              <p className="text-2xl font-bold text-lh-text">100%</p>
              <p className="text-xs text-lh-text-muted mt-0.5">Google Places Oficial</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-lh-primary">10 Etapas</p>
              <p className="text-xs text-lh-text-muted mt-0.5">Funil Comercial Estruturado</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-lh-accent">IA Gemini</p>
              <p className="text-xs text-lh-text-muted mt-0.5">Diagnósticos e Abordagens</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-lh-text">Zero</p>
              <p className="text-xs text-lh-text-muted mt-0.5">Scraping Frágil ou Ilegal</p>
            </div>
          </div>
        </div>

        {/* Preview do Painel Executivo com iluminação suave */}
        <ScrollReveal className="mt-16 bg-lh-surface/90 backdrop-blur-sm rounded-lh-xl border border-lh-border/80 shadow-lh-soft p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-lh-border/80 gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-lh-text">Lead Hunter • Painel de Inteligência de Vendas</h3>
              <p className="text-xs sm:text-sm text-lh-text-muted">Acompanhamento consolidado de oportunidades ativas e conversões</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lh-accent-soft text-lh-accent text-xs font-semibold border border-lh-accent-border">
                <span className="w-2 h-2 rounded-full bg-lh-accent animate-pulse" />
                Operação em Tempo Real
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lh-md bg-lh-surface-alt/70 border border-lh-border/80 lh-card-interactive">
              <span className="text-xs font-medium text-lh-text-secondary">Radar Territorial</span>
              <p className="text-xl font-bold text-lh-text mt-1">Busca por Nicho & Cidade</p>
              <p className="text-xs text-lh-text-muted mt-1">Varredura com geolocalização e raio personalizado no Maps.</p>
            </div>
            <div className="p-4 rounded-lh-md bg-lh-surface-alt/70 border border-lh-border/80 lh-card-interactive">
              <span className="text-xs font-medium text-lh-text-secondary">Auditoria Técnica</span>
              <p className="text-xl font-bold text-lh-primary mt-1">Presença Digital & SEO</p>
              <p className="text-xs text-lh-text-muted mt-1">Identifique falhas no site do prospect antes do primeiro contato.</p>
            </div>
            <div className="p-4 rounded-lh-md bg-lh-surface-alt/70 border border-lh-border/80 lh-card-interactive">
              <span className="text-xs font-medium text-lh-text-secondary">Fechamento</span>
              <p className="text-xl font-bold text-lh-accent mt-1">Gestão de Vendas & Caixa</p>
              <p className="text-xs text-lh-text-muted mt-1">Controle contratos assinados, valores recebidos e ticket médio.</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SEÇÃO: Solução em 4 Passos Estruturados                       */}
      {/* ------------------------------------------------------------- */}
      <section id="solucao" className="py-20 bg-lh-surface border-y border-lh-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-lh-text">Do mapeamento ao fechamento comercial</h2>
            <p className="text-sm sm:text-base text-lh-text-secondary mt-2">
              Um fluxo claro que substitui planilhas desorganizadas por processos executivos previsíveis.
            </p>
          </div>

          <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lh-lg bg-lh-surface-alt/70 border border-lh-border/80 lh-card-interactive flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lh-md bg-lh-primary-soft text-lh-primary flex items-center justify-center font-bold mb-4 shadow-xs">
                  1
                </div>
                <h3 className="font-bold text-base text-lh-text">Mapeamento</h3>
                <p className="text-xs sm:text-sm text-lh-text-secondary mt-2 leading-relaxed">
                  Localize empresas ativas na sua cidade ou estado utilizando a Google Maps Places API New.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-lh-border/80 text-xs text-lh-text-muted flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-lh-primary" />
                Dados ricos e atualizados
              </div>
            </div>

            <div className="p-6 rounded-lh-lg bg-lh-surface-alt/70 border border-lh-border/80 lh-card-interactive flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lh-md bg-lh-primary-soft text-lh-primary flex items-center justify-center font-bold mb-4 shadow-xs">
                  2
                </div>
                <h3 className="font-bold text-base text-lh-text">Diagnóstico</h3>
                <p className="text-xs sm:text-sm text-lh-text-secondary mt-2 leading-relaxed">
                  Avalie o site, certificados SSL, responsividade e gere argumentos com a IA Gemini.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-lh-border/80 text-xs text-lh-text-muted flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-lh-primary" />
                Auditoria de presença digital
              </div>
            </div>

            <div className="p-6 rounded-lh-lg bg-lh-surface-alt/70 border border-lh-border/80 lh-card-interactive flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lh-md bg-lh-primary-soft text-lh-primary flex items-center justify-center font-bold mb-4 shadow-xs">
                  3
                </div>
                <h3 className="font-bold text-base text-lh-text">Pipeline Ativo</h3>
                <p className="text-xs sm:text-sm text-lh-text-secondary mt-2 leading-relaxed">
                  Mova oportunidades entre 10 etapas claras de qualificação, reuniões e propostas.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-lh-border/80 text-xs text-lh-text-muted flex items-center gap-1.5">
                <Kanban className="w-3.5 h-3.5 text-lh-primary" />
                Quadro Kanban comercial
              </div>
            </div>

            <div className="p-6 rounded-lh-lg bg-lh-surface-alt/70 border border-lh-border/80 lh-card-interactive flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lh-md bg-lh-accent-soft text-lh-accent flex items-center justify-center font-bold mb-4 shadow-xs">
                  4
                </div>
                <h3 className="font-bold text-base text-lh-text">Contrato Fechado</h3>
                <p className="text-xs sm:text-sm text-lh-text-secondary mt-2 leading-relaxed">
                  Registre o valor negociado, controle os recebimentos e alimente suas métricas de ticket médio.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-lh-border/80 text-xs text-lh-accent font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-lh-accent" />
                Receita no caixa
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SEÇÃO: Simulador de Receita Comercial                         */}
      {/* ------------------------------------------------------------- */}
      <section id="simulador" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal className="bg-lh-surface rounded-lh-xl border border-lh-border/80 shadow-lh-card p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Lado Esquerdo: Controles */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lh-accent-soft text-lh-accent text-xs font-semibold shadow-xs">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Simulador de Projeção Comercial</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-lh-text">
                Quanto sua operação pode faturar com prospecção ativa?
              </h2>

              <p className="text-sm text-lh-text-secondary leading-relaxed">
                Ajuste os valores para visualizar a estimativa de receita recorrente ou novos contratos mensais utilizando a metodologia Lead Hunter.
              </p>

              {/* Slider 1: Clientes Fechados */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-lh-text">Clientes fechados por mês:</span>
                  <span className="font-bold text-lh-primary text-base">{closedDeals} clientes</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={closedDeals}
                  onChange={(e) => setClosedDeals(Number(e.target.value))}
                  className="w-full accent-lh-primary h-2 bg-lh-bg-subtle rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-lh-text-muted">
                  <span>1 cliente</span>
                  <span>15 clientes</span>
                  <span>30 clientes</span>
                </div>
              </div>

              {/* Slider 2: Ticket Médio */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-lh-text">Ticket médio do seu serviço:</span>
                  <span className="font-bold text-lh-accent text-base">{formatCurrency(averageTicket)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={averageTicket}
                  onChange={(e) => setAverageTicket(Number(e.target.value))}
                  className="w-full accent-lh-accent h-2 bg-lh-bg-subtle rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-lh-text-muted">
                  <span>R$ 500</span>
                  <span>R$ 5.000</span>
                  <span>R$ 10.000</span>
                </div>
              </div>
            </div>

            {/* Lado Direito: Resultados Financeiros com AnimatedNumber */}
            <div className="lg:col-span-6 bg-lh-surface-alt/80 rounded-lh-lg border border-lh-border/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs">
              <div>
                <span className="text-xs font-semibold text-lh-text-muted uppercase tracking-wider block">
                  Projeção Mensal Estimada
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-lh-accent mt-2 lh-tabular">
                  <AnimatedNumber value={projectedMonthlyRevenue} isCurrency />
                </p>
                <p className="text-xs text-lh-text-muted mt-1">
                  Com base em {closedDeals} fechamentos mensais no valor médio de {formatCurrency(averageTicket)}.
                </p>
              </div>

              <div className="pt-6 border-t border-lh-border/80">
                <span className="text-xs font-semibold text-lh-text-muted uppercase tracking-wider block">
                  Potencial Anual Acumulado
                </span>
                <p className="text-2xl sm:text-3xl font-bold text-lh-text mt-1 lh-tabular">
                  <AnimatedNumber value={projectedAnnualRevenue} isCurrency />
                </p>
                <p className="text-xs text-lh-text-muted mt-1">
                  Volume de faturamento contratado em 12 meses de operação comercial contínua.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/leads/buscar"
                  className="w-full flex items-center justify-center h-11 rounded-lh-md bg-lh-primary hover:bg-lh-primary-hover text-white text-sm font-semibold transition-all active:scale-98 shadow-xs"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Iniciar Prospecção Agora
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER: Executivo e Institucional                             */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-lh-surface border-t border-lh-border/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lh-md bg-lh-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm text-lh-text">{BRAND.name}</span>
              <p className="text-[11px] text-lh-text-muted">Plataforma executiva de inteligência e conversão comercial.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-lh-text-secondary">
            <Link href="/dashboard" className="hover:text-lh-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/leads/buscar" className="hover:text-lh-primary transition-colors">
              Radar de Empresas
            </Link>
            <Link href="/configuracoes#integracoes" className="hover:text-lh-primary transition-colors">
              APIs & Integrações
            </Link>
            <Link href="/privacidade" className="hover:text-lh-primary transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-lh-primary transition-colors">
              Termos de Uso & Atribuições Google
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-lh-border/80 text-center text-[11px] text-lh-text-muted">
          © {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados. Em total conformidade com as diretrizes da Google Maps Platform.
        </div>
      </footer>
    </div>
  );
}
