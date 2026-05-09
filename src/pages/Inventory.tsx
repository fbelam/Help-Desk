import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Modal } from '../components/Modal';

type CategoryFilter = 'Todos' | 'Hardware' | 'Software' | 'Rede' | 'Periféricos' | 'Elétrica';

const inventoryItems = [
  { id: '#INV-1024', name: 'MacBook Pro M2', category: 'Hardware', location: 'Setor Financeiro', status: 'Em Uso', revision: '12 Out, 2023', statusClass: 'bg-primary-fixed/50 text-on-primary-fixed-variant border-primary/20', dotClass: 'bg-primary' },
  { id: '#INV-1088', name: 'Roteador Industrial Cisco', category: 'Rede', location: 'Sala de Servidores 01', status: 'Disponível', revision: '05 Nov, 2023', statusClass: 'bg-surface-container-highest text-on-surface border-outline-variant', dotClass: 'bg-outline' },
  { id: '#INV-2041', name: 'Monitor Dell UltraSharp 27"', category: 'Periféricos', location: 'Design Hub', status: 'Manutenção', revision: '22 Set, 2023', statusClass: 'bg-error-container text-on-error-container border-error/20', dotClass: 'bg-error' },
  { id: '#INV-0955', name: 'Licença Adobe Creative Cloud', category: 'Software', location: 'Equipe de Marketing', status: 'Reservado', revision: '15 Dez, 2023', statusClass: 'bg-tertiary-fixed text-on-tertiary-fixed-variant border-tertiary/20', dotClass: 'bg-tertiary' },
  { id: '#INV-1102', name: 'Nobreak APC 1500VA', category: 'Elétrica', location: 'Sala 402', status: 'Em Uso', revision: '01 Jan, 2024', statusClass: 'bg-primary-fixed/50 text-on-primary-fixed-variant border-primary/20', dotClass: 'bg-primary' },
];

export function Inventory() {
  const { addToast } = useAppContext();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('Todos');
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState<string | null>(null);
  const [historyModal, setHistoryModal] = useState<string | null>(null);
  const [addModal, setAddModal] = useState(false);

  const filters: CategoryFilter[] = ['Todos', 'Hardware', 'Software', 'Rede', 'Periféricos', 'Elétrica'];

  const filtered = inventoryItems.filter(item => {
    const matchCat = activeFilter === 'Todos' || item.category === activeFilter;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.id.includes(search);
    return matchCat && matchSearch;
  });

  const editItem = inventoryItems.find(i => i.id === editModal);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-2">Inventário de Ativos</h1>
          <p className="font-body text-on-surface-variant text-lg">Gerencie equipamentos, licenças e recursos do sistema.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
              placeholder="Buscar por patrimônio..."
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setAddModal(true)}
            className="bg-primary text-on-primary font-body font-bold py-2.5 px-5 rounded-lg hover:bg-surface-tint transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
          >
            <span className="material-symbols-outlined">add</span>Adicionar Item
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: 'devices', iconClass: 'bg-surface-container-low text-on-surface-variant', badge: '+12%', label: 'Total de Ativos', value: '1.248', iconFill: true },
          { icon: 'check_circle', iconClass: 'bg-surface-container-low text-primary', label: 'Itens em Uso', value: '982', iconFill: true },
          { icon: 'build', iconClass: 'bg-error-container text-error', label: 'Em Manutenção', value: '45', iconFill: true },
          { icon: 'warning', iconClass: 'bg-tertiary-fixed text-tertiary', label: 'Estoque Baixo', value: '12', iconFill: true },
        ].map((card) => (
          <div
            key={card.label}
            onClick={() => addToast('info', card.label, `${card.value} itens registrados nesta categoria.`)}
            className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/60 shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col justify-between cursor-pointer hover:border-primary/30 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 ${card.iconClass} rounded-lg`}>
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
              </div>
              {card.badge && <span className="font-body text-xs font-bold text-primary bg-primary-fixed px-2 py-1 rounded-full">{card.badge}</span>}
            </div>
            <div>
              <p className="font-body text-on-surface-variant text-sm font-medium mb-1">{card.label}</p>
              <p className="font-headline text-3xl font-bold text-on-surface">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 gap-3 hide-scrollbar mb-6">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => { setActiveFilter(f); addToast('info', 'Filtro Ativo', `Filtrando inventário por: ${f}`); }}
            className={`px-5 py-2 rounded-full font-body text-sm whitespace-nowrap transition-colors ${
              activeFilter === f
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container-low font-medium'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/60">
                {['Patrimônio', 'Nome do Item', 'Categoria', 'Localização', 'Status', 'Última Revisão', 'Ações'].map((h, i) => (
                  <th key={h} className={`font-body text-sm font-bold text-on-surface-variant py-4 px-6 whitespace-nowrap ${i === 6 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-on-surface-variant font-body"><span className="material-symbols-outlined text-4xl mb-2 block text-outline">search_off</span>Nenhum item encontrado.</td></tr>
              ) : filtered.map(item => (
                <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="font-body text-sm font-bold text-on-surface py-4 px-6">{item.id}</td>
                  <td className="font-body text-sm font-medium text-on-surface py-4 px-6">{item.name}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container">{item.category}</span>
                  </td>
                  <td className="font-body text-sm text-on-surface-variant py-4 px-6">{item.location}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${item.statusClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.dotClass}`}></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="font-body text-sm text-on-surface-variant py-4 px-6">{item.revision}</td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => setEditModal(item.id)} className="text-on-surface-variant hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-xl">edit</span></button>
                    <button onClick={() => setHistoryModal(item.id)} className="text-on-surface-variant hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-xl">history</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-surface-container-lowest border-t border-outline-variant/60 py-4 px-6 flex items-center justify-between">
          <p className="font-body text-sm text-on-surface-variant">Mostrando <span className="font-bold text-on-surface">{filtered.length}</span> de <span className="font-bold text-on-surface">1.248</span> resultados</p>
          <div className="flex gap-2">
            <button onClick={() => addToast('info', 'Paginação', 'Você está na primeira página.')} className="p-2 border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button onClick={() => addToast('info', 'Paginação', 'Carregando próxima página...')} className="p-2 border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Editar Item */}
      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title={`Editar — ${editItem?.name ?? ''}`} size="md">
        {editItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-sm font-semibold text-on-surface">Nome</label><input className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm bg-surface focus:border-primary focus:ring-1 focus:ring-primary" defaultValue={editItem.name} /></div>
              <div className="space-y-1"><label className="text-sm font-semibold text-on-surface">Localização</label><input className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm bg-surface focus:border-primary focus:ring-1 focus:ring-primary" defaultValue={editItem.location} /></div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-on-surface">Status</label>
              <select className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm bg-surface focus:border-primary focus:ring-1 focus:ring-primary">
                {['Em Uso', 'Disponível', 'Manutenção', 'Reservado'].map(s => <option key={s} selected={s === editItem.status}>{s}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditModal(null)} className="px-5 py-2 rounded-lg border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-high transition-colors text-sm">Cancelar</button>
              <button onClick={() => { setEditModal(null); addToast('success', 'Item Atualizado', `${editItem.name} foi atualizado com sucesso.`); }} className="px-5 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors text-sm">Salvar</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Histórico */}
      <Modal isOpen={!!historyModal} onClose={() => setHistoryModal(null)} title={`Histórico — ${historyModal}`} size="md">
        <div className="space-y-3">
          {[
            { date: 'Hoje, 09:30', event: 'Status alterado para Em Uso', user: 'Carlos Ribeiro' },
            { date: '02 Jan, 2024', event: 'Revisão técnica realizada', user: 'Mariana Freitas' },
            { date: '15 Dez, 2023', event: 'Cadastrado no sistema', user: 'Admin' },
          ].map((h, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/40">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">history</span>
              <div>
                <p className="text-sm font-semibold text-on-surface">{h.event}</p>
                <p className="text-xs text-on-surface-variant">{h.date} · por {h.user}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Modal: Adicionar Item */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Adicionar Novo Item" size="md">
        <div className="space-y-4">
          {[['Nome do Item', 'text', 'Ex: Notebook Dell Inspiron 15'], ['Localização', 'text', 'Ex: Sala 201'], ['Patrimônio (ID)', 'text', 'Ex: #INV-9999']].map(([label, type, ph]) => (
            <div key={label as string} className="space-y-1">
              <label className="text-sm font-semibold text-on-surface">{label}</label>
              <input className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm bg-surface focus:border-primary focus:ring-1 focus:ring-primary" type={type as string} placeholder={ph as string} />
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface">Categoria</label>
            <select className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm bg-surface focus:border-primary focus:ring-1 focus:ring-primary">
              {['Hardware', 'Software', 'Rede', 'Periféricos', 'Elétrica'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setAddModal(false)} className="px-5 py-2 rounded-lg border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-high transition-colors text-sm">Cancelar</button>
            <button onClick={() => { setAddModal(false); addToast('success', 'Item Adicionado', 'Novo ativo cadastrado no inventário.'); }} className="px-5 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">add</span>Cadastrar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
