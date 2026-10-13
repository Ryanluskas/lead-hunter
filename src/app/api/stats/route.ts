import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    const daysBack = range === '7d' ? 7 : 30;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Leads encontrados hoje
    const leadsFoundToday = await prisma.lead.count({
      where: {
        createdAt: { gte: startOfToday },
      },
    });

    // Total de leads geral
    const totalLeads = await prisma.lead.count();

    // 2. Leads qualificados no mês
    const qualifiedMonth = await prisma.lead.count({
      where: {
        createdAt: { gte: startOfMonth },
        status: {
          in: [
            'qualificado',
            'contato_pendente',
            'contatado',
            'interessado',
            'reuniao_agendada',
            'proposta_enviada',
            'em_negociacao',
            'vendido',
          ],
        },
      },
    });

    // 3. Vendas hoje
    const salesToday = await prisma.deal.count({
      where: {
        contractDate: { gte: startOfToday },
      },
    });

    // 4. Vendas no mês
    const dealsMonth = await prisma.deal.findMany({
      where: {
        contractDate: { gte: startOfMonth },
      },
    });
    const salesMonth = dealsMonth.length;

    // 5. Faturamento no mês (Contratado vs Recebido)
    const revenueContractedMonth = dealsMonth.reduce((acc, d) => acc + d.closedValue, 0);
    const revenueReceivedMonth = dealsMonth.reduce((acc, d) => acc + d.receivedValue, 0);

    // 6. Taxa de conversão real (Vendas fechadas / Total de prospects * 100)
    const totalClosedDeals = await prisma.deal.count();
    const conversionRate = totalLeads > 0 ? (totalClosedDeals / totalLeads) * 100 : 0;
    const averageTicket = salesMonth > 0 ? revenueContractedMonth / salesMonth : 0;

    // 7. Funil comercial nas 10 etapas oficiais exigidas pelo prompt
    const [
      countNovos,
      countEmVerificacao,
      countQualificados,
      countContatados,
      countInteressados,
      countReunioes,
      countPropostas,
      countEmNegociacao,
      countVendidos,
      countPerdidos,
    ] = await Promise.all([
      prisma.lead.count({ where: { status: 'novo' } }),
      prisma.lead.count({ where: { status: 'em_verificacao' } }),
      prisma.lead.count({ where: { status: 'qualificado' } }),
      prisma.lead.count({ where: { status: { in: ['contatado', 'contato_pendente'] } } }),
      prisma.lead.count({ where: { status: 'interessado' } }),
      prisma.lead.count({ where: { status: 'reuniao_agendada' } }),
      prisma.lead.count({ where: { status: 'proposta_enviada' } }),
      prisma.lead.count({ where: { status: 'em_negociacao' } }),
      prisma.lead.count({ where: { status: 'vendido' } }),
      prisma.lead.count({ where: { status: 'perdido' } }),
    ]);

    const funnelData = [
      { stage: 'Encontrados', count: totalLeads },
      { stage: 'Em análise', count: countEmVerificacao + countNovos },
      { stage: 'Qualificados', count: countQualificados },
      { stage: 'Contatados', count: countContatados },
      { stage: 'Interessados', count: countInteressados },
      { stage: 'Reuniões', count: countReunioes },
      { stage: 'Propostas', count: countPropostas },
      { stage: 'Negociação', count: countEmNegociacao },
      { stage: 'Vendidos', count: countVendidos },
      { stage: 'Perdidos', count: countPerdidos },
    ];

    // 8. Desempenho por segmento / nicho com agregações reais do banco
    const leadsByCategory = await prisma.lead.groupBy({
      by: ['category'],
      _count: { id: true },
    });

    const dealsWithCategory = await prisma.deal.findMany({
      include: {
        lead: { select: { category: true } },
      },
    });

    const salesByCategoryMap = new Map<string, number>();
    for (const d of dealsWithCategory) {
      const cat = d.lead?.category || 'Geral';
      salesByCategoryMap.set(cat, (salesByCategoryMap.get(cat) || 0) + 1);
    }

    const segmentData = leadsByCategory.map((c) => ({
      category: c.category,
      leads: c._count.id,
      sales: salesByCategoryMap.get(c.category) || 0,
    }));

    // 9. Dados de Tendência dos últimos N dias baseados estritamente no banco real
    const rangeStartDate = new Date(now);
    rangeStartDate.setDate(rangeStartDate.getDate() - (daysBack - 1));
    rangeStartDate.setHours(0, 0, 0, 0);

    const historicalLeads = await prisma.lead.findMany({
      where: { createdAt: { gte: rangeStartDate } },
      select: { createdAt: true },
    });

    const historicalDeals = await prisma.deal.findMany({
      where: { contractDate: { gte: rangeStartDate } },
      select: { contractDate: true, closedValue: true },
    });

    const trendData: Array<{ date: string; leads: number; sales: number; revenue: number }> = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const dayDate = new Date(now);
      dayDate.setDate(dayDate.getDate() - i);
      const dayStart = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 0, 0, 0);
      const dayEnd = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 23, 59, 59, 999);

      const dayStr = dayDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

      const dayLeads = historicalLeads.filter(
        (l) => l.createdAt >= dayStart && l.createdAt <= dayEnd
      ).length;

      const dayDeals = historicalDeals.filter(
        (d) => d.contractDate >= dayStart && d.contractDate <= dayEnd
      );

      const daySales = dayDeals.length;
      const dayRevenue = dayDeals.reduce((acc, d) => acc + d.closedValue, 0);

      trendData.push({
        date: dayStr,
        leads: dayLeads,
        sales: daySales,
        revenue: dayRevenue,
      });
    }

    // 10. Atividades recentes reais do banco
    const recentActivities = await prisma.activity.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        lead: {
          select: { id: true, businessName: true, category: true },
        },
      },
    });

    // 11. Tarefas pendentes reais do banco
    const pendingTasks = await prisma.task.findMany({
      where: { completed: false },
      take: 5,
      orderBy: { dueDate: 'asc' },
      include: {
        lead: {
          select: { id: true, businessName: true },
        },
      },
    });

    return NextResponse.json({
      metrics: {
        leadsFoundToday,
        qualifiedMonth,
        salesToday,
        salesMonth,
        revenueContractedMonth,
        revenueReceivedMonth,
        conversionRate,
        averageTicket,
        totalLeads,
      },
      funnelData,
      segmentData,
      trendData,
      recentActivities,
      pendingTasks,
    });
  } catch (error: unknown) {
    console.error('Erro ao calcular estatísticas reais:', error);
    return NextResponse.json(
      { error: 'Falha ao recuperar indicadores comerciais.' },
      { status: 500 }
    );
  }
}
