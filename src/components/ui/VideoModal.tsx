'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Play, BookOpen, Search, ShieldCheck, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { Badge } from './Badge';
import { brandConfig } from '@/lib/brand';

export interface VideoTutorial {
  id: string;
  title: string;
  duration: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  steps: string[];
  keyTakeaway: string;
}

const tutorials: VideoTutorial[] = [
  {
    id: 'intro',
    title: 'Visão Geral: Como vender sites para negócios locais',
    duration: '2:15',
    category: 'Comece Aqui',
    icon: <Play className="w-4 h-4" />,
    description: `Aprenda a estruturar seu processo comercial diário no ${brandConfig.name} e transformar oportunidades em reuniões produtivas.`,
    steps: [
      '1. Entenda as métricas principais do Dashboard e seus objetivos de receita.',
      '2. Estabeleça uma meta diária de prospecção (ex: 15 prospects qualificados/dia).',
      '3. Utilize o CRM Kanban para não perder nenhum contato de follow-up.',
    ],
    keyTakeaway: 'O segredo da venda de sites locais é a personalização e a agilidade no contato via WhatsApp com diagnóstico prévio.',
  },
  {
    id: 'search',
    title: 'Pesquisa Precisa de Empresas no Google Maps',
    duration: '3:10',
    category: 'Prospecção',
    icon: <Search className="w-4 h-4" />,
    description: 'Como utilizar filtros geográficos e nichos de alta demanda (clínicas, oficinas, salões) em conformidade oficial.',
    steps: [
      '1. Defina Cidade, Estado e o Bairro de maior adensamento comercial.',
      '2. Selecione a categoria desejada e visualize os estabelecimentos no mapa.',
      '3. Identifique cartões com "Website não informado na ficha" como oportunidades potenciais.',
      '4. Adicione ao CRM para enriquecimento com verificação independente.',
    ],
    keyTakeaway: 'Nunca exporte ou armazene dados da Places API em lote. Sempre realize o enriquecimento independente para manter total conformidade legal.',
  },
  {
    id: 'audit',
    title: 'Auditoria de Websites: Encontrando falhas que vendem',
    duration: '2:45',
    category: 'Qualificação',
    icon: <ShieldCheck className="w-4 h-4" />,
    description: 'Como analisar a página existente de um cliente para demonstrar problemas de lentidão, falta de mobile e ausência de WhatsApp.',
    steps: [
      '1. Insira a URL do prospect no auditor seguro com proteção SSRF.',
      '2. Avalie o score técnico e os problemas críticos (falta de HTTPS, sem viewport mobile).',
      '3. Use as evidências para gerar o diagnóstico com a IA.',
    ],
    keyTakeaway: 'Apresentar dados técnicos concretos (como carregamento de 4s no celular) elimina o "achismo" e fecha propostas mais rápido.',
  },
  {
    id: 'gemini',
    title: 'Assistente Gemini Flash: Abordagens e Propostas',
    duration: '2:30',
    category: 'Inteligência Artificial',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Como gerar abordagens sem parecer spam e criar propostas comerciais estruturadas em segundos.',
    steps: [
      '1. Abra o assistente comercial e selecione o prospect desejado.',
      '2. Escolha o tom da abordagem (consultivo, direto ou amigável).',
      '3. Copie o roteiro para WhatsApp e use o quebra-objeções para responder dúvidas.',
    ],
    keyTakeaway: 'A IA gera o rascunho com base nas informações verificadas, mas a revisão humana garante o toque pessoal.',
  },
];

export function VideoTutorialModal({
  isOpen,
  onClose,
  initialTutorialId = 'intro',
}: {
  isOpen: boolean;
  onClose: () => void;
  initialTutorialId?: string;
}) {
  const [selectedId, setSelectedId] = useState(initialTutorialId);
  const activeTutorial = tutorials.find((t) => t.id === selectedId) || tutorials[0];
  const currentIndex = tutorials.findIndex((t) => t.id === activeTutorial.id);
  const nextTutorial = currentIndex >= 0 && currentIndex < tutorials.length - 1 ? tutorials[currentIndex + 1] : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Central de Tutoriais & Treinamento Comercial"
      description="Vídeos práticos e metodologia passo a passo para prospecção local"
      maxWidth="4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Lista lateral de tutoriais */}
        <div className="md:col-span-5 space-y-2 border-r border-lh-border/80 pr-0 md:pr-4">
          <p className="text-xs font-semibold text-lh-text-muted uppercase tracking-wider mb-2">
            Módulos de Aprendizado
          </p>
          {tutorials.map((tut) => {
            const isSelected = tut.id === activeTutorial.id;
            return (
              <button
                key={tut.id}
                onClick={() => setSelectedId(tut.id)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-150 cursor-pointer flex items-start gap-3 active:scale-98 ${
                  isSelected
                    ? 'bg-lh-primary-soft/90 border border-lh-primary-border shadow-xs'
                    : 'hover:bg-lh-surface-alt/70 border border-transparent'
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-colors shrink-0 shadow-xs ${
                    isSelected ? 'bg-lh-primary text-white' : 'bg-lh-surface-alt text-lh-text-muted'
                  }`}
                >
                  {tut.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-lh-text-muted">{tut.category}</span>
                    <span className="text-[11px] font-semibold text-lh-text lh-tabular">{tut.duration}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-lh-text truncate mt-0.5">
                    {tut.title}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>

        {/* Player e detalhes do tutorial ativo */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div>
            {/* Player visual preparado para MP4/WebM com alternativa interativa */}
            <div className="relative aspect-video bg-[#0D282F] rounded-xl overflow-hidden shadow-lh-card flex flex-col items-center justify-center text-white p-6 border border-[#174B55]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

              {/* Botão de reprodução simulada com microinteração Apple */}
              <div className="relative z-10 text-center">
                <button
                  type="button"
                  className="w-14 h-14 bg-lh-primary hover:bg-lh-primary-hover active:scale-90 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lh-elevated transition-all cursor-pointer group"
                >
                  <Play className="w-6 h-6 text-white ml-0.5 group-hover:scale-110 transition-transform" />
                </button>
                <Badge variant="primary" size="sm" className="bg-white/20 text-white border-white/20 mb-2">
                  Tutorial Prático • {activeTutorial.duration}
                </Badge>
                <h4 className="text-sm font-semibold text-white px-4 leading-snug">
                  {activeTutorial.title}
                </h4>
              </div>

              {/* Barra de progresso do player */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-[10px] text-gray-300">
                <span className="lh-tabular">00:00</span>
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-lh-accent" />
                </div>
                <span className="lh-tabular">{activeTutorial.duration}</span>
              </div>
            </div>

            {/* Descrição e Passos Práticos */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-lh-text mb-1">
                {activeTutorial.title}
              </h4>
              <p className="text-xs text-lh-text-muted leading-relaxed mb-3">
                {activeTutorial.description}
              </p>

              <div className="bg-lh-surface-alt/80 p-3.5 rounded-xl border border-lh-border/80 space-y-2 shadow-xs">
                <p className="text-xs font-semibold text-lh-text flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-lh-primary" /> Roteiro Prático:
                </p>
                <div className="space-y-1.5">
                  {activeTutorial.steps.map((st, i) => (
                    <div key={i} className="text-xs text-lh-text-secondary flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lh-accent shrink-0 mt-0.5" />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 p-2.5 bg-lh-primary-soft/70 rounded-lg border border-lh-primary-border flex items-start gap-2 text-xs text-lh-primary-text">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-lh-primary" />
                <div>
                  <span className="font-semibold">Ponto-chave: </span>
                  {activeTutorial.keyTakeaway}
                </div>
              </div>

              {/* Sugestão de próximo tutorial conforme Seção 14 */}
              {nextTutorial && (
                <div className="mt-4 pt-3 border-t border-lh-border/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-lh-text-muted uppercase font-semibold block">Próxima Aula</span>
                    <p className="text-xs font-semibold text-lh-text truncate max-w-[240px]">{nextTutorial.title}</p>
                  </div>
                  <button
                    onClick={() => setSelectedId(nextTutorial.id)}
                    className="px-3 py-1.5 rounded-lh-sm bg-lh-surface border border-lh-border text-xs font-medium text-lh-primary hover:bg-lh-surface-alt transition-colors active:scale-95 flex items-center gap-1"
                  >
                    Avançar <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
