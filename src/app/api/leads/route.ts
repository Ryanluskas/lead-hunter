import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const minScore = searchParams.get('minScore');

    const where: any = {};

    if (search) {
      where.OR = [
        { businessName: { contains: search } },
        { city: { contains: search } },
        { notes: { contains: search } },
      ];
    }

    if (category && category !== 'todos') {
      where.category = category;
    }

    if (status && status !== 'todos') {
      where.status = status;
    }

    if (minScore) {
      where.score = { gte: parseInt(minScore, 10) };
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        audits: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        deals: true,
      },
    });

    return NextResponse.json({ leads });
  } catch (error: unknown) {
    console.error('Erro ao buscar leads:', error);
    return NextResponse.json({ error: 'Falha ao buscar prospects.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      businessName,
      category,
      city,
      state,
      address,
      phone,
      email,
      website,
      websiteStatus,
      googlePlaceId,
      source,
      notes,
    } = body;

    if (!businessName || !category || !city) {
      return NextResponse.json(
        { error: 'Nome comercial, segmento e cidade são campos obrigatórios.' },
        { status: 400 }
      );
    }

    // Cálculo transparente de pontuação de oportunidade (0 a 100)
    let score = 40;
    const rationales: string[] = [];

    // Fator 1: Situação do site
    if (!website || websiteStatus === 'none_stated') {
      score += 35;
      rationales.push('Sem website oficial informado (+35 pts)');
    } else if (websiteStatus === 'needs_redesign') {
      score += 25;
      rationales.push('Site existente requer modernização urgente (+25 pts)');
    } else {
      score += 10;
      rationales.push('Possui website estruturado (+10 pts)');
    }

    // Fator 2: Contato independente disponível
    if (phone) {
      score += 15;
      rationales.push('Canal de telefone/WhatsApp verificado (+15 pts)');
    }

    // Fator 3: Segmento de alta propensão a vendas
    const highTicketSegments = ['Dentistas', 'Clínicas', 'Oficinas', 'Contabilidade', 'Advocacia'];
    if (highTicketSegments.some((s) => category.toLowerCase().includes(s.toLowerCase()))) {
      score += 10;
      rationales.push('Nicho de mercado com alto retorno sobre investimento (+10 pts)');
    }

    const finalScore = Math.min(100, Math.max(10, score));
    const scoreRationale = rationales.join(' • ');

    const newLead = await prisma.lead.create({
      data: {
        businessName,
        category,
        city,
        state: state || 'GO',
        address,
        phone,
        email,
        website: website || null,
        websiteStatus: websiteStatus || (website ? 'has_website' : 'none_stated'),
        googlePlaceId: googlePlaceId || null,
        score: finalScore,
        scoreRationale,
        status: 'novo',
        source: source || 'Verificação Independente',
        notes,
      },
    });

    // Registrar atividade inicial
    await prisma.activity.create({
      data: {
        leadId: newLead.id,
        type: 'nota',
        title: 'Prospect cadastrado no CRM',
        description: `Cadastrado com pontuação de oportunidade ${finalScore}/100. ${scoreRationale}`,
      },
    });

    return NextResponse.json({ lead: newLead }, { status: 201 });
  } catch (error: unknown) {
    console.error('Erro ao cadastrar lead:', error);
    return NextResponse.json({ error: 'Falha ao cadastrar prospect no CRM.' }, { status: 500 });
  }
}
