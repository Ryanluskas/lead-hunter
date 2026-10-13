'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Compass } from 'lucide-react';
import { brandConfig } from '@/lib/brand';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('consultor@leadhunter.com.br');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-lh-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-lh-sidebar text-white shadow-md mb-2">
            <Compass className="w-6 h-6 text-lh-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-lh-text">
            Acessar o {brandConfig.name}
          </h1>
          <p className="text-xs text-lh-text-muted">
            {brandConfig.tagline}
          </p>
        </div>

        {/* Card de Login */}
        <Card className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="E-mail profissional"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com.br"
              required
            />

            <Input
              label="Senha de acesso"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />

            <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
              Entrar na Plataforma
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-lh-border-subtle text-center text-xs text-lh-text-muted">
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="text-lh-primary font-semibold hover:underline">
              Criar conta gratuita
            </Link>
          </div>
        </Card>

        {/* Links de Conformidade */}
        <div className="flex items-center justify-center gap-4 text-xs text-lh-text-muted">
          <Link href="/privacidade" className="hover:underline hover:text-lh-text">
            Privacidade
          </Link>
          <span>•</span>
          <Link href="/termos" className="hover:underline hover:text-lh-text">
            Termos de Uso & Atribuições
          </Link>
        </div>
      </div>
    </div>
  );
}
