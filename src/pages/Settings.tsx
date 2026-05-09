import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Modal } from '../components/Modal';

export function Settings() {
  const { addToast } = useAppContext();
  const navigate = useNavigate();
  const [name, setName] = useState('Ana Silva');
  const [email, setEmail] = useState('ana.silva@saharasupport.com');
  const [cargo, setCargo] = useState('Administradora Sênior');
  const [theme, setTheme] = useState<'Claro' | 'Escuro'>('Claro');
  const [language, setLanguage] = useState('Português (BR)');
  const [timezone, setTimezone] = useState('Brasília (GMT-3)');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSound, setNotifSound] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [twoFAModal, setTwoFAModal] = useState(false);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [logoutModal, setLogoutModal] = useState(false);

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      addToast('error', 'Campos Obrigatórios', 'Nome e e-mail não podem ser vazios.');
      return;
    }
    if (!email.includes('@')) {
      addToast('error', 'E-mail Inválido', 'Por favor, insira um e-mail válido.');
      return;
    }
    addToast('success', 'Configurações Salvas', 'Suas preferências foram atualizadas com sucesso.');
  };

  const handleChangePassword = () => {
    if (!currentPwd || !newPwd) {
      addToast('error', 'Campos Vazios', 'Preencha a senha atual e a nova senha.');
      return;
    }
    if (newPwd.length < 6) {
      addToast('error', 'Senha Fraca', 'A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setCurrentPwd('');
    setNewPwd('');
    addToast('success', 'Senha Atualizada', 'Sua senha foi alterada com sucesso.');
  };

  const handleAddMember = () => {
    if (!memberEmail.trim() || !memberEmail.includes('@')) {
      addToast('error', 'E-mail Inválido', 'Insira um e-mail válido para o novo membro.');
      return;
    }
    setAddMemberModal(false);
    setMemberEmail('');
    addToast('success', 'Convite Enviado', `Convite enviado para ${memberEmail}.`);
  };

  const handleLogout = () => {
    setLogoutModal(false);
    addToast('info', 'Sessão Encerrada', 'Você foi desconectado com sucesso.');
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="space-y-2">
        <h1 className="font-headline text-4xl font-bold text-on-surface tracking-tight">Configurações</h1>
        <p className="font-body text-on-surface-variant text-base">Gerencie suas preferências e configurações de conta.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Perfil do Usuário */}
        <section className="md:col-span-12 bg-surface-container-low rounded-xl p-8 border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            Perfil do Usuário
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <img alt="Profile Upload" className="w-32 h-32 rounded-full object-cover border-4 border-surface shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjtZiXZJaYllCbitJIGfJOxgO4TIJuXVJ5ztrUMAEd3OVelZelEY77S0PcClLKsByLyS3wPr0gsF5-BwDOYIs6B6bc6gVmmF_V44RTcVbruabAPhNoG_zTkNMTkydC4lfXKf_f8KraVJGke7pznEojk96h1TU4mAfc2qvnmqkWcuJadxla5ffapRbLpi_Encs_ciZkk1Ogd66tP_Cs8AtAz0SrNDwnbYi035zjwS9KTi34MFge4yrerx087zYJkB0FjKd4_TdhfSg" />
                <button
                  onClick={() => addToast('info', 'Alterar Foto', 'Em breve você poderá fazer upload de uma nova foto de perfil.')}
                  className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-md hover:bg-primary/90 transition"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
              <span className="font-body text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Alterar Foto</span>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="space-y-2">
                <label className="font-body text-sm font-semibold text-on-surface">Nome Completo</label>
                <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 font-body text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors" type="text" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="font-body text-sm font-semibold text-on-surface">E-mail</label>
                <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 font-body text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="font-body text-sm font-semibold text-on-surface">Cargo</label>
                <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 font-body text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors" type="text" value={cargo} onChange={e => setCargo(e.target.value)} />
              </div>
            </div>
          </div>
        </section>

        {/* Preferências */}
        <section className="md:col-span-7 bg-surface-container-low rounded-xl p-8 border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">tune</span>
            Preferências do Sistema
          </h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
              <div><p className="font-body font-semibold text-on-surface">Idioma</p><p className="font-body text-sm text-on-surface-variant">Selecione o idioma da interface</p></div>
              <select value={language} onChange={e => { setLanguage(e.target.value); addToast('info', 'Idioma', `Idioma alterado para: ${e.target.value}`); }} className="bg-surface border border-outline-variant rounded-lg px-4 py-2 font-body text-on-surface focus:border-primary focus:ring-1 focus:ring-primary">
                <option>Português (BR)</option>
                <option>English (US)</option>
              </select>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
              <div><p className="font-body font-semibold text-on-surface">Tema</p><p className="font-body text-sm text-on-surface-variant">Modo claro ou escuro</p></div>
              <div className="flex bg-surface-container border border-outline-variant rounded-lg p-1">
                {(['Claro', 'Escuro'] as const).map(t => (
                  <button key={t} onClick={() => { setTheme(t); addToast('info', 'Tema', `Tema "${t}" aplicado.`); }} className={`px-4 py-1.5 rounded font-body text-sm font-medium transition ${theme === t ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div><p className="font-body font-semibold text-on-surface">Fuso Horário</p><p className="font-body text-sm text-on-surface-variant">Horário local para registros</p></div>
              <select value={timezone} onChange={e => { setTimezone(e.target.value); addToast('info', 'Fuso Horário', `Alterado para: ${e.target.value}`); }} className="bg-surface border border-outline-variant rounded-lg px-4 py-2 font-body text-on-surface focus:border-primary focus:ring-1 focus:ring-primary max-w-[200px]">
                <option>Brasília (GMT-3)</option>
                <option>Nova York (GMT-4)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notificações */}
        <section className="md:col-span-5 bg-surface-container-low rounded-xl p-8 border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications_active</span>
            Notificações
          </h2>
          <div className="space-y-5">
            {[
              { label: 'Alertas por E-mail', desc: 'Resumos e chamados críticos', value: notifEmail, set: setNotifEmail },
              { label: 'Notificações Push', desc: 'Avisos instantâneos no navegador', value: notifPush, set: setNotifPush },
              { label: 'Sons de Alerta', desc: 'Tocar som para novos chamados', value: notifSound, set: setNotifSound },
            ].map(({ label, desc, value, set }) => (
              <label key={label} className="flex items-start gap-4 cursor-pointer group">
                <input checked={value} onChange={e => { set(e.target.checked); addToast('info', label, e.target.checked ? 'Ativado.' : 'Desativado.'); }} className="mt-1 w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary bg-surface" type="checkbox" />
                <div>
                  <p className="font-body font-semibold text-on-surface group-hover:text-primary transition-colors">{label}</p>
                  <p className="font-body text-sm text-on-surface-variant">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Segurança */}
        <section className="md:col-span-6 bg-surface-container-low rounded-xl p-8 border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">security</span>
            Segurança
          </h2>
          <div className="space-y-6">
            <div className="space-y-4 pb-6 border-b border-outline-variant/30">
              <p className="font-body font-semibold text-on-surface">Alterar Senha</p>
              <input value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 font-body text-on-surface focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Senha Atual" type="password" />
              <input value={newPwd} onChange={e => setNewPwd(e.target.value)} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 font-body text-on-surface focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Nova Senha (mín. 6 caracteres)" type="password" />
              <button onClick={handleChangePassword} className="mt-2 bg-surface border border-primary text-primary font-body text-sm font-semibold py-2 px-6 rounded-lg hover:bg-primary/5 transition-colors">
                Atualizar Senha
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-body font-semibold text-on-surface">Autenticação em Dois Fatores (2FA)</p>
                <p className="font-body text-sm text-on-surface-variant">Adiciona uma camada extra de segurança</p>
              </div>
              <button onClick={() => setTwoFAModal(true)} className="bg-primary text-on-primary font-body text-sm font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                Configurar
              </button>
            </div>
          </div>
        </section>

        {/* Equipe */}
        <section className="md:col-span-6 bg-surface-container-low rounded-xl p-8 border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline text-2xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">group</span>
              Equipe (Admin)
            </h2>
            <button onClick={() => setAddMemberModal(true)} className="text-primary font-body text-sm font-semibold hover:underline">Adicionar Membro</button>
          </div>
          <div className="space-y-4">
            {[{ initials: 'CR', bg: 'bg-primary-container text-on-primary-container', name: 'Carlos Ribeiro', role: 'Técnico Nível 2' }, { initials: 'MF', bg: 'bg-tertiary-container text-on-tertiary-container', name: 'Mariana Freitas', role: 'Técnico Nível 1' }].map(m => (
              <div key={m.name} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${m.bg} flex items-center justify-center font-headline font-bold text-sm`}>{m.initials}</div>
                  <div>
                    <p className="font-body font-semibold text-on-surface text-sm">{m.name}</p>
                    <p className="font-body text-xs text-on-surface-variant">{m.role}</p>
                  </div>
                </div>
                <button onClick={() => addToast('info', m.name, `Perfil de ${m.name} — ${m.role}. Nenhuma ação adicional disponível nesta versão.`)} className="text-xs font-body font-medium bg-surface-variant text-on-surface px-2 py-1 rounded hover:bg-surface-container-high transition-colors">
                  Visualizar
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Save + Logout */}
      <div className="flex justify-between items-center pt-6">
        <button onClick={() => setLogoutModal(true)} className="flex items-center gap-2 text-on-surface-variant hover:text-error font-body text-sm font-semibold transition-colors">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Sair da Conta
        </button>
        <button onClick={handleSave} className="bg-primary text-on-primary font-body text-base font-semibold py-3 px-8 rounded-lg shadow-sm hover:bg-primary/90 transition-all active:scale-95">
          Salvar Alterações
        </button>
      </div>

      {/* Modal: 2FA */}
      <Modal isOpen={twoFAModal} onClose={() => setTwoFAModal(false)} title="Configurar Autenticação em 2 Fatores" size="md">
        <div className="space-y-4">
          <p className="text-on-surface-variant text-sm font-body">Escaneie o QR Code abaixo com seu aplicativo autenticador (Google Authenticator, Authy, etc.):</p>
          <div className="flex justify-center py-4">
            <div className="w-40 h-40 bg-surface-container-high rounded-xl border border-outline-variant/60 flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-outline">qr_code_2</span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface">Código de Verificação</label>
            <input className="w-full border border-outline-variant rounded-lg px-4 py-2.5 bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary font-mono tracking-widest text-center text-lg" placeholder="000 000" maxLength={7} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setTwoFAModal(false)} className="px-5 py-2 rounded-lg border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-high transition-colors text-sm">Cancelar</button>
            <button onClick={() => { setTwoFAModal(false); addToast('success', '2FA Ativado', 'Autenticação em dois fatores configurada com sucesso.'); }} className="px-5 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">security</span>Ativar 2FA
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Adicionar Membro */}
      <Modal isOpen={addMemberModal} onClose={() => setAddMemberModal(false)} title="Adicionar Membro à Equipe" size="sm">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface">E-mail do Novo Membro</label>
            <input value={memberEmail} onChange={e => setMemberEmail(e.target.value)} className="w-full border border-outline-variant rounded-lg px-4 py-2.5 bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary" type="email" placeholder="nome@empresa.com" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface">Nível de Acesso</label>
            <select className="w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary">
              <option>Técnico Nível 1</option><option>Técnico Nível 2</option><option>Administrador</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setAddMemberModal(false)} className="px-5 py-2 rounded-lg border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-high transition-colors text-sm">Cancelar</button>
            <button onClick={handleAddMember} className="px-5 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">send</span>Enviar Convite
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Confirmar Logout */}
      <Modal isOpen={logoutModal} onClose={() => setLogoutModal(false)} title="Sair da Conta" size="sm">
        <div className="space-y-4">
          <p className="text-on-surface-variant text-sm font-body">Tem certeza que deseja encerrar a sessão? Você será redirecionado para o painel.</p>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setLogoutModal(false)} className="px-5 py-2 rounded-lg border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-high transition-colors text-sm">Cancelar</button>
            <button onClick={handleLogout} className="px-5 py-2 rounded-lg bg-error text-on-error font-semibold hover:bg-error/90 transition-colors text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">logout</span>Sair
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
