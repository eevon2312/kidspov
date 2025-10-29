import React from 'react';
import { StarIcon } from './icons';

interface HeaderProps {
  stars: number;
  children: React.ReactNode;
  showLanguageSelector?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ stars, children, showLanguageSelector = true }) => (
  <header className="w-full bg-[#FAFAF7]/80 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-50 border-b border-black/5">
    <div className="flex items-center gap-2">
      <h1 className="text-3xl font-bold text-[#2E7D57]" style={{ fontFamily: "'Fredoka One', cursive" }}>
        KidsPOV
      </h1>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-[#FFE9A6] text-[#111111] font-bold px-4 py-2 rounded-full text-lg">
        <StarIcon className="w-6 h-6 text-orange-400" />
        <span>{stars}</span>
      </div>
      <div className={`${showLanguageSelector ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </div>
  </header>
);
