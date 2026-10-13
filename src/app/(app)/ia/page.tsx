'use client';

import React, { Suspense } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { AiCommercialAssistant } from '@/components/ia/AiCommercialAssistant';
import { useSearchParams } from 'next/navigation';

function GeminiAiContent() {
  const searchParams = useSearchParams();
  const businessName = searchParams.get('businessName') || '';
  const category = searchParams.get('category') || '';
  const city = searchParams.get('city') || '';
  const issues = searchParams.get('issues') || '';
  const leadId = searchParams.get('leadId') || undefined;

  return (
    <AiCommercialAssistant
      initialBusinessName={businessName}
      initialCategory={category}
      initialCity={city}
      initialIssues={issues}
      initialLeadId={leadId}
    />
  );
}

export default function GeminiAiPage() {
  return (
    <PageContainer
      title="Assistente Comercial Gemini Flash"
      description="Geração de abordagens persuasivas para WhatsApp, e-mails comerciais, quebra de objeções e propostas estruturadas"
    >
      <Suspense
        fallback={
          <div className="p-8 text-xs text-lh-text-muted">
            Carregando assistente comercial...
          </div>
        }
      >
        <GeminiAiContent />
      </Suspense>
    </PageContainer>
  );
}
