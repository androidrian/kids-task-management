import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="text-purple-600 hover:text-purple-700 flex items-center gap-2"
      aria-label="Toggle language"
    >
      <Languages className="w-5 h-5" />
      {i18n.language.toUpperCase()}
    </button>
  );
};

export default LanguageSwitcher;