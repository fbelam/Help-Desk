import { createContext, useContext } from 'react';
import type { ToastType } from '../components/Toast';

interface AppContextType {
  addToast: (type: ToastType, title: string, message: string) => void;
}

export const AppContext = createContext<AppContextType>({
  addToast: () => {},
});

export const useAppContext = () => useContext(AppContext);
