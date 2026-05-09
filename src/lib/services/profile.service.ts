/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '../supabase';
import type { Profile, ProfileUpdate } from '../database.types';

// ─── Perfil do usuário logado ─────────────────────────────────────────────────
export async function getMyProfile(): Promise<Profile> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw authError ?? new Error('Usuário não autenticado');

  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data as Profile;
}

// ─── Atualizar perfil ─────────────────────────────────────────────────────────
export async function updateMyProfile(payload: ProfileUpdate): Promise<Profile> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw authError ?? new Error('Usuário não autenticado');

  const { data, error } = await (supabase as any)
    .from('profiles')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

// ─── Listar todos os técnicos (para atribuição) ───────────────────────────────
export async function getTechnicians(): Promise<Pick<Profile, 'id' | 'full_name' | 'email' | 'role' | 'avatar_url'>[]> {
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('id, full_name, email, role, avatar_url')
    .in('role', ['technician_l1', 'technician_l2', 'admin'])
    .order('full_name');

  if (error) throw error;
  return data;
}

// ─── Alterar senha ────────────────────────────────────────────────────────────
export async function changePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}
