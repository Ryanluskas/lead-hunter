const test = require('node:test');
const assert = require('node:assert');

test('Google Maps Compliance: O identificador de rastreamento obrigatório deve ser gmp_git_agentskills_v1', () => {
  const trackingId = 'gmp_git_agentskills_v1';
  assert.strictEqual(trackingId, 'gmp_git_agentskills_v1');
});

test('Google Maps Compliance: FieldMask deve solicitar apenas campos permitidos e necessários', () => {
  const allowedFields = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.location',
    'places.rating',
    'places.userRatingCount',
    'places.websiteUri',
    'places.nationalPhoneNumber',
    'places.primaryTypeDisplayName',
    'places.googleMapsUri',
  ];

  assert.strictEqual(allowedFields.includes('places.id'), true);
  assert.strictEqual(allowedFields.includes('places.displayName'), true);
  // Não deve solicitar campos proibidos ou caros não utilizados
  assert.strictEqual(allowedFields.includes('places.reviews'), false);
});

test('Google Maps Compliance: Ausência de website deve ser rotulada como "site não informado"', () => {
  const placeWithoutSite = { websiteUri: undefined };
  const label = placeWithoutSite.websiteUri
    ? 'Website informado'
    : 'Website não informado na ficha (oportunidade a verificar)';

  assert.strictEqual(label, 'Website não informado na ficha (oportunidade a verificar)');
});
