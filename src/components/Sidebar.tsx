import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Modal } from './Modal';

const ROLE_LABEL: Record<string, string> = {
  admin:          'Administrador',
  technician_l1:  'Técnico N1',
  technician_l2:  'Técnico N2',
  requester:      'Solicitante',
};

export function Sidebar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { addToast } = useAppContext();
  const { profile, signOut } = useAuth();

  const [logoutModal, setLogoutModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    isActive(path)
      ? 'flex items-center gap-3 bg-primary-container text-on-primary-container rounded-lg px-4 py-3 mx-2 active:scale-95 transform transition-all'
      : 'flex items-center gap-3 text-on-surface-variant hover:text-on-surface px-4 py-3 mx-2 hover:bg-surface-container-highest transition-all duration-200 rounded-lg active:scale-95';

  const handleLogout = async () => {
    setLogoutModal(false);
    await signOut();
    addToast('info', 'Sessão Encerrada', 'Você foi desconectado com sucesso.');
    navigate('/login', { replace: true });
  };

  // Iniciais para avatar fallback
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '??';

  return (
    <>
      <aside className="hidden md:flex bg-surface-container-low text-primary font-body text-sm font-medium tracking-wide border-r border-outline-variant/60 fixed left-0 top-0 h-screen w-64 z-50 flex-col py-4 space-y-2">
        {/* Logo */}
        <div className="font-headline text-xl text-primary font-bold px-6 py-4 mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
          Sahara Support
        </div>

        {/* Perfil do usuário logado */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-3 py-3">
            {profile?.avatar_url ? (
              <img
                alt={profile.full_name}
                className="h-9 w-9 rounded-full border-2 border-primary-container object-cover flex-shrink-0"
                src={profile.avatar_url}
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold flex-shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-on-surface font-semibold text-sm truncate">
                {profile?.full_name ?? 'Carregando...'}
              </p>
              <p className="text-on-surface-variant text-xs truncate">
                {profile?.role ? ROLE_LABEL[profile.role] : ''}
              </p>
            </div>
            {profile?.role === 'admin' && (
              <span
                className="ml-auto flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                title="Admin"
              >
                <span className="material-symbols-outlined text-on-primary text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  shield
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-2 space-y-1">
          <Link to="/" className={linkClass('/')}>
            <span className="material-symbols-outlined" style={isActive('/') ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
            Painel Geral
          </Link>
          <Link to="/meus-chamados" className={linkClass('/meus-chamados')}>
            <span className="material-symbols-outlined" style={isActive('/meus-chamados') ? { fontVariationSettings: "'FILL' 1" } : {}}>confirmation_number</span>
            Meus Chamados
          </Link>
          <Link to="/relatorios" className={linkClass('/relatorios')}>
            <span className="material-symbols-outlined" style={isActive('/relatorios') ? { fontVariationSettings: "'FILL' 1" } : {}}>analytics</span>
            Relatórios
          </Link>
          <Link to="/inventario" className={linkClass('/inventario')}>
            <span className="material-symbols-outlined" style={isActive('/inventario') ? { fontVariationSettings: "'FILL' 1" } : {}}>inventory_2</span>
            Inventário
          </Link>
          <Link to="/configuracoes" className={linkClass('/configuracoes')}>
            <span className="material-symbols-outlined" style={isActive('/configuracoes') ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
            Configurações
          </Link>
        </nav>

        {/* Rodapé sidebar */}
        <div className="px-4 py-4 mt-auto border-t border-outline-variant/60 mx-2 space-y-2">
          <Link
            to="/novo-chamado"
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Novo Chamado
          </Link>
          <button
            onClick={() => setLogoutModal(true)}
            className="flex items-center gap-3 text-on-surface-variant hover:text-error px-4 py-2 hover:bg-error-container/30 transition-all duration-200 rounded-lg cursor-pointer w-full"
          >
            <span className="material-symbols-outlined">logout</span>
            Sair
          </button>
        </div>
      </aside>

      {/* Modal de confirmação de logout */}
      <Modal isOpen={logoutModal} onClose={() => setLogoutModal(false)} title="Sair da Conta" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
            {profile?.avatar_url ? (
              <img alt={profile.full_name} className="h-10 w-10 rounded-full object-cover" src={profile.avatar_url} />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-sm font-bold">
                {initials}
              </div>
            )}
            <div>
              <p className="font-body font-semibold text-on-surface text-sm">{profile?.full_name}</p>
              <p className="font-body text-xs text-on-surface-variant">{profile?.email}</p>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-body">Tem certeza que deseja encerrar a sessão?</p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setLogoutModal(false)}
              className="px-5 py-2 rounded-lg border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-high transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-lg bg-error text-on-error font-semibold hover:bg-error/90 transition-colors text-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>Sair
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
