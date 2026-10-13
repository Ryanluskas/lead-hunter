'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Code,
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
} from 'recharts';

// Dados dos horários simulando exatamente o gráfico da foto (pico às 00h e projeção às 22h)
const hourlyData = [
  { hour: '00', hoje: 1297, media: 0 },
  { hour: '02', hoje: 0, media: 0 },
  { hour: '04', hoje: 0, media: 0 },
  { hour: '06', hoje: 0, media: 0 },
  { hour: '08', hoje: 0, media: 0 },
  { hour: '10', hoje: 0, media: 0 },
  { hour: '12', hoje: 0, media: 0 },
  { hour: '14', hoje: 0, media: 0 },
  { hour: '16', hoje: 0, media: 0 },
  { hour: '18', hoje: 0, media: 0 },
  { hour: '20', hoje: 0, media: 0 },
  { hour: '22', hoje: 0, media: 450 },
];

export default function SalaDeReceitaPage() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [salesCount, setSalesCount] = useState<number>(1);
  const [totalRevenue, setTotalRevenue] = useState<number>(1297);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  // Relógio ao vivo em tempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(`${dateStr} • ${timeStr} GMT-03`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simular recebimento de nova venda ao vivo
  const handleSimulateSale = () => {
    const saleValue = 1297;
    setSalesCount((prev) => prev + 1);
    setTotalRevenue((prev) => prev + saleValue);
    setRecentNotification(`Nova venda confirmada! +R$ ${saleValue.toLocaleString('pt-BR')},00`);

    setTimeout(() => {
      setRecentNotification(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#070002] text-white flex flex-col justify-between selection:bg-[#ff5a5a] selection:text-black font-sans relative overflow-x-hidden">
      {/* Background Geométrico e Iluminação Dark Ruby */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3A040D]/40 via-[#100104]/80 to-[#070002] pointer-events-none -z-10" />

      {/* Grid sutil de perspectiva */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage:
            'linear-gradient(#ff5a5a 1px, transparent 1px), linear-gradient(to right, #ff5a5a 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ------------------------------------------------------------- */}
      {/* TOPO: Voltar, Logo Central Sci-Fi e Relógio                   */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-2">
        <div className="flex items-center justify-between relative">
          {/* Botão Superior Esquerdo: Voltar à dashboard */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#160000]/80 hover:bg-[#2b0208] border border-[#520000] text-xs font-semibold text-[#D4D4D8] hover:text-white transition-all shadow-[0_0_15px_rgba(176,0,0,0.25)]"
          >
            <ArrowLeft className="w-4 h-4 text-[#ff5a5a]" />
            <span>Voltar à dashboard</span>
          </Link>

          {/* Logo Central Futurista: </> CODE MAKERS */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
            <div className="hidden sm:block w-12 h-px bg-gradient-to-r from-transparent to-[#ff5a5a]" />
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#160000] border border-[#520000] shadow-[0_0_20px_rgba(176,0,0,0.5)]">
              <Code className="w-4 h-4 text-[#ff5a5a]" />
              <span className="font-extrabold text-sm tracking-wider font-sora uppercase">
                CODE MAKERS
              </span>
            </div>
            <div className="hidden sm:block w-12 h-px bg-gradient-to-l from-transparent to-[#ff5a5a]" />
          </div>

          {/* Ações Rápidas Direita: Simular / Áudio */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateSale}
              className="px-3 py-1.5 rounded-full bg-[#520000]/60 hover:bg-[#b00000] border border-[#ff5a5a]/40 text-[11px] font-mono font-bold text-[#ffd6d6] hover:text-white transition-all shadow-[0_0_15px_rgba(255,90,90,0.3)] flex items-center gap-1.5"
              title="Testar alerta de nova venda"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff5a5a]" />
              <span className="hidden sm:inline">+ Simular Venda</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full bg-[#160000] border border-[#520000] text-[#D4D4D8] hover:text-white transition-colors"
              title={soundEnabled ? 'Silenciar Alertas' : 'Ativar Som'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Título Principal Centralizado */}
        <div className="text-center mt-6">
          <div className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#ff5a5a] flex items-center justify-center gap-2">
            <span>SALA DE RECEITA</span>
            <span>•</span>
            <span className="text-white">VICTOR HUGO</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-sora tracking-tight text-white mt-1">
            Vendas hoje
          </h1>

          <div className="text-xs font-mono text-[#8E8D92] mt-1.5 flex items-center justify-center gap-2">
            <span>—</span>
            <span>{currentTime || '31/08/2026 • 17:35:40 GMT-03'}</span>
            <span>—</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* NOTIFICAÇÃO FLUTUANTE DE NOVA VENDA                           */}
      {/* ------------------------------------------------------------- */}
      {recentNotification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#160000] border-2 border-[#169B62] rounded-full px-6 py-2.5 shadow-[0_0_40px_rgba(22,155,98,0.7)] animate-bounce flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#169B62] animate-ping" />
          <span className="text-xs font-mono font-bold text-[#169B62] uppercase tracking-wider">
            {recentNotification}
          </span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CORPO PRINCIPAL: HUD CARD GIGANTE & GRÁFICO (Exato da Imagem) */}
      {/* ------------------------------------------------------------- */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex-1 flex flex-col justify-center py-4">
        {/* HUD BOX PRINCIPAL: FATURAMENTO CONFIRMADO */}
        <div className="relative bg-[#0d0104]/90 backdrop-blur-xl border-2 border-[#520000] rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_-10px_rgba(176,0,0,0.6)]">
          {/* Marcadores Laterais de Diamante Vermelho (Exatos da foto) */}
          <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 bg-[#ff5a5a] rotate-45 shadow-[0_0_20px_#ff5a5a] border border-white/40" />
          <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-5 bg-[#ff5a5a] rotate-45 shadow-[0_0_20px_#ff5a5a] border border-white/40" />

          {/* Cabeçalho do Card */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#8E8D92] uppercase font-bold tracking-wider">
              FATURAMENTO CONFIRMADO
            </span>
            <span className="px-3 py-1 rounded bg-[#240003] text-[#ff5a5a] border border-[#ff5a5a]/40 font-bold tracking-wider">
              CM - LIVE 01
            </span>
          </div>

          {/* VALOR GIGANTE CYAN BRILHANTE (Exato da Foto: R$ 1.297,00) */}
          <div className="text-center my-6 sm:my-8">
            <div className="text-5xl sm:text-7xl md:text-8xl font-black font-sora tracking-tight text-[#00F0FF] drop-shadow-[0_0_35px_rgba(0,240,255,0.7)]">
              R$ {totalRevenue.toLocaleString('pt-BR')},00
            </div>

            {/* Sublinha: Atualização automática | +63% vs. ontem */}
            <div className="flex items-center justify-center gap-4 text-xs font-mono mt-4 text-[#8E8D92]">
              <span className="flex items-center gap-2 text-[#ff5a5a]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a5a] animate-pulse" />
                <span className="font-bold">Atualização automática</span>
              </span>
              <span>•</span>
              <span className="text-[#ff5a5a] font-bold">+63% vs. ontem</span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* SEÇÃO DO GRÁFICO: TENDÊNCIA DE VENDAS                       */}
        {/* ----------------------------------------------------------- */}
        <div className="mt-8 pt-6 border-t border-[#3A0812]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#ff5a5a]">
                DESEMPENHO POR HORÁRIO
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-sora text-white">
                Tendência de vendas
              </h2>
              <div className="text-xs text-[#8E8D92]">
                Receita confirmada ao longo do dia
              </div>
            </div>

            {/* Legenda do Gráfico */}
            <div className="flex items-center gap-5 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-5 h-0.5 bg-[#ff5a5a] shadow-[0_0_8px_#ff5a5a]" />
                <span className="text-white font-bold">Hoje</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-0.5 bg-[#8E8D92]" />
                <span className="text-[#8E8D92]">Média</span>
              </div>
            </div>
          </div>

          {/* Gráfico Recharts Fiel à Foto */}
          <div className="w-full h-56 sm:h-64 bg-[#0a0103] rounded-2xl border border-[#3A0812] p-4 relative overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
            <div className="text-[10px] font-mono text-[#8E8D92] absolute top-2 left-4">
              VENDAS (R$)
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#250308" vertical={false} />
                <XAxis
                  dataKey="hour"
                  stroke="#5A5960"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#3A0812' }}
                />
                <YAxis
                  stroke="#5A5960"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => (v === 1297 ? '1,3 mil' : v === 0 ? '0' : `${v}`)}
                  ticks={[0, 324, 648, 972, 1297]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#160000] border border-[#ff5a5a] p-2.5 rounded-xl shadow-xl text-xs font-mono">
                          <div className="text-[#8E8D92]">{payload[0].payload.hour}:00h</div>
                          <div className="text-[#00F0FF] font-bold">
                            Hoje: R$ {Number(payload[0].value).toLocaleString('pt-BR')},00
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Linha Vermelha de Hoje (com pico nas 00h) */}
                <Line
                  type="monotone"
                  dataKey="hoje"
                  stroke="#ff5a5a"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#ff5a5a' }}
                  activeDot={{ r: 6, fill: '#ffffff', stroke: '#ff5a5a', strokeWidth: 2 }}
                />
                {/* Linha Branca/Cinza de Projeção Média */}
                <Line
                  type="monotone"
                  dataKey="media"
                  stroke="#8E8D92"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ----------------------------------------------------------- */}
          {/* 3 MÉTRICAS INFERIORES: Conforme Imagem 2                   */}
          {/* ----------------------------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-6">
            {/* Bloco 1: VENDAS CONFIRMADAS */}
            <div className="bg-[#120104]/80 p-4 rounded-2xl border border-[#3A0812] shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
              <div className="text-[10px] font-mono text-[#8E8D92] uppercase tracking-wider font-semibold">
                VENDAS CONFIRMADAS
              </div>
              <div className="text-2xl sm:text-3xl font-black font-sora text-white mt-1">
                {String(salesCount).padStart(2, '0')}
              </div>
              <div className="text-[10px] font-mono text-[#ff5a5a] mt-0.5 uppercase tracking-wider">
                pagamento hoje
              </div>
            </div>

            {/* Bloco 2: TICKET MÉDIO */}
            <div className="bg-[#120104]/80 p-4 rounded-2xl border border-[#3A0812] shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
              <div className="text-[10px] font-mono text-[#8E8D92] uppercase tracking-wider font-semibold">
                TICKET MÉDIO
              </div>
              <div className="text-2xl sm:text-3xl font-black font-sora text-white mt-1">
                R$ 1.297,00
              </div>
              <div className="text-[10px] font-mono text-[#D4D4D8] mt-0.5">
                por projeto
              </div>
            </div>

            {/* Bloco 3: LUCRO DE HOJE (Neon Cyan) */}
            <div className="bg-[#120104]/80 p-4 rounded-2xl border border-[#3A0812] shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
              <div className="text-[10px] font-mono text-[#8E8D92] uppercase tracking-wider font-semibold">
                LUCRO DE HOJE
              </div>
              <div className="text-2xl sm:text-3xl font-black font-sora text-[#00F0FF] drop-shadow-[0_0_15px_rgba(0,240,255,0.7)] mt-1">
                R$ {totalRevenue.toLocaleString('pt-BR')},00
              </div>
              <div className="text-[10px] font-mono text-[#ff5a5a] mt-0.5 uppercase tracking-wider font-bold">
                100% de margem
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* RODAPÉ DO MONITOR: Frase com Ponto Pulsante                   */}
      {/* ------------------------------------------------------------- */}
      <footer className="w-full py-4 text-center border-t border-[#3A0812]/40 text-xs font-mono text-[#8E8D92]">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff5a5a] animate-pulse" />
          <span>
            A tela acompanha automaticamente as novas vendas registradas por Victor Hugo
          </span>
        </div>
      </footer>
    </div>
  );
}
