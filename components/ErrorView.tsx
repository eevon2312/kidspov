import React from 'react';
import { ReplayIcon } from './icons';

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl shadow-xl max-w-md border border-black/5">
    <div className="w-16 h-16 text-[#E57373] mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    </div>
    <h2 className="text-3xl font-bold text-[#111111]" style={{ fontFamily: "'Fredoka One', cursive" }}>Uh Oh!</h2>
    <p className="text-[#666666] mt-2 mb-8">{message}</p>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 px-6 py-3 bg-[#2E7D57] text-white font-bold rounded-xl shadow-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#2E7D57]/50 transition-transform transform active:scale-95"
    >
      <ReplayIcon className="w-6 h-6" />
      <span>Try Again</span>
    </button>
  </div>
);
