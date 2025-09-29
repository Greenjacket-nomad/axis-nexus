import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubscriptionData {
  name: string;
  email: string;
  interest: string;
}

interface SubscriptionModalContextType {
  isOpen: boolean;
  modalState: 'initial' | 'success' | 'articles-only' | 'reading-article' | 'ask-question' | 'question-response';
  prefilledData: SubscriptionData;
  articles: Array<{
    id: number;
    title: string;
    summary: string;
    slug: string;
  }>;
  currentArticle: {
    id: number;
    title: string;
    summary: string;
    slug: string;
  } | null;
  questionResponse: {
    answer: string;
    articles: Array<{
      article_id: number;
      title: string;
      summary: string;
      category: string;
      author: string;
      published_date: string;
      article_url: string;
      read_time_minutes: number;
    }>;
    status: 'success' | 'not_relevant' | 'no_results';
  } | null;
  isLoadingResponse: boolean;
  openModal: (data: SubscriptionData) => void;
  closeModal: () => void;
  setModalState: (state: 'initial' | 'success' | 'articles-only' | 'reading-article' | 'ask-question' | 'question-response') => void;
  setArticles: (articles: Array<{id: number; title: string; summary: string; slug: string}>) => void;
  setCurrentArticle: (article: {id: number; title: string; summary: string; slug: string} | null) => void;
  setQuestionResponse: (response: any) => void;
  setIsLoadingResponse: (loading: boolean) => void;
}

const SubscriptionModalContext = createContext<SubscriptionModalContextType | undefined>(undefined);

interface SubscriptionModalProviderProps {
  children: ReactNode;
}

export const SubscriptionModalProvider: React.FC<SubscriptionModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState<'initial' | 'success' | 'articles-only' | 'reading-article' | 'ask-question' | 'question-response'>('initial');
  const [prefilledData, setPrefilledData] = useState<SubscriptionData>({
    name: '',
    email: '',
    interest: ''
  });
  const [articles, setArticles] = useState<Array<{id: number; title: string; summary: string; slug: string}>>([]);
  const [currentArticle, setCurrentArticle] = useState<{id: number; title: string; summary: string; slug: string} | null>(null);
  const [questionResponse, setQuestionResponse] = useState<any>(null);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  const openModal = (data: SubscriptionData) => {
    setPrefilledData(data);
    setModalState('initial');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalState('initial');
    setArticles([]);
    setCurrentArticle(null);
    setQuestionResponse(null);
    setIsLoadingResponse(false);
  };

  return (
    <SubscriptionModalContext.Provider value={{
      isOpen,
      modalState,
      prefilledData,
      articles,
      currentArticle,
      questionResponse,
      isLoadingResponse,
      openModal,
      closeModal,
      setModalState,
      setArticles,
      setCurrentArticle,
      setQuestionResponse,
      setIsLoadingResponse
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