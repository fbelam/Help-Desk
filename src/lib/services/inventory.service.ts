/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '../supabase';
import type { InventoryItem, InventoryItemInsert, InventoryItemUpdate, InventoryStatus } from '../database.types';

// ─── Listar itens ─────────────────────────────────────────────────────────────
export async function getInventoryItems(filters?: {
  category?: string;
  status?: InventoryStatus;
  search?: string;
}): Promise<InventoryItem[]> {
  let query = (supabase as any)
    .from('inventory_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.category) query = query.eq('category', filters.category);
  if (filters?.status)   query = query.eq('status', filters.status);
  if (filters?.search)   query = query.ilike('name', `%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data as InventoryItem[];
}

// ─── Buscar item único ────────────────────────────────────────────────────────
export async function getInventoryItemById(id: string): Promise<InventoryItem> {
  const { data, error } = await (supabase as any)
    .from('inventory_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as InventoryItem;
}

// ─── Criar item ───────────────────────────────────────────────────────────────
export async function createInventoryItem(payload: InventoryItemInsert): Promise<InventoryItem> {
  const { data, error } = await (supabase as any)
    .from('inventory_items')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as InventoryItem;
}

// ─── Atualizar item ───────────────────────────────────────────────────────────
export async function updateInventoryItem(id: string, payload: InventoryItemUpdate): Promise<InventoryItem> {
  const { data, error } = await (supabase as any)
    .from('inventory_items')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as InventoryItem;
}

// ─── Resumo de contagens por status ──────────────────────────────────────────
export async function getInventoryStats() {
  const { data, error } = await (supabase as any)
    .from('inventory_items')
    .select('status');

  if (error) throw error;

  const rows = data as { status: InventoryStatus }[];
  return {
    total:      rows.length,
    emUso:      rows.filter(i => i.status === 'Em Uso').length,
    manutencao: rows.filter(i => i.status === 'Manutenção').length,
    disponivel: rows.filter(i => i.status === 'Disponível').length,
    reservado:  rows.filter(i => i.status === 'Reservado').length,
  };
}
