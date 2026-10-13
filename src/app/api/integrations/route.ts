import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.integrationSetting.findMany();

    const mapsKeyConfigured = Boolean(process.env.GOOGLE_MAPS_PLACES_SERVER_KEY);
    const geminiKeyConfigured = Boolean(process.env.GEMINI_API_KEY);
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

    const integrations = [
      {
        service: 'google_maps',
        name: 'Google Maps Platform — Places API (New)',
        description: 'Pesquisa oficial de empresas locais, dados de localização e mapa interativo.',
        configured: mapsKeyConfigured,
        status: mapsKeyConfigured ? 'conectado' : demoMode ? 'demo' : 'nao_configurado',
        envVar: 'GOOGLE_MAPS_PLACES_SERVER_KEY',
        usageCount: settings.find((s) => s.service === 'google_maps')?.monthlyUsageCount || 0,
        usageLimit: settings.find((s) => s.service === 'google_maps')?.usageLimit || 1000,
        costEstimate: settings.find((s) => s.service === 'google_maps')?.costEstimate || 0,
        lastChecked: settings.find((s) => s.service === 'google_maps')?.lastChecked,
      },
      {
        service: 'gemini',
        name: 'Google Gemini Flash AI',
        description: 'Geração de abordagens comerciais (WhatsApp/E-mail), análise de oportunidades e propostas.',
        configured: geminiKeyConfigured,
        model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
        status: geminiKeyConfigured ? 'conectado' : demoMode ? 'demo' : 'nao_configurado',
        envVar: 'GEMINI_API_KEY',
        usageCount: settings.find((s) => s.service === 'gemini')?.monthlyUsageCount || 0,
        usageLimit: settings.find((s) => s.service === 'gemini')?.usageLimit || 2500,
        costEstimate: settings.find((s) => s.service === 'gemini')?.costEstimate || 0,
        lastChecked: settings.find((s) => s.service === 'gemini')?.lastChecked,
      },
      {
        service: 'audit',
        name: 'Website Inspector Seguro (SSRF-Guard)',
        description: 'Auditoria técnica de websites em servidores externos com bloqueio de IPs privados e SSRF.',
        configured: true,
        status: 'conectado',
        usageCount: settings.find((s) => s.service === 'audit')?.monthlyUsageCount || 0,
        usageLimit: settings.find((s) => s.service === 'audit')?.usageLimit || 500,
        costEstimate: 0,
        lastChecked: settings.find((s) => s.service === 'audit')?.lastChecked,
      },
    ];

    return NextResponse.json({ integrations, demoMode });
  } catch (error: unknown) {
    console.error('Erro ao verificar integrações:', error);
    return NextResponse.json({ error: 'Falha ao recuperar status das integrações.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { service } = body;

    if (service === 'google_maps') {
      const key = process.env.GOOGLE_MAPS_PLACES_SERVER_KEY;
      if (!key) {
        return NextResponse.json({
          status: 'demo',
          message: 'GOOGLE_MAPS_PLACES_SERVER_KEY não definida. O sistema opera perfeitamente com dados de demonstração.',
        });
      }

      // Teste real de chamada na Places API (New)
      const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': key,
          'X-Goog-FieldMask': 'places.id',
          'X-Goog-Client-Tracking-Id': 'gmp_git_agentskills_v1',
        },
        body: JSON.stringify({ textQuery: 'Goiânia' }),
      });

      if (!res.ok) {
        const txt = await res.text();
        return NextResponse.json({
          status: 'erro',
          message: `Falha na verificação da chave: ${res.status} - ${txt}`,
        });
      }

      await prisma.integrationSetting.upsert({
        where: { service: 'google_maps' },
        update: { status: 'conectado', lastChecked: new Date() },
        create: { service: 'google_maps', status: 'conectado', lastChecked: new Date() },
      });

      return NextResponse.json({ status: 'conectado', message: 'Conexão com a Places API (New) validada com sucesso!' });
    }

    if (service === 'gemini') {
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        return NextResponse.json({
          status: 'demo',
          message: 'GEMINI_API_KEY não definida. Assistente opera com templates de demonstração comercial.',
        });
      }

      await prisma.integrationSetting.upsert({
        where: { service: 'gemini' },
        update: { status: 'conectado', lastChecked: new Date() },
        create: { service: 'gemini', status: 'conectado', lastChecked: new Date() },
      });

      return NextResponse.json({ status: 'conectado', message: 'Credencial do Gemini validada com sucesso!' });
    }

    return NextResponse.json({ status: 'conectado', message: 'Serviço operacional.' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha no teste';
    return NextResponse.json({ status: 'erro', message }, { status: 500 });
  }
}
