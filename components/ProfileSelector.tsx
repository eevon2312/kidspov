import React, { useState } from 'react';
import { AVATARS } from '../constants';
import type { Profile } from '../types';
import { PlusIcon } from './icons';

interface ProfileSelectorProps {
  profiles: Profile[];
  onSelect: (profile: Profile) => void;
  onCreate: (name: string, avatar: string) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ profiles, onSelect, onCreate }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const handleCreate = () => {
    if (newName.trim()) {
      onCreate(newName, selectedAvatar);
      setIsCreating(false);
      setNewName('');
    }
  };

  if (isCreating) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-black/5 animate-fade-in">
        <h2 className="text-2xl font-bold text-[#111111] mb-6" style={{ fontFamily: "'Fredoka One', cursive" }}>New Learner</h2>
        
        <div className="grid grid-cols-4 gap-2 mb-6">
          {AVATARS.map((avatar) => (
            <button
              key={avatar}
              onClick={() => setSelectedAvatar(avatar)}
              className={`text-3xl p-3 rounded-2xl transition-all ${
                selectedAvatar === avatar ? 'bg-[#2E7D57]/20 ring-2 ring-[#2E7D57]' : 'hover:bg-gray-100'
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="What's your name?"
          className="w-full text-lg p-4 rounded-xl border-2 border-gray-200 focus:border-[#2E7D57] focus:outline-none mb-6 text-center"
        />

        <div className="flex gap-4 w-full">
          <button
            onClick={() => setIsCreating(false)}
            className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!newName.trim()}
            className="flex-1 py-3 bg-[#2E7D57] text-white font-bold rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
          >
            Let's Go!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl animate-fade-in p-6">
      <h1 className="text-4xl md:text-5xl font-bold text-[#111111] mb-10 text-center" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Who is learning today?
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => onSelect(profile)}
            className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-lg border-2 border-transparent hover:border-[#2E7D57] transition-all transform hover:-translate-y-1"
          >
            <span className="text-5xl mb-4">{profile.avatar}</span>
            <span className="font-bold text-lg text-[#111111]">{profile.name}</span>
            <div className="flex items-center gap-1 mt-2 text-yellow-500 text-sm font-bold">
               <span>{profile.coins}</span>
               <span>Coins</span>
            </div>
          </button>
        ))}

        <button
          onClick={() => setIsCreating(true)}
          className="flex flex-col items-center justify-center p-6 bg-[#FAFAF7] rounded-3xl border-2 border-dashed border-gray-300 hover:border-[#2E7D57] hover:bg-white transition-all text-gray-500 hover:text-[#2E7D57] group"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-[#2E7D57]/10 flex items-center justify-center mb-4 transition-colors">
            <PlusIcon className="w-6 h-6" />
          </div>
          <span className="font-bold">Add Profile</span>
        </button>
      </div>
    </div>
  );
};
