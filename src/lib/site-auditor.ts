import { safeFetchWebsite, SafeFetchResponse } from './ssrf-guard';

export interface AuditIssue {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  evidence?: string;
  recommendation: string;
}

export interface WebsiteAuditResult {
  url: string;
  finalUrl: string;
  httpStatus: number;
  https: boolean;
  hasMobileViewport: boolean;
  title: string | null;
  metaDescription: string | null;
  headingsCount: number;
  hasH1: boolean;
  hasContactLink: boolean;
  hasCta: boolean;
  loadTimeMs: number;
  score: number; // 0 a 100 de maturidade do site
  issues: AuditIssue[];
  recommendations: string[];
}

export async function auditWebsite(targetUrl: string): Promise<WebsiteAuditResult> {
  const fetchResult: SafeFetchResponse = await safeFetchWebsite(targetUrl, {
    timeoutMs: 8000,
    maxSizeBytes: 2 * 1024 * 1024,
  });

  const { bodyText, status, finalUrl, loadTimeMs } = fetchResult;
  const isHttps = finalUrl.toLowerCase().startsWith('https://');

  const issues: AuditIssue[] = [];
  const recommendations: string[] = [];

  let score = 100;

  // 1. Status HTTP
  if (status !== 200) {
    score -= 30;
    issues.push({
      severity: 'critical',
      title: `Resposta HTTP com status ${status}`,
      description: 'O servidor não respondeu com o código HTTP 200 de sucesso.',
      evidence: `Status retornado: ${status}`,
      recommendation: 'Verificar se o servidor web está configurado e acessível publicamente.',
    });
  }

  // 2. HTTPS / SSL
  if (!isHttps) {
    score -= 25;
    issues.push({
      severity: 'critical',
      title: 'Ausência de conexão segura HTTPS (SSL)',
      description: 'O site é transmitido em HTTP não criptografado, gerando alerta de "Não Seguro" nos navegadores e prejudicando o ranqueamento.',
      evidence: `URL final: ${finalUrl}`,
      recommendation: 'Instalar certificado SSL gratuito (Let\'s Encrypt) e forçar redirecionamento HTTPS.',
    });
    recommendations.push('Configurar certificado SSL (HTTPS) para garantir credibilidade e segurança aos clientes.');
  }

  // 3. Meta Viewport (Mobile Responsiveness)
  const hasViewport = /<meta[^>]+name=["']viewport["'][^>]*>/i.test(bodyText);
  if (!hasViewport) {
    score -= 25;
    issues.push({
      severity: 'critical',
      title: 'Ausência de tag Viewport para celulares',
      description: 'O site não informa ao navegador como se comportar em telas menores, fazendo com que o conteúdo fique desproporcional ou ilegível em smartphones.',
      evidence: 'Nenhuma tag <meta name="viewport"> identificada no código HTML.',
      recommendation: 'Adicionar <meta name="viewport" content="width=device-width, initial-scale=1.0"> e revisar responsividade.',
    });
    recommendations.push('Modernizar o layout para tecnologia Mobile-First responsiva.');
  }

  // 4. Title Tag
  const titleMatch = bodyText.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;
  if (!title || title.length < 5) {
    score -= 10;
    issues.push({
      severity: 'warning',
      title: 'Título da página ausente ou muito curto',
      description: 'O título da página (<title>) é essencial para a exibição na aba do navegador e no Google.',
      evidence: title ? `Título atual: "${title}"` : 'Tag <title> não encontrada',
      recommendation: 'Definir título claro contendo o nome da empresa e o serviço principal.',
    });
  }

  // 5. Meta Description
  const metaDescMatch = bodyText.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null;
  if (!metaDescription) {
    score -= 10;
    issues.push({
      severity: 'warning',
      title: 'Ausência de Meta Description para buscas',
      description: 'O Google não tem um resumo oficial para exibir nos resultados de busca, diminuindo a taxa de cliques de visitantes.',
      recommendation: 'Inserir meta description concisa e atrativa com até 155 caracteres.',
    });
  }

  // 6. Heading H1
  const h1Matches = bodyText.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi);
  const hasH1 = Boolean(h1Matches && h1Matches.length > 0);
  const headingsCount = (bodyText.match(/<h[1-6][^>]*>/gi) || []).length;
  if (!hasH1) {
    score -= 10;
    issues.push({
      severity: 'warning',
      title: 'Ausência de título principal <h1>',
      description: 'A hierarquia da página carece de um cabeçalho H1 principal descrevendo a proposta de valor do negócio.',
      recommendation: 'Adicionar uma tag <h1> clara no topo da página inicial.',
    });
  }

  // 7. Links de Contato e WhatsApp
  const hasTel = /href=["']tel:[^"']+["']/i.test(bodyText);
  const hasMailto = /href=["']mailto:[^"']+["']/i.test(bodyText);
  const hasWhatsapp = /wa\.me\/|api\.whatsapp\.com|whatsapp/i.test(bodyText);
  const hasContactLink = hasTel || hasMailto || hasWhatsapp;

  if (!hasWhatsapp) {
    issues.push({
      severity: 'info',
      title: 'Oportunidade: Botão direto de WhatsApp não detectado',
      description: 'No mercado brasileiro, mais de 70% das conversões locais ocorrem por WhatsApp. Um botão flutuante direto agiliza o fechamento.',
      recommendation: 'Implementar botão flutuante oficial do WhatsApp com mensagem de início pronta.',
    });
    recommendations.push('Inserir botão de contato rápido via WhatsApp para aumentar a taxa de agendamentos.');
  }

  // 8. Chamadas para Ação (CTA)
  const ctaKeywords = /agendar|orçamento|solicitar|contato|fale conosco|ligar agora|pedir|consulte/i;
  const hasCta = ctaKeywords.test(bodyText);
  if (!hasCta) {
    score -= 10;
    issues.push({
      severity: 'warning',
      title: 'Poucas chamadas para ação (CTA) claras',
      description: 'A página não orienta o visitante sobre o próximo passo óbvio a ser tomado.',
      recommendation: 'Inserir botões de ação evidentes ("Agende uma Avaliação", "Solicite um Orçamento").',
    });
    recommendations.push('Estruturar seções com chamadas de ação persuasivas para converter visitas em clientes.');
  }

  // 9. Tempo de Carregamento
  if (loadTimeMs > 3500) {
    score -= 10;
    issues.push({
      severity: 'warning',
      title: `Carregamento lento (${(loadTimeMs / 1000).toFixed(1)}s)`,
      description: 'Páginas que demoram mais de 3 segundos para responder sofrem com altas taxas de rejeição no celular.',
      evidence: `Tempo de resposta medido: ${loadTimeMs}ms`,
      recommendation: 'Otimizar imagens, scripts pesados e migrar para hospedagem veloz.',
    });
    recommendations.push('Reduzir o tempo de carregamento para menos de 2 segundos.');
  }

  const finalScore = Math.max(10, Math.min(100, score));

  return {
    url: targetUrl,
    finalUrl,
    httpStatus: status,
    https: isHttps,
    hasMobileViewport: hasViewport,
    title,
    metaDescription,
    headingsCount,
    hasH1,
    hasContactLink,
    hasCta,
    loadTimeMs,
    score: finalScore,
    issues,
    recommendations,
  };
}
