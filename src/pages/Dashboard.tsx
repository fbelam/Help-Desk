import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Modal } from '../components/Modal';

const TICKET_DETAILS: Record<string, { subject: string; category: string; priority: string; status: string; desc: string; technician: string }> = {
  '#TK-8902': { subject: 'Queda de servidor principal', category: 'Informática/TI', priority: 'Alta', status: 'Aberto', desc: 'O servidor principal do datacenter deixou de responder às 08:42. Usuários do ERP não conseguem acessar o sistema. Impacto crítico em todas as operações financeiras. Logs indicam falha no módulo de memória DIMM slot 2.', technician: 'Não atribuído' },
  '#TK-8901': { subject: 'Curto-circuito no andar 3', category: 'Elétrica', priority: 'Média', status: 'Em Atendimento', desc: 'Funcionários relatam cheiro de queimado e desligamento de tomadas no corredor B do 3º andar. Acionamento do disjuntor Q-3B identificado. Eletricista em deslocamento.', technician: 'Carlos Ribeiro' },
  '#TK-8895': { subject: 'Câmera portão sul inoperante', category: 'Segurança Eletrônica', priority: 'Baixa', status: 'Aguardando Peças', desc: 'Câmera IP modelo Hikvision DS-2CD do portão sul apresenta tela preta. DVR reconhece o canal, mas sem sinal de vídeo. Aguardando chegada de cabo balun de reposição.', technician: 'Mariana Freitas' },
  '#TK-8890': { subject: 'Vazamento teto refeitório', category: 'Predial/Civil', priority: 'Alta', status: 'Concluído Hoje', desc: 'Infiltração identificada no forro de gesso do refeitório, próximo à janela norte. Possível origem na calha do terraço. Equipe predial realizou inspeção e vedação provisória. Aguardando avaliação estrutural.', technician: 'João Predial' },
};

type FilterType = 'Todos' | 'Informática/TI' | 'Elétrica' | 'Predial/Civil' | 'Segurança Eletrônica' | 'Telecomunicações';

const allTickets = [
  { id: '#TK-8902', subject: 'Queda de servidor principal', time: 'Criado há 15 min', category: 'Informática/TI', priority: 'Alta', status: 'Aberto' },
  { id: '#TK-8901', subject: 'Curto-circuito no andar 3', time: 'Criado há 1h', category: 'Elétrica', priority: 'Média', status: 'Em Atendimento' },
  { id: '#TK-8895', subject: 'Câmera portão sul inoperante', time: 'Criado ontem', category: 'Segurança Eletrônica', priority: 'Baixa', status: 'Aguardando Peças' },
  { id: '#TK-8890', subject: 'Vazamento teto refeitório', time: 'Criado ontem', category: 'Predial/Civil', priority: 'Alta', status: 'Concluído Hoje' },
];

const categoryBadge: Record<string, string> = {
  'Informática/TI': 'bg-[#e6f0fa] text-[#1a5f9a]',
  'Elétrica': 'bg-[#fcf0e3] text-[#a35c15]',
  'Predial/Civil': 'bg-[#e6f4ea] text-[#1e6f3d]',
  'Segurança Eletrônica': 'bg-[#eae8f4] text-[#4a3e90]',
  'Telecomunicações': 'bg-secondary-container text-on-secondary-container',
};

export function Dashboard() {
  const { addToast } = useAppContext();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');
  const [search, setSearch] = useState('');
  const [detailModal, setDetailModal] = useState<string | null>(null);
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [notifModal, setNotifModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);

  const filters: FilterType[] = ['Todos', 'Informática/TI', 'Elétrica', 'Predial/Civil', 'Segurança Eletrônica', 'Telecomunicações'];

  const filterIcon: Record<FilterType, string> = {
    'Todos': 'filter_alt',
    'Informática/TI': 'computer',
    'Elétrica': 'electrical_services',
    'Predial/Civil': 'apartment',
    'Segurança Eletrônica': 'videocam',
    'Telecomunicações': 'router',
  };

  const filteredTickets = allTickets.filter(t => {
    const matchCat = activeFilter === 'Todos' || t.category === activeFilter;
    const matchSearch = !search || t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search);
    return matchCat && matchSearch;
  });

  const handleAssign = (ticketId: string, tech: string) => {
    setAssignModal(null);
    addToast('success', 'Técnico Atribuído', `${tech} foi atribuído ao chamado ${ticketId}.`);
  };

  const detail = detailModal ? TICKET_DETAILS[detailModal] : null;
  const assignTicket = assignModal ? TICKET_DETAILS[assignModal] : null;

  return (
    <>
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-2">Visão Geral</h1>
          <p className="text-on-surface-variant text-lg">Acompanhe o status e métricas do suporte técnico hoje.</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              className="bg-surface-container-low border border-outline-variant rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm w-64 placeholder-on-surface-variant"
              placeholder="Buscar chamados..."
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setNotifModal(true)}
            className="relative p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button
            onClick={() => setHelpModal(true)}
            className="p-2 text-on-surface-variant hover:bg-surface-container-highest rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <img alt="Admin User" className="h-10 w-10 rounded-full border border-outline-variant ml-2 cursor-pointer" onClick={() => navigate('/configuracoes')} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr10gfD4ojDyCH-t2jpLYhqsrSeRxSbelhWegr6JXYQAbhcM03bWOvFBejWerjBOaiNYTG_eyA3lBl3p1nU72ZoJ16-f7nupU4_DIFhLP7JsDH6LH75BfTVTw4b2F0d5Ibhix8btugBI6-dHRunxaHB4LimRi_gaR6BzzAxgpW-B6W-vXo9IN-EQKyUEroGij281NAid21o4AgThrhLYs9z3-NB96i4kT2GmeeszMMzIDQUbIR9XV1syavg0DtTV2uOHH8xUoGp2o" />
        </div>
      </header>

      {/* Bento Grid - KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Chamados Abertos', value: '24', sub: '+12% vs. ontem', subColor: 'text-primary', icon: 'confirmation_number', iconColor: 'text-tertiary bg-tertiary-container/20', subIcon: 'trending_up', filter: 'Todos' },
          { label: 'Em Atendimento', value: '18', sub: 'Técnicos alocados: 8', subColor: 'text-on-surface-variant', icon: 'build_circle', iconColor: 'text-primary bg-primary-container/20', filter: 'Todos' },
          { label: 'Aguardando Peças', value: '7', sub: 'Tempo médio: 48h', subColor: 'text-on-surface-variant', icon: 'inventory_2', iconColor: 'text-secondary bg-secondary-container/50', filter: 'Todos' },
          { label: 'Concluídos Hoje', value: '32', sub: 'SLA de 94%', subColor: 'text-[#4a7c59]', icon: 'check_circle', iconColor: 'text-[#4a7c59] bg-[#4a7c59]/10', subIcon: 'sentiment_very_satisfied', filter: 'Todos' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col justify-between cursor-pointer hover:border-primary/30 hover:shadow-[0_4px_24px_rgba(194,101,42,0.10)] transition-all"
            onClick={() => { setActiveFilter(kpi.filter as FilterType); addToast('info', 'Filtro Aplicado', `Exibindo: ${kpi.label}`); }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-on-surface-variant font-medium text-sm uppercase tracking-wider">{kpi.label}</h3>
              <span className={`material-symbols-outlined ${kpi.iconColor} p-2 rounded-lg`} style={{ fontVariationSettings: "'FILL' 1" }}>{kpi.icon}</span>
            </div>
            <div>
              <p className="font-headline text-4xl font-bold text-on-surface">{kpi.value}</p>
              <p className={`text-xs ${kpi.subColor} mt-2 flex items-center gap-1 font-medium`}>
                {kpi.subIcon && <span className="material-symbols-outlined text-[14px]">{kpi.subIcon}</span>}
                {kpi.sub}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories / Filters */}
      <section className="mb-8 overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex gap-3 min-w-max">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => { setActiveFilter(f); addToast('info', 'Filtro Ativo', f === 'Todos' ? 'Mostrando todos os chamados.' : `Filtrando por: ${f}`); }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm flex items-center gap-2 transition-colors ${
                activeFilter === f
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest border border-outline-variant/60 text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{filterIcon[f]}</span>
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Recent Tickets Table */}
      <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] overflow-hidden">
        <div className="px-6 py-5 border-b border-outline-variant/60 flex justify-between items-center bg-surface-container-low/30">
          <h2 className="font-headline text-2xl font-bold text-on-surface">Chamados Recentes</h2>
          <button
            onClick={() => navigate('/meus-chamados')}
            className="text-primary hover:underline text-sm font-semibold"
          >
            Ver Todos
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/40 bg-surface-bright/50 text-on-surface-variant text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">ID/Ticket</th>
                <th className="px-6 py-4 font-medium">Assunto</th>
                <th className="px-6 py-4 font-medium">Categoria</th>
                <th className="px-6 py-4 font-medium">Prioridade</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant/30">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-on-surface-variant font-body">
                    <span className="material-symbols-outlined text-4xl mb-2 block text-outline">search_off</span>
                    Nenhum chamado encontrado.
                  </td>
                </tr>
              ) : filteredTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="px-6 py-4 font-semibold text-on-surface">{ticket.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-on-surface font-medium">{ticket.subject}</p>
                    <p className="text-on-surface-variant text-xs mt-0.5">{ticket.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryBadge[ticket.category] || 'bg-surface-container text-on-surface'}`}>
                      {ticket.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 font-medium ${ticket.priority === 'Alta' ? 'text-error' : ticket.priority === 'Média' ? 'text-primary' : 'text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-[16px]">
                        {ticket.priority === 'Alta' ? 'priority_high' : ticket.priority === 'Média' ? 'warning' : 'arrow_downward'}
                      </span>
                      {ticket.priority}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      ticket.status === 'Aberto' ? 'bg-tertiary-container/20 text-tertiary border-tertiary/20' :
                      ticket.status === 'Em Atendimento' ? 'bg-primary-container/20 text-primary border-primary/20' :
                      ticket.status === 'Concluído Hoje' ? 'bg-[#4a7c59]/10 text-[#4a7c59] border-[#4a7c59]/20' :
                      'bg-secondary-container/50 text-on-secondary-container border-outline-variant/60'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setAssignModal(ticket.id)}
                        className="p-1.5 text-primary hover:bg-primary-container/20 rounded-md transition-colors"
                        title="Atribuir Técnico"
                      >
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                      </button>
                      <button
                        onClick={() => setDetailModal(ticket.id)}
                        className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-md transition-colors"
                        title="Visualizar Detalhes"
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-outline-variant/60 bg-surface-container-low/30 flex items-center justify-between">
          <p className="text-sm text-on-surface-variant">Mostrando {filteredTickets.length} de {allTickets.length} chamados</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addToast('info', 'Paginação', 'Esta é a primeira página.')}
              className="p-1 border border-outline-variant/60 rounded text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button
              onClick={() => addToast('info', 'Paginação', 'Esta é a última página.')}
              className="p-1 border border-outline-variant/60 rounded text-on-surface-variant hover:bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Modal: Detalhes do Chamado */}
      <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title={`Detalhes — ${detailModal}`} size="lg">
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-on-surface-variant font-medium mb-1">Assunto</p><p className="font-semibold text-on-surface">{detail.subject}</p></div>
              <div><p className="text-on-surface-variant font-medium mb-1">Categoria</p><p className="font-semibold text-on-surface">{detail.category}</p></div>
              <div><p className="text-on-surface-variant font-medium mb-1">Prioridade</p><p className="font-semibold text-on-surface">{detail.priority}</p></div>
              <div><p className="text-on-surface-variant font-medium mb-1">Status</p><p className="font-semibold text-on-surface">{detail.status}</p></div>
              <div className="col-span-2"><p className="text-on-surface-variant font-medium mb-1">Técnico Responsável</p><p className="font-semibold text-on-surface">{detail.technician}</p></div>
            </div>
            <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/40">
              <p className="text-on-surface-variant text-sm font-medium mb-2">Descrição</p>
              <p className="text-on-surface text-sm leading-relaxed">{detail.desc}</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setDetailModal(null)} className="px-5 py-2 rounded-lg border border-outline-variant text-on-surface font-body font-semibold hover:bg-surface-container-high transition-colors text-sm">Fechar</button>
              <button onClick={() => { setDetailModal(null); addToast('success', 'Em Atendimento', `Chamado ${detailModal} marcado como em atendimento.`); }} className="px-5 py-2 rounded-lg bg-primary text-on-primary font-body font-semibold hover:bg-primary/90 transition-colors text-sm">
                Iniciar Atendimento
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Atribuir Técnico */}
      <Modal isOpen={!!assignModal} onClose={() => setAssignModal(null)} title={`Atribuir Técnico — ${assignModal}`} size="sm">
        {assignTicket && (
          <div className="space-y-3">
            <p className="text-on-surface-variant text-sm font-body mb-4">Selecione um técnico disponível para o chamado:</p>
            {['Carlos Ribeiro', 'Mariana Freitas', 'Rafael Andrade', 'Ana Lima'].map(tech => (
              <button
                key={tech}
                onClick={() => handleAssign(assignModal!, tech)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-outline-variant/60 hover:border-primary hover:bg-primary-fixed/20 transition-colors text-left group"
              >
                <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {tech.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-on-surface text-sm">{tech}</p>
                  <p className="text-on-surface-variant text-xs">Disponível agora</p>
                </div>
                <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary ml-auto transition-colors">arrow_forward</span>
              </button>
            ))}
          </div>
        )}
      </Modal>

      {/* Modal: Notificações */}
      <Modal isOpen={notifModal} onClose={() => setNotifModal(false)} title="Notificações" size="md">
        <div className="space-y-3">
          {[
            { icon: 'priority_high', color: 'text-error', title: '#TK-8902 — Alta Prioridade', desc: 'Queda de servidor principal ainda sem técnico atribuído.', time: 'Há 15 min' },
            { icon: 'schedule', color: 'text-primary', title: 'SLA em risco — #TK-8895', desc: 'Chamado da câmera sul vence em 2h.', time: 'Há 45 min' },
            { icon: 'check_circle', color: 'text-[#4a7c59]', title: '#TK-8890 Concluído', desc: 'Vazamento no refeitório resolvido com sucesso.', time: 'Há 2h' },
          ].map((n, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
              <span className={`material-symbols-outlined text-[22px] mt-0.5 ${n.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{n.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-on-surface text-sm">{n.title}</p>
                <p className="text-on-surface-variant text-xs mt-0.5">{n.desc}</p>
              </div>
              <span className="text-xs text-outline flex-shrink-0">{n.time}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-outline-variant/40">
            <button onClick={() => setNotifModal(false)} className="w-full text-center text-primary text-sm font-semibold hover:underline">Marcar todas como lidas</button>
          </div>
        </div>
      </Modal>

      {/* Modal: Ajuda */}
      <Modal isOpen={helpModal} onClose={() => setHelpModal(false)} title="Central de Ajuda" size="md">
        <div className="space-y-4">
          {[
            { icon: 'book', title: 'Documentação', desc: 'Guias e manuais do sistema Sahara Support.' },
            { icon: 'headset_mic', title: 'Suporte Técnico', desc: 'Fale com a equipe de suporte via ramal 2040.' },
            { icon: 'video_library', title: 'Tutoriais em Vídeo', desc: 'Aprenda a usar cada funcionalidade do sistema.' },
            { icon: 'forum', title: 'Fórum Interno', desc: 'Troque experiências com outros técnicos.' },
          ].map((item, i) => (
            <button key={i} onClick={() => { setHelpModal(false); addToast('info', item.title, `Abrindo: ${item.desc}`); }} className="w-full flex items-center gap-4 p-4 rounded-xl border border-outline-variant/40 hover:border-primary hover:bg-primary-fixed/10 transition-colors text-left group">
              <span className="material-symbols-outlined text-primary text-[28px] group-hover:scale-110 transition-transform">{item.icon}</span>
              <div>
                <p className="font-semibold text-on-surface text-sm">{item.title}</p>
                <p className="text-on-surface-variant text-xs">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
