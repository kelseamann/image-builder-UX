import React, { createContext, useContext, useState, ReactNode } from 'react';

export type NamingMode = 'semantic' | 'regular';

interface NamingModeContextType {
  namingMode: NamingMode;
  setNamingMode: (mode: NamingMode) => void;
  toggleNamingMode: () => void;
}

const NamingModeContext = createContext<NamingModeContextType | undefined>(undefined);

interface NamingModeProviderProps {
  children: ReactNode;
}

export const NamingModeProvider: React.FC<NamingModeProviderProps> = ({ children }) => {
  const [namingMode, setNamingMode] = useState<NamingMode>('regular');

  const toggleNamingMode = () => {
    setNamingMode(prev => prev === 'semantic' ? 'regular' : 'semantic');
  };

  return (
    <NamingModeContext.Provider value={{ namingMode, setNamingMode, toggleNamingMode }}>
      {children}
    </NamingModeContext.Provider>
  );
};

export const useNamingMode = (): NamingModeContextType => {
  const context = useContext(NamingModeContext);
  if (context === undefined) {
    throw new Error('useNamingMode must be used within a NamingModeProvider');
  }
  return context;
};

// Helper function to get the appropriate name based on mode
export const getDisplayName = (
  semanticName: string, 
  regularName: string, 
  namingMode: NamingMode
): string => {
  return namingMode === 'semantic' ? semanticName : regularName;
};
