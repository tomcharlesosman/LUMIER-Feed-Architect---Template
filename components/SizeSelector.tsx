import React from 'react';
import { ImageSize } from '../types';

interface SizeSelectorProps {
  selectedSize: ImageSize;
  onSelect: (size: ImageSize) => void;
  disabled?: boolean;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({ selectedSize, onSelect, disabled }) => {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-xs uppercase tracking-widest text-charcoal/60 font-sans">Output Resolution</label>
      {/* 
        Applied rounded-theme to the container and overflow-hidden so the children buttons 
        don't bleed out of rounded corners.
        Added border-theme to ensure border width scales.
      */}
      <div className="flex gap-0 border-theme border-charcoal/20 w-fit rounded-theme overflow-hidden">
        {Object.values(ImageSize).map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            disabled={disabled}
            className={`
              px-6 py-3 text-xs font-sans tracking-widest uppercase transition-all
              ${selectedSize === size 
                ? 'bg-charcoal text-white font-medium' 
                : 'bg-transparent text-charcoal/60 hover:text-charcoal hover:bg-stone/30'}
              disabled:opacity-50 disabled:cursor-not-allowed
              border-r border-charcoal/20 last:border-r-0
            `}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};