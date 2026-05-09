import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer, useToast } from './Toast';
import { AppContext } from '../context/AppContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <AppContext.Provider value={{ addToast }}>
      <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row overflow-x-hidden">
        <Header />
        <Sidebar />
        <main className="flex-1 md:ml-64 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
        {/* Floating Action Button (Mobile Only) */}
        <Link to="/novo-chamado" className="md:hidden fixed bottom-6 right-6 bg-primary text-on-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-transform active:scale-95 z-50">
          <span className="material-symbols-outlined">add</span>
        </Link>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </AppContext.Provider>
  );
}
