import { NextResponse } from 'next/server';
import { geminiAssistant, CommercialPromptContext } from '@/lib/gemini-client';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, context, leadId, options, objection } = body;

    if (!action) {
      return NextResponse.json({ error: 'Ação comercial da IA não informada.' }, { status: 400 });
    }

    const promptContext: CommercialPromptContext = {
      businessName: context?.businessName || 'Empresa Local',
      category: context?.category || 'Comércio Local',
      city: context?.city || 'Goiânia',
      state: context?.state || 'GO',
      website: context?.website,
      websiteStatus: context?.websiteStatus,
      contactName: context?.contactName,
      auditIssues: context?.auditIssues,
      notes: context?.notes,
      customTone: context?.customTone || 'consultivo',
    };

    let result: any = null;
    let generationType = 'mensagem_whatsapp';

    switch (action) {
      case 'message':
        result = await geminiAssistant.generateCommercialMessage(promptContext);
        generationType = 'mensagem_comercial';
        break;

      case 'opportunity':
        result = await geminiAssistant.analyzeOpportunity(promptContext);
        generationType = 'analise_oportunidade';
        break;

      case 'proposal':
        result = await geminiAssistant.generateProposal(promptContext, options);
        generationType = 'proposta_comercial';
        break;

      case 'objection':
        result = {
          response: await geminiAssistant.handleObjections(objection || 'Já tenho Instagram', promptContext),
        };
        generationType = 'quebra_objecoes';
        break;

      default:
        return NextResponse.json({ error: `Ação "${action}" inválida.` }, { status: 400 });
    }

    // Persistir geração associada ao prospect se leadId informado
    if (leadId) {
      try {
        await prisma.aiGeneration.create({
          data: {
            leadId,
            type: generationType,
            promptContext: JSON.stringify(promptContext),
            generatedContent: typeof result === 'string' ? result : JSON.stringify(result),
            modelUsed: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
          },
        });
      } catch (err) {
        console.warn('Não foi possível persistir AiGeneration:', err);
      }
    }

    // Incrementar contagem de uso da integração
    try {
      await prisma.integrationSetting.upsert({
        where: { service: 'gemini' },
        update: {
          monthlyUsageCount: { increment: 1 },
          lastChecked: new Date(),
        },
        create: {
          service: 'gemini',
          status: 'conectado',
          monthlyUsageCount: 1,
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      action,
      data: result,
      modelUsed: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    });
  } catch (error: unknown) {
    console.error('Erro na rota Gemini:', error);
    const message = error instanceof Error ? error.message : 'Falha na IA comercial';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
