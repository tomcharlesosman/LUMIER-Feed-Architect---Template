import React from 'react';
import { STYLE_PRESETS } from '../constants';

interface StyleSelectorProps {
  selectedStyleId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyleId, onSelect, disabled }) => {
  const { NATURAL, ...otherStyles } = STYLE_PRESETS;

  const ButtonBase = ({ id, label, description, className = '' }: any) => {
    const isSelected = selectedStyleId === id;
    return (
      <button
        onClick={() => onSelect(id)}
        disabled={disabled}
        className={`
          group text-left p-3 border-theme transition-all duration-300 rounded-theme
          ${isSelected 
            ? 'bg-charcoal border-charcoal text-white shadow-lg' 
            : 'bg-transparent border-charcoal/20 text-charcoal hover:border-charcoal/50 hover:bg-stone/20'}
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        <span className={`block font-serif text-base mb-1 ${isSelected ? 'text-white' : 'text-charcoal'}`}>
          {label}
        </span>
        <span className={`block font-sans text-[9px] leading-tight opacity-70 ${isSelected ? 'text-white' : 'text-charcoal'}`}>
          {description}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-widest text-charcoal/60 font-sans">Aesthetic Direction</label>
      
      <div className="flex flex-col gap-2">
        <ButtonBase 
          {...NATURAL} 
          className="w-full"
        />
        <div className="grid grid-cols-2 gap-2">
          {Object.values(otherStyles).map((style) => (
            <ButtonBase key={style.id} {...style} />
          ))}
        </div>
      </div>
    </div>
  );
};