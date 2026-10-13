'use client';

import React, { useState } from 'react';
import { PlaceSearchResult } from '@/lib/maps-client';
import { MapPin, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface SearchMapProps {
  places: PlaceSearchResult[];
  selectedPlaceId?: string | null;
  onSelectPlace?: (place: PlaceSearchResult) => void;
  center?: { lat: number; lng: number };
}

export function SearchMap({
  places,
  selectedPlaceId,
  onSelectPlace,
}: SearchMapProps) {
  const [activePlace, setActivePlace] = useState<PlaceSearchResult | null>(
    places.find((p) => p.id === selectedPlaceId) || null
  );

  return (
    <div className="relative w-full h-[520px] rounded-lh-lg overflow-hidden border border-lh-border bg-[#E5E3DF] shadow-inner flex flex-col">
      {/* Top attribution overlay */}
      <div className="absolute top-3 left-3 z-10 bg-lh-surface/95 backdrop-blur-xs px-3 py-1.5 rounded-lh-md border border-lh-border shadow-sm flex items-center gap-2 text-xs">
        <span className="font-semibold text-lh-text">Google Maps Platform</span>
        <span className="text-lh-text-muted text-[11px]">• {places.length} locais encontrados</span>
      </div>

      {/* Map visualization canvas */}
      <div className="relative flex-1 w-full bg-[#ECEAEB] overflow-hidden flex items-center justify-center select-none">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(#C3C3C3 1px, transparent 1px), linear-gradient(to right, #D8D6D7 1px, transparent 1px), linear-gradient(to bottom, #D8D6D7 1px, transparent 1px)',
            backgroundSize: '24px 24px, 120px 120px, 120px 120px',
          }}
        />

        {/* Center geographic label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20 text-center">
          <p className="text-3xl font-extrabold tracking-widest text-lh-text uppercase">
            Área de Prospecção
          </p>
          <p className="text-xs text-lh-text-secondary mt-1">Busca Geográfica de Empresas</p>
        </div>

        {/* Interactive Location Markers */}
        {places.map((place, idx) => {
          const isSelected = activePlace?.id === place.id;
          const offsetX = Math.sin((idx + 1) * 1.3) * 180;
          const offsetY = Math.cos((idx + 1) * 1.5) * 140;

          return (
            <div
              key={place.id}
              onClick={() => {
                setActivePlace(place);
                if (onSelectPlace) onSelectPlace(place);
              }}
              style={{
                transform: `translate(${offsetX}px, ${offsetY}px)`,
              }}
              className="absolute z-10 cursor-pointer group transition-transform hover:scale-105"
            >
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-lh-card border transition-all ${
                  isSelected
                    ? 'bg-lh-primary text-white border-white ring-3 ring-lh-primary-border scale-105 z-20'
                    : 'bg-lh-surface text-lh-text border-lh-border hover:border-lh-primary'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-lh-primary'}`} />
                <span className="text-[11px] font-semibold truncate max-w-[130px]">
                  {place.displayName.text}
                </span>
                {place.rating && (
                  <span className="text-[10px] font-medium opacity-80 flex items-center">
                    ★{place.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected place details footer inside map view */}
      {activePlace && (
        <div className="absolute bottom-3 left-3 right-3 z-10 bg-lh-surface rounded-lh-lg border border-lh-border p-4 shadow-lh-elevated flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-semibold text-lh-text truncate">
                {activePlace.displayName.text}
              </h4>
              <Badge
                variant={activePlace.hasWebsiteReported ? 'neutral' : 'warning'}
                size="sm"
              >
                {activePlace.hasWebsiteReported ? 'Site informado' : 'Sem site na ficha'}
              </Badge>
            </div>
            <p className="text-xs text-lh-text-muted truncate">{activePlace.formattedAddress}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {activePlace.googleMapsUri && (
              <a
                href={activePlace.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 text-xs text-lh-text-secondary hover:text-lh-text bg-lh-surface-alt rounded-lh-sm border border-lh-border flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Abrir no Maps
              </a>
            )}
          </div>
        </div>
      )}

      {/* Mandatory Google branding bar & terms notice as required by Google Maps Platform */}
      <div className="h-6 bg-lh-surface/95 border-t border-lh-border px-3 flex items-center justify-between text-[10px] text-lh-text-muted z-10">
        <div className="flex items-center gap-1 font-semibold text-[#5F6368]">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
          <span className="ml-1 font-normal text-lh-text-muted">Maps Platform</span>
        </div>
        <span>Termos de Uso • Atribuição gmp_git_agentskills_v1</span>
      </div>
    </div>
  );
}
