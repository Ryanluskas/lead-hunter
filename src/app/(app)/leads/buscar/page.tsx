'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SearchMap } from '@/components/leads/SearchMap';
import { PlacesResultCard } from '@/components/leads/PlacesResultCard';
import { EnrichmentModal } from '@/components/leads/EnrichmentModal';
import { PlaceSearchResult } from '@/lib/maps-client';
import { Card } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import {
  Search,
  MapPin,
  Map,
  List,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { staggerContainer } from '@/lib/motion';

export default function SearchPlacesPage() {
  const router = useRouter();
  const toast = useToast();
  const [city, setCity] = useState('Goiânia');
  const [state, setState] = useState('GO');
  const [neighborhood, setNeighborhood] = useState('Setor Bueno');
  const [category, setCategory] = useState('Dentistas');
  const [keyword, setKeyword] = useState('');
  const [radius, setRadius] = useState('5000');

  const [viewMode, setViewMode] = useState<'both' | 'map' | 'list'>('both');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PlaceSearchResult[]>([]);
  const [isDemo, setIsDemo] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const [selectedPlace, setSelectedPlace] = useState<PlaceSearchResult | null>(null);
  const [enrichmentModalOpen, setEnrichmentModalOpen] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage(null);

    const query = keyword.trim()
      ? `${keyword.trim()} em ${city}, ${state}`
      : `${category} em ${neighborhood ? `${neighborhood}, ` : ''}${city}, ${state}`;

    try {
      const res = await fetch('/api/places/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textQuery: query,
          city,
          state,
          category,
          radiusMeters: parseInt(radius, 10),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao pesquisar estabelecimentos');

      setResults(data.places || []);
      setIsDemo(data.isDemo);
      if (data.message) setMessage(data.message);
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Falha na requisição');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleSearch();
  }, []);

  const handleOpenEnrichment = (place: PlaceSearchResult) => {
    setSelectedPlace(place);
    setEnrichmentModalOpen(true);
  };

  const handleEnrichmentSuccess = (newLead: any) => {
    toast.success('Prospect cadastrado no CRM', `"${newLead.businessName}" foi registrado com sucesso.`);
  };

  const handleAuditWebsite = (url: string) => {
    router.push(`/auditorias?url=${encodeURIComponent(url)}`);
  };

  return (
    <PageContainer
      title="Buscar leads no Google Maps"
      description="Pesquise empresas locais por segmento e região com a Places API (New) oficial em conformidade"
      action={
        <div className="flex items-center gap-2">
          {/* Alternar Visualização */}
          <div className="bg-lh-surface p-1 rounded-lh-md border border-lh-border flex items-center gap-1 text-xs">
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-1.5 rounded-lh-sm font-medium transition-colors cursor-pointer ${
                viewMode === 'both' ? 'bg-lh-primary text-white font-semibold' : 'text-lh-text-secondary hover:text-lh-text'
              }`}
            >
              Mapa + Lista
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lh-sm font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-lh-primary text-white font-semibold' : 'text-lh-text-secondary hover:text-lh-text'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Lista
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lh-sm font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'map' ? 'bg-lh-primary text-white font-semibold' : 'text-lh-text-secondary hover:text-lh-text'
              }`}
            >
              <Map className="w-3.5 h-3.5" /> Mapa
            </button>
          </div>
        </div>
      }
    >
      {/* Formulário de Busca com Sugestões Prontas */}
      <Card className="p-5">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Input
              label="Cidade"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Goiânia"
              required
            />

            <Input
              label="Estado"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="GO"
              required
            />

            <Input
              label="Bairro / Região"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Ex: St. Bueno"
            />

            <Select
              label="Categoria Comercial"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Dentistas">Dentistas & Odontologia</option>
              <option value="Clínicas">Clínicas Médicas</option>
              <option value="Oficinas Mecânicas">Oficinas Mecânicas</option>
              <option value="Academias">Academias & Crossfit</option>
              <option value="Salões de Beleza">Salões de Beleza</option>
              <option value="Restaurantes">Restaurantes</option>
              <option value="Contabilidade">Escritórios de Contabilidade</option>
              <option value="Advocacia">Advogados</option>
              <option value="Lojas">Lojas & Comércio Geral</option>
            </Select>

            <Input
              label="Palavra-chave (Opcional)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Ex: implantes, estética"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-lh-border">
            {/* Sugestões rápidas de pesquisa regional */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-lh-text-secondary">
              <span className="font-semibold text-lh-text">Sugestões rápidas:</span>
              <button
                type="button"
                onClick={() => {
                  setCity('Goiânia');
                  setNeighborhood('Setor Bueno');
                  setCategory('Dentistas');
                  handleSearch();
                }}
                className="px-2 py-1 rounded-lh-sm bg-lh-surface-alt hover:bg-lh-primary-soft hover:text-lh-primary text-lh-text-secondary border border-lh-border transition-colors cursor-pointer"
              >
                Dentistas em Goiânia
              </button>
              <button
                type="button"
                onClick={() => {
                  setCity('Trindade');
                  setNeighborhood('Centro');
                  setCategory('Clínicas');
                  handleSearch();
                }}
                className="px-2 py-1 rounded-lh-sm bg-lh-surface-alt hover:bg-lh-primary-soft hover:text-lh-primary text-lh-text-secondary border border-lh-border transition-colors cursor-pointer"
              >
                Clínicas em Trindade
              </button>
              <button
                type="button"
                onClick={() => {
                  setCity('Aparecida de Goiânia');
                  setNeighborhood('');
                  setCategory('Academias');
                  handleSearch();
                }}
                className="px-2 py-1 rounded-lh-sm bg-lh-surface-alt hover:bg-lh-primary-soft hover:text-lh-primary text-lh-text-secondary border border-lh-border transition-colors cursor-pointer"
              >
                Academias em Aparecida
              </button>
            </div>

            <Button type="submit" variant="primary" isLoading={loading}>
              <Search className="w-4 h-4" /> Pesquisar Empresas
            </Button>
          </div>
        </form>
      </Card>

      {/* Alerta de Status / Conformidade */}
      {message && (
        <div className="p-3.5 bg-lh-primary-soft rounded-lh-md border border-lh-primary-border text-xs text-lh-primary-text flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-lh-primary shrink-0" />
            <span>{message}</span>
          </div>
          {isDemo && (
            <Badge variant="primary" size="sm">
              Modo Demonstração Ativo
            </Badge>
          )}
        </div>
      )}

      {/* Resultados da Pesquisa */}
      <div className="space-y-6">
        {/* Visualização de Mapa */}
        {(viewMode === 'both' || viewMode === 'map') && (
          <div>
            <SearchMap
              places={results}
              selectedPlaceId={selectedPlace?.id}
              onSelectPlace={(p) => setSelectedPlace(p)}
            />
          </div>
        )}

        {/* Visualização de Lista / Cartões */}
        {(viewMode === 'both' || viewMode === 'list') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-lh-text">
                Empresas Encontradas ({results.length})
              </h3>
              <p className="text-xs text-lh-text-muted">
                Cadastre o lead no CRM para confirmar os dados e preparar a abordagem
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {results.map((place) => (
                <PlacesResultCard
                  key={place.id}
                  place={place}
                  onAddToCrm={handleOpenEnrichment}
                  onAuditWebsite={handleAuditWebsite}
                />
              ))}
            </motion.div>

            {results.length === 0 && !loading && (
              <EmptyState
                kind="no-results"
                title="Nenhuma empresa encontrada nesta região"
                description="Tente alterar a categoria ou expandir o raio de pesquisa para outras áreas metropolitanas."
              />
            )}
          </div>
        )}
      </div>

      {/* Modal de Enriquecimento Independente */}
      <EnrichmentModal
        isOpen={enrichmentModalOpen}
        onClose={() => setEnrichmentModalOpen(false)}
        place={selectedPlace}
        onSuccess={handleEnrichmentSuccess}
      />
    </PageContainer>
  );
}
