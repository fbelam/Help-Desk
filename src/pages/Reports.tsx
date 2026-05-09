import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

// ─── Tipos ────────────────────────────────────────────────────────────────────
type PeriodKey = 'Hoje' | 'Semana' | 'Mês' | 'Personalizado';

interface PeriodData {
  slaHr: number;
  slaMin: number;
  slaVsLabel: string;
  slaUp: boolean;
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  csat: string;
  csatDelta: string;
  csatUp: boolean;
  barTitle: string;
  barChart: { h: string; label: string; val: string; highlight: boolean }[];
  donut: { color: string; label: string; pct: string }[];
  team: { initials: string; bg: string; name: string; tickets: string; time: string; csat: string }[];
}

// ─── Dataset por período ──────────────────────────────────────────────────────
const PERIOD_DATA: Record<PeriodKey, PeriodData> = {
  'Hoje': {
    slaHr: 0, slaMin: 48, slaVsLabel: '-5% vs. ontem', slaUp: false,
    totalTickets: 24, openTickets: 8, closedTickets: 16,
    csat: '4.9', csatDelta: '+0.1 pontos', csatUp: true,
    barTitle: 'Chamados por Hora',
    barChart: [
      { h: '30%', label: '08h', val: '7',  highlight: false },
      { h: '55%', label: '10h', val: '13', highlight: false },
      { h: '80%', label: '12h', val: '19', highlight: true  },
      { h: '60%', label: '14h', val: '14', highlight: false },
      { h: '50%', label: '16h', val: '12', highlight: false },
      { h: '25%', label: '18h', val: '6',  highlight: false },
      { h: '10%', label: '20h', val: '2',  highlight: false },
    ],
    donut: [
      { color: 'bg-primary',                 label: 'Informática', pct: '50%' },
      { color: 'bg-primary-container',       label: 'Elétrica',    pct: '25%' },
      { color: 'bg-tertiary',                label: 'Predial',     pct: '15%' },
      { color: 'bg-surface-container-highest', label: 'Outros',    pct: '10%' },
    ],
    team: [
      { initials: 'MC', bg: 'bg-primary-container text-on-primary-container',    name: 'Mariana Costa', tickets: '8',  time: '38m',    csat: '5.0' },
      { initials: 'RS', bg: 'bg-secondary-container text-on-secondary-container', name: 'Rafael Silva',  tickets: '5',  time: '55m',    csat: '4.8' },
      { initials: 'AL', bg: 'bg-tertiary-container text-on-tertiary-container',   name: 'Ana Lima',      tickets: '3',  time: '1h 10m', csat: '4.7' },
    ],
  },
  'Semana': {
    slaHr: 1, slaMin: 5, slaVsLabel: '-8% vs. semana passada', slaUp: false,
    totalTickets: 138, openTickets: 22, closedTickets: 116,
    csat: '4.8', csatDelta: '+0.1 pontos', csatUp: true,
    barTitle: 'Tendência da Semana',
    barChart: [
      { h: '40%', label: 'Seg', val: '42', highlight: false },
      { h: '65%', label: 'Ter', val: '68', highlight: false },
      { h: '85%', label: 'Qua', val: '89', highlight: true  },
      { h: '50%', label: 'Qui', val: '55', highlight: false },
      { h: '70%', label: 'Sex', val: '72', highlight: false },
      { h: '20%', label: 'Sáb', val: '21', highlight: false },
      { h: '10%', label: 'Dom', val: '12', highlight: false },
    ],
    donut: [
      { color: 'bg-primary',                 label: 'Informática', pct: '45%' },
      { color: 'bg-primary-container',       label: 'Sistemas',    pct: '30%' },
      { color: 'bg-tertiary',                label: 'Elétrica',    pct: '15%' },
      { color: 'bg-surface-container-highest', label: 'Outros',    pct: '10%' },
    ],
    team: [
      { initials: 'MC', bg: 'bg-primary-container text-on-primary-container',    name: 'Mariana Costa', tickets: '38', time: '42m',    csat: '4.9' },
      { initials: 'RS', bg: 'bg-secondary-container text-on-secondary-container', name: 'Rafael Silva',  tickets: '31', time: '58m',    csat: '4.7' },
      { initials: 'AL', bg: 'bg-tertiary-container text-on-tertiary-container',   name: 'Ana Lima',      tickets: '26', time: '1h 20m', csat: '4.6' },
    ],
  },
  'Mês': {
    slaHr: 1, slaMin: 15, slaVsLabel: '-12% vs. mês passado', slaUp: false,
    totalTickets: 482, openTickets: 45, closedTickets: 437,
    csat: '4.8', csatDelta: '+0.2 pontos', csatUp: true,
    barTitle: 'Chamados por Semana',
    barChart: [
      { h: '45%', label: 'S1', val: '108', highlight: false },
      { h: '60%', label: 'S2', val: '145', highlight: false },
      { h: '80%', label: 'S3', val: '192', highlight: true  },
      { h: '55%', label: 'S4', val: '130', highlight: false },
      { h: '30%', label: 'S5', val: '72',  highlight: false },
      { h: '0%',  label: '',   val: '',    highlight: false },
      { h: '0%',  label: '',   val: '',    highlight: false },
    ],
    donut: [
      { color: 'bg-primary',                 label: 'Informática', pct: '45%' },
      { color: 'bg-primary-container',       label: 'Sistemas',    pct: '30%' },
      { color: 'bg-tertiary',                label: 'Elétrica',    pct: '15%' },
      { color: 'bg-surface-container-highest', label: 'Outros',    pct: '10%' },
    ],
    team: [
      { initials: 'MC', bg: 'bg-primary-container text-on-primary-container',    name: 'Mariana Costa', tickets: '142', time: '45m',    csat: '4.9' },
      { initials: 'RS', bg: 'bg-secondary-container text-on-secondary-container', name: 'Rafael Silva',  tickets: '118', time: '1h 10m', csat: '4.7' },
      { initials: 'AL', bg: 'bg-tertiary-container text-on-tertiary-container',   name: 'Ana Lima',      tickets: '95',  time: '1h 30m', csat: '4.5' },
    ],
  },
  'Personalizado': {
    slaHr: 1, slaMin: 30, slaVsLabel: '+3% vs. período anterior', slaUp: true,
    totalTickets: 210, openTickets: 18, closedTickets: 192,
    csat: '4.6', csatDelta: '-0.1 pontos', csatUp: false,
    barTitle: 'Evolução por Mês',
    barChart: [
      { h: '35%', label: 'Jan', val: '74',  highlight: false },
      { h: '55%', label: 'Fev', val: '116', highlight: false },
      { h: '70%', label: 'Mar', val: '148', highlight: true  },
      { h: '40%', label: 'Abr', val: '84',  highlight: false },
      { h: '0%',  label: '',    val: '',    highlight: false },
      { h: '0%',  label: '',    val: '',    highlight: false },
      { h: '0%',  label: '',    val: '',    highlight: false },
    ],
    donut: [
      { color: 'bg-primary',                 label: 'Informática', pct: '40%' },
      { color: 'bg-primary-container',       label: 'Sistemas',    pct: '35%' },
      { color: 'bg-tertiary',                label: 'Elétrica',    pct: '20%' },
      { color: 'bg-surface-container-highest', label: 'Outros',    pct: '5%'  },
    ],
    team: [
      { initials: 'MC', bg: 'bg-primary-container text-on-primary-container',    name: 'Mariana Costa', tickets: '68', time: '52m',    csat: '4.7' },
      { initials: 'RS', bg: 'bg-secondary-container text-on-secondary-container', name: 'Rafael Silva',  tickets: '55', time: '1h 15m', csat: '4.5' },
      { initials: 'AL', bg: 'bg-tertiary-container text-on-tertiary-container',   name: 'Ana Lima',      tickets: '42', time: '1h 40m', csat: '4.4' },
    ],
  },
};

const PERIODS: PeriodKey[] = ['Hoje', 'Semana', 'Mês', 'Personalizado'];

// ─── Componente ───────────────────────────────────────────────────────────────
export function Reports() {
  const { addToast } = useAppContext();
  const [period, setPeriod] = useState<PeriodKey>('Mês');

  // d é o snapshot de dados do período ativo — muda toda vez que period muda
  const d = PERIOD_DATA[period];

  const handlePeriod = (p: PeriodKey) => {
    setPeriod(p);
    addToast('info', 'Período Atualizado', `Exibindo métricas de: ${p}`);
  };

  const handleExport = () =>
    addToast('success', 'Relatório Exportado', `Relatório de "${period}" exportado com sucesso em PDF.`);

  return (
    <>
      {/* ── Cabeçalho ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-1">
          <p className="text-on-surface-variant text-sm font-medium uppercase tracking-widest">Visão Geral</p>
          <h2 className="font-headline text-4xl font-bold text-on-surface">Métricas Operacionais</h2>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* Seletor de período */}
          <div className="flex bg-surface-container-highest rounded-lg p-1 border border-outline-variant/30">
            {PERIODS.map(p => (
              <button
                key={p}
                onClick={() => handlePeriod(p)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1 ${
                  period === p
                    ? 'bg-surface text-on-surface shadow-sm border border-outline-variant/40'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {p === 'Personalizado' && (
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                )}
                {p}
              </button>
            ))}
          </div>

          {/* Exportar */}
          <button
            onClick={handleExport}
            className="bg-surface border border-outline-variant/60 text-on-surface hover:border-primary hover:text-primary font-medium py-2 px-5 rounded-lg flex items-center gap-2 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* ── KPIs ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* SLA */}
        <div
          className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.02)] relative overflow-hidden group hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => addToast('info', 'Tempo de Resposta (SLA)', `Média de ${d.slaHr > 0 ? `${d.slaHr}h ` : ''}${d.slaMin}m para o período "${period}".`)}
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-primary">timer</span>
          </div>
          <p className="text-sm font-medium text-on-surface-variant mb-4">Tempo Médio de Resposta (SLA)</p>
          <div className="flex items-baseline gap-2 mb-2">
            <h3 className="font-headline text-5xl font-bold text-on-surface tracking-tight">
              {d.slaHr > 0 && <>{d.slaHr}<span className="text-3xl text-on-surface-variant">h</span> </>}
              {d.slaMin}<span className="text-3xl text-on-surface-variant">m</span>
            </h3>
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${d.slaUp ? 'text-error' : 'text-primary'}`}>
            <span className="material-symbols-outlined text-[16px]">
              {d.slaUp ? 'trending_up' : 'trending_down'}
            </span>
            <span>{d.slaVsLabel}</span>
          </div>
        </div>

        {/* Volume */}
        <div
          className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.02)] relative overflow-hidden group hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => addToast('info', 'Volume de Chamados', `${d.totalTickets} chamados: ${d.closedTickets} concluídos, ${d.openTickets} abertos — período "${period}".`)}
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-primary">confirmation_number</span>
          </div>
          <p className="text-sm font-medium text-on-surface-variant mb-4">Volume de Chamados</p>
          <div className="flex items-baseline gap-3 mb-2">
            <h3 className="font-headline text-5xl font-bold text-on-surface tracking-tight">{d.totalTickets}</h3>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-on-surface-variant mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary-container"></div>
              <span>Abertos: {d.openTickets}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Concluídos: {d.closedTickets}</span>
            </div>
          </div>
        </div>

        {/* CSAT */}
        <div
          className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.02)] relative overflow-hidden group hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => addToast(d.csatUp ? 'success' : 'info', `CSAT: ${d.csat}/5.0`, `${d.csatDelta} — meta de 4.5 — período "${period}".`)}
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-primary">sentiment_satisfied</span>
          </div>
          <p className="text-sm font-medium text-on-surface-variant mb-4">Índice de Satisfação (CSAT)</p>
          <div className="flex items-baseline gap-2 mb-2">
            <h3 className="font-headline text-5xl font-bold text-on-surface tracking-tight">{d.csat}</h3>
            <span className="text-xl font-bold text-on-surface-variant font-headline">/ 5.0</span>
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${d.csatUp ? 'text-[#4a7c59]' : 'text-error'}`}>
            <span className="material-symbols-outlined text-[16px]">{d.csatUp ? 'trending_up' : 'trending_down'}</span>
            <span>{d.csatDelta}</span>
          </div>
        </div>
      </div>

      {/* ── Gráficos ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Donut */}
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.02)] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline text-2xl font-bold text-on-surface">Chamados por Categoria</h3>
            <span className="text-xs font-body text-on-surface-variant bg-surface-container-low border border-outline-variant/40 px-3 py-1 rounded-full">
              {period}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-10">
            <div
              className="relative w-48 h-48 rounded-full flex items-center justify-center border-[16px]"
              style={{
                borderTopColor: '#c2652a',
                borderRightColor: '#c2652a',
                borderBottomColor: '#e08850',
                borderLeftColor: '#8c3c3c',
                transform: 'rotate(-45deg)',
              }}
            >
              <div
                className="absolute inset-0 bg-surface-container-lowest rounded-full m-[10px]"
                style={{ transform: 'rotate(45deg)' }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <span className="font-headline text-3xl font-bold text-on-surface">{d.totalTickets}</span>
                  <span className="text-xs text-on-surface-variant font-medium">Total</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {d.donut.map(({ color, label, pct }) => (
                <button
                  key={label}
                  onClick={() => addToast('info', label, `${pct} dos chamados de "${period}" são da categoria ${label}.`)}
                  className="flex items-center justify-between gap-6 w-full hover:opacity-70 transition-opacity"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${color}`}></div>
                    <span className="text-sm font-medium text-on-surface">{label}</span>
                  </div>
                  <span className="text-sm font-bold text-on-surface font-headline">{pct}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Barras */}
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.02)] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline text-2xl font-bold text-on-surface">{d.barTitle}</h3>
            <span className="text-xs font-body text-on-surface-variant bg-surface-container-low border border-outline-variant/40 px-3 py-1 rounded-full">
              {period}
            </span>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 h-48 border-b border-outline-variant/40 pb-2 relative">
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-on-surface-variant font-medium -ml-6">
              <span>100</span><span>50</span><span>0</span>
            </div>
            <div className="w-full flex justify-around items-end h-full pt-4">
              {d.barChart.map((bar, i) =>
                !bar.label ? null : (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-8 rounded-t-sm cursor-pointer relative group transition-colors ${
                        bar.highlight
                          ? 'bg-primary hover:bg-surface-tint shadow-sm'
                          : 'bg-surface-container-highest hover:bg-primary-container'
                      }`}
                      style={{ height: bar.h }}
                      onClick={() => addToast('info', `${bar.label} — ${bar.val} chamados`, `Pico registrado: ${bar.val} chamados.`)}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                        {bar.val}
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${bar.highlight ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                      {bar.label}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabela de Desempenho ───────────────────────────────────────────── */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-[0_2px_16px_rgba(58,48,42,0.02)] overflow-hidden">
        <div className="p-6 border-b border-outline-variant/40 bg-surface/50 flex items-center justify-between">
          <h3 className="font-headline text-2xl font-bold text-on-surface">Desempenho da Equipe</h3>
          <span className="text-xs font-body text-on-surface-variant bg-surface-container-low border border-outline-variant/40 px-3 py-1 rounded-full">
            {period}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                {['Técnico', 'Chamados Concluídos', 'Tempo Médio', 'Nota Média (CSAT)'].map(h => (
                  <th key={h} className="py-4 px-6 font-headline font-bold text-on-surface-variant border-b border-outline-variant/60">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {d.team.map(row => (
                <tr
                  key={row.name}
                  className="hover:bg-surface-container-low/30 transition-colors cursor-pointer"
                  onClick={() => addToast('info', row.name, `${row.tickets} chamados concluídos com CSAT ${row.csat}/5.0 em "${period}".`)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${row.bg} flex items-center justify-center font-bold text-sm`}>
                        {row.initials}
                      </div>
                      <span className="font-medium text-on-surface">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-on-surface">{row.tickets}</td>
                  <td className="py-4 px-6 text-on-surface">{row.time}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-on-surface">{row.csat}</span>
                      <span
                        className="material-symbols-outlined text-[16px] text-[#e0a96d]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
