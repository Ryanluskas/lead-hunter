const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de dados comerciais para LeadPulse...');

  // 1. Limpar registros anteriores se existirem
  await prisma.aiGeneration.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.task.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.leadAudit.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();
  await prisma.integrationSetting.deleteMany();

  // 2. Criar Usuário Principal
  const user = await prisma.user.create({
    data: {
      email: 'consultor@leadpulse.com.br',
      name: 'Gabriel Martins',
      role: 'admin',
    },
  });

  // 3. Criar Leads (com enriquecimento independente e status do funil)
  const lead1 = await prisma.lead.create({
    data: {
      businessName: 'Clínica Odontológica Sorriso Perfeito',
      category: 'Dentistas',
      city: 'Goiânia',
      state: 'GO',
      address: 'Av. T-63, 1200 - Setor Bueno',
      phone: '(62) 3251-4090',
      email: 'contato@sorrisoperfeitogo.com.br',
      website: null,
      websiteStatus: 'none_stated',
      score: 92,
      scoreRationale: 'Excelente reputação local, sem website oficial no celular e ausência de canal direto de agendamento.',
      status: 'qualificado',
      source: 'Verificação Independente Google Maps + Instagram',
      notes: 'Consultório com 4 dentistas. Proprietário demonstrou interesse em modernização.',
      userId: user.id,
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      businessName: 'Auto Mecânica & Centro Automotivo Master',
      category: 'Oficinas',
      city: 'Goiânia',
      state: 'GO',
      address: 'Av. Castelo Branco, 840 - Setor Coimbra',
      phone: '(62) 3233-8820',
      email: 'oficinamastergo@gmail.com',
      website: 'http://mecanicamastergo.com.br',
      websiteStatus: 'needs_redesign',
      score: 85,
      scoreRationale: 'Possui website antigo sem HTTPS, sem viewport mobile e com tempo de resposta acima de 4 segundos.',
      status: 'proposta_enviada',
      source: 'Verificação Independente Web',
      notes: 'Proposta de redesign e botão de WhatsApp enviada. Aguardando retorno até sexta-feira.',
      userId: user.id,
    },
  });

  const lead3 = await prisma.lead.create({
    data: {
      businessName: 'Studio Bella Donna Cabelo e Estética',
      category: 'Salões de Beleza',
      city: 'Aparecida de Goiânia',
      state: 'GO',
      address: 'Av. Rio Verde, 550 - Vila Rosa',
      phone: '(62) 3588-1199',
      email: 'contato@belladonnastudio.com.br',
      website: null,
      websiteStatus: 'none_stated',
      score: 78,
      scoreRationale: 'Dependência exclusiva de Instagram; ausência de catálogo fixo de serviços e agendamentos perdidos.',
      status: 'contatado',
      source: 'Prospecção Ativa Local',
      notes: 'Primeiro contato realizado via WhatsApp. Proprietária pediu contato na parte da tarde.',
      userId: user.id,
    },
  });

  const lead4 = await prisma.lead.create({
    data: {
      businessName: 'Academia Força & Movimento',
      category: 'Academias',
      city: 'Goiânia',
      state: 'GO',
      address: 'Rua 9, 310 - Setor Marista',
      phone: '(62) 3945-0010',
      email: 'atendimento@forcaemovimento.com.br',
      website: 'https://forcaemovimento.com.br',
      websiteStatus: 'has_website',
      score: 95,
      scoreRationale: 'Contrato fechado com sucesso para landing page de planos anuais e agendamento de aula experimental.',
      status: 'vendido',
      source: 'Indicação Comercial',
      notes: 'Projeto em fase final de publicação.',
      userId: user.id,
    },
  });

  const lead5 = await prisma.lead.create({
    data: {
      businessName: 'Dr. Lucas Ribeiro - Cardiologia & Checkup',
      category: 'Clínicas',
      city: 'Goiânia',
      state: 'GO',
      address: 'Av. República do Líbano, 1500 - St. Oeste',
      phone: '(62) 3215-6677',
      email: 'dr.lucascardiologia@gmail.com',
      website: null,
      websiteStatus: 'none_stated',
      score: 88,
      scoreRationale: 'Médico especialista sem presença web estruturada; alta busca no Google pela especialidade.',
      status: 'reuniao_agendada',
      source: 'Verificação Independente Google Maps',
      notes: 'Reunião marcada via Google Meet para quinta-feira às 14h.',
      userId: user.id,
    },
  });

  const lead6 = await prisma.lead.create({
    data: {
      businessName: 'Restaurante Fogão Goiano',
      category: 'Restaurantes',
      city: 'Trindade',
      state: 'GO',
      address: 'Praça da Matriz, 45 - Centro',
      phone: '(62) 3505-1234',
      email: 'fogao.goiano@hotmail.com',
      website: null,
      websiteStatus: 'none_stated',
      score: 40,
      scoreRationale: 'Proprietário optou por manter apenas atendimento presencial e delivery por aplicativo.',
      status: 'perdido',
      lossReason: 'Cliente prefere operar apenas com cardápio impresso no momento.',
      source: 'Pesquisa Local',
      notes: 'Retomar contato em 6 meses.',
      userId: user.id,
    },
  });

  // 4. Criar Vendas e Faturamento (Deals)
  await prisma.deal.create({
    data: {
      leadId: lead4.id,
      title: 'Desenvolvimento Website + Landing Page Planos',
      proposalValue: 2400.0,
      closedValue: 2400.0,
      receivedValue: 1200.0,
      contractDate: new Date(),
      paymentStatus: 'pago_parcial',
      expectedPaymentDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      notes: '50% de entrada quitado via Pix. Saldo na entrega do projeto.',
    },
  });

  const leadPastSale = await prisma.lead.create({
    data: {
      businessName: 'Escritório Contábil Progresso',
      category: 'Contabilidade',
      city: 'Goiânia',
      state: 'GO',
      phone: '(62) 3222-1010',
      email: 'contato@contabilprogresso.com.br',
      website: 'https://contabilprogresso.com.br',
      websiteStatus: 'has_website',
      score: 90,
      scoreRationale: 'Projeto entregue no início do mês.',
      status: 'vendido',
      source: 'Prospecção Ativa',
      userId: user.id,
    },
  });

  await prisma.deal.create({
    data: {
      leadId: leadPastSale.id,
      title: 'Portal Institucional + Área de Clientes',
      proposalValue: 3200.0,
      closedValue: 3200.0,
      receivedValue: 3200.0,
      contractDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      paymentStatus: 'pago_total',
      expectedPaymentDate: new Date(),
      notes: 'Total quitado à vista.',
    },
  });

  // 5. Criar Tarefas
  await prisma.task.create({
    data: {
      leadId: lead5.id,
      title: 'Apresentar modelo de site para Dr. Lucas Ribeiro',
      description: 'Reunião às 14h. Destacar rapidez de agendamento no celular.',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: 'alta',
      completed: false,
    },
  });

  await prisma.task.create({
    data: {
      leadId: lead2.id,
      title: 'Fazer follow-up da proposta comercial (Auto Master)',
      description: 'Verificar se o sócio aprovou o escopo de modernização.',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      priority: 'media',
      completed: false,
    },
  });

  await prisma.task.create({
    data: {
      leadId: lead1.id,
      title: 'Gerar mensagem de abordagem via WhatsApp com Gemini',
      description: 'Usar o assistente IA para abordagem consultiva.',
      dueDate: new Date(),
      priority: 'alta',
      completed: true,
    },
  });

  // 6. Criar Atividades
  await prisma.activity.create({
    data: {
      leadId: lead2.id,
      type: 'proposta',
      title: 'Proposta Comercial enviada',
      description: 'Proposta de R$ 1.950,00 enviada por e-mail com prazo de 10 dias úteis.',
    },
  });

  await prisma.activity.create({
    data: {
      leadId: lead5.id,
      type: 'reuniao',
      title: 'Reunião Agendada',
      description: 'Dr. Lucas confirmou interesse em ver exemplos de páginas médicas.',
    },
  });

  // 7. Criar Auditoria Técnica para Lead 2
  await prisma.leadAudit.create({
    data: {
      leadId: lead2.id,
      url: 'http://mecanicamastergo.com.br',
      httpStatus: 200,
      https: false,
      hasMobileViewport: false,
      title: 'Página Inicial - Oficina',
      metaDescription: null,
      headingsCount: 1,
      hasContactLink: true,
      hasCta: false,
      loadTimeMs: 4200,
      score: 35,
      issues: JSON.stringify([
        {
          severity: 'critical',
          title: 'Ausência de conexão segura HTTPS',
          description: 'Navegadores acusam o site como "Não Seguro".',
          recommendation: 'Instalar certificado SSL.',
        },
        {
          severity: 'critical',
          title: 'Layout não adaptado para smartphones',
          description: 'Falta tag viewport, texto fica minúsculo no celular.',
          recommendation: 'Reformular layout para mobile-first.',
        },
        {
          severity: 'warning',
          title: 'Carregamento lento (4.2s)',
          description: 'Imagens não otimizadas atrasam o acesso dos clientes.',
          recommendation: 'Otimizar assets e migrar servidor.',
        },
      ]),
      recommendations: JSON.stringify([
        'Criar nova página moderna e rápida',
        'Implementar botão fixo de WhatsApp',
        'Ativar certificado SSL obrigatório',
      ]),
    },
  });

  // 8. Configurações de Integrações
  await prisma.integrationSetting.upsert({
    where: { service: 'google_maps' },
    update: { status: 'conectado', monthlyUsageCount: 48, usageLimit: 1000 },
    create: {
      service: 'google_maps',
      status: 'conectado',
      monthlyUsageCount: 48,
      usageLimit: 1000,
      costEstimate: 0.0,
    },
  });

  await prisma.integrationSetting.upsert({
    where: { service: 'gemini' },
    update: { status: 'conectado', monthlyUsageCount: 112, usageLimit: 2500 },
    create: {
      service: 'gemini',
      status: 'conectado',
      monthlyUsageCount: 112,
      usageLimit: 2500,
      costEstimate: 0.0,
    },
  });

  await prisma.integrationSetting.upsert({
    where: { service: 'audit' },
    update: { status: 'conectado', monthlyUsageCount: 26, usageLimit: 500 },
    create: {
      service: 'audit',
      status: 'conectado',
      monthlyUsageCount: 26,
      usageLimit: 500,
      costEstimate: 0.0,
    },
  });

  console.log('Seed de dados comerciais concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
