import { useTranslation } from '../../../locales/LanguageContext';

export const useStudentDashboard = () => {
  const { lang } = useTranslation();

  return {
    lang
  };
};
