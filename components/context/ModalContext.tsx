/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from 'react';

interface ModalContent {
  type: 'DetalheCategoria' | 'MenuOffCanvas' | 'FormularioCategoria';
  props?: any;
}

interface ModalContextType {
  modalContent: ModalContent | null;
  setModalContent: (content: ModalContent | null) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ modalContent, setModalContent, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
