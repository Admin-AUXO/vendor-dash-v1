import { createContext, useContext, ReactNode } from 'react';

interface NavigationContextType {
  navigate: (screenId: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ 
  children, 
  onNavigate 
}: { 
  children: ReactNode; 
  onNavigate: (screenId: string) => void;
}) {
  return (
    <NavigationContext.Provider value={{ navigate: onNavigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

