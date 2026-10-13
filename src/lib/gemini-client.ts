import { GoogleGenAI } from '@google/genai';

/**
 * Lead Hunter Gemini Flash Commercial Assistant
 * Integração server-side oficial utilizando o SDK @google/genai.
 *
 * REGRAS DE CONFORMIDADE:
 * 1. Opera exclusivamente com dados independentes inseridos pelo usuário ou relatórios de auditoria do próprio site.
 * 2. NUNCA envia dados brutos da Places API (como reviews ou nomes de terceiros) para treino ou análise proibida.
 * 3. Chave GEMINI_API_KEY restrita exclusivamente ao backend.
 */

export interface CommercialPromptContext {
  businessName: string;
  category: string;
  city: string;
  state: string;
  website?: string | null;
  websiteStatus?: string;
  contactName?: string | null;
  auditIssues?: string[];
  notes?: string | null;
  customTone?: 'consultivo' | 'direto' | 'amigavel';
}

export class GeminiAssistantService {
  private client: GoogleGenAI | null = null;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    this.modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

    if (apiKey) {
      try {
        this.client = new GoogleGenAI({ apiKey });
      } catch (err) {
        console.warn('Não foi possível inicializar o cliente GoogleGenAI:', err);
      }
    }
  }

  /**
   * 1. Gerador de Mensagens Comerciais para WhatsApp e E-mail
   */
  async generateCommercialMessage(context: CommercialPromptContext): Promise<{
    whatsapp: string;
    email: { subject: string; body: string };
    isDemo: boolean;
  }> {
    if (!this.client || !process.env.GEMINI_API_KEY) {
      return this.getDemoMessages(context);
    }

    const systemInstruction = `
Você é um consultor especialista em vendas de presença digital e modernização de websites para empresas e comércios locais no Brasil.
Suas abordagens são sempre em português brasileiro, profissionais, consultivas, respeitosas e jamais parecem spam.
Não faça promessas exageradas como "garanto dobrar suas vendas em 7 dias".
Foque em utilidade real: credibilidade local, velocidade de atendimento, facilidade para o cliente encontrar o negócio no celular e canal próprio sem depender apenas de algoritmos de redes sociais.
`;

    const prompt = `
Contexto do Prospect:
- Empresa: ${context.businessName}
- Segmento: ${context.category}
- Localização: ${context.city} - ${context.state}
- Situação do Website: ${context.website ? `Possui site (${context.website}), mas com oportunidades de modernização.` : 'Ainda não possui website próprio verificado.'}
- Problemas técnicos observados na auditoria: ${context.auditIssues?.join(', ') || 'Ausência de página otimizada para celular e botão direto de WhatsApp.'}
- Tom desejado: ${context.customTone || 'consultivo'}

Gere em formato JSON estrito com as chaves:
{
  "whatsapp": "Texto curto para WhatsApp (máximo 4 a 5 linhas, com quebras de linha e convite suave)",
  "emailSubject": "Assunto atraente e profissional para e-mail",
  "emailBody": "Corpo do e-mail comercial formal, com identificação de oportunidade, valor prático e convite para conversa de 10 minutos"
}
`;

    try {
      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);
      return {
        whatsapp: parsed.whatsapp,
        email: {
          subject: parsed.emailSubject,
          body: parsed.emailBody,
        },
        isDemo: false,
      };
    } catch (err: unknown) {
      console.warn('Fallback para resposta comercial demo devido a erro na API:', err);
      return this.getDemoMessages(context);
    }
  }

  /**
   * 2. Analisador de Oportunidades Comerciais
   */
  async analyzeOpportunity(context: CommercialPromptContext): Promise<{
    analysis: string;
    quickWins: string[];
    riskPoints: string[];
    isDemo: boolean;
  }> {
    if (!this.client || !process.env.GEMINI_API_KEY) {
      return {
        analysis: `A empresa ${context.businessName} no segmento de ${context.category} em ${context.city} possui alta relevância para busca local. Por não contar com um site moderno otimizado para conversão no celular, perde potenciais clientes que buscam atendimento imediato. Um site institucional limpo com agendamento direto e prova social resolve esse gargalo.`,
        quickWins: [
          'Botão flutuante de WhatsApp com mensagem de início pré-configurada',
          'Página leve carregando em menos de 1,5s no 4G',
          'Apresentação clara dos principais serviços e horários',
        ],
        riskPoints: [
          'Verificar se o decisor já possui agência contratada para marketing',
          'Confirmar o canal preferencial do proprietário antes do primeiro contato',
        ],
        isDemo: true,
      };
    }

    const prompt = `
Analise a seguinte oportunidade comercial de criação/modernização de site:
- Empresa: ${context.businessName}
- Nicho: ${context.category} em ${context.city}/${context.state}
- Status digital: ${context.websiteStatus || 'Sem site verificado'}
- Auditoria: ${context.auditIssues?.join('; ') || 'Nenhum detalhe técnico'}

Responda em formato JSON com:
{
  "analysis": "Parágrafo com diagnóstico estratégico do porquê um site moderno gerará retorno a essa empresa",
  "quickWins": ["Ganho rápido 1", "Ganho rápido 2", "Ganho rápido 3"],
  "riskPoints": ["Ponto de cautela a verificar antes de abordar", "Objeção potencial do nicho"]
}
`;

    try {
      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });
      const parsed = JSON.parse(response.text || '{}');
      return {
        analysis: parsed.analysis,
        quickWins: parsed.quickWins || [],
        riskPoints: parsed.riskPoints || [],
        isDemo: false,
      };
    } catch {
      return {
        analysis: `Diagnóstico para ${context.businessName}: forte potencial de retorno via presença digital estruturada.`,
        quickWins: ['Estrutura mobile-first', 'Integração direta com WhatsApp'],
        riskPoints: ['Confirmar decisor comercial'],
        isDemo: true,
      };
    }
  }

  /**
   * 3. Gerador de Proposta Comercial Estruturada
   */
  async generateProposal(
    context: CommercialPromptContext,
    options?: { scope?: string; estimatedDays?: number; proposedPrice?: number }
  ): Promise<{
    proposalMarkdown: string;
    isDemo: boolean;
  }> {
    if (!this.client || !process.env.GEMINI_API_KEY) {
      return {
        proposalMarkdown: this.getDemoProposal(context, options),
        isDemo: true,
      };
    }

    const prompt = `
Crie uma proposta comercial completa e elegante em Markdown para a empresa "${context.businessName}" (${context.category} em ${context.city}/${context.state}).
Escopo desejado: ${options?.scope || 'Criação de Website Institucional de Alta Conversão + Mobile First + Botão WhatsApp'}.
Prazo estimado: ${options?.estimatedDays || 10} dias úteis.
Preço de referência sugerido: R$ ${options?.proposedPrice || '1.800,00'}.

A proposta deve conter:
1. Resumo Executivo e Oportunidade Identificada
2. Solução Proposta e Tecnologias
3. Entregáveis Claros (Páginas, recursos, responsividade)
4. Benefícios Plausíveis (Sem promessas irreais de faturamento)
5. Cronograma de Execução
6. Investimento e Condições Comerciais
7. Próximos Passos
`;

    try {
      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          temperature: 0.5,
        },
      });

      return {
        proposalMarkdown: response.text || this.getDemoProposal(context, options),
        isDemo: false,
      };
    } catch {
      return {
        proposalMarkdown: this.getDemoProposal(context, options),
        isDemo: true,
      };
    }
  }

  /**
   * 4. Quebra de Objeções e Pitch Comercial
   */
  async handleObjections(objection: string, context: CommercialPromptContext): Promise<string> {
    if (!this.client || !process.env.GEMINI_API_KEY) {
      return `Para a objeção "${objection}": Entenda o ponto do cliente com empatia. Por exemplo, se ele disser "Já tenho Instagram", responda: "O Instagram é excelente para atrair quem já te segue, mas quem busca atendimento no Google ou precisa ver serviços com clareza muitas vezes não tem paciência para buscar nos destaques do perfil. Um site funciona como sua sede oficial 24h, passando muito mais segurança e fechando contatos de clientes com maior intenção de compra."`;
    }

    const prompt = `
O prospect "${context.businessName}" (${context.category}) apresentou a seguinte objeção: "${objection}".
Como um consultor de vendas experiente, forneça:
1. A resposta empática para neutralizar a resistência.
2. Uma analogia simples que demonstre o valor real do site.
3. Uma pergunta de fechamento para retomar a conversa.
`;

    try {
      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: { temperature: 0.6 },
      });
      return response.text || 'Resposta comercial indisponível no momento.';
    } catch {
      return 'Dica prática: valide a objeção do cliente e mostre como o site complementa seus canais atuais sem gerar retrabalho.';
    }
  }

  private getDemoMessages(context: CommercialPromptContext) {
    const firstName = context.contactName ? `, ${context.contactName}` : '';
    return {
      whatsapp: `Olá${firstName}! Tudo bem? Vi o trabalho da ${context.businessName} aqui em ${context.city} e percebi que vocês têm uma excelente reputação, mas ainda não contam com uma página oficial rápida no celular para quem procura seus serviços no Google. Criamos páginas modernas integradas direto ao WhatsApp que aumentam a confiança dos clientes. Poderia te enviar um exemplo prático de 2 minutos?`,
      email: {
        subject: `Oportunidade de presença digital para a ${context.businessName}`,
        body: `Prezado(a)${firstName},\n\nAcompanhando o mercado de ${context.category} em ${context.city}, identifiquei a qualidade do atendimento da ${context.businessName}.\n\nAo verificar a presença digital da empresa, notamos uma oportunidade clara: potenciais clientes que buscam seus serviços pelo celular hoje não encontram uma página direta com seus diferenciais, horários e botão de atendimento imediato.\n\nDesenvolvemos projetos enxutos, com carregamento ultra-rápido e otimizados para converter visitantes em clientes no WhatsApp.\n\nTeria disponibilidade para uma breve conversa de 10 minutos nesta semana para eu te apresentar uma prévia sem compromisso?\n\nAtenciosamente,\nEquipe Comercial Lead Hunter`,
      },
      isDemo: true,
    };
  }

  private getDemoProposal(
    context: CommercialPromptContext,
    options?: { scope?: string; estimatedDays?: number; proposedPrice?: number }
  ): string {
    const priceFormatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(options?.proposedPrice || 1850);

    return `# Proposta Comercial: Modernização Digital & Website Oficial

**Cliente:** ${context.businessName}  
**Segmento:** ${context.category}  
**Praça:** ${context.city} - ${context.state}  
**Data:** ${new Date().toLocaleDateString('pt-BR')}  

---

## 1. Oportunidade Identificada
Hoje, mais de 80% dos consumidores buscam serviços locais diretamente pelo smartphone antes de tomar uma decisão. Empresas com presença digital profissional e botão de atendimento direto transmitem mais credibilidade e captam contatos qualificados com agilidade.

## 2. Solução Proposta
Desenvolvimento de um website profissional moderno, responsivo (100% adaptado para celulares) e veloz, estruturado especificamente para gerar contatos para a **${context.businessName}**.

### Entregáveis:
- **Design Personalizado:** Alinhado às cores e identidade visual da empresa.
- **Estrutura Mobile-First:** Navegação fluida em qualquer dispositivo.
- **Chamadas de Ação Estratégicas:** Botão fixo de WhatsApp e formulário direto.
- **Apresentação de Serviços e Diferenciais:** Clareza total para quem chega à página.
- **Certificado de Segurança SSL (HTTPS):** Conexão segura e confiável.
- **Integração com Google Analytics / Tag Manager:** Medição de visitantes.

## 3. Cronograma de Execução
- **Etapa 1 (Dias 1 a 3):** Coleta de informações, briefing e estrutura inicial.
- **Etapa 2 (Dias 4 a 7):** Desenvolvimento das páginas e aprovação visual.
- **Etapa 3 (Dias 8 a 10):** Testes de responsividade, publicação e entrega final.
- **Prazo total estimado:** **${options?.estimatedDays || 10} dias úteis**.

## 4. Investimento Comercial
- **Valor do Projeto:** **${priceFormatted}**
- **Condições:** 50% de entrada no início do projeto e 50% na aprovação e entrega final (ou parcelamento em até 3x no cartão).

## 5. Próximos Passos
Para darmos início, basta confirmar o aceite desta proposta e combinarmos o alinhamento inicial.
`;
  }
}

export const geminiAssistant = new GeminiAssistantService();
