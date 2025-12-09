
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

  const nextStep = () => setStep(s => s + 1);

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
    <div className="flex flex-col items-center text-center animate-fade-in w-full max-w-sm mx-auto">
        <div className="mt-10 mb-8 relative">
           <Mascot className="w-64 h-64" color="#FF9A9A" />
        </div>
        
        <h1 className="text-3xl font-bold text-[#111111] mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
            Hi, I'm Ollie! 🧠 Let's learn new words together.
        </h1>
        <p className="text-gray-600 mb-10 text-lg">
            Ollie will help you learn what you see!
        </p>
        <button 
            onClick={nextStep} 
            className="w-full bg-[#F42C5D] text-white py-4 rounded-full text-xl font-bold shadow-lg hover:scale-105 transition-transform"
        >
            Start
        </button>
    </div>
  );

  const renderParentSetup = () => (
    <div className="w-full max-w-md animate-fade-in flex flex-col h-full">
        <div className="flex justify-center mb-6">
             <Mascot className="w-20 h-20" color="#FF9A9A" />
        </div>
        <h2 className="text-3xl font-bold text-[#111111] mb-8 text-center" style={{ fontFamily: "'Fredoka One', cursive" }}>Welcome, grown-up!</h2>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
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
        <div className="space-y-4 mb-8">
            <div className="space-y-1">
                <label className="text-sm font-bold text-gray-800 ml-1">Email</label>
                <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="w-full p-4 rounded-2xl border border-gray-200 bg-white focus:border-[#F42C5D] focus:ring-1 focus:ring-[#F42C5D] focus:outline-none transition-colors"
                />
            </div>
            
            <div className="space-y-1">
                <label className="text-sm font-bold text-gray-800 ml-1">Password</label>
                <div className="relative">
                    <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password" 
                        className="w-full p-4 rounded-2xl border border-gray-200 bg-white focus:border-[#F42C5D] focus:ring-1 focus:ring-[#F42C5D] focus:outline-none transition-colors pr-10"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>

             {authTab === 'create' && (
                <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-800 ml-1">Confirm password</label>
                     <div className="relative">
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm your password" 
                            className="w-full p-4 rounded-2xl border border-gray-200 bg-white focus:border-[#F42C5D] focus:ring-1 focus:ring-[#F42C5D] focus:outline-none transition-colors pr-10"
                        />
                        <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
             )}
        </div>

        <div className="mt-auto space-y-4">
            <button onClick={nextStep} className="w-full bg-[#F42C5D] text-white py-4 rounded-full text-lg font-bold shadow-md hover:opacity-90">
                {authTab === 'create' ? 'Create Account' : 'Log In'}
            </button>
            <button onClick={nextStep} className="w-full bg-white text-[#F42C5D] border border-[#F42C5D] py-4 rounded-full text-lg font-bold hover:bg-gray-50">
                Continue as Guest
            </button>
            
            <p className="text-center text-xs text-gray-400">
                Your child's progress will be saved safely.
            </p>
             <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
                By creating an account, you agree to our<br/>
                <span className="underline text-[#F42C5D]">Terms of Service</span> and <span className="underline text-[#F42C5D]">Privacy Policy</span>.
            </p>
        </div>
    </div>
  );

  const renderChildProfile = () => (
    <div className="w-full max-w-md animate-fade-in flex flex-col items-center">
        <div className="mb-4 relative">
             <Mascot className="w-40 h-40" color={ollieColor} />
             {/* Sparkles */}
             <div className="absolute top-0 right-0 text-yellow-400 text-2xl">✨</div>
             <div className="absolute top-10 left-0 text-yellow-400 text-xl">✨</div>
        </div>

        <h2 className="text-3xl font-bold text-[#111111] mb-8 text-center" style={{ fontFamily: "'Fredoka One', cursive" }}>Who's learning today?</h2>

        <div className="w-full space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">What's your name?</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <SmileyIcon className="w-6 h-6" />
                    </div>
                    <input 
                        type="text" 
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder="Type your name here" 
                        className="w-full p-4 pl-12 rounded-2xl border border-gray-200 focus:border-[#F42C5D] focus:outline-none"
                    />
                </div>
            </div>

            <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700 ml-1">Are you a...</label>
                 <div className="flex bg-white rounded-full p-1 border border-gray-100">
                    {['Boy', 'Girl', 'Prefer not to say'].map((g) => (
                        <button 
                            key={g}
                            onClick={() => setChildGender(g)}
                            className={`flex-1 py-3 text-sm font-bold rounded-full transition-all ${childGender === g ? 'bg-white shadow-md text-[#F42C5D]' : 'text-gray-400'}`}
                        >
                            {g === 'Prefer not to say' ? 'Prefer not t...' : g}
                        </button>
                    ))}
                 </div>
            </div>

            <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700 ml-1">How old are you?</label>
                 <div className="flex flex-wrap gap-3 justify-center">
                    {[4,5,6,7,8,9,10,11,12].map(age => (
                        <button 
                            key={age} 
                            onClick={() => setChildAge(age)}
                            className={`w-12 h-12 rounded-full font-bold flex items-center justify-center border transition-all ${
                                childAge === age 
                                ? 'bg-[#F42C5D] text-white border-[#F42C5D]' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-[#F42C5D]'
                            }`}
                        >
                            {age}
                        </button>
                    ))}
                 </div>
            </div>

             <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700 ml-1">Pick your Ollie color!</label>
                 <div className="flex gap-4 justify-center">
                    {['#FF9A9A', '#9AE4B5', '#F8E996', '#9ACEEB'].map(color => (
                        <button 
                            key={color} 
                            onClick={() => setOllieColor(color)}
                            className={`w-14 h-14 rounded-full border-4 transition-all ${ollieColor === color ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                 </div>
            </div>
        </div>

        <button 
            onClick={nextStep} 
            disabled={!childName}
            className="w-full mt-8 bg-[#F42C5D] text-white py-4 rounded-full text-lg font-bold shadow-md hover:opacity-90 disabled:opacity-50"
        >
            Next
        </button>
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
        <div className="w-full max-w-md animate-fade-in flex flex-col items-center">
            <div className="mb-4">
                <Mascot className="w-24 h-24" color={ollieColor} />
            </div>

            <h2 className="text-3xl font-bold text-[#111111] mb-2 text-center" style={{ fontFamily: "'Fredoka One', cursive" }}>Let's choose what to learn!</h2>
            <p className="text-gray-500 mb-6 text-center">Pick up to 3 languages you'd like to explore.</p>

            <div className="bg-[#F8E1E7] text-[#892B45] text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                {selectedLangs.length}/3 Selected
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mb-6">
                {SUPPORTED_LANGUAGES.slice(0, 6).map(lang => (
                    <button 
                        key={lang.code}
                        onClick={() => toggle(lang.code)}
                        className={`p-6 rounded-3xl flex flex-col items-center gap-2 transition-all border-2 ${
                            selectedLangs.includes(lang.code) 
                            ? 'bg-[#FFE4EC] border-[#F42C5D]' 
                            : 'bg-white border-transparent shadow-sm'
                        }`}
                    >
                        {/* Placeholder Flags */}
                         <div className="text-4xl">
                            {lang.code === 'en-US' ? '🇬🇧' : 
                             lang.code === 'zh-CN' ? '🇨🇳' :
                             lang.code === 'ms-MY' ? '🇲🇾' :
                             lang.code === 'es-ES' ? '🇪🇸' :
                             lang.code === 'hi-IN' ? '🇮🇳' :
                             lang.code === 'fr-FR' ? '🇫🇷' : '🏳️'}
                         </div>
                        <span className="font-bold text-gray-800">{lang.name.split(' ')[0]}</span>
                    </button>
                ))}
            </div>

            <label className="flex items-center gap-3 mb-8 cursor-pointer self-start ml-2">
                 <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${showHomeLang ? 'bg-[#F42C5D] border-[#F42C5D]' : 'border-gray-300'}`}>
                    {showHomeLang && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                 </div>
                 <input type="checkbox" className="hidden" onChange={() => setShowHomeLang(!showHomeLang)} />
                 <span className="text-gray-600 font-medium">Show my home language too.</span>
            </label>

            <button 
                onClick={handleComplete} 
                disabled={selectedLangs.length === 0}
                className="w-full bg-[#F42C5D] text-white py-4 rounded-full text-lg font-bold shadow-md hover:opacity-90 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#EAF6F9] to-[#FFFDE7] flex flex-col items-center p-6 overflow-y-auto">
        {step === 1 && renderWelcome()}
        {step === 2 && renderParentSetup()}
        {step === 3 && renderChildProfile()}
        {step === 4 && renderLanguages()}
    </div>
  );
};
