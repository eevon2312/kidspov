import React from 'react';

export const Mascot: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(10, 10)">
            {/* Body */}
            <path d="M50,150 C10,150 0,100 20,60 C40,20 140,20 160,60 C180,100 170,150 130,150 Z" fill="#FFE9A6" stroke="#111111" strokeWidth="2"/>
            {/* Eye Left */}
            <circle cx="65" cy="80" r="12" fill="#FFFFFF" stroke="#111111" strokeWidth="2"/>
            <circle cx="68" cy="83" r="5" fill="#111111"/>
            {/* Eye Right */}
            <circle cx="115" cy="80" r="12" fill="#FFFFFF" stroke="#111111" strokeWidth="2"/>
            <circle cx="112" cy="83" r="5" fill="#111111"/>
            {/* Mouth */}
            <path d="M80,115 Q90,130 100,115" stroke="#111111" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* Feet */}
            <ellipse cx="60" cy="152" rx="20" ry="8" fill="#D4E3FA" stroke="#111111" strokeWidth="2"/>
            <ellipse cx="120" cy="152" rx="20" ry="8" fill="#D4E3FA" stroke="#111111" strokeWidth="2"/>
            {/* Camera */}
            <g transform="translate(75, 20)">
                <rect x="0" y="0" width="30" height="20" rx="5" fill="#C4B5FD" stroke="#111111" strokeWidth="2"/>
                <circle cx="15" cy="10" r="6" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5"/>
                <circle cx="15" cy="10" r="3" fill="#111111" />
                <rect x="12" y="-5" width="6" height="3" fill="#666666" stroke="#111111" strokeWidth="1"/>
            </g>
             {/* Sparkles */}
            <path d="M20 30 L 30 40 M 25 30 L 25 40" stroke="#2E7D57" strokeWidth="2" strokeLinecap="round"/>
            <path d="M150 30 L 160 40 M 155 30 L 155 40" stroke="#2E7D57" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="40" cy="50" r="3" fill="#8BC34A"/>
        </g>
    </svg>
);
