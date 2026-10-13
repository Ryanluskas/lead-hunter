'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { PlaceSearchResult } from '@/lib/maps-client';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface EnrichmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: PlaceSearchResult | null;
  onSuccess: (newLead: any) => void;
}

export function EnrichmentModal({
  isOpen,
  onClose,
  place,
  onSuccess,
}: EnrichmentModalProps) {
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Dentistas');
  const [city, setCity] = useState('Goiânia');
  const [state, setState] = useState('GO');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [websiteStatus, setWebsiteStatus] = useState('none_stated');
  const [source, setSource] = useState('Verificação Independente Google Maps + Web');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preencher inicialmente quando o modal abre com o lugar selecionado
  React.useEffect(() => {
    if (place) {
      setBusinessName(place.displayName?.text || '');
      setCategory(place.primaryTypeDisplayName?.text || 'Clínicas');
      setAddress(place.formattedAddress || '');
      setPhone(place.nationalPhoneNumber || '');
      setWebsite(place.websiteUri || '');
      setWebsiteStatus(place.hasWebsiteReported ? 'has_website' : 'none_stated');
      setNotes(`Identificado na pesquisa. Status inicial: ${place.websiteStatusLabel}.`);
    }
  }, [place]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setError('O nome comercial é obrigatório.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: businessName.trim(),
          category,
          city,
          state,
          address,
          phone,
          website: website.trim() || null,
          websiteStatus,
          googlePlaceId: place?.id || null, // Armazena apenas o Place ID conforme permissão dos ToS
          source,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Falha ao cadastrar no CRM.');
      }

      const data = await res.json();
      onSuccess(data.lead);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar prospect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cadastrar Lead no CRM (Enriquecimento Independente)"
      description="Confirme os dados cadastrais e a verificação independente antes de persistir"
      maxWidth="2xl"
    >
      {/* Aviso de Conformidade com ToS */}
      <div className="p-3.5 mb-4 rounded-lh-md bg-lh-primary-soft border border-lh-primary-border flex items-start gap-2.5 text-xs text-lh-primary-text">
        <ShieldCheck className="w-4 h-4 text-lh-primary shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-lh-primary">Conformidade com Google Maps Platform: </span>
          O cadastro no CRM preserva dados enriquecidos e confirmados por verificação independente (contato direto, consulta pública ou redes sociais do negócio).
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 bg-lh-danger-soft text-lh-danger text-xs rounded-lh-sm border border-lh-danger/20">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nome Comercial Confirmado *"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Ex: Clínica Sorriso Bueno"
            required
          />

          <Select
            label="Segmento / Nicho *"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Clínicas">Clínicas Médicas</option>
            <option value="Dentistas">Dentistas & Odontologia</option>
            <option value="Oficinas">Oficinas Mecânicas</option>
            <option value="Academias">Academias & Fitness</option>
            <option value="Salões de Beleza">Salões de Beleza & Barbearias</option>
            <option value="Restaurantes">Restaurantes & Gastronomia</option>
            <option value="Contabilidade">Contabilidade & Finanças</option>
            <option value="Advocacia">Escritórios de Advocacia</option>
            <option value="Lojas">Lojas & Comércio Geral</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Cidade"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Goiânia"
          />
          <Input
            label="Estado"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="GO"
          />
          <Input
            label="Telefone / WhatsApp"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(62) 99999-0000"
          />
        </div>

        <Input
          label="Endereço Comercial Verificado"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Rua, número, bairro"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Website Oficial Verificado"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://exemplo.com.br (vazio se não tiver)"
          />

          <Select
            label="Situação do Website"
            value={websiteStatus}
            onChange={(e) => setWebsiteStatus(e.target.value)}
          >
            <option value="none_stated">Sem website informado na ficha (Oportunidade a verificar)</option>
            <option value="needs_redesign">Possui site antigo / Requer modernização</option>
            <option value="has_website">Possui site moderno funcional</option>
          </Select>
        </div>

        <Select
          label="Origem da Verificação Independente"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="Verificação Independente Google Maps + Web">
            Pesquisa Maps + Checagem Web Independente
          </option>
          <option value="Instagram / Redes Sociais">Perfil Comercial no Instagram</option>
          <option value="Contato Direto / WhatsApp">Contato Telefônico Direto</option>
          <option value="Indicação Comercial">Indicação Comercial</option>
        </Select>

        <Textarea
          label="Observações Comerciais & Próximas Ações"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ex: Empresa sem botão de WhatsApp; decisor atende no período matutino."
          rows={3}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-lh-border">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            <CheckCircle2 className="w-4 h-4" /> Confirmar e Salvar no CRM
          </Button>
        </div>
      </form>
    </Modal>
  );
}
