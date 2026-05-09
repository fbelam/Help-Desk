/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '../supabase';
import type { TicketNote, TicketNoteInsert } from '../database.types';

// ─── Listar notas de um chamado ───────────────────────────────────────────────
export async function getNotesByTicket(ticketId: string): Promise<TicketNote[]> {
  const { data, error } = await (supabase as any)
    .from('ticket_notes')
    .select(`*, author:profiles(id, full_name)`)
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as TicketNote[];
}

// ─── Adicionar nota ───────────────────────────────────────────────────────────
export async function addNote(payload: TicketNoteInsert): Promise<TicketNote> {
  const { data, error } = await (supabase as any)
    .from('ticket_notes')
    .insert(payload)
    .select(`*, author:profiles(id, full_name)`)
    .single();

  if (error) throw error;
  return data as TicketNote;
}
