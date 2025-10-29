import React from 'react';

export const LoadingView: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4 text-center p-8 bg-white rounded-3xl shadow-lg border border-black/5">
    <div className="w-16 h-16 border-8 border-black/10 border-t-[#2E7D57] rounded-full animate-spin"></div>
    <h2 className="text-3xl font-bold text-[#111111] mt-4" style={{ fontFamily: "'Fredoka One', cursive" }}>Let me see...</h2>
    <p className="text-[#666666]">I'm thinking about what's in your picture!</p>
  </div>
);
