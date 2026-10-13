'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Menu,
  CheckCircle2,
  PlugZap,
  User,
  ShieldCheck,
  Video,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface HeaderProps {
  onOpenTutorial?: () => void;
  onToggleMobileMenu?: () => void;
}

export function Header({ onOpenTutorial, onToggleMobileMenu }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [integrationsStatus, setIntegrationsStatus] = useState<{
    mapsOk: boolean;
    geminiOk: boolean;
    demoMode: boolean;
  }>({ mapsOk: false, geminiOk: false, demoMode: true });

  useEffect(() => {
    fetch('/api/integrations')
      .then((res) => res.json())
      .then((data) => {
        const maps = data.integrations?.find((i: any) => i.service === 'google_maps');
        const gemini = data.integrations?.find((i: any) => i.service === 'gemini');
        setIntegrationsStatus({
          mapsOk: maps?.status === 'conectado',
          geminiOk: gemini?.status === 'conectado',
          demoMode: data.demoMode,
        });
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/leads?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-lh-surface border-b border-lh-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-lh-text-secondary hover:text-lh-text hover:bg-lh-bg-subtle rounded-lh-sm cursor-pointer"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-lh-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar empresas, telefones, cidades ou notas..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-lh-surface-alt border border-lh-border rounded-lh-md text-lh-text placeholder:text-lh-text-muted focus:bg-lh-surface focus:border-lh-primary focus:outline-none focus:shadow-lh-focus transition-all"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Status das Integrações Reais */}
        <Link
          href="/configuracoes#integracoes"
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-lh-border bg-lh-surface-alt hover:bg-lh-bg-subtle transition-colors text-xs text-lh-text-secondary"
          title="Verificar saúde das APIs e cotas"
        >
          <PlugZap className="w-3.5 h-3.5 text-lh-primary" />
          <span className="text-[12px] font-medium">APIs:</span>
          {integrationsStatus.mapsOk ? (
            <span className="flex items-center gap-1 text-[11px] font-medium text-lh-success">
              <span className="w-1.5 h-1.5 rounded-full bg-lh-accent" /> Maps Ativo
            </span>
          ) : integrationsStatus.demoMode ? (
            <span className="flex items-center gap-1 text-[11px] font-medium text-lh-primary-text">
              <span className="w-1.5 h-1.5 rounded-full bg-lh-primary" /> Demonstração
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-medium text-lh-warning">
              <span className="w-1.5 h-1.5 rounded-full bg-lh-warning" /> Pendente
            </span>
          )}
        </Link>

        {/* Botão de Tutoriais */}
        {onOpenTutorial && (
          <button
            onClick={onOpenTutorial}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-lh-text-secondary hover:text-lh-primary hover:bg-lh-primary-soft rounded-lh-md transition-colors cursor-pointer"
            title="Abrir Central de Tutoriais"
          >
            <Video className="w-4 h-4 text-lh-primary" />
            <span className="hidden sm:inline">Tutoriais</span>
          </button>
        )}

        {/* Notificações Comerciais */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-lh-text-secondary hover:text-lh-text hover:bg-lh-bg-subtle rounded-lh-sm transition-colors relative cursor-pointer"
            title="Notificações Comerciais"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-lh-accent rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-lh-surface rounded-lh-xl border border-lh-border shadow-lh-elevated p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-lh-border">
                <h4 className="text-xs font-semibold text-lh-text">Notificações Comerciais</h4>
                <Badge variant="primary" size="sm">Recentes</Badge>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2.5 rounded-lh-md bg-lh-success-soft border border-lh-accent-border flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lh-success shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-lh-text">Oportunidade Qualificada</p>
                    <p className="text-[11px] text-lh-text-secondary">Novos prospects verificados aguardam abordagem.</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-lh-md bg-lh-bg-subtle border border-lh-border flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-lh-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-lh-text">Auditoria Concluída</p>
                    <p className="text-[11px] text-lh-text-secondary">Diagnóstico técnico com proteção SSRF ativo.</p>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-lh-border text-center">
                <Link
                  href="/tarefas"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-medium text-lh-primary hover:underline"
                >
                  Ver todas as tarefas e follow-ups →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Perfil Executivo do Usuário */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 cursor-pointer focus:outline-none"
            aria-label="Menu do usuário"
          >
            <div className="w-8 h-8 rounded-full bg-lh-primary text-white flex items-center justify-center font-bold text-xs ring-2 ring-lh-primary-soft">
              LH
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-lh-text leading-tight">Consultor</span>
              <span className="text-[10px] text-lh-text-muted">Lead Hunter PRO</span>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-lh-surface rounded-lh-xl border border-lh-border shadow-lh-elevated py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-lh-border">
                <p className="font-semibold text-lh-text">Equipe Comercial</p>
                <p className="text-[11px] text-lh-text-muted">Lead Hunter</p>
              </div>
              <Link
                href="/configuracoes"
                onClick={() => setShowUserMenu(false)}
                className="block px-4 py-2 text-lh-text-secondary hover:bg-lh-surface-alt hover:text-lh-text"
              >
                Configurações & APIs
              </Link>
              <Link
                href="/privacidade"
                onClick={() => setShowUserMenu(false)}
                className="block px-4 py-2 text-lh-text-secondary hover:bg-lh-surface-alt hover:text-lh-text"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/termos"
                onClick={() => setShowUserMenu(false)}
                className="block px-4 py-2 text-lh-text-secondary hover:bg-lh-surface-alt hover:text-lh-text"
              >
                Termos & Atribuições Google
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
