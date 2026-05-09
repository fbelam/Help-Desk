import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type DemoUser = {
  label: string;
  email: string;
  password: string;
  role: string;
  icon: string;
  color: string;
};

const DEMO_USERS: DemoUser[] = [
  {
    label:    'Entrar como Admin',
    email:    'admin@saharasupport.com',
    password: 'Admin@2024',
    role:     'Administradora Sênior',
    icon:     'shield_person',
    color:    'hover:border-primary/60 hover:bg-primary/5',
  },
  {
    label:    'Entrar como Usuário',
    email:    'carlos@saharasupport.com',
    password: 'Carlos@2024',
    role:     'Analista de Operações',
    icon:     'person',
    color:    'hover:border-secondary/60 hover:bg-secondary/5',
  },
];

export function Login() {
  const { signIn }  = useAuth();
  const navigate    = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e?: React.FormEvent, preset?: DemoUser) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    const loginEmail    = preset?.email    ?? email;
    const loginPassword = preset?.password ?? password;

    try {
      await signIn(loginEmail, loginPassword);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err?.message ?? 'E-mail ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (user: DemoUser) => {
    setEmail(user.email);
    setPassword(user.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Painel esquerdo — ilustração ──────────────────────────── */}
      <div className="hidden lg:flex w-1/2 bg-surface-container-low border-r border-outline-variant/40 flex-col justify-between p-14 relative overflow-hidden">
        {/* Gradiente decorativo */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at 20% 50%, hsla(22,65%,42%,0.25) 0%, transparent 60%),' +
              'radial-gradient(ellipse at 80% 20%, hsla(32,55%,55%,0.15) 0%, transparent 50%)',
          }}
        />
        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              support_agent
            </span>
          </div>
          <span className="font-headline text-2xl font-bold text-on-surface tracking-tight">
            Sahara<span className="text-primary"> Support</span>
          </span>
        </div>

        {/* Destaque central */}
        <div className="relative space-y-8">
          <div className="space-y-4">
            <div className="w-16 h-1 bg-primary rounded-full" />
            <h2 className="font-headline text-5xl font-bold text-on-surface leading-tight tracking-tight">
              Suporte técnico<br />
              <span className="text-primary">inteligente</span> e<br />
              eficiente.
            </h2>
            <p className="text-on-surface-variant font-body text-lg max-w-sm leading-relaxed">
              Gerencie chamados, inventário e relatórios operacionais em um único painel centralizado.
            </p>
          </div>

          {/* Cards de métricas decorativos */}
          <div className="flex gap-4">
            {[
              { icon: 'confirmation_number', value: '482', label: 'Chamados / mês' },
              { icon: 'schedule',            value: '1h15m', label: 'SLA médio' },
              { icon: 'sentiment_satisfied', value: '4.8★', label: 'Satisfação' },
            ].map(m => (
              <div
                key={m.label}
                className="flex-1 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 text-center"
              >
                <span className="material-symbols-outlined text-primary text-2xl block mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {m.icon}
                </span>
                <p className="font-headline text-xl font-bold text-on-surface">{m.value}</p>
                <p className="text-xs text-on-surface-variant font-body">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-outline font-body">
          © 2025 Sahara Support · Plataforma de Suporte Técnico
        </p>
      </div>

      {/* ── Painel direito — formulário ────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                support_agent
              </span>
            </div>
            <span className="font-headline text-xl font-bold text-on-surface">
              Sahara<span className="text-primary"> Support</span>
            </span>
          </div>

          {/* Título */}
          <div className="space-y-1">
            <h1 className="font-headline text-3xl font-bold text-on-surface">Bem-vindo de volta</h1>
            <p className="text-on-surface-variant font-body text-sm">Faça login para acessar o painel.</p>
          </div>

          {/* Atalhos de demo */}
          <div className="grid grid-cols-2 gap-3">
            {DEMO_USERS.map(user => (
              <button
                key={user.email}
                type="button"
                onClick={() => fillDemo(user)}
                className={`flex flex-col items-start gap-1.5 p-4 bg-surface-container-lowest border border-outline-variant/60 rounded-xl transition-all text-left ${user.color}`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {user.icon}
                  </span>
                  <span className="font-body text-xs font-bold text-on-surface">{user.label.replace('Entrar como ', '')}</span>
                </div>
                <p className="text-xs text-on-surface-variant font-body leading-tight">{user.role}</p>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-outline-variant/60" />
            <span className="text-xs text-outline font-body">ou insira suas credenciais</span>
            <div className="flex-1 border-t border-outline-variant/60" />
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* E-mail */}
            <div className="space-y-1.5">
              <label className="text-sm font-body font-bold text-on-surface" htmlFor="email">
                E-mail
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-3 font-body text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline text-sm"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <label className="text-sm font-body font-bold text-on-surface" htmlFor="password">
                Senha
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  lock
                </span>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-12 py-3 font-body text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-error-container/40 border border-error/20 rounded-lg">
                <span className="material-symbols-outlined text-error text-[18px]">error</span>
                <p className="text-error text-sm font-body">{error}</p>
              </div>
            )}

            {/* Botão de login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-body font-bold py-3 rounded-lg hover:bg-primary/90 transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Credenciais visíveis (ambiente de demo) */}
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 space-y-3">
            <p className="text-xs font-body font-bold text-on-surface-variant uppercase tracking-widest">
              Credenciais de demonstração
            </p>
            <div className="space-y-2">
              {DEMO_USERS.map(u => (
                <div key={u.email} className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-on-surface font-body">{u.label.replace('Entrar como ', '')} — {u.role}</p>
                    <p className="text-xs text-on-surface-variant font-mono">{u.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLogin(undefined, u)}
                    className="text-xs font-body font-bold text-primary hover:text-primary/70 transition-colors border border-primary/30 hover:border-primary rounded-lg px-3 py-1.5 whitespace-nowrap"
                  >
                    Usar →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
