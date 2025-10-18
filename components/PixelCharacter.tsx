"use client";

import React, { useState } from 'react';

import Image from 'next/image';

interface PixelCharacterProps {
  variant?: 'hero' | 'group' | 'idle' | 'walk' | 'jump' | 'draft';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animated?: boolean;
  className?: string;
}

const CHARACTER_PATHS = {
  hero: '/assets/characters/superboy_solo_1(1).gif',
  group: '/assets/characters/team(1).gif',
  idle: '/assets/characters/idle.gif',
  walk: '/assets/characters/walk.gif',
  jump: '/assets/characters/jump.gif',
  draft: '/assets/characters/superboy_draft(1).gif',
};

// Fallback SVG for when GIF is not available
const FallbackSVG: React.FC<{ variant: string; size: string }> = ({ variant, size }) => {
  const colors = {
    hero: { primary: '#4169E1', secondary: '#FFB6A3', accent: '#FFD700' },
    group: { primary: '#4169E1', secondary: '#FFB6A3', accent: '#FFD700' },
    idle: { primary: '#4169E1', secondary: '#FFB6A3', accent: '#FFD700' },
    walk: { primary: '#32CD32', secondary: '#FFB6A3', accent: '#FFD700' },
    jump: { primary: '#FF6B35', secondary: '#FFB6A3', accent: '#FFD700' },
    draft: { primary: '#9B59B6', secondary: '#FFB6A3', accent: '#FFD700' },
  };

  const color = colors[variant as keyof typeof colors] || colors.hero;

  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Hair/Head */}
      <rect x="10" y="6" width="12" height="2" fill="#8B4513"/>
      <rect x="8" y="8" width="16" height="2" fill="#8B4513"/>
      <rect x="8" y="10" width="2" height="4" fill="#8B4513"/>
      <rect x="22" y="10" width="2" height="4" fill="#8B4513"/>
      
      {/* Face */}
      <rect x="10" y="10" width="12" height="8" fill={color.secondary}/>
      
      {/* Eyes */}
      <rect x="12" y="12" width="2" height="2" fill="#000000"/>
      <rect x="18" y="12" width="2" height="2" fill="#000000"/>
      
      {/* Mouth */}
      <rect x="14" y="16" width="4" height="1" fill="#8B4513"/>
      
      {/* Body */}
      <rect x="8" y="18" width="16" height="6" fill={color.primary}/>
      
      {/* Arms */}
      <rect x="6" y="18" width="2" height="4" fill={color.secondary}/>
      <rect x="24" y="18" width="2" height="4" fill={color.secondary}/>
      
      {/* Belt */}
      <rect x="10" y="22" width="12" height="2" fill={color.accent}/>
      
      {/* Legs */}
      <rect x="10" y="24" width="5" height="4" fill="#DC143C"/>
      <rect x="17" y="24" width="5" height="4" fill="#DC143C"/>
      
      {/* Shoes */}
      <rect x="10" y="28" width="5" height="2" fill="#8B4513"/>
      <rect x="17" y="28" width="5" height="2" fill="#8B4513"/>
      
      {/* Details */}
      <rect x="15" y="20" width="2" height="1" fill={color.accent}/>
    </svg>
  );
};

const PixelCharacter: React.FC<PixelCharacterProps> = ({ 
  variant = 'hero',
  size = 'md', 
  animated = false,
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  };

  const pixelSizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
    '2xl': 128
  };

  return (
    <div className={`${sizeClasses[size]} ${animated ? 'animate-bounce' : ''} ${className} relative`}>
      {!imageError ? (
        <Image
          src={CHARACTER_PATHS[variant]}
          alt={`Pixel character ${variant}`}
          width={pixelSizes[size]}
          height={pixelSizes[size]}
          className="w-full h-full object-contain pixelated"
          unoptimized // Important for GIFs to animate
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <FallbackSVG variant={variant} size={size} />
      )}
    </div>
  );
};

export default PixelCharacter;

