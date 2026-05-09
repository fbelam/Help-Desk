import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { Modal } from '../components/Modal';
import { supabase } from '../lib/supabase';

// ─── Tipos ────────────────────────────────────────────────────────────────────
type TicketStatus = 'Aberto' | 'Em Andamento' | 'Pendente' | 'Concluído';
type Priority     = 'Alta' | 'Média' | 'Baixa';

interface Ticket {
  id:          string;
  subject:     string;
  category:    string;
  description: string;
  priority:    Priority;
  status:      TicketStatus;
  sla_deadline: string | null;
  created_at:  string;
}

type FilterKey = 'Todos' | 'Abertos' | 'Em Andamento' | 'Pendentes' | 'Concluídos';

const FILTER_MAP: Record<FilterKey, TicketStatus[]> = {
  'Todos':        ['Aberto', 'Em Andamento', 'Pendente', 'Concluído'],
  'Abertos':      ['Aberto'],
  'Em Andamento': ['Em Andamento'],
  'Pendentes':    ['Pendente'],
  'Concluídos':   ['Concluído'],
};

const PRIORITY_CFG: Record<Priority, { color: string; icon: string }> = {
  Alta:  { color: 'text-error',        icon: 'keyboard_double_arrow_up' },
  Média: { color: 'text-surface-tint', icon: 'remove' },
  Baixa: { color: 'text-secondary',    icon: 'keyboard_arrow_down' },
};

const STATUS_BADGE: Record<TicketStatus, string> = {
  'Aberto':       'bg-tertiary-container/40 text-tertiary border border-tertiary/20',
  'Em Andamento': 'bg-primary-container/50 text-on-primary-fixed-variant border border-primary/20',
  'Pendente':     'bg-secondary-container text-on-secondary-container',
  'Concluído':    'bg-[#4a7c59]/10 text-[#4a7c59] border border-[#4a7c59]/20',
};

// ─── Componente ───────────────────────────────────────────────────────────────
export function MyTickets() {
  const { addToast } = useAppContext();

  const [tickets,      setTickets]      = useState<Ticket[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('Todos');
  const [noteModal,    setNoteModal]    = useState<string | null>(null);
  const [note,         setNote]         = useState('');
  const [moreModal,    setMoreModal]    = useState<string | null>(null);

  // ─── Buscar do Supabase ────────────────────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets((data as Ticket[]) ?? []);
    } catch (err: any) {
      console.error('[MyTickets] Erro ao buscar chamados:', err);
      addToast('error', 'Erro ao Carregar', 'Não foi possível buscar os chamados do servidor.');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  // ─── Atualizar status ──────────────────────────────────────────────────────
  const updateStatus = async (id: string, newStatus: TicketStatus) => {
    try {
      const { error } = await (supabase as any)
        .from('tickets')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setTickets(prev =>
        prev.map(t => t.id === id ? { ...t, status: newStatus } : t)
      );

      const msgs: Record<TicketStatus, string> = {
        'Em Andamento': 'Atendimento iniciado com sucesso.',
        'Concluído':    'Chamado marcado como concluído.',
        'Pendente':     'Chamado colocado em pendência.',
        'Aberto':       'Chamado reaberto.',
      };
      addToast('success', newStatus, msgs[newStatus]);
    } catch (err: any) {
      addToast('error', 'Erro ao Atualizar', err?.message ?? 'Tente novamente.');
    }
  };

  // ─── Salvar nota ───────────────────────────────────────────────────────────
  const handleSaveNote = async () => {
    if (!note.trim()) { addToast('error', 'Campo Vazio', 'Escreva uma nota antes de salvar.'); return; }
    try {
      const { error } = await (supabase as any)
        .from('ticket_notes')
        .insert({
          ticket_id: noteModal,
          content:   note.trim(),
          author_id: '00000000-0000-0000-0000-000000000000', // placeholder até auth
        });

      if (error) throw error;
      addToast('success', 'Nota Adicionada', `Nota salva no chamado.`);
      setNote('');
      setNoteModal(null);
    } catch (err: any) {
      addToast('error', 'Erro ao Salvar', err?.message ?? 'Tente novamente.');
    }
  };

  // ─── Derivações ───────────────────────────────────────────────────────────
  const count = (statuses: TicketStatus[]) =>
    tickets.filter(t => statuses.includes(t.status)).length;

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'Todos',        label: `Todos (${tickets.length})` },
    { key: 'Abertos',      label: `Abertos (${count(['Aberto'])})` },
    { key: 'Em Andamento', label: `Em Andamento (${count(['Em Andamento'])})` },
    { key: 'Pendentes',    label: `Pendentes (${count(['Pendente'])})` },
    { key: 'Concluídos',   label: `Concluídos (${count(['Concluído'])})` },
  ];

  const filteredTickets = tickets.filter(t =>
    FILTER_MAP[activeFilter].includes(t.status)
  );

  const getNextStatus = (status: TicketStatus): TicketStatus | null => {
    if (status === 'Aberto')       return 'Em Andamento';
    if (status === 'Em Andamento') return 'Concluído';
    return null;
  };

  const getPrimaryAction = (status: TicketStatus) => {
    if (status === 'Aberto')       return { label: 'Iniciar Atendimento', style: 'bg-primary text-on-primary hover:bg-primary/90' };
    if (status === 'Em Andamento') return { label: 'Concluir', style: 'bg-surface-container text-on-surface border border-outline-variant hover:border-primary hover:text-primary' };
    if (status === 'Pendente')     return { label: 'Verificar Status', style: 'bg-surface text-on-surface border border-outline-variant hover:bg-surface-variant' };
    return { label: 'Ver Detalhes', style: 'bg-surface-container text-on-surface border border-outline-variant' };
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <div className="h-10 w-64 bg-surface-container-high rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-96 bg-surface-container-high rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-36 bg-surface-container-low rounded-xl animate-pulse border border-outline-variant/30" />
          ))}
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto w-full space-y-8">
      {/* Header + Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold text-on-surface tracking-tight mb-2">Meus Chamados</h1>
          <p className="text-on-surface-variant font-body text-base">
            {tickets.length} chamado{tickets.length !== 1 ? 's' : ''} registrado{tickets.length !== 1 ? 's' : ''} no sistema.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-4 py-2 rounded-full font-body text-sm transition-all active:scale-95 ${
                activeFilter === key
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface-container-low border border-outline-variant/60 text-on-surface-variant hover:border-primary/50 hover:text-primary font-medium'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={fetchTickets}
            className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
            title="Recarregar"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Lista de Tickets */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest rounded-xl border border-outline-variant/40">
            <span className="material-symbols-outlined text-5xl text-outline mb-3">inbox</span>
            <p className="font-headline text-xl font-bold text-on-surface mb-1">
              {tickets.length === 0 ? 'Nenhum chamado ainda' : 'Nenhum chamado nesta categoria'}
            </p>
            <p className="font-body text-sm text-on-surface-variant">
              {tickets.length === 0
                ? 'Crie um novo chamado para começar.'
                : `Não há chamados com o filtro "${activeFilter}" no momento.`}
            </p>
          </div>
        ) : (
          filteredTickets.map(ticket => {
            const pCfg      = PRIORITY_CFG[ticket.priority];
            const isCompleted = ticket.status === 'Concluído';
            const nextStatus  = getNextStatus(ticket.status);
            const action      = getPrimaryAction(ticket.status);

            return (
              <div
                key={ticket.id}
                className={`relative bg-surface-container-lowest border rounded-xl p-6 transition-all flex flex-col lg:flex-row gap-6 items-start lg:items-center overflow-hidden
                  ${isCompleted ? 'opacity-70 border-outline-variant/30 hover:opacity-90' : 'border-outline-variant/60 hover:shadow-[0_4px_24px_rgba(58,48,42,0.08)]'}
                `}
              >
                {/* Barra lateral para Em Andamento */}
                {ticket.status === 'Em Andamento' && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
                )}

                {/* ID + Prioridade */}
                <div className={`flex flex-row lg:flex-col gap-4 lg:gap-2 min-w-[180px] ${ticket.status === 'Em Andamento' ? 'pl-2' : ''}`}>
                  <span className="font-headline font-bold text-on-surface text-base font-mono">
                    {ticket.id.slice(0, 8).toUpperCase()}
                  </span>
                  <div className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider ${pCfg.color}`}>
                    <span className="material-symbols-outlined text-sm">{pCfg.icon}</span>
                    {ticket.priority}
                  </div>
                  <span className="text-xs text-on-surface-variant font-body">{formatDate(ticket.created_at)}</span>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-headline text-xl font-semibold text-on-surface">{ticket.subject}</h3>
                    <span className="px-2.5 py-1 bg-surface-variant text-on-surface-variant text-xs font-bold rounded-md">
                      {ticket.category}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${STATUS_BADGE[ticket.status]}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm font-body line-clamp-2">{ticket.description}</p>
                </div>

                {/* Ações */}
                <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                  <button
                    onClick={() => nextStatus ? updateStatus(ticket.id, nextStatus) : addToast('info', ticket.status, 'Chamado está em estado final.')}
                    className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-sm font-body font-bold transition-colors text-center flex items-center justify-center gap-1.5 ${action.style}`}
                  >
                    {ticket.status === 'Em Andamento' && (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    )}
                    {action.label}
                  </button>

                  {!isCompleted && (
                    <div className="flex gap-2 flex-1 lg:flex-none">
                      <button
                        onClick={() => setNoteModal(ticket.id)}
                        className="flex-1 px-3 py-2 border border-outline-variant text-on-surface hover:border-primary hover:text-primary rounded-lg transition-colors flex justify-center items-center group"
                        title="Adicionar Nota"
                      >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">edit_note</span>
                      </button>
                      <button
                        onClick={() => setMoreModal(ticket.id)}
                        className="flex-1 px-3 py-2 border border-outline-variant text-on-surface hover:border-error hover:text-error rounded-lg transition-colors flex justify-center items-center group"
                        title="Mais Opções"
                      >
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">more_horiz</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rodapé */}
      {tickets.length > 0 && (
        <div className="flex items-center justify-between border-t border-outline-variant/60 pt-6">
          <p className="text-sm text-on-surface-variant font-body">
            Mostrando <span className="font-bold text-on-surface">{filteredTickets.length}</span> de{' '}
            <span className="font-bold text-on-surface">{tickets.length}</span> chamados
          </p>
        </div>
      )}

      {/* Modal: Adicionar Nota */}
      <Modal isOpen={!!noteModal} onClose={() => { setNoteModal(null); setNote(''); }} title={`Adicionar Nota`} size="md">
        <div className="space-y-4">
          <p className="text-on-surface-variant text-sm">Registre informações ou atualizações sobre este chamado:</p>
          <textarea
            className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            rows={4}
            placeholder="Ex: Contactei o solicitante às 10:45, aguardando peça de reposição..."
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setNoteModal(null); setNote(''); }}
              className="px-5 py-2 rounded-lg border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-high transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveNote}
              className="px-5 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors text-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>Salvar Nota
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Mais Opções */}
      <Modal isOpen={!!moreModal} onClose={() => setMoreModal(null)} title="Opções do Chamado" size="sm">
        <div className="space-y-2">
          {[
            { icon: 'pending',    label: 'Colocar em Pendência', color: 'text-primary',
              action: () => { updateStatus(moreModal!, 'Pendente'); setMoreModal(null); } },
            { icon: 'escalator_warning', label: 'Escalar para Nível 2', color: 'text-primary',
              action: () => { setMoreModal(null); addToast('warning', 'Escalado', `Chamado escalado para suporte nível 2.`); } },
            { icon: 'cancel', label: 'Cancelar Chamado', color: 'text-error',
              action: () => { updateStatus(moreModal!, 'Concluído'); setMoreModal(null); } },
          ].map(opt => (
            <button
              key={opt.label}
              onClick={opt.action}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors text-left ${opt.color}`}
            >
              <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
              <span className="font-body font-semibold text-sm">{opt.label}</span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
