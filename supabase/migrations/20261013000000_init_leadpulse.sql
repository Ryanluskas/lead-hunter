-- LeadPulse Supabase PostgreSQL Migration
-- Inclui tabelas completas, índices e políticas de Row Level Security (RLS)

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Leads (Prospects com dados verificados de forma independente)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    google_place_id TEXT, -- Apenas ID referencial (em conformidade com o ToS do Google Maps)
    business_name TEXT NOT NULL,
    website TEXT,
    website_status TEXT NOT NULL DEFAULT 'none_stated',
    phone TEXT,
    email TEXT,
    category TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    address TEXT,
    score INTEGER NOT NULL DEFAULT 50,
    score_rationale TEXT,
    status TEXT NOT NULL DEFAULT 'novo',
    loss_reason TEXT,
    source TEXT NOT NULL DEFAULT 'Pesquisa Local + Enriquecimento Independente',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_category ON public.leads(category);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(score);

-- 3. Lead Audits
CREATE TABLE IF NOT EXISTS public.lead_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    http_status INTEGER,
    https BOOLEAN NOT NULL DEFAULT FALSE,
    has_mobile_viewport BOOLEAN NOT NULL DEFAULT FALSE,
    title TEXT,
    meta_description TEXT,
    headings_count INTEGER NOT NULL DEFAULT 0,
    has_contact_link BOOLEAN NOT NULL DEFAULT FALSE,
    has_cta BOOLEAN NOT NULL DEFAULT FALSE,
    load_time_ms INTEGER,
    score INTEGER NOT NULL DEFAULT 0,
    issues JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_lead_audits_lead_id ON public.lead_audits(lead_id);

-- 4. Activities
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_activities_lead_id ON public.activities(lead_id);

-- 5. Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    priority TEXT NOT NULL DEFAULT 'media',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_tasks_lead_id ON public.tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON public.tasks(completed);

-- 6. Deals & Sales
CREATE TABLE IF NOT EXISTS public.deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    proposal_value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    closed_value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    received_value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    contract_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    payment_status TEXT NOT NULL DEFAULT 'pendente',
    expected_payment_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_deals_lead_id ON public.deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_deals_contract_date ON public.deals(contract_date);

-- 7. AI Generations
CREATE TABLE IF NOT EXISTS public.ai_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    prompt_context TEXT,
    generated_content TEXT NOT NULL,
    model_used TEXT NOT NULL DEFAULT 'gemini-3.8-flash',
    tokens_used INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Integration Settings
CREATE TABLE IF NOT EXISTS public.integration_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'nao_configurado',
    last_checked TIMESTAMPTZ,
    monthly_usage_count INTEGER NOT NULL DEFAULT 0,
    usage_limit INTEGER NOT NULL DEFAULT 1000,
    cost_estimate NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    error_message TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: Usuários só visualizam e alteram seu próprio perfil
CREATE POLICY "Users can manage own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Leads: Usuários autenticados acessam seus próprios leads
CREATE POLICY "Users can manage own leads" ON public.leads
    FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- Audits: Acessíveis via lead pertencente ao usuário
CREATE POLICY "Users can manage audits for own leads" ON public.lead_audits
    FOR ALL USING (
        lead_id IS NULL OR EXISTS (
            SELECT 1 FROM public.leads WHERE leads.id = lead_audits.lead_id AND (leads.user_id = auth.uid() OR leads.user_id IS NULL)
        )
    );

-- Activities
CREATE POLICY "Users can manage activities for own leads" ON public.activities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.leads WHERE leads.id = activities.lead_id AND (leads.user_id = auth.uid() OR leads.user_id IS NULL)
        )
    );

-- Tasks
CREATE POLICY "Users can manage tasks for own leads" ON public.tasks
    FOR ALL USING (
        lead_id IS NULL OR EXISTS (
            SELECT 1 FROM public.leads WHERE leads.id = tasks.lead_id AND (leads.user_id = auth.uid() OR leads.user_id IS NULL)
        )
    );

-- Deals
CREATE POLICY "Users can manage deals for own leads" ON public.deals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.leads WHERE leads.id = deals.lead_id AND (leads.user_id = auth.uid() OR leads.user_id IS NULL)
        )
    );

-- AI Generations
CREATE POLICY "Users can view own AI generations" ON public.ai_generations
    FOR ALL USING (
        lead_id IS NULL OR EXISTS (
            SELECT 1 FROM public.leads WHERE leads.id = ai_generations.lead_id AND (leads.user_id = auth.uid() OR leads.user_id IS NULL)
        )
    );

-- Integration Settings: Apenas administradores ou usuários autenticados da conta
CREATE POLICY "Authenticated users view settings" ON public.integration_settings
    FOR ALL USING (auth.role() = 'authenticated');
