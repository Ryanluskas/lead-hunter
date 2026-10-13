import { NextResponse } from 'next/server';
import { auditWebsite } from '@/lib/site-auditor';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, leadId } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Informe uma URL válida para auditoria.' }, { status: 400 });
    }

    // Executar auditoria com proteção SSRF embutida
    const auditResult = await auditWebsite(url);

    // Salvar auditoria se associada a um lead ou como auditoria avulsa
    let savedAudit = null;
    if (leadId) {
      savedAudit = await prisma.leadAudit.create({
        data: {
          leadId,
          url: auditResult.url,
          httpStatus: auditResult.httpStatus,
          https: auditResult.https,
          hasMobileViewport: auditResult.hasMobileViewport,
          title: auditResult.title,
          metaDescription: auditResult.metaDescription,
          headingsCount: auditResult.headingsCount,
          hasContactLink: auditResult.hasContactLink,
          hasCta: auditResult.hasCta,
          loadTimeMs: auditResult.loadTimeMs,
          score: auditResult.score,
          issues: JSON.stringify(auditResult.issues),
          recommendations: JSON.stringify(auditResult.recommendations),
        },
      });

      // Atualizar status do site no lead se necessário
      const websiteStatus = auditResult.score < 60 ? 'needs_redesign' : 'has_website';
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          website: auditResult.finalUrl,
          websiteStatus,
        },
      });

      // Registrar atividade
      await prisma.activity.create({
        data: {
          leadId,
          type: 'nota',
          title: `Auditoria técnica concluída (${auditResult.score}/100)`,
          description: `${auditResult.issues.length} pontos de atenção identificados no site ${auditResult.url}.`,
        },
      });
    }

    // Registrar evento de integração
    try {
      await prisma.integrationSetting.upsert({
        where: { service: 'audit' },
        update: {
          monthlyUsageCount: { increment: 1 },
          lastChecked: new Date(),
        },
        create: {
          service: 'audit',
          status: 'conectado',
          monthlyUsageCount: 1,
        },
      });
    } catch {}

    return NextResponse.json({ audit: auditResult, savedAuditId: savedAudit?.id });
  } catch (error: unknown) {
    console.error('Erro na rota de auditoria:', error);
    const message = error instanceof Error ? error.message : 'Falha ao executar auditoria do site.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  try {
    const audits = await prisma.leadAudit.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        lead: {
          select: { id: true, businessName: true, category: true, city: true },
        },
      },
    });

    const parsedAudits = audits.map((a) => ({
      ...a,
      issues: JSON.parse(a.issues || '[]'),
      recommendations: JSON.parse(a.recommendations || '[]'),
    }));

    return NextResponse.json({ audits: parsedAudits });
  } catch (error: unknown) {
    console.error('Erro ao listar auditorias:', error);
    return NextResponse.json({ error: 'Falha ao recuperar histórico de auditorias.' }, { status: 500 });
  }
}
