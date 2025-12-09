
import React, { useState } from 'react';
import { Mascot } from './Mascot';
import { EyeIcon, EyeSlashIcon, SmileyIcon } from './icons';
import { SUPPORTED_LANGUAGES } from '../constants';
import type { Profile } from '../types';

interface OnboardingViewProps {
  onComplete: (profile: Profile) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  
  // Form State
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState<number | null>(null);
  const [childGender, setChildGender] = useState<string>('Boy');
  const [ollieColor, setOllieColor] = useState<string>('#FF9A9A');
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [showHomeLang, setShowHomeLang] = useState(false);

  // Auth State (Visual Only)
  const [authTab, setAuthTab] = useState<'create' | 'login'>('create');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const nextStep = () => {
      window.scrollTo(0, 0);
      setStep(s => s + 1);
  };

  const handleComplete = () => {
    // Create the profile object
    const newProfile: Profile = {
        id: Date.now().toString(),
        name: childName || 'Alex',
        avatar: '🧠', // Default avatar
        coins: 125, // Starting bonus from screenshot
        dailyGoal: 5,
        dailyProgress: 2,
        ageGroup: childAge?.toString() || '6',
        gender: childGender,
        targetLanguages: selectedLangs.length > 0 ? selectedLangs : ['en-US'],
        motivation: 'Stars'
    };
    onComplete(newProfile);
  };

  // --- RENDER STEPS ---

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-sm mx-auto py-6">
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="mb-6 relative">
               <Mascot className="w-48 h-48 md:w-64 md:h-64" color="#FF9A9A" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-[#111111] mb-3 text-center px-4" style={{ fontFamily: "'Fredoka One', cursive" }}>
                Hi, I'm Ollie! 🧠<br/>Let's learn together.
            </h1>
            <p className="text-gray-600 text-base md:text-lg text-center px-6">
                Ollie will help you learn what you see!
            </p>
        </div>
        
        <div className="w-full px-4 mt-6">
            <button 
                onClick={nextStep} 
                className="w-full bg-[#F42C5D] text-white py-4 rounded-full text-lg font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
            >
                Start
            </button>
        </div>
    </div>
  );

  const renderParentSetup = () => (
    <div className="w-full max-w-md animate-fade-in flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-1 pb-4">
            <div className="flex justify-center mb-4 mt-2">
                 <Mascot className="w-16 h-16" color="#FF9A9A" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#111111] mb-6 text-center" style={{ fontFamily: "'Fredoka One', cursive" }}>Welcome, grown-up!</h2>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 sticky top-0 bg-[#EAF6F9] z-10 pt-2">
                <button 
                    onClick={() => setAuthTab('create')}
                    className={`flex-1 pb-3 text-sm font-bold transition-colors ${authTab === 'create' ? 'text-[#111111] border-b-2 border-[#F42C5D]' : 'text-gray-400'}`}
                >
                    Create Account
                </button>
                <button 
                    onClick={() => setAuthTab('login')}
                    className={`flex-1 pb-3 text-sm font-bold transition-colors ${authTab === 'login' ? 'text-[#111111] border-b-2 border-[#F42C5D]' : 'text-gray-400'}`}
                >
                    Log In
                </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4 mb-4">
                <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-800 ml-1">Email</label>
                    <input 
                        type="email" 
                        placeholder="Enter email" 
                        className="w-full p-3.5 rounded-2xl border border-gray-200 bg-white focus:border-[#F42C5D] focus:ring-1 focus:ring-[#F42C5D] focus:outline-none transition-colors"
                    />
                </div>
                
                <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-800 ml-1">Password</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Create password" 
                            className="w-full p-3.5 rounded-2xl border border-gray-200 bg-white focus:border-[#F42C5D] focus:ring-1 focus:ring-[#F42C5D] focus:outline-none transition-colors pr-10"
                        />
                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                 {authTab === 'create' && (
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-800 ml-1">Confirm</label>
                         <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Confirm password" 
                                className="w-full p-3.5 rounded-2xl border border-gray-200 bg-white focus:border-[#F42C5D] focus:ring-1 focus:ring-[#F42C5D] focus:outline-none transition-colors pr-10"
                            />
                            <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                 )}
            </div>
        </div>

        <div className="mt-auto space-y-3 pt-4 border-t border-gray-100 bg-[#EAF6F9]/50">
            <button onClick={nextStep} className="w-full bg-[#F42C5D] text-white py-3.5 rounded-full text-lg font-bold shadow-md hover:opacity-90 active:scale-95 transition-transform">
                {authTab === 'create' ? 'Create Account' : 'Log In'}
            </button>
            <button onClick={nextStep} className="w-full bg-white text-[#F42C5D] border border-[#F42C5D] py-3.5 rounded-full text-lg font-bold hover:bg-gray-50 active:scale-95 transition-transform">
                Continue as Guest
            </button>
            
            <p className="text-center text-[10px] text-gray-400 leading-tight pb-2">
                By creating an account, you agree to our<br/>
                <span className="underline text-[#F42C5D]">Terms</span> and <span className="underline text-[#F42C5D]">Privacy Policy</span>.
            </p>
        </div>
    </div>
  );

  const renderChildProfile = () => (
    <div className="w-full max-w-md animate-fade-in flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-1 pb-4">
            <div className="mb-4 mt-2 relative flex justify-center">
                 <Mascot className="w-32 h-32" color={ollieColor} />
                 <div className="absolute top-0 right-10 text-yellow-400 text-2xl animate-bounce">✨</div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-[#111111] mb-6 text-center" style={{ fontFamily: "'Fredoka One', cursive" }}>Who's learning?</h2>

            <div className="w-full space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Name</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <SmileyIcon className="w-6 h-6" />
                        </div>
                        <input 
                            type="text" 
                            value={childName}
                            onChange={(e) => setChildName(e.target.value)}
                            placeholder="Type name here" 
                            className="w-full p-3.5 pl-12 rounded-2xl border border-gray-200 focus:border-[#F42C5D] focus:outline-none bg-white"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                     <label className="text-sm font-bold text-gray-700 ml-1">Identity</label>
                     <div className="flex bg-white rounded-full p-1 border border-gray-100 shadow-sm">
                        {['Boy', 'Girl', 'Other'].map((g) => (
                            <button 
                                key={g}
                                onClick={() => setChildGender(g)}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${childGender === g ? 'bg-[#F42C5D] text-white shadow-md' : 'text-gray-400'}`}
                            >
                                {g}
                            </button>
                        ))}
                     </div>
                </div>

                <div className="space-y-2">
                     <label className="text-sm font-bold text-gray-700 ml-1">Age</label>
                     <div className="grid grid-cols-5 gap-2">
                        {[4,5,6,7,8,9,10,11,12].map(age => (
                            <button 
                                key={age} 
                                onClick={() => setChildAge(age)}
                                className={`h-10 rounded-xl font-bold flex items-center justify-center border transition-all ${
                                    childAge === age 
                                    ? 'bg-[#F42C5D] text-white border-[#F42C5D]' 
                                    : 'bg-white text-gray-600 border-gray-200'
                                }`}
                            >
                                {age}
                            </button>
                        ))}
                     </div>
                </div>

                 <div className="space-y-2">
                     <label className="text-sm font-bold text-gray-700 ml-1">Ollie's Color</label>
                     <div className="flex gap-3 justify-center bg-white p-3 rounded-2xl border border-gray-100">
                        {['#FF9A9A', '#9AE4B5', '#F8E996', '#9ACEEB'].map(color => (
                            <button 
                                key={color} 
                                onClick={() => setOllieColor(color)}
                                className={`w-10 h-10 rounded-full border-2 transition-all ${ollieColor === color ? 'border-gray-800 scale-110 shadow-sm' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                     </div>
                </div>
            </div>
        </div>

        <div className="mt-auto pt-4 bg-gradient-to-t from-[#EAF6F9] to-transparent">
            <button 
                onClick={nextStep} 
                disabled={!childName}
                className="w-full bg-[#F42C5D] text-white py-4 rounded-full text-lg font-bold shadow-lg hover:opacity-90 disabled:opacity-50 disabled:shadow-none active:scale-95 transition-all"
            >
                Next
            </button>
        </div>
    </div>
  );

  const renderLanguages = () => {
    const toggle = (code: string) => {
        if (selectedLangs.includes(code)) {
            setSelectedLangs(selectedLangs.filter(c => c !== code));
        } else if (selectedLangs.length < 3) {
            setSelectedLangs([...selectedLangs, code]);
        }
    };

    return (
        <div className="w-full max-w-md animate-fade-in flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-1 pb-4">
                <div className="mb-4 mt-2 flex justify-center">
                    <Mascot className="w-20 h-20" color={ollieColor} />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-[#111111] mb-2 text-center" style={{ fontFamily: "'Fredoka One', cursive" }}>What to learn?</h2>
                <p className="text-gray-500 mb-6 text-center text-sm">Pick up to 3 languages.</p>

                <div className="flex justify-center mb-6">
                    <div className="bg-[#F8E1E7] text-[#892B45] text-xs font-bold px-4 py-1.5 rounded-full">
                        {selectedLangs.length}/3 Selected
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full mb-6">
                    {SUPPORTED_LANGUAGES.slice(0, 6).map(lang => (
                        <button 
                            key={lang.code}
                            onClick={() => toggle(lang.code)}
                            className={`p-4 rounded-2xl flex flex-col items-center gap-1 transition-all border-2 ${
                                selectedLangs.includes(lang.code) 
                                ? 'bg-[#FFE4EC] border-[#F42C5D]' 
                                : 'bg-white border-transparent shadow-sm'
                            }`}
                        >
                             <div className="text-3xl">
                                {lang.code === 'en-US' ? '🇬🇧' : 
                                 lang.code === 'zh-CN' ? '🇨🇳' :
                                 lang.code === 'ms-MY' ? '🇲🇾' :
                                 lang.code === 'es-ES' ? '🇪🇸' :
                                 lang.code === 'hi-IN' ? '🇮🇳' :
                                 lang.code === 'fr-FR' ? '🇫🇷' : '🏳️'}
                             </div>
                            <span className="font-bold text-gray-800 text-sm">{lang.name.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>

                <label className="flex items-center gap-3 mb-8 cursor-pointer justify-center p-3 bg-white rounded-xl border border-gray-100">
                     <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${showHomeLang ? 'bg-[#F42C5D] border-[#F42C5D]' : 'border-gray-300'}`}>
                        {showHomeLang && <div className="w-2 h-2 bg-white rounded-full" />}
                     </div>
                     <input type="checkbox" className="hidden" onChange={() => setShowHomeLang(!showHomeLang)} />
                     <span className="text-gray-600 font-bold text-sm">Show home language</span>
                </label>
            </div>

            <div className="mt-auto pt-4">
                <button 
                    onClick={handleComplete} 
                    disabled={selectedLangs.length === 0}
                    className="w-full bg-[#F42C5D] text-white py-4 rounded-full text-lg font-bold shadow-lg hover:opacity-90 disabled:opacity-50 disabled:shadow-none active:scale-95 transition-all"
                >
                    Let's Go!
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-b from-[#EAF6F9] to-[#FFFDE7] flex flex-col items-center p-4 overflow-hidden">
        {step === 1 && renderWelcome()}
        {step === 2 && renderParentSetup()}
        {step === 3 && renderChildProfile()}
        {step === 4 && renderLanguages()}
    </div>
  );
};
