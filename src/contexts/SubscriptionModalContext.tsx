import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubscriptionData {
  name: string;
  email: string;
  interest: string;
}

interface SubscriptionModalContextType {
  isOpen: boolean;
  modalState: 'initial' | 'success' | 'articles-only';
  prefilledData: SubscriptionData;
  articles: Array<{
    id: number;
    title: string;
    summary: string;
    slug: string;
  }>;
  openModal: (data: SubscriptionData) => void;
  closeModal: () => void;
  setModalState: (state: 'initial' | 'success' | 'articles-only') => void;
  setArticles: (articles: Array<{id: number; title: string; summary: string; slug: string}>) => void;
}

const SubscriptionModalContext = createContext<SubscriptionModalContextType | undefined>(undefined);

interface SubscriptionModalProviderProps {
  children: ReactNode;
}

export const SubscriptionModalProvider: React.FC<SubscriptionModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState<'initial' | 'success' | 'articles-only'>('initial');
  const [prefilledData, setPrefilledData] = useState<SubscriptionData>({
    name: '',
    email: '',
    interest: ''
  });
  const [articles, setArticles] = useState<Array<{id: number; title: string; summary: string; slug: string}>>([]);

  const openModal = (data: SubscriptionData) => {
    setPrefilledData(data);
    setModalState('initial');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalState('initial');
    setArticles([]);
  };

  return (
    <SubscriptionModalContext.Provider value={{
      isOpen,
      modalState,
      prefilledData,
      articles,
      openModal,
      closeModal,
      setModalState,
      setArticles
    }}>
      {children}
    </SubscriptionModalContext.Provider>
  );
};

export const useSubscriptionModal = () => {
  const context = useContext(SubscriptionModalContext);
  if (context === undefined) {
    throw new Error('useSubscriptionModal must be used within a SubscriptionModalProvider');
  }
  return context;
};