import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      orderBy: { contractDate: 'desc' },
      include: {
        lead: {
          select: {
            id: true,
            businessName: true,
            category: true,
            city: true,
            state: true,
            phone: true,
          },
        },
      },
    });

    const totalContracted = deals.reduce((acc, d) => acc + d.closedValue, 0);
    const totalReceived = deals.reduce((acc, d) => acc + d.receivedValue, 0);
    const totalPending = totalContracted - totalReceived;

    return NextResponse.json({
      deals,
      totals: {
        totalContracted,
        totalReceived,
        totalPending,
        count: deals.length,
      },
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar vendas:', error);
    return NextResponse.json({ error: 'Falha ao recuperar vendas.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      leadId,
      title,
      proposalValue,
      closedValue,
      receivedValue,
      paymentStatus,
      expectedPaymentDate,
      notes,
    } = body;

    if (!leadId || !closedValue) {
      return NextResponse.json(
        { error: 'Prospect e valor fechado são obrigatórios para registrar uma venda.' },
        { status: 400 }
      );
    }

    const newDeal = await prisma.deal.create({
      data: {
        leadId,
        title: title || 'Criação de Website Profissional',
        proposalValue: parseFloat(proposalValue || closedValue),
        closedValue: parseFloat(closedValue),
        receivedValue: parseFloat(receivedValue || 0),
        paymentStatus: paymentStatus || 'pendente',
        expectedPaymentDate: expectedPaymentDate ? new Date(expectedPaymentDate) : null,
        notes,
      },
    });

    // Atualizar status do lead para "vendido"
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: 'vendido' },
    });

    // Registrar atividade de comemoração / fechamento
    await prisma.activity.create({
      data: {
        leadId,
        type: 'proposta',
        title: 'Venda Fechada com Sucesso!',
        description: `Contrato fechado no valor de R$ ${parseFloat(closedValue).toFixed(2)}. Status pagamento: ${paymentStatus || 'pendente'}.`,
      },
    });

    return NextResponse.json({ deal: newDeal }, { status: 201 });
  } catch (error: unknown) {
    console.error('Erro ao registrar venda:', error);
    return NextResponse.json({ error: 'Falha ao registrar venda.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, paymentStatus, receivedValue, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID da venda obrigatório.' }, { status: 400 });
    }

    const updated = await prisma.deal.update({
      where: { id },
      data: {
        paymentStatus: paymentStatus !== undefined ? paymentStatus : undefined,
        receivedValue: receivedValue !== undefined ? parseFloat(receivedValue) : undefined,
        notes: notes !== undefined ? notes : undefined,
      },
    });

    return NextResponse.json({ deal: updated });
  } catch (error: unknown) {
    console.error('Erro ao atualizar venda:', error);
    return NextResponse.json({ error: 'Falha ao atualizar status da venda.' }, { status: 500 });
  }
}
