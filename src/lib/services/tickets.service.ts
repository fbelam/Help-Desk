/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '../supabase';
import type { Ticket, TicketInsert, TicketUpdate, TicketStatus } from '../database.types';

// ─── Listar chamados ──────────────────────────────────────────────────────────
export async function getTickets(filters?: {
  status?: TicketStatus;
  assignedTo?: string;
}) {
  let query = (supabase as any)
    .from('tickets')
    .select(`
      *,
      requester:profiles!tickets_requester_id_fkey(id, full_name, email),
      assignee:profiles!tickets_assigned_to_fkey(id, full_name)
    `)
    .order('created_at', { ascending: false });

  if (filters?.status)     query = query.eq('status', filters.status);
  if (filters?.assignedTo) query = query.eq('assigned_to', filters.assignedTo);

  const { data, error } = await query;
  if (error) throw error;
  return data as Ticket[];
}

// ─── Buscar chamado único ─────────────────────────────────────────────────────
export async function getTicketById(id: string): Promise<Ticket> {
  const { data, error } = await (supabase as any)
    .from('tickets')
    .select(`
      *,
      requester:profiles!tickets_requester_id_fkey(id, full_name, email),
      assignee:profiles!tickets_assigned_to_fkey(id, full_name),
      notes:ticket_notes(*, author:profiles(id, full_name))
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Ticket;
}

// ─── Criar chamado ────────────────────────────────────────────────────────────
export async function createTicket(payload: TicketInsert): Promise<Ticket> {
  const { data, error } = await (supabase as any)
    .from('tickets')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as Ticket;
}

// ─── Atualizar chamado ────────────────────────────────────────────────────────
export async function updateTicket(id: string, payload: TicketUpdate): Promise<Ticket> {
  const { data, error } = await (supabase as any)
    .from('tickets')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Ticket;
}

// ─── Alterar status ───────────────────────────────────────────────────────────
export async function updateTicketStatus(id: string, status: TicketStatus) {
  return updateTicket(id, { status });
}

// ─── Atribuir técnico ─────────────────────────────────────────────────────────
export async function assignTicket(id: string, technicianId: string) {
  return updateTicket(id, { assigned_to: technicianId, status: 'Em Andamento' });
}

// ─── KPIs para dashboard / relatórios ────────────────────────────────────────
export async function getTicketStats() {
  const { data, error } = await (supabase as any)
    .from('tickets')
    .select('status, priority, created_at');

  if (error) throw error;

  const rows = data as { status: TicketStatus }[];
  return {
    total:     rows.length,
    abertos:   rows.filter(t => t.status === 'Aberto').length,
    andamento: rows.filter(t => t.status === 'Em Andamento').length,
    pendentes: rows.filter(t => t.status === 'Pendente').length,
    concluidos: rows.filter(t => t.status === 'Concluído').length,
  };
}
