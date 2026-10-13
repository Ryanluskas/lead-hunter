'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Calendar,
  Clock,
  ListTodo,
} from 'lucide-react';
import Link from 'next/link';

export default function TarefasPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('alta');
  const [leadId, setLeadId] = useState('');
  const [leadsList, setLeadsList] = useState<any[]>([]);

  const { addToast } = useToast();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter === 'pending') params.append('completed', 'false');
      if (filter === 'completed') params.append('completed', 'true');

      const res = await fetch(`/api/tasks?${params.toString()}`);
      const json = await res.json();
      setTasks(json.tasks || []);
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Erro ao carregar tarefas',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const json = await res.json();
      setLeadsList(json.leads || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchLeads();
  }, [filter]);

  const handleToggleComplete = async (taskId: string, current: boolean) => {
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, completed: !current }),
      });
      addToast({
        title: !current ? 'Tarefa Concluída' : 'Tarefa Reaberta',
        type: 'success',
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Erro ao atualizar tarefa',
        type: 'error',
      });
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await fetch(`/api/tasks?id=${taskId}`, { method: 'DELETE' });
      addToast({
        title: 'Tarefa Removida',
        type: 'info',
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Erro ao remover tarefa',
        type: 'error',
      });
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          dueDate: dueDate || null,
          priority,
          leadId: leadId || null,
        }),
      });

      setTitle('');
      setDescription('');
      setDueDate('');
      setModalOpen(false);
      addToast({
        title: 'Tarefa Agendada',
        description: 'Lembrete registrado no CRM.',
        type: 'success',
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      addToast({
        title: 'Erro ao criar tarefa',
        type: 'error',
      });
    }
  };

  return (
    <PageContainer
      title="Tarefas Comerciais & Follow-ups"
      description="Organização diária de ligações, reuniões agendadas e lembretes de envio de propostas"
      action={
        <div className="flex items-center gap-2">
          {/* Filtros */}
          <div className="bg-lh-surface p-1 rounded-xl border border-lh-border flex items-center gap-1 shadow-xs text-xs">
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                filter === 'pending'
                  ? 'bg-lh-primary text-white shadow-xs'
                  : 'text-lh-text-muted hover:text-lh-text'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                filter === 'completed'
                  ? 'bg-lh-primary text-white shadow-xs'
                  : 'text-lh-text-muted hover:text-lh-text'
              }`}
            >
              Concluídas
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                filter === 'all'
                  ? 'bg-lh-primary text-white shadow-xs'
                  : 'text-lh-text-muted hover:text-lh-text'
              }`}
            >
              Todas
            </button>
          </div>

          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Nova Tarefa
          </Button>
        </div>
      }
    >
      <Card className="divide-y divide-lh-border-subtle overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="Nenhuma tarefa encontrada"
            description="Você não possui tarefas ou lembretes pendentes com o filtro selecionado."
            icon={ListTodo}
            action={
              <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
                Criar Nova Tarefa
              </Button>
            }
          />
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                task.completed ? 'bg-lh-bg/60 opacity-70' : 'hover:bg-lh-bg/40'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <button
                  onClick={() => handleToggleComplete(task.id, task.completed)}
                  className="mt-0.5 text-lh-text-muted hover:text-lh-primary cursor-pointer transition-colors"
                >
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-lh-accent" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-sm font-semibold ${
                        task.completed ? 'line-through text-lh-text-muted' : 'text-lh-text'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <Badge
                      variant={task.priority === 'alta' ? 'danger' : 'neutral'}
                      size="sm"
                    >
                      {task.priority === 'alta' ? 'Alta Prioridade' : 'Média'}
                    </Badge>
                  </div>

                  {task.lead && (
                    <p className="text-xs text-lh-primary font-medium mt-0.5">
                      Prospect: <Link href={`/leads/${task.lead.id}`} className="hover:underline">{task.lead.businessName}</Link>
                    </p>
                  )}

                  {task.description && (
                    <p className="text-xs text-lh-text-secondary mt-1">{task.description}</p>
                  )}

                  {task.dueDate && (
                    <div className="flex items-center gap-1.5 text-[11px] text-lh-text-muted mt-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="lh-tabular">Vencimento: {formatDate(task.dueDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(task.id)}
                className="p-1.5 text-lh-text-muted hover:text-lh-danger hover:bg-lh-danger-soft rounded-lg transition-colors cursor-pointer"
                title="Excluir tarefa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </Card>

      {/* Modal Criar Tarefa */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Criar Nova Tarefa / Lembrete"
        description="Agende follow-ups para não perder o momento certo da venda"
        maxWidth="md"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Título da Tarefa *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Enviar proposta atualizada para Dr. Lucas"
            required
          />

          <Select
            label="Prospect Relacionado (Opcional)"
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
          >
            <option value="">Nenhum prospect específico</option>
            {leadsList.map((l) => (
              <option key={l.id} value={l.id}>
                {l.businessName} ({l.city})
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Data de Vencimento"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <Select
              label="Prioridade"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </Select>
          </div>

          <Input
            label="Detalhes ou Observações"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Focar no desconto de 10% à vista"
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-lh-border-subtle">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Salvar Tarefa
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
