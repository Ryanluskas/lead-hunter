'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Code,
  ArrowUpRight,
  Search,
  Bot,
  Zap,
  TrendingUp,
  CheckCircle2,
  Shield,
  Layers,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [simulatedRevenue, setSimulatedRevenue] = useState(1297);

  return (
    <div className="min-h-screen bg-[#070002] text-white selection:bg-[#ff5a5a] selection:text-black overflow-x-hidden font-sans">
      {/* --------------------------------------------------------------------- */}
      {/* HEADER: Pill Bar estilo Code Makers                                   */}
      {/* --------------------------------------------------------------------- */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 max-w-6xl mx-auto animate-[site-header-arrival_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
        <div className="bg-[#160000]/80 backdrop-blur-xl border border-[#520000]/60 rounded-full px-5 py-3 flex items-center justify-between shadow-[0_10px_30px_-10px_rgba(176,0,0,0.4)]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff5a5a] to-[#b00000] flex items-center justify-center shadow-[0_0_15px_rgba(255,90,90,0.5)] group-hover:scale-105 transition-transform">
              <Code className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight font-sora flex items-center gap-1.5">
              <span>Code Makers</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#520000] text-[#ff5a5a] border border-[#ff5a5a]/30 font-mono">
                HUNTER
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm text-[#D4D4D8]">
            <a href="#metodologia" className="hover:text-white transition-colors">
              Metodologia
            </a>
            <a href="#sala-receita" className="hover:text-white transition-colors">
              Sala de Receita
            </a>
            <Link href="/leads/buscar" className="hover:text-white transition-colors flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-[#ff5a5a]" />
              Radar de Leads
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              CRM & Gestão
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#b00000] to-[#520000] hover:from-[#ff5a5a] hover:to-[#b00000] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(176,0,0,0.4)] hover:shadow-[0_0_30px_rgba(255,90,90,0.6)] hover:-translate-y-0.5"
            >
              <span>Acessar Plataforma</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-[#240003] text-white hover:bg-[#520000] transition-colors"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-[#160000]/95 backdrop-blur-2xl border border-[#520000] rounded-2xl p-5 flex flex-col gap-4 text-sm shadow-2xl">
            <a
              href="#metodologia"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#D4D4D8] hover:text-white py-1"
            >
              Metodologia
            </a>
            <a
              href="#sala-receita"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#D4D4D8] hover:text-white py-1"
            >
              Sala de Receita
            </a>
            <Link
              href="/leads/buscar"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#D4D4D8] hover:text-white py-1 flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-[#ff5a5a]" />
              Radar de Leads no Google Maps
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#D4D4D8] hover:text-white py-1"
            >
              Dashboard Comercial
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#b00000] to-[#ff5a5a] text-center font-bold text-xs uppercase tracking-wider text-white"
            >
              Entrar no Sistema
            </Link>
          </div>
        )}
      </header>

      {/* --------------------------------------------------------------------- */}
      {/* HERO SECTION: Estilo Oficial Code Makers (Imagem 1)                  */}
      {/* --------------------------------------------------------------------- */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Fundo com Radial Ruby Glow e Marca d'água gigante */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#b00000]/30 via-[#520000]/20 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

        {/* Letra Marca d'água Gigante em Outline no Fundo */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 text-[14vw] font-black uppercase text-transparent tracking-tighter select-none pointer-events-none -z-10 whitespace-nowrap opacity-[0.06] font-sora"
             style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.5)' }}>
          CODE MAKERS
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Lado Esquerdo: Tipografia e Mensagem Principal */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#160000] border border-[#ff5a5a]/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#ff5a5a] animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#ffd6d6]">
                Code Makers + Code Hunter
              </span>
            </div>

            {/* Headline Principal */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-sora leading-[1.1]">
              Crie com IA. <br />
              Encontre com a Code Hunter. <br />
              <span className="bg-gradient-to-r from-[#ff5a5a] via-[#ffd6d6] to-[#b00000] bg-clip-text text-transparent">
                Venda com a nossa metodologia.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#D4D4D8] max-w-xl leading-relaxed">
              Descubra estabelecimentos locais sem presença digital ou com sites defasados pelo Google Maps oficial, gere abordagens consultivas com Gemini AI e feche contratos de alto valor.
            </p>

            {/* CTAs de Ação */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/leads/buscar"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#b00000] to-[#520000] hover:from-[#ff5a5a] hover:to-[#b00000] text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_35px_rgba(176,0,0,0.6)] hover:shadow-[0_0_45px_rgba(255,90,90,0.8)] hover:-translate-y-1 flex items-center gap-2 group"
              >
                <span>Buscar Clientes Agora</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                href="/dashboard"
                className="px-8 py-4 rounded-full bg-[#160000]/80 hover:bg-[#240003] border border-[#520000] hover:border-[#ff5a5a]/50 text-white font-semibold text-sm transition-all duration-300 flex items-center gap-2"
              >
                <span>Acessar Dashboard</span>
                <ChevronRight className="w-4 h-4 text-[#ff5a5a]" />
              </Link>
            </div>

            {/* Micro métricas */}
            <div className="flex items-center gap-8 pt-6 border-t border-[#3A0812]/80 text-xs text-[#8E8D92]">
              <div>
                <div className="text-white font-bold text-lg font-sora">+10.000</div>
                <span>Leads mapeáveis / mês</span>
              </div>
              <div className="w-px h-8 bg-[#3A0812]" />
              <div>
                <div className="text-white font-bold text-lg font-sora">100% Oficial</div>
                <span>Google Maps & Gemini AI</span>
              </div>
              <div className="w-px h-8 bg-[#3A0812]" />
              <div>
                <div className="text-white font-bold text-lg font-sora">R$ 1.297+</div>
                <span>Ticket médio por projeto</span>
              </div>
            </div>
          </div>

          {/* Lado Direito: Holograma Cybernetico & Card Flutuante (Imagem 1) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual Iluminado Cyber / Cabeça Futurista */}
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              {/* Círculos de Órbita e Luz */}
              <div className="absolute inset-0 rounded-full border border-[#ff5a5a]/20 animate-[course-orbit-breathe_6s_ease-in-out_infinite]" />
              <div className="absolute inset-8 rounded-full border border-[#b00000]/30 animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-[#b00000]/40 to-transparent blur-2xl" />

              {/* Elemento Gráfico Central: Wireframe Humanoide Cyber */}
              <div className="relative z-10 w-64 h-64 flex items-center justify-center">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full text-[#ff5a5a] drop-shadow-[0_0_25px_rgba(255,90,90,0.8)] animate-[hero-robot-arrival_1.2s_ease-out]"
                >
                  <defs>
                    <linearGradient id="cyberRed" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="40%" stopColor="#ff5a5a" />
                      <stop offset="100%" stopColor="#b00000" />
                    </linearGradient>
                  </defs>
                  {/* Linhas topográficas estilizadas simulando a cabeça futurista da imagem */}
                  <path
                    d="M 50 140 C 40 100, 60 40, 100 30 C 140 40, 160 100, 150 140 C 140 160, 120 180, 100 180 C 80 180, 60 160, 50 140 Z"
                    fill="none"
                    stroke="url(#cyberRed)"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                  <path
                    d="M 60 135 C 52 105, 68 50, 100 42 C 132 50, 148 105, 140 135 C 132 152, 116 168, 100 168 C 84 168, 68 152, 60 135 Z"
                    fill="none"
                    stroke="url(#cyberRed)"
                    strokeWidth="1.2"
                    opacity="0.8"
                  />
                  <path
                    d="M 70 130 C 65 108, 78 65, 100 58 C 122 65, 135 108, 130 130 C 124 144, 112 156, 100 156 C 88 156, 76 144, 70 130 Z"
                    fill="none"
                    stroke="url(#cyberRed)"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  {/* Linhas de contorno facial horizontais */}
                  <line x1="75" y1="80" x2="125" y2="80" stroke="url(#cyberRed)" strokeWidth="1" opacity="0.6" />
                  <line x1="70" y1="95" x2="130" y2="95" stroke="url(#cyberRed)" strokeWidth="1.5" opacity="0.8" />
                  <line x1="80" y1="110" x2="120" y2="110" stroke="url(#cyberRed)" strokeWidth="1" opacity="0.6" />
                  <line x1="85" y1="125" x2="115" y2="125" stroke="url(#cyberRed)" strokeWidth="1" opacity="0.5" />
                  {/* Ponto focal de IA no olho */}
                  <circle cx="100" cy="95" r="4" fill="#ffffff" className="animate-ping" />
                  <circle cx="100" cy="95" r="3" fill="#ff5a5a" />
                </svg>
              </div>

              {/* CARD FLUTUANTE DA IMAGEM 1: "DA IDEIA AO DINHEIRO NO BOLSO" */}
              <div className="absolute -bottom-6 -right-2 sm:-right-6 z-20 w-[290px] sm:w-[320px] bg-[#160000]/90 backdrop-blur-xl border border-[#ff5a5a]/40 rounded-2xl p-5 shadow-[0_20px_50px_rgba(176,0,0,0.6)] animate-[hero-shadow-drift-a_12s_ease-in-out_infinite]">
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#ff5a5a] mb-1">
                  CODE MAKERS + CODE HUNTER
                </div>
                <div className="text-base font-bold font-sora text-white leading-snug">
                  Da ideia ao cliente. <br />
                  Do cliente ao dinheiro no bolso.
                </div>
                <p className="text-xs text-[#D4D4D8] mt-2 mb-4 leading-relaxed">
                  Você encontra as empresas certas e aprende a conduzir a conversa até fechar a venda.
                </p>

                <Link
                  href="/leads/buscar"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b00000] to-[#ff5a5a] hover:from-[#ff5a5a] hover:to-[#b00000] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,90,90,0.5)] transition-all"
                >
                  <span>Entrar no Sistema</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <div className="text-[9px] uppercase tracking-wider text-center text-[#8E8D92] mt-2 font-mono">
                  CRIAR • ENCONTRAR • VENDER
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* SEÇÃO 3 ETAPAS: Conforme Imagem 3 (CRIAR, ENCONTRAR, VENDER)         */}
      {/* --------------------------------------------------------------------- */}
      <section id="metodologia" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#3A0812]/60">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#160000] border border-[#ff5a5a]/30 text-xs font-semibold text-[#ff5a5a] uppercase tracking-wider mb-4">
            Metodologia Integrada
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sora tracking-tight">
            Uma rota completa para sair da pesquisa e chegar ao pagamento.
          </h2>
          <p className="text-[#D4D4D8] text-sm sm:text-base mt-3">
            O fluxo ideal que transforma buscas comuns no Google Maps em fechamentos comerciais de alta margem.
          </p>
        </div>

        {/* 3 Cards com números gigantes de fundo (Imagem 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 01: CRIAR */}
          <div className="relative group bg-[#160000]/70 hover:bg-[#200206] backdrop-blur-md border border-[#3A0812] hover:border-[#ff5a5a]/60 rounded-3xl p-7 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_35px_rgba(176,0,0,0.3)] overflow-hidden">
            <div className="absolute -bottom-6 -right-3 text-8xl font-black text-white/5 select-none pointer-events-none font-sora group-hover:text-[#ff5a5a]/10 transition-colors">
              01
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#520000]/60 text-[#ff5a5a] text-xs font-bold font-mono border border-[#ff5a5a]/30">
                <span>01</span>
                <span>CRIAR</span>
              </span>
              <div className="w-8 h-8 rounded-full bg-[#240003] flex items-center justify-center text-[#ff5a5a] group-hover:bg-[#ff5a5a] group-hover:text-black transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl font-bold font-sora text-white mb-3">
              Crie sites e sistemas em minutos
            </h3>
            <p className="text-sm text-[#D4D4D8] leading-relaxed mb-6">
              Use IA para transformar uma ideia em um site ou sistema pronto para apresentar ao cliente com alto impacto visual.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#ff5a5a] pt-4 border-t border-[#3A0812]">
              <CheckCircle2 className="w-4 h-4 text-[#ff5a5a]" />
              <span>Seu primeiro projeto pronto</span>
            </div>
          </div>

          {/* Card 02: ENCONTRAR */}
          <div className="relative group bg-[#160000]/70 hover:bg-[#200206] backdrop-blur-md border border-[#3A0812] hover:border-[#ff5a5a]/60 rounded-3xl p-7 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_35px_rgba(176,0,0,0.3)] overflow-hidden">
            <div className="absolute -bottom-6 -right-3 text-8xl font-black text-white/5 select-none pointer-events-none font-sora group-hover:text-[#ff5a5a]/10 transition-colors">
              02
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#520000]/60 text-[#ff5a5a] text-xs font-bold font-mono border border-[#ff5a5a]/30">
                <span>02</span>
                <span>ENCONTRAR</span>
              </span>
              <div className="w-8 h-8 rounded-full bg-[#240003] flex items-center justify-center text-[#ff5a5a] group-hover:bg-[#ff5a5a] group-hover:text-black transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl font-bold font-sora text-white mb-3">
              Encontre clientes com a Code Hunter
            </h3>
            <p className="text-sm text-[#D4D4D8] leading-relaxed mb-6">
              Coloque empresas qualificadas no radar e chegue a cada conversa sabendo exatamente onde sua solução gera valor imediato.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#ff5a5a] pt-4 border-t border-[#3A0812]">
              <CheckCircle2 className="w-4 h-4 text-[#ff5a5a]" />
              <span>Oportunidades certas no radar</span>
            </div>
          </div>

          {/* Card 03: VENDER */}
          <div className="relative group bg-[#160000]/70 hover:bg-[#200206] backdrop-blur-md border border-[#3A0812] hover:border-[#ff5a5a]/60 rounded-3xl p-7 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_35px_rgba(176,0,0,0.3)] overflow-hidden">
            <div className="absolute -bottom-6 -right-3 text-8xl font-black text-white/5 select-none pointer-events-none font-sora group-hover:text-[#ff5a5a]/10 transition-colors">
              03
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#520000]/60 text-[#ff5a5a] text-xs font-bold font-mono border border-[#ff5a5a]/30">
                <span>03</span>
                <span>VENDER</span>
              </span>
              <div className="w-8 h-8 rounded-full bg-[#240003] flex items-center justify-center text-[#ff5a5a] group-hover:bg-[#ff5a5a] group-hover:text-black transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl font-bold font-sora text-white mb-3">
              Venda com a nossa metodologia
            </h3>
            <p className="text-sm text-[#D4D4D8] leading-relaxed mb-6">
              Use oferta, abordagem personalizada pelo Gemini AI, proposta comercial pronta e fechamento para fechar vendas no WhatsApp.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#ff5a5a] pt-4 border-t border-[#3A0812]">
              <CheckCircle2 className="w-4 h-4 text-[#ff5a5a]" />
              <span>Venda fechada. Dinheiro no bolso</span>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* SALA DE RECEITA • HUD SHOWCASE: Conforme Imagem 2                     */}
      {/* --------------------------------------------------------------------- */}
      <section id="sala-receita" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="bg-[#0e0104] border border-[#520000] rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_-10px_rgba(176,0,0,0.5)] relative overflow-hidden">
          {/* Top Bar da Sala de Receita */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#3A0812]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5a5a] animate-ping" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4D4D8]">
                SALA DE RECEITA • VICTOR HUGO & PROSPECÇÃO
              </span>
            </div>

            <div className="text-xs font-mono text-[#8E8D92]">
              31/08/2026 • 17:35:40 GMT-03
            </div>
          </div>

          <div className="text-center my-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-sora tracking-tight text-white">
              Vendas hoje
            </h2>
          </div>

          {/* HUD BOX PRINCIPAL COM NEON CYAN E DETALHES EM VERMELHO (Imagem 2) */}
          <div className="relative mx-auto max-w-2xl bg-[#090103] border-2 border-[#520000] rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(176,0,0,0.4)] my-6">
            {/* Marcadores Laterais Vermelhos Losango */}
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-[#ff5a5a] rotate-45 shadow-[0_0_10px_#ff5a5a]" />
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-[#ff5a5a] rotate-45 shadow-[0_0_10px_#ff5a5a]" />

            <div className="flex items-center justify-between text-xs font-mono mb-3">
              <span className="text-[#8E8D92] tracking-wider uppercase font-semibold">
                FATURAMENTO CONFIRMADO
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#240003] text-[#ff5a5a] border border-[#ff5a5a]/40 font-bold">
                CM - LIVE 01
              </span>
            </div>

            {/* VALOR GIGANTE CYAN BRILHANTE (Exato como na Imagem 2) */}
            <div className="text-center my-4">
              <div className="text-4xl sm:text-6xl font-black font-sora tracking-tight cyan-hud-text">
                R$ {simulatedRevenue.toLocaleString('pt-BR')},00
              </div>
              <div className="flex items-center justify-center gap-3 text-xs text-[#8E8D92] font-mono mt-3">
                <span className="flex items-center gap-1.5 text-[#169B62]">
                  <span className="w-2 h-2 rounded-full bg-[#169B62] animate-pulse" />
                  Atualização automática
                </span>
                <span>•</span>
                <span className="text-[#169B62] font-bold">+63% vs. ontem</span>
              </div>
            </div>
          </div>

          {/* Gráfico Visual HUD: Tendência de Vendas */}
          <div className="mt-8 pt-6 border-t border-[#3A0812]">
            <div className="flex items-center justify-between text-xs mb-4">
              <div>
                <span className="text-[#ff5a5a] font-mono uppercase font-bold tracking-wider">
                  DESEMPENHO POR HORÁRIO
                </span>
                <div className="text-white font-bold text-sm">Tendência de vendas</div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-[#8E8D92]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#ff5a5a]" /> Hoje
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#520000]" /> Média
                </span>
              </div>
            </div>

            {/* Simulação da Linha Neon do Gráfico */}
            <div className="h-28 w-full bg-[#120104] rounded-xl border border-[#3A0812] p-4 flex items-end justify-between gap-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#b00000]/10 to-transparent pointer-events-none" />
              {/* Linha SVG com Gradiente Vermelho/Cyan */}
              <svg className="absolute inset-0 w-full h-full p-2" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path
                  d="M 0 30 Q 15 90, 30 85 T 60 88 T 80 82 L 95 40 L 100 85"
                  fill="none"
                  stroke="#ff5a5a"
                  strokeWidth="2.5"
                  className="drop-shadow-[0_0_8px_rgba(255,90,90,0.8)]"
                />
              </svg>
            </div>

            {/* 3 Métricas Inferiores da Imagem 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-6 pt-4 border-t border-[#3A0812] text-xs font-mono">
              <div className="bg-[#160000]/60 p-3 rounded-xl border border-[#3A0812]">
                <div className="text-[#8E8D92]">VENDAS CONFIRMADAS</div>
                <div className="text-white font-bold text-lg font-sora mt-0.5">01</div>
                <div className="text-[10px] text-[#ff5a5a]">pagamento hoje</div>
              </div>
              <div className="bg-[#160000]/60 p-3 rounded-xl border border-[#3A0812]">
                <div className="text-[#8E8D92]">TICKET MÉDIO</div>
                <div className="text-white font-bold text-lg font-sora mt-0.5">
                  R$ {simulatedRevenue.toLocaleString('pt-BR')},00
                </div>
                <div className="text-[10px] text-[#D4D4D8]">por projeto</div>
              </div>
              <div className="bg-[#160000]/60 p-3 rounded-xl border border-[#3A0812]">
                <div className="text-[#8E8D92]">LUCRO DE HOJE</div>
                <div className="text-[#00F0FF] font-bold text-lg font-sora mt-0.5 drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
                  R$ {simulatedRevenue.toLocaleString('pt-BR')},00
                </div>
                <div className="text-[10px] text-[#169B62]">100% de margem</div>
              </div>
            </div>

            <div className="text-center text-[11px] text-[#8E8D92] mt-4 font-mono">
              • A tela acompanha automaticamente as novas vendas registradas no CRM
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* FOOTER                                                                */}
      {/* --------------------------------------------------------------------- */}
      <footer className="border-t border-[#3A0812] py-12 px-4 sm:px-6 max-w-7xl mx-auto text-xs text-[#8E8D92] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#b00000] flex items-center justify-center text-white">
            <Code className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white font-sora">Code Makers + Code Hunter</span>
          <span>© 2026. Todos os direitos reservados.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/termos" className="hover:text-white transition-colors">
            Termos de Uso
          </Link>
          <Link href="/privacidade" className="hover:text-white transition-colors">
            Privacidade
          </Link>
          <Link href="/dashboard" className="text-[#ff5a5a] hover:underline font-bold">
            Entrar no Painel ↗
          </Link>
        </div>
      </footer>
    </div>
  );
}
