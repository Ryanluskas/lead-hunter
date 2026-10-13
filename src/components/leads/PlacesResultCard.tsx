'use client';

import React from 'react';
import { PlaceSearchResult } from '@/lib/maps-client';
import { MapPin, Phone, Globe, Star, ExternalLink, Plus, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface PlacesResultCardProps {
  place: PlaceSearchResult;
  onAddToCrm: (place: PlaceSearchResult) => void;
  onAuditWebsite?: (url: string) => void;
}

export function PlacesResultCard({
  place,
  onAddToCrm,
  onAuditWebsite,
}: PlacesResultCardProps) {
  return (
    <div className="bg-lh-surface rounded-lh-lg border border-lh-border/80 p-5 shadow-lh-card lh-card-interactive flex flex-col justify-between">
      <div>
        {/* Top Badges: Categoria e Situação do Site */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <Badge variant="neutral" size="sm">
            {place.primaryTypeDisplayName?.text || 'Comércio Local'}
          </Badge>
          <Badge
            variant={place.hasWebsiteReported ? 'info' : 'warning'}
            size="sm"
          >
            {place.hasWebsiteReported
              ? 'Site informado'
              : 'Sem site informado'}
          </Badge>
        </div>

        {/* Nome do Negócio */}
        <h3 className="text-[15px] font-semibold text-lh-text tracking-tight leading-snug">
          {place.displayName.text}
        </h3>

        {/* Avaliação e Reviews */}
        <div className="flex items-center gap-2 mt-1.5 text-xs text-lh-text-muted">
          {place.rating ? (
            <div className="flex items-center gap-1 font-semibold text-lh-text">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{place.rating.toFixed(1)}</span>
              {place.userRatingCount && (
                <span className="font-normal text-lh-text-muted">
                  ({place.userRatingCount} avaliações)
                </span>
              )}
            </div>
          ) : (
            <span className="text-lh-text-muted">Sem avaliações na ficha</span>
          )}
        </div>

        {/* Endereço */}
        {place.formattedAddress && (
          <div className="flex items-start gap-2 mt-3 text-xs text-lh-text-secondary">
            <MapPin className="w-3.5 h-3.5 text-lh-text-muted shrink-0 mt-0.5" />
            <span className="line-clamp-2">{place.formattedAddress}</span>
          </div>
        )}

        {/* Telefone */}
        {place.nationalPhoneNumber && (
          <div className="flex items-center gap-2 mt-1.5 text-xs text-lh-text-secondary">
            <Phone className="w-3.5 h-3.5 text-lh-text-muted shrink-0" />
            <span>{place.nationalPhoneNumber}</span>
          </div>
        )}

        {/* Website informado na ficha */}
        {place.websiteUri && (
          <div className="flex items-center gap-2 mt-1.5 text-xs text-lh-text-secondary">
            <Globe className="w-3.5 h-3.5 text-lh-text-muted shrink-0" />
            <a
              href={place.websiteUri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lh-primary hover:underline truncate max-w-[220px]"
            >
              {place.websiteUri}
            </a>
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="mt-5 pt-3.5 border-t border-lh-border/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {place.googleMapsUri && (
            <a
              href={place.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-lh-text-muted hover:text-lh-text hover:bg-lh-bg-subtle rounded-lh-sm transition-colors active:scale-95"
              title="Abrir no Google Maps oficial"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {place.websiteUri && onAuditWebsite && (
            <button
              onClick={() => onAuditWebsite(place.websiteUri!)}
              className="px-2.5 py-1.5 text-xs text-lh-primary-text bg-lh-primary-soft hover:bg-lh-border-strong rounded-lh-sm font-medium flex items-center gap-1 transition-all duration-150 cursor-pointer active:scale-95"
              title="Auditar tecnicamente este website"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Auditar Site
            </button>
          )}
        </div>

        <Button
          onClick={() => onAddToCrm(place)}
          variant="primary"
          size="sm"
        >
          <Plus className="w-4 h-4" /> Cadastrar no CRM
        </Button>
      </div>
    </div>
  );
}
