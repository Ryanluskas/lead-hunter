import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const completed = searchParams.get('completed');

    const where: any = {};
    if (completed !== null && completed !== undefined && completed !== '') {
      where.completed = completed === 'true';
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [{ completed: 'asc' }, { dueDate: 'asc' }],
      include: {
        lead: {
          select: { id: true, businessName: true, category: true, phone: true },
        },
      },
    });

    return NextResponse.json({ tasks });
  } catch (error: unknown) {
    console.error('Erro ao buscar tarefas:', error);
    return NextResponse.json({ error: 'Falha ao buscar tarefas.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, dueDate, priority, leadId } = body;

    if (!title) {
      return NextResponse.json({ error: 'Título da tarefa é obrigatório.' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'media',
        leadId: leadId || null,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error: unknown) {
    console.error('Erro ao criar tarefa:', error);
    return NextResponse.json({ error: 'Falha ao criar tarefa.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, completed, title, description, dueDate, priority } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID da tarefa obrigatório.' }, { status: 400 });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        completed: completed !== undefined ? completed : undefined,
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
        priority: priority !== undefined ? priority : undefined,
      },
    });

    return NextResponse.json({ task });
  } catch (error: unknown) {
    console.error('Erro ao atualizar tarefa:', error);
    return NextResponse.json({ error: 'Falha ao atualizar tarefa.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID da tarefa obrigatório.' }, { status: 400 });
    }

    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Erro ao deletar tarefa:', error);
    return NextResponse.json({ error: 'Falha ao excluir tarefa.' }, { status: 500 });
  }
}
