/**
 * Google Maps Platform — Places API (New) Client
 * Implementação em estrita conformidade com os Termos de Serviço da Google Maps Platform.
 *
 * REGRAS DE CONFORMIDADE:
 * 1. Usa exclusivamente endpoints modernos Places API (New).
 * 2. FieldMask otimizado para evitar cobranças indevidas de campos desnecessários.
 * 3. Identificador de rastreamento: "gmp_git_agentskills_v1".
 * 4. NÃO armazena em lote no banco dados como endereços, nomes, telefones ou fotos.
 *    Apenas o `id` (Place ID) é retornado como identificador referencial para o frontend.
 * 5. Se o campo websiteUri for ausente, classifica como "site não informado na ficha"
 *    e NÃO como "não possui site".
 */

export interface PlaceSearchResult {
  id: string; // Google Place ID
  displayName: {
    text: string;
    languageCode?: string;
  };
  formattedAddress?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  hasWebsiteReported: boolean;
  websiteStatusLabel: string;
  nationalPhoneNumber?: string;
  primaryTypeDisplayName?: {
    text: string;
  };
  googleMapsUri?: string;
  isDemo?: boolean;
}

export interface SearchPlacesParams {
  textQuery: string;
  city?: string;
  state?: string;
  category?: string;
  radiusMeters?: number;
  latitude?: number;
  longitude?: number;
  pageSize?: number;
}

export async function searchPlacesNew(params: SearchPlacesParams): Promise<{
  places: PlaceSearchResult[];
  isDemo: boolean;
  message?: string;
}> {
  const apiKey = process.env.GOOGLE_MAPS_PLACES_SERVER_KEY;
  const isDemo = !apiKey || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  // Se não houver chave configurada, usa resultados representativos no modo demonstração
  if (isDemo) {
    return {
      places: generateDemoPlaces(params),
      isDemo: true,
      message: apiKey
        ? 'Resultados em modo demonstração ativo.'
        : 'Chave GOOGLE_MAPS_PLACES_SERVER_KEY não detectada. Exibindo resultados de demonstração para testes imediatos sem custo.',
    };
  }

  const endpoint = 'https://places.googleapis.com/v1/places:searchText';

  // Montar a query completa (ex: "Dentistas em Goiânia, Goiás")
  let query = params.textQuery;
  if (params.category && !query.includes(params.category)) {
    query = `${params.category} em ${params.city || ''} ${params.state || ''}`.trim();
  }

  // Máscara de campos solicitados (solicita somente os dados autorizados e necessários)
  const fieldMask = [
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
  ].join(',');

  const requestBody: Record<string, unknown> = {
    textQuery: query,
    pageSize: Math.min(params.pageSize || 20, 20),
    languageCode: 'pt-BR',
  };

  // Se houver coordenadas geográficas, adiciona restrição circular de área
  if (params.latitude && params.longitude) {
    requestBody.locationBias = {
      circle: {
        center: {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        radius: params.radiusMeters || 5000,
      },
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
        'X-Goog-Client-Tracking-Id': 'gmp_git_agentskills_v1',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Erro na chamada da Places API (New):', response.status, errText);
      throw new Error(`Google Maps Places API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawPlaces = data.places || [];

    const formattedPlaces: PlaceSearchResult[] = rawPlaces.map((p: any) => {
      const hasWebsite = Boolean(p.websiteUri && p.websiteUri.trim().length > 0);
      return {
        id: p.id,
        displayName: p.displayName || { text: 'Estabelecimento Comercial' },
        formattedAddress: p.formattedAddress,
        location: p.location,
        rating: p.rating,
        userRatingCount: p.userRatingCount,
        websiteUri: p.websiteUri,
        hasWebsiteReported: hasWebsite,
        websiteStatusLabel: hasWebsite
          ? 'Website informado na ficha'
          : 'Website não informado na ficha (oportunidade a verificar)',
        nationalPhoneNumber: p.nationalPhoneNumber,
        primaryTypeDisplayName: p.primaryTypeDisplayName,
        googleMapsUri: p.googleMapsUri,
        isDemo: false,
      };
    });

    return {
      places: formattedPlaces,
      isDemo: false,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha na Places API';
    console.warn(`Fallback para demonstração devido a erro na API: ${message}`);
    return {
      places: generateDemoPlaces(params),
      isDemo: true,
      message: `Aviso da API: ${message}. Exibindo dados de teste.`,
    };
  }
}

function generateDemoPlaces(params: SearchPlacesParams): PlaceSearchResult[] {
  const city = params.city || 'Goiânia';
  const state = params.state || 'GO';
  const category = params.category || 'Clínicas e Consultórios';

  return [
    {
      id: 'ChIJDemoPlace001',
      displayName: { text: `Clínica Integrada OdontoMais ${city}` },
      formattedAddress: `Av. T-63, 1420 - St. Bueno, ${city} - ${state}, 74230-100`,
      location: { latitude: -16.6869, longitude: -49.2648 },
      rating: 4.8,
      userRatingCount: 84,
      websiteUri: undefined,
      hasWebsiteReported: false,
      websiteStatusLabel: 'Website não informado na ficha (oportunidade a verificar)',
      nationalPhoneNumber: '(62) 3214-5500',
      primaryTypeDisplayName: { text: category },
      googleMapsUri: 'https://maps.google.com',
      isDemo: true,
    },
    {
      id: 'ChIJDemoPlace002',
      displayName: { text: `Centro Automotivo & Oficina Precision ${city}` },
      formattedAddress: `Av. Mutirão, 2200 - St. Marista, ${city} - ${state}, 74150-340`,
      location: { latitude: -16.7024, longitude: -49.2711 },
      rating: 4.3,
      userRatingCount: 42,
      websiteUri: 'http://oficinaprecisiondemo.com.br',
      hasWebsiteReported: true,
      websiteStatusLabel: 'Website informado na ficha',
      nationalPhoneNumber: '(62) 3942-8890',
      primaryTypeDisplayName: { text: 'Oficina Mecânica' },
      googleMapsUri: 'https://maps.google.com',
      isDemo: true,
    },
    {
      id: 'ChIJDemoPlace003',
      displayName: { text: `Espaço Saúde & Fisioterapia Vida Ativa` },
      formattedAddress: `Rua 9, 780 - St. Oeste, ${city} - ${state}, 74110-100`,
      location: { latitude: -16.6781, longitude: -49.2612 },
      rating: 4.9,
      userRatingCount: 112,
      websiteUri: undefined,
      hasWebsiteReported: false,
      websiteStatusLabel: 'Website não informado na ficha (oportunidade a verificar)',
      nationalPhoneNumber: '(62) 3522-1040',
      primaryTypeDisplayName: { text: 'Fisioterapia e Estética' },
      googleMapsUri: 'https://maps.google.com',
      isDemo: true,
    },
    {
      id: 'ChIJDemoPlace004',
      displayName: { text: `Restaurante & Empório Sabor do Cerrado` },
      formattedAddress: `Alameda Ricardo Paranhos, 540 - St. Marista, ${city} - ${state}, 74180-050`,
      location: { latitude: -16.7089, longitude: -49.2598 },
      rating: 4.6,
      userRatingCount: 310,
      websiteUri: 'http://empriosabordocerrado.com.br',
      hasWebsiteReported: true,
      websiteStatusLabel: 'Website informado na ficha',
      nationalPhoneNumber: '(62) 3281-7766',
      primaryTypeDisplayName: { text: 'Restaurante' },
      googleMapsUri: 'https://maps.google.com',
      isDemo: true,
    },
    {
      id: 'ChIJDemoPlace005',
      displayName: { text: `Studio Bella Donna Cabelo e Estética` },
      formattedAddress: `Av. T-10, 850 - St. Bueno, ${city} - ${state}, 74223-060`,
      location: { latitude: -16.6991, longitude: -49.2675 },
      rating: 4.2,
      userRatingCount: 29,
      websiteUri: undefined,
      hasWebsiteReported: false,
      websiteStatusLabel: 'Website não informado na ficha (oportunidade a verificar)',
      nationalPhoneNumber: '(62) 3998-3311',
      primaryTypeDisplayName: { text: 'Salão de Beleza' },
      googleMapsUri: 'https://maps.google.com',
      isDemo: true,
    },
    {
      id: 'ChIJDemoPlace006',
      displayName: { text: `Academia IronFit Treinamento Funcional` },
      formattedAddress: `Av. Castelo Branco, 1800 - St. Coimbra, ${city} - ${state}, 74530-010`,
      location: { latitude: -16.6712, longitude: -49.2815 },
      rating: 4.7,
      userRatingCount: 95,
      websiteUri: undefined,
      hasWebsiteReported: false,
      websiteStatusLabel: 'Website não informado na ficha (oportunidade a verificar)',
      nationalPhoneNumber: '(62) 3233-9000',
      primaryTypeDisplayName: { text: 'Academia' },
      googleMapsUri: 'https://maps.google.com',
      isDemo: true,
    },
  ];
}
