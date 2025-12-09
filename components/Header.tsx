import React from 'react';
import { CoinIcon } from './icons';

interface HeaderProps {
  coins: number;
  children: React.ReactNode;
  showLanguageSelector?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ coins, children, showLanguageSelector = true }) => (
  <header className="w-full bg-[#FAFAF7]/90 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-50 border-b border-black/5">
    <div className="flex items-center gap-2">
      <h1 className="text-2xl md:text-3xl font-bold text-[#2E7D57]" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Povkids
      </h1>
    </div>
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-white border border-yellow-200 text-[#111111] font-bold px-3 py-1.5 rounded-full text-sm md:text-base shadow-sm">
        <CoinIcon className="w-5 h-5" />
        <span>{coins}</span>
      </div>
      <div className={`${showLanguageSelector ? 'opacity-100' : 'opacity-0 transition-opacity'}`}>
        {children}
      </div>
    </div>
  </header>
);
