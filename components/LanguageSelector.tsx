import React, { useState, useRef, useEffect } from 'react';
import type { Language } from '../types';
import { ChevronDownIcon } from './icons';

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: Language;
  onSelect: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, selectedLanguage, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (lang: Language) => {
    onSelect(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white hover:bg-black/5 text-[#333333] font-semibold px-4 py-2 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D57]/50 border border-black/10"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{selectedLanguage.name}</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg p-2 z-10 animate-fade-in-fast border border-black/5">
          <ul className="space-y-1">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => handleSelect(lang)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedLanguage.code === lang.code
                      ? 'bg-[#2E7D57] text-white'
                      : 'text-[#333333] hover:bg-black/5'
                  }`}
                >
                  {lang.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
