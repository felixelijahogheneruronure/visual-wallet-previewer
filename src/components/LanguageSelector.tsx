
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onLanguageChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        🌍 Language / Idioma / Idioma
      </label>
      <Select value={language} onValueChange={onLanguageChange}>
        <SelectTrigger className="bg-black/30 border-gray-600 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-700">
          <SelectItem value="en" className="text-white hover:bg-gray-800">🇺🇸 English</SelectItem>
          <SelectItem value="pt" className="text-white hover:bg-gray-800">🇧🇷 Português</SelectItem>
          <SelectItem value="es" className="text-white hover:bg-gray-800">🇪🇸 Español</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
