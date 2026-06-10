import React, { createContext, useContext, useState, useEffect } from 'react';
import type { TranslationKeys } from './translationKeys';
import { hu } from './hu';
import { en } from './en';

type LanguageType = 'hu' | 'en';

interface LanguageContextProps {
  lang: TranslationKeys;
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const dictionaries: Record<LanguageType, TranslationKeys> = {
  hu,
  en
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read saved language from localStorage or default to Hungarian 'hu'
  const [language, setLanguageState] = useState<LanguageType>(() => {
    const saved = localStorage.getItem('app-lang');
    return (saved === 'en' || saved === 'hu') ? saved : 'hu';
  });

  const [lang, setLang] = useState<TranslationKeys>(dictionaries[language]);

  useEffect(() => {
    setLang(dictionaries[language]);
    localStorage.setItem('app-lang', language);
  }, [language]);

  const setLanguage = (newLang: LanguageType) => {
    setLanguageState(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
