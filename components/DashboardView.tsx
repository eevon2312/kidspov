
import React from 'react';
import { CameraIcon, StarIcon, BookIcon, FireIcon, PawIcon, NatureIcon, SettingsIcon, HomeIcon, PlusIcon } from './icons';
import type { Profile } from '../types';
import { Mascot } from './Mascot';

interface DashboardViewProps {
  profile: Profile;
  onStart: () => void;
  onChangeProfile: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ profile, onStart, onChangeProfile }) => {
  return (
    <div className="w-full h-full flex flex-col bg-[#F3F6FB]">
      
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-transparent">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF8A80] flex items-center justify-center text-white">
                <span className="font-bold text-lg">🧠</span>
            </div>
            <span className="font-bold text-xl text-[#37474F]" style={{ fontFamily: "'Fredoka One', cursive" }}>KidSPOV</span>
        </div>
        <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm">
                <StarIcon className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-sm">{profile.coins}</span>
             </div>
             <button onClick={onChangeProfile} className="p-2 bg-white rounded-full shadow-sm">
                <SettingsIcon className="w-5 h-5 text-gray-400" />
             </button>
        </div>
      </div>

      <div className="px-6 pb-6 flex-1 overflow-y-auto">
        
        {/* Greeting */}
        <div className="mb-6 mt-2">
             <h1 className="text-3xl font-bold text-[#37474F] mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>Hi {profile.name} 👋</h1>
             <p className="text-gray-500">Ollie's ready to learn something new today!</p>
        </div>

        {/* Start Learning CTA */}
        <button 
            onClick={onStart}
            className="w-full bg-[#66D9B0] py-5 rounded-2xl shadow-lg shadow-[#66D9B0]/20 flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform mb-8"
        >
             <CameraIcon className="w-6 h-6 text-[#1B5E20]" />
             <span className="font-bold text-lg text-[#1B5E20]">Start Learning</span>
        </button>

        <p className="text-gray-400 text-center text-sm mb-8">Every photo helps Ollie grow smarter!</p>

        {/* Stats Row */}
        <div className="flex gap-4 mb-8">
            <div className="flex-1 bg-white p-4 rounded-3xl shadow-sm flex items-center gap-3">
                 <div className="p-3 bg-yellow-100 rounded-full text-yellow-500">
                    <StarIcon className="w-6 h-6" />
                 </div>
                 <div>
                    <span className="block font-bold text-xl text-[#37474F]">{profile.coins}</span>
                    <span className="text-xs text-gray-400">Stars</span>
                 </div>
            </div>
             <div className="flex-1 bg-white p-4 rounded-3xl shadow-sm flex items-center gap-3">
                 <div className="p-3 bg-blue-100 rounded-full text-blue-500">
                    <BookIcon className="w-6 h-6" />
                 </div>
                 <div>
                    <span className="block font-bold text-xl text-[#37474F]">32</span>
                    <span className="text-xs text-gray-400">Words</span>
                 </div>
            </div>
             <div className="flex-1 bg-white p-4 rounded-3xl shadow-sm flex items-center gap-3">
                 <div className="p-3 bg-red-100 rounded-full text-red-500">
                    <FireIcon className="w-6 h-6" />
                 </div>
                 <div>
                    <span className="block font-bold text-xl text-[#37474F]">7</span>
                    <span className="text-xs text-gray-400">Streak</span>
                 </div>
            </div>
        </div>

        {/* Daily Goal */}
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-8">
            <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-[#37474F]">Today's Goal</span>
                <span className="text-sm font-bold text-gray-400">{profile.dailyProgress} / {profile.dailyGoal} Words</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-[#66D9B0] rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (profile.dailyProgress / profile.dailyGoal) * 100)}%` }}
                ></div>
            </div>
        </div>

        {/* Badges */}
        <div className="mb-24">
             <h3 className="font-bold text-[#37474F] mb-4">Your Badges</h3>
             <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                <div className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="w-20 h-20 rounded-full bg-[#B2EBF2] flex items-center justify-center text-[#0097A7]">
                        <BookIcon className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-bold text-center text-gray-500">Color<br/>Explorer</span>
                </div>
                 <div className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="w-20 h-20 rounded-full bg-[#FFCDD2] flex items-center justify-center text-[#E57373]">
                        <PawIcon className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-bold text-center text-gray-500">Animal Expert</span>
                </div>
                 <div className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="w-20 h-20 rounded-full bg-[#F0F4C3] flex items-center justify-center text-[#AFB42B]">
                        <NatureIcon className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-bold text-center text-gray-500">Foodie Fun</span>
                </div>
                 <div className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center text-gray-400">
                        <FireIcon className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-bold text-center text-gray-500">Nature Scout</span>
                </div>
             </div>
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
          <button className="flex flex-col items-center gap-1 text-[#F42C5D]">
              <HomeIcon className="w-6 h-6" />
              <span className="text-[10px] font-bold">Home</span>
          </button>
           <button onClick={onStart} className="flex flex-col items-center gap-1 -mt-8">
              <div className="w-14 h-14 bg-[#66D9B0] rounded-full flex items-center justify-center shadow-lg text-white">
                  <CameraIcon className="w-7 h-7" />
              </div>
          </button>
           <button className="flex flex-col items-center gap-1 text-gray-400">
              <SettingsIcon className="w-6 h-6" />
              <span className="text-[10px] font-bold">Settings</span>
          </button>
      </div>
    </div>
  );
};
