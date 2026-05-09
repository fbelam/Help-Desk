import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NewTicket } from './pages/NewTicket';
import { MyTickets } from './pages/MyTickets';
import { Reports } from './pages/Reports';
import { Inventory } from './pages/Inventory';
import { Settings } from './pages/Settings';

// ─── Proteção de rotas ────────────────────────────────────────────────────────
function ProtectedRoutes() {
  const { session, loading } = useAuth();

  // Enquanto verifica a sessão, mostra tela em branco (evita flash)
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-primary text-5xl animate-spin">refresh</span>
          <p className="font-body text-on-surface-variant text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  // Não autenticado → redireciona para login
  if (!session) return <Navigate to="/login" replace />;

  // Autenticado → exibe o app completo
  return (
    <Layout>
      <Routes>
        <Route path="/"               element={<Dashboard />} />
        <Route path="/novo-chamado"   element={<NewTicket />} />
        <Route path="/meus-chamados"  element={<MyTickets />} />
        <Route path="/relatorios"     element={<Reports />} />
        <Route path="/inventario"     element={<Inventory />} />
        <Route path="/configuracoes"  element={<Settings />} />
        {/* Qualquer rota desconhecida → dashboard */}
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<LoginGuard />} />
          {/* Todas as outras rotas são protegidas */}
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Redireciona para / se já estiver logado e tentar acessar /login
function LoginGuard() {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (session) return <Navigate to="/" replace />;
  return <Login />;
}

export default App;
