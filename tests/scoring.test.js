const test = require('node:test');
const assert = require('node:assert');

function calculateLeadScore(lead) {
  let score = 40;
  const rationales = [];

  if (!lead.website || lead.websiteStatus === 'none_stated') {
    score += 35;
    rationales.push('Sem website oficial informado (+35 pts)');
  } else if (lead.websiteStatus === 'needs_redesign') {
    score += 25;
    rationales.push('Site existente requer modernização urgente (+25 pts)');
  } else {
    score += 10;
    rationales.push('Possui website estruturado (+10 pts)');
  }

  if (lead.phone) {
    score += 15;
    rationales.push('Canal de telefone/WhatsApp verificado (+15 pts)');
  }

  const highTicketSegments = ['Dentistas', 'Clínicas', 'Oficinas', 'Contabilidade'];
  if (highTicketSegments.some((s) => lead.category.toLowerCase().includes(s.toLowerCase()))) {
    score += 10;
    rationales.push('Nicho de mercado com alto retorno sobre investimento (+10 pts)');
  }

  const finalScore = Math.min(100, Math.max(10, score));
  return { score: finalScore, rationale: rationales.join(' • ') };
}

test('Lead Scoring: Prospect sem site em nicho de alta conversão deve pontuar alto (>= 90)', () => {
  const result = calculateLeadScore({
    category: 'Dentistas',
    website: null,
    websiteStatus: 'none_stated',
    phone: '(62) 99999-1111',
  });

  assert.strictEqual(result.score, 100);
  assert.match(result.rationale, /Sem website oficial informado/);
  assert.match(result.rationale, /Canal de telefone\/WhatsApp/);
});

test('Lead Scoring: Prospect com site funcional deve ter pontuação moderada', () => {
  const result = calculateLeadScore({
    category: 'Padaria',
    website: 'https://padariaboa.com.br',
    websiteStatus: 'has_website',
    phone: null,
  });

  assert.strictEqual(result.score, 50);
});
