import { NextResponse } from 'next/server';
import { searchPlacesNew } from '@/lib/maps-client';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { textQuery, city, state, category, radiusMeters, latitude, longitude } = body;

    if (!textQuery && !category) {
      return NextResponse.json(
        { error: 'Por favor, informe uma palavra-chave ou selecione uma categoria para a busca.' },
        { status: 400 }
      );
    }

    const result = await searchPlacesNew({
      textQuery: textQuery || '',
      city: city || 'Goiânia',
      state: state || 'GO',
      category: category || '',
      radiusMeters: radiusMeters ? Number(radiusMeters) : 5000,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
    });

    // Registrar incremento de uso na tabela de integrações
    try {
      await prisma.integrationSetting.upsert({
        where: { service: 'google_maps' },
        update: {
          monthlyUsageCount: { increment: 1 },
          lastChecked: new Date(),
        },
        create: {
          service: 'google_maps',
          status: result.isDemo ? 'demo' : 'conectado',
          monthlyUsageCount: 1,
        },
      });
    } catch {
      // Falha silenciosa de logging para não interromper a resposta
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Erro na rota de busca de lugares:', error);
    const message = error instanceof Error ? error.message : 'Falha ao buscar estabelecimentos';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
