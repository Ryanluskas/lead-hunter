'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { VideoTutorialModal } from '@/components/ui/VideoModal';
import { ToastProvider } from '@/components/ui/Toast';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  Users,
  ShieldCheck,
  Kanban,
  CheckSquare,
  FileText,
  DollarSign,
  Sparkles,
  BarChart3,
  PlugZap,
  Settings,
  X,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BRAND } from '@/lib/brand';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const mobileNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Buscar leads', href: '/leads/buscar', icon: MapPin },
    { name: 'Meus leads', href: '/leads', icon: Users },
    { name: 'Auditorias de sites', href: '/auditorias', icon: ShieldCheck },
    { name: 'Pipeline', href: '/pipeline', icon: Kanban },
    { name: 'Tarefas', href: '/tarefas', icon: CheckSquare },
    { name: 'Propostas', href: '/ia?tab=proposal', icon: FileText },
    { name: 'Vendas', href: '/vendas', icon: DollarSign },
    { name: 'Assistente de IA', href: '/ia', icon: Sparkles },
    { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
    { name: 'Integrações', href: '/configuracoes#integracoes', icon: PlugZap },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
  ];

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-lh-bg">
        {/* Desktop Sidebar */}
        <Sidebar onOpenTutorial={() => setTutorialOpen(true)} />

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-lh-overlay backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-lh-sidebar text-lh-text-inverse h-full p-4 flex flex-col justify-between shadow-lh-elevated z-10 border-r border-white/10">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lh-md bg-lh-sidebar-active text-lh-accent flex items-center justify-center font-bold border border-lh-accent/30">
                      <Compass className="w-4 h-4 text-lh-accent" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-white">{BRAND.name}</span>
                      <span className="block text-[10px] text-white/60">Inteligência Comercial</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-white/70 hover:text-white rounded-lh-sm"
                    aria-label="Fechar menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4 space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto">
                  {mobileNav.map((item) => {
                    const isActive = pathname === item.href.split('?')[0].split('#')[0];
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lh-md text-[13px] font-medium transition-colors',
                          isActive
                            ? 'bg-lh-sidebar-active text-white font-semibold'
                            : 'text-white/70 hover:bg-lh-sidebar-hover hover:text-white'
                        )}
                      >
                        <Icon className={cn('w-4 h-4', isActive ? 'text-lh-accent' : 'text-white/40')} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTutorialOpen(true);
                  }}
                  className="w-full py-2 text-xs font-semibold text-white bg-lh-sidebar-active hover:bg-lh-sidebar-hover border border-lh-accent/40 rounded-lh-md transition-colors"
                >
                  Assistir aos Tutoriais em Vídeo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main App Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header
            onOpenTutorial={() => setTutorialOpen(true)}
            onToggleMobileMenu={() => setMobileMenuOpen(true)}
          />
          <main className="flex-1 pb-16">{children}</main>
        </div>

        {/* Tutorial Video Modal */}
        <VideoTutorialModal
          isOpen={tutorialOpen}
          onClose={() => setTutorialOpen(false)}
        />
      </div>
    </ToastProvider>
  );
}
