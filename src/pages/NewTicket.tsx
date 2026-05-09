import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

type Priority = 'Alta' | 'Média' | 'Baixa';
type CategoryOption = { value: string; label: string };

const CATEGORIES: CategoryOption[] = [
  { value: 'Informática / TI', label: 'Informática / TI' },
  { value: 'Elétrica',         label: 'Elétrica' },
  { value: 'Predial / Civil',  label: 'Predial / Civil' },
  { value: 'Recursos Humanos', label: 'Recursos Humanos' },
  { value: 'Hardware',         label: 'Hardware' },
  { value: 'Software',         label: 'Software' },
  { value: 'Rede',             label: 'Rede' },
  { value: 'Telecom',          label: 'Telecom' },
];

export function NewTicket() {
  const { addToast } = useAppContext();
  const { session }  = useAuth();
  const navigate = useNavigate();

  const [subject,     setSubject]     = useState('');
  const [category,    setCategory]    = useState('');
  const [priority,    setPriority]    = useState<Priority>('Média');
  const [description, setDescription] = useState('');
  const [fileName,    setFileName]    = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [createdId,   setCreatedId]   = useState('');

  // ─── Validação ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    if (!subject.trim()) {
      addToast('error', 'Campo Obrigatório', 'Preencha o assunto do chamado.');
      return false;
    }
    if (!category) {
      addToast('error', 'Campo Obrigatório', 'Selecione uma categoria.');
      return false;
    }
    if (!description.trim() || description.trim().length < 20) {
      addToast('error', 'Descrição Insuficiente', 'A descrição deve ter ao menos 20 caracteres.');
      return false;
    }
    if (!session?.user?.id) {
      addToast('error', 'Sessão Expirada', 'Você precisa estar logado para criar um chamado.');
      return false;
    }
    return true;
  };

  // ─── Envio ao Supabase ────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { data, error } = await (supabase as any)
        .from('tickets')
        .insert({
          subject:      subject.trim(),
          category,
          description:  description.trim(),
          priority,
          status:       'Aberto',
          requester_id: session!.user.id,
          assigned_to:  null,
          sla_deadline: null,
        })
        .select()
        .single();

      if (error) throw error;

      setCreatedId(data.id);
      setSubmitted(true);
      addToast('success', 'Chamado Criado!', `"${subject}" registrado com sucesso.`);
    } catch (err: any) {
      console.error('[NewTicket] Erro ao criar chamado:', err);
      addToast('error', 'Erro ao Criar Chamado', err?.message ?? 'Tente novamente em instantes.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Tela de Sucesso ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <div>
          <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Chamado Criado!</h2>
          <p className="font-body text-on-surface-variant">
            Chamado <span className="font-bold text-on-surface">"{subject}"</span> registrado no sistema com sucesso.
          </p>
          {createdId && (
            <p className="font-body text-xs text-outline mt-2 font-mono">ID: {createdId}</p>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setSubmitted(false);
              setSubject('');
              setCategory('');
              setDescription('');
              setFileName('');
              setCreatedId('');
            }}
            className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface font-body font-bold hover:bg-surface-container-high transition-colors"
          >
            Novo Chamado
          </button>
          <button
            onClick={() => navigate('/meus-chamados')}
            className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-body font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
            Ver Meus Chamados
          </button>
        </div>
      </div>
    );
  }

  // ─── Formulário ───────────────────────────────────────────────────────────
  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center text-sm font-body text-on-surface-variant mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Visão Geral</Link>
        <span className="material-symbols-outlined text-[16px] mx-2">chevron_right</span>
        <span className="text-primary font-medium">Novo Chamado</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-3">
          Abrir Novo Chamado
        </h1>
        <p className="font-body text-on-surface-variant max-w-2xl text-lg">
          Detalhe o problema ou solicitação abaixo. Nossa equipe técnica analisará as informações e retornará o mais breve possível.
        </p>
      </div>

      {/* Card do formulário */}
      <div className="bg-surface-container-low rounded-xl border border-outline-variant/60 shadow-[0_2px_16px_rgba(58,48,42,0.04)] p-6 md:p-10 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Assunto */}
          <div className="space-y-2">
            <label className="block font-body text-sm font-bold text-on-surface" htmlFor="subject">
              Assunto do Chamado <span className="text-error">*</span>
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Ex: Falha na conexão com a impressora"
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline"
            />
          </div>

          {/* Categoria & Prioridade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block font-body text-sm font-bold text-on-surface" htmlFor="category">
                Categoria <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none pr-10"
                >
                  <option value="">Selecione a área</option>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-body text-sm font-bold text-on-surface">Prioridade Estimada</label>
              <div className="flex bg-surface border border-outline-variant rounded-lg overflow-hidden p-1 gap-1">
                {(['Baixa', 'Média', 'Alta'] as Priority[]).map(p => (
                  <label key={p} className="flex-1 cursor-pointer">
                    <input
                      className="peer sr-only"
                      name="priority"
                      type="radio"
                      value={p}
                      checked={priority === p}
                      onChange={() => setPriority(p)}
                    />
                    <div className={`text-center py-2 px-3 rounded-md font-body text-sm font-medium transition-colors ${
                      priority === p
                        ? p === 'Alta'
                          ? 'bg-error-container text-on-error-container font-bold'
                          : 'bg-primary-container text-on-primary-fixed-variant font-bold'
                        : 'text-on-surface-variant hover:bg-surface-container-highest'
                    }`}>
                      {p}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="block font-body text-sm font-bold text-on-surface" htmlFor="description">
              Descrição Detalhada <span className="text-error">*</span>
            </label>
            <p className="text-xs text-on-surface-variant">
              Forneça o máximo de detalhes: mensagens de erro, passos para reproduzir, equipamento afetado. (Mín. 20 caracteres)
            </p>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={5}
              placeholder="Descreva o problema detalhadamente..."
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-y placeholder:text-outline"
            />
            <p className={`text-xs text-right ${description.length > 0 && description.length < 20 ? 'text-error' : 'text-on-surface-variant'}`}>
              {description.length} / 20 mínimo
            </p>
          </div>

          {/* Anexos */}
          <div className="space-y-2">
            <label className="block font-body text-sm font-bold text-on-surface">Anexos (Opcional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-outline-variant border-dashed rounded-lg bg-surface hover:bg-surface-container-lowest transition-colors cursor-pointer group">
              <div className="space-y-2 text-center">
                <span className="material-symbols-outlined text-4xl text-outline group-hover:text-primary transition-colors">
                  cloud_upload
                </span>
                <div className="flex text-sm text-on-surface-variant justify-center font-body">
                  <label className="relative cursor-pointer font-bold text-primary hover:text-primary/80" htmlFor="file-upload">
                    <span>Faça upload de um arquivo</span>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setFileName(f.name);
                          addToast('success', 'Arquivo Anexado', `"${f.name}" pronto para envio.`);
                        }
                      }}
                    />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                {fileName ? (
                  <p className="text-xs text-primary font-semibold">{fileName}</p>
                ) : (
                  <p className="text-xs text-outline">PNG, JPG, PDF até 10MB</p>
                )}
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="pt-6 border-t border-outline-variant/60 flex flex-col-reverse sm:flex-row justify-end gap-4">
            <Link
              to="/"
              className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface font-body font-bold hover:bg-surface-container-highest transition-colors text-center"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 rounded-lg bg-primary text-on-primary font-body font-bold hover:bg-primary/90 shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  Salvando no banco...
                </>
              ) : (
                <>
                  Criar Chamado
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center text-sm font-body text-on-surface-variant">
        Precisa de ajuda urgente? Ligue para <span className="font-bold text-primary">Ramal 2040</span>
      </div>
    </>
  );
}
