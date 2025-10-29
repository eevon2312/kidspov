import React from 'react';
import { Mascot } from './Mascot';

interface HomeViewProps {
  onStart: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 max-w-lg mx-auto animate-fade-in h-full">
      <Mascot className="w-48 h-auto mb-8" />
      <h1 className="text-4xl md:text-5xl font-bold text-[#111111] leading-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Ready to Explore?
      </h1>
      <p className="text-[#666666] mt-4 mb-10 text-lg max-w-sm">
        Point your camera at an object to learn its name in different languages!
      </p>
      <button
        onClick={onStart}
        className="w-full max-w-xs px-8 py-4 bg-[#2E7D57] text-white font-bold rounded-xl shadow-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#2E7D57]/50 transition-all transform active:scale-95 text-xl"
      >
        Start Scanning
      </button>
    </div>
  );
};
