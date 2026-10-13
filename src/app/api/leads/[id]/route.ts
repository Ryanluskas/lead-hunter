import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      include: {
        audits: { orderBy: { createdAt: 'desc' } },
        activities: { orderBy: { createdAt: 'desc' } },
        tasks: { orderBy: { createdAt: 'desc' } },
        deals: { orderBy: { createdAt: 'desc' } },
        aiGenerations: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Prospect não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error: unknown) {
    console.error('Erro ao buscar lead:', error);
    return NextResponse.json({ error: 'Falha ao buscar detalhes do prospect.' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const existing = await prisma.lead.findUnique({ where: { id: params.id } });

    if (!existing) {
      return NextResponse.json({ error: 'Prospect não encontrado.' }, { status: 404 });
    }

    const previousStatus = existing.status;
    const newStatus = body.status;

    const updated = await prisma.lead.update({
      where: { id: params.id },
      data: {
        businessName: body.businessName !== undefined ? body.businessName : existing.businessName,
        category: body.category !== undefined ? body.category : existing.category,
        city: body.city !== undefined ? body.city : existing.city,
        state: body.state !== undefined ? body.state : existing.state,
        address: body.address !== undefined ? body.address : existing.address,
        phone: body.phone !== undefined ? body.phone : existing.phone,
        email: body.email !== undefined ? body.email : existing.email,
        website: body.website !== undefined ? body.website : existing.website,
        websiteStatus: body.websiteStatus !== undefined ? body.websiteStatus : existing.websiteStatus,
        status: newStatus !== undefined ? newStatus : existing.status,
        score: body.score !== undefined ? body.score : existing.score,
        lossReason: body.lossReason !== undefined ? body.lossReason : existing.lossReason,
        notes: body.notes !== undefined ? body.notes : existing.notes,
      },
    });

    // Se houve mudança de status, registrar atividade no histórico
    if (newStatus && newStatus !== previousStatus) {
      await prisma.activity.create({
        data: {
          leadId: params.id,
          type: 'status_change',
          title: `Etapa comercial alterada: ${previousStatus} → ${newStatus}`,
          description: body.lossReason ? `Motivo da perda: ${body.lossReason}` : undefined,
        },
      });
    }

    return NextResponse.json({ lead: updated });
  } catch (error: unknown) {
    console.error('Erro ao atualizar lead:', error);
    return NextResponse.json({ error: 'Falha ao atualizar dados do prospect.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.lead.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Erro ao deletar lead:', error);
    return NextResponse.json({ error: 'Falha ao excluir prospect.' }, { status: 500 });
  }
}
