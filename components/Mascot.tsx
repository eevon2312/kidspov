
import React from 'react';

interface MascotProps {
    className?: string;
    color?: string;
}

export const Mascot: React.FC<MascotProps> = ({ className, color = "#FF9A9A" }) => (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="brainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFC1C1" />
                <stop offset="100%" stopColor="#FF8A80" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        
        <g transform="translate(100, 100)">
            {/* Main Brain Shape - Left Hemisphere */}
            <path 
                d="M-5,-60 C-40,-65 -85,-40 -85,10 C-85,55 -55,80 -5,80" 
                fill="url(#brainGradient)" 
                stroke="#E57373" 
                strokeWidth="4" 
                strokeLinecap="round"
            />
            
            {/* Main Brain Shape - Right Hemisphere */}
            <path 
                d="M5,-60 C40,-65 85,-40 85,10 C85,55 55,80 5,80" 
                fill="url(#brainGradient)" 
                stroke="#E57373" 
                strokeWidth="4" 
                strokeLinecap="round"
            />

            {/* Center Split */}
            <path 
                d="M0,-55 L0,75" 
                stroke="#D32F2F" 
                strokeWidth="3" 
                opacity="0.2"
                strokeLinecap="round"
            />

            {/* Cortex Folds / Details - Left */}
            <g stroke="#D32F2F" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.3">
                <path d="M-20,-40 C-35,-35 -45,-50 -60,-30" />
                <path d="M-60,-10 C-70,0 -50,10 -65,30" />
                <path d="M-30,20 C-40,40 -20,50 -30,65" />
                <path d="M-15,-10 C-25,0 -5,10 -15,30" />
            </g>

            {/* Cortex Folds / Details - Right */}
            <g stroke="#D32F2F" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.3">
                <path d="M20,-40 C35,-35 45,-50 60,-30" />
                <path d="M60,-10 C70,0 50,10 65,30" />
                <path d="M30,20 C40,40 20,50 30,65" />
                <path d="M15,-10 C25,0 5,10 15,30" />
            </g>

            {/* Cute Face (Optional, keeps it character-like but subtle) */}
            <g transform="translate(0, 10)">
                <ellipse cx="-22" cy="-5" rx="6" ry="8" fill="#3E2723" />
                <circle cx="-20" cy="-8" r="2.5" fill="white" />
                
                <ellipse cx="22" cy="-5" rx="6" ry="8" fill="#3E2723" />
                <circle cx="24" cy="-8" r="2.5" fill="white" />
                
                <path d="M-10,15 Q0,22 10,15" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />
                
                {/* Cheeks */}
                <circle cx="-35" cy="10" r="6" fill="#FFCDD2" opacity="0.6" />
                <circle cx="35" cy="10" r="6" fill="#FFCDD2" opacity="0.6" />
            </g>
        </g>
    </svg>
);
