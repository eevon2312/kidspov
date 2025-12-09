
import React from 'react';
import { CameraIcon, StarIcon, BookIcon, FireIcon, PawIcon, NatureIcon, SettingsIcon, HomeIcon } from './icons';
import type { Profile, Language } from '../types';
import { LanguageSelector } from './LanguageSelector';

interface DashboardViewProps {
  profile: Profile;
  onStart: () => void;
  onChangeProfile: () => void;
  languages: Language[];
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  profile, 
  onStart, 
  onChangeProfile,
  languages,
  selectedLanguage,
  onSelectLanguage
}) => {
  return (
    <div className="w-full h-[100dvh] flex flex-col bg-[#F3F6FB] overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 pt-safe-top bg-[#F3F6FB] shrink-0 z-10">
        <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#FF8A80] flex items-center justify-center text-white border-2 border-white shadow-sm">
                <span className="font-bold text-lg">{profile.avatar}</span>
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider">Learner</span>
                <span className="font-bold text-base text-[#37474F] leading-tight line-clamp-1 max-w-[100px]">{profile.name}</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
             <div className="scale-90 origin-right">
                <LanguageSelector 
                    languages={languages} 
                    selectedLanguage={selectedLanguage} 
                    onSelect={onSelectLanguage} 
                />
             </div>
             <button onClick={onChangeProfile} className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400">
                <SettingsIcon className="w-5 h-5" />
             </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-28">
        
        {/* Greeting & Main CTA */}
        <div className="mt-2 mb-4">
             <h1 className="text-xl md:text-2xl font-bold text-[#37474F] mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>Ready to explore?</h1>
             <p className="text-gray-500 text-xs md:text-sm">Every photo helps Ollie grow smarter!</p>
        </div>

        <button 
            onClick={onStart}
            className="w-full bg-[#66D9B0] h-14 md:h-16 rounded-2xl shadow-lg shadow-[#66D9B0]/20 flex items-center justify-center gap-3 active:scale-95 transition-transform mb-6 group"
        >
             <div className="w-9 h-9 bg-[#E0F2F1] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <CameraIcon className="w-5 h-5 text-[#1B5E20]" />
             </div>
             <span className="font-bold text-lg text-[#1B5E20]">Start Learning</span>
        </button>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-white p-2.5 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center gap-1 border border-gray-50">
                 <div className="p-1 bg-yellow-100 rounded-full text-yellow-500 mb-0.5">
                    <StarIcon className="w-4 h-4" />
                 </div>
                 <span className="block font-bold text-base text-[#37474F] leading-none">{profile.coins}</span>
                 <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Stars</span>
            </div>
             <div className="bg-white p-2.5 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center gap-1 border border-gray-50">
                 <div className="p-1 bg-blue-100 rounded-full text-blue-500 mb-0.5">
                    <BookIcon className="w-4 h-4" />
                 </div>
                 <span className="block font-bold text-base text-[#37474F] leading-none">32</span>
                 <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Words</span>
            </div>
             <div className="bg-white p-2.5 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center gap-1 border border-gray-50">
                 <div className="p-1 bg-red-100 rounded-full text-red-500 mb-0.5">
                    <FireIcon className="w-4 h-4" />
                 </div>
                 <span className="block font-bold text-base text-[#37474F] leading-none">7</span>
                 <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Streak</span>
            </div>
        </div>

        {/* Daily Goal */}
        <div className="bg-white p-4 rounded-3xl shadow-sm mb-6 border border-gray-50">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-[#37474F] text-sm">Today's Goal</span>
                <span className="text-xs font-bold text-gray-400">{profile.dailyProgress} / {profile.dailyGoal} Words</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-[#66D9B0] rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (profile.dailyProgress / profile.dailyGoal) * 100)}%` }}
                ></div>
            </div>
        </div>

        {/* Badges */}
        <div className="mb-4">
             <h3 className="font-bold text-[#37474F] mb-3 text-xs uppercase tracking-wide opacity-80">Badges</h3>
             <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
                <div className="flex flex-col items-center gap-1 min-w-[64px]">
                    <div className="w-14 h-14 rounded-full bg-[#B2EBF2] flex items-center justify-center text-[#0097A7] shadow-sm">
                        <BookIcon className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-bold text-center text-gray-500 leading-tight mt-1">Color<br/>Explorer</span>
                </div>
                 <div className="flex flex-col items-center gap-1 min-w-[64px]">
                    <div className="w-14 h-14 rounded-full bg-[#FFCDD2] flex items-center justify-center text-[#E57373] shadow-sm">
                        <PawIcon className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-bold text-center text-gray-500 leading-tight mt-1">Animal<br/>Expert</span>
                </div>
                 <div className="flex flex-col items-center gap-1 min-w-[64px]">
                    <div className="w-14 h-14 rounded-full bg-[#F0F4C3] flex items-center justify-center text-[#AFB42B] shadow-sm">
                        <NatureIcon className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-bold text-center text-gray-500 leading-tight mt-1">Foodie<br/>Fun</span>
                </div>
                 <div className="flex flex-col items-center gap-1 min-w-[64px]">
                    <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center text-gray-400 shadow-sm border border-dashed border-gray-300">
                        <FireIcon className="w-6 h-6 opacity-50" />
                    </div>
                    <span className="text-[9px] font-bold text-center text-gray-400 leading-tight mt-1">Nature<br/>Scout</span>
                </div>
             </div>
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 px-6 py-2 pb-safe-bottom flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] h-[80px]">
          <button className="flex flex-col items-center gap-1 text-[#F42C5D] w-16">
              <HomeIcon className="w-6 h-6" />
              <span className="text-[10px] font-bold">Home</span>
          </button>
           <button onClick={onStart} className="flex flex-col items-center gap-1 -mt-10 group relative z-10">
              <div className="w-14 h-14 bg-[#66D9B0] rounded-full flex items-center justify-center shadow-lg shadow-[#66D9B0]/40 text-white border-[5px] border-[#F3F6FB] active:scale-95 transition-transform">
                  <CameraIcon className="w-6 h-6" />
              </div>
          </button>
           <button className="flex flex-col items-center gap-1 text-gray-400 w-16">
              <div className="w-6 h-6 flex items-center justify-center font-bold border-2 border-gray-300 rounded-md text-[10px]">XP</div>
              <span className="text-[10px] font-bold">Rank</span>
          </button>
      </div>
    </div>
  );
};
