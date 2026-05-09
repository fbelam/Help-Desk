// ─────────────────────────────────────────────────────────────────────────────
// database.types.ts
// Tipos TypeScript que espelham exatamente o schema do Supabase.
// Gerado manualmente com base no schema SQL (migration.sql).
// Após criar o projeto no Supabase, você pode regenerar com:
//   npx supabase gen types typescript --project-id SEU_ID > src/lib/database.types.ts
// ─────────────────────────────────────────────────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TicketStatus    = 'Aberto' | 'Em Andamento' | 'Pendente' | 'Concluído';
export type TicketPriority  = 'Alta' | 'Média' | 'Baixa';
export type InventoryStatus = 'Em Uso' | 'Disponível' | 'Manutenção' | 'Reservado';
export type UserRole        = 'admin' | 'technician_l1' | 'technician_l2' | 'requester';

// ─── Database interface (usada pelo createClient<Database>) ──────────────────
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row:    Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      tickets: {
        Row:    Ticket;
        Insert: TicketInsert;
        Update: TicketUpdate;
      };
      ticket_notes: {
        Row:    TicketNote;
        Insert: TicketNoteInsert;
        Update: TicketNoteUpdate;
      };
      inventory_items: {
        Row:    InventoryItem;
        Insert: InventoryItemInsert;
        Update: InventoryItemUpdate;
      };
    };
    Views:     Record<string, never>;
    Functions: Record<string, never>;
    Enums:     Record<string, never>;
  };
}

// ─── Profiles (usuários / técnicos) ─────────────────────────────────────────
export interface Profile {
  id:         string;           // UUID — espelha auth.users.id
  full_name:  string;
  email:      string;
  role:       UserRole;
  avatar_url: string | null;
  cargo:      string | null;
  created_at: string;
  updated_at: string;
}
export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>;
export type ProfileUpdate = Partial<ProfileInsert>;

// ─── Tickets (chamados) ──────────────────────────────────────────────────────
export interface Ticket {
  id:           string;          // UUID
  subject:      string;
  category:     string;
  description:  string;
  priority:     TicketPriority;
  status:       TicketStatus;
  sla_deadline: string | null;   // ISO timestamp
  requester_id: string;          // FK → profiles.id
  assigned_to:  string | null;   // FK → profiles.id
  created_at:   string;
  updated_at:   string;
}
export type TicketInsert = Omit<Ticket, 'id' | 'created_at' | 'updated_at'>;
export type TicketUpdate = Partial<TicketInsert>;

// Ticket com joins já resolvidos (para exibição)
export interface TicketWithRelations extends Ticket {
  requester: Pick<Profile, 'id' | 'full_name' | 'email'>;
  assignee:  Pick<Profile, 'id' | 'full_name'> | null;
  notes:     TicketNote[];
}

// ─── Ticket Notes (notas internas dos chamados) ──────────────────────────────
export interface TicketNote {
  id:         string;
  ticket_id:  string;           // FK → tickets.id
  content:    string;
  author_id:  string;           // FK → profiles.id
  created_at: string;
}
export type TicketNoteInsert = Omit<TicketNote, 'id' | 'created_at'>;
export type TicketNoteUpdate = Partial<TicketNoteInsert>;

export interface TicketNoteWithAuthor extends TicketNote {
  author: Pick<Profile, 'id' | 'full_name'>;
}

// ─── Inventory Items (ativos) ────────────────────────────────────────────────
export interface InventoryItem {
  id:            string;
  asset_tag:     string;        // Ex: "#INV-1024"
  name:          string;
  category:      string;
  location:      string;
  status:        InventoryStatus;
  last_revision: string | null; // ISO date
  created_at:    string;
  updated_at:    string;
}
export type InventoryItemInsert = Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>;
export type InventoryItemUpdate = Partial<InventoryItemInsert>;
