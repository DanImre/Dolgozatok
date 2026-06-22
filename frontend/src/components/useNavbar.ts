import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../locales/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const useNavbar = () => {
  const { lang, language, setLanguage } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === 'hu' ? 'en' : 'hu');
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  return {
    lang,
    language,
    toggleLanguage,
    user,
    logout,
    handleNavigateHome
  };
};
