'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
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
  ChevronLeft,
  ChevronRight,
  Compass,
  Video,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BRAND } from '@/lib/brand';

export interface SidebarProps {
  onOpenTutorial?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Buscar leads', href: '/leads/buscar', icon: MapPin },
      { name: 'Meus leads', href: '/leads', icon: Users },
      { name: 'Auditorias de sites', href: '/auditorias', icon: ShieldCheck },
    ],
  },
  {
    label: 'Comercial',
    items: [
      { name: 'Pipeline', href: '/pipeline', icon: Kanban },
      { name: 'Tarefas', href: '/tarefas', icon: CheckSquare },
      { name: 'Propostas', href: '/ia?tab=proposal', icon: FileText },
      { name: 'Vendas', href: '/vendas', icon: DollarSign },
    ],
  },
  {
    label: 'Inteligência',
    items: [
      { name: 'Assistente de IA', href: '/ia', icon: Sparkles },
      { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { name: 'Integrações', href: '/configuracoes#integracoes', icon: PlugZap },
      { name: 'Configurações', href: '/configuracoes', icon: Settings },
    ],
  },
];

export function Sidebar({ onOpenTutorial }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 248 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="hidden md:flex flex-col bg-[#09090b] text-lh-text-inverse h-screen sticky top-0 z-30 select-none shrink-0 border-r border-[#27272a] shadow-xl"
    >
      {/* Top Brand Logo */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#174B55] shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lh-md bg-[#174B55] text-lh-accent flex items-center justify-center font-bold shrink-0 border border-lh-accent/30">
            <Compass className="w-5 h-5 text-lh-accent" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-white truncate">
                  {BRAND.name}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-lh-accent text-white">
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-[#BED7DC] truncate">
                Inteligência Comercial
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 text-[#BED7DC] hover:text-white hover:bg-lh-sidebar-hover rounded-lh-sm transition-colors cursor-pointer"
          title={collapsed ? 'Expandir Menu' : 'Recolher Menu'}
          aria-label={collapsed ? 'Expandir Menu' : 'Recolher Menu'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Grouped Navigation List */}
      <nav className="flex-1 py-3 px-2 space-y-4 overflow-y-auto overflow-x-hidden">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-semibold text-[#71838A] uppercase tracking-wider">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const baseHref = item.href.split('?')[0].split('#')[0];
              const isActive =
                item.href.includes('#')
                  ? pathname === baseHref
                  : item.href.includes('?tab=proposal')
                  ? pathname === '/ia' && typeof window !== 'undefined' && window.location.search.includes('tab=proposal')
                  : pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));

              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 px-3 py-2 rounded-[4px] text-[13px] font-medium transition-colors',
                    isActive
                      ? 'bg-[#18181b] text-white font-semibold'
                      : 'text-[#BED7DC] hover:bg-lh-sidebar-hover hover:text-white'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive ? 'text-lh-accent' : 'text-[#8BA4AB] group-hover:text-white'
                    )}
                  />
                  {!collapsed && <span className="truncate flex-1">{item.name}</span>}

                  {/* Indicador fino em verde de crescimento para item ativo */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveIndicator"
                      className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-amber-400 rounded-r-sm"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer: Rodapé executivo */}
      <div className="p-3 border-t border-[#174B55] shrink-0 space-y-1.5 bg-[#0C2D35]">
        {onOpenTutorial && (
          <button
            onClick={onOpenTutorial}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#BED7DC] hover:text-white hover:bg-lh-sidebar-hover rounded-lh-md transition-colors cursor-pointer',
              collapsed && 'justify-center px-0'
            )}
            title="Vídeos Rápidos de Treinamento"
          >
            <Video className="w-4 h-4 text-lh-accent shrink-0" />
            {!collapsed && <span>Guia de Prospecção</span>}
          </button>
        )}

        <div
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 text-xs text-[#BED7DC]',
            collapsed && 'justify-center px-0'
          )}
        >
          <div className="w-2 h-2 rounded-full bg-lh-accent shrink-0" />
          {!collapsed && (
            <span className="text-[11px] text-[#8BA4AB] truncate">
              Google Maps & Gemini Ativos
            </span>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
