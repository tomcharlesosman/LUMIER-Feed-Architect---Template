import React from 'react';
import { Button } from './Button';

interface ApiKeyModalProps {
  onSelectKey: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSelectKey }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sand/90 backdrop-blur-sm p-4">
      {/* Added rounded-theme and border-theme */}
      <div className="max-w-md w-full bg-white border-theme border-stone p-12 shadow-2xl text-center rounded-theme">
        <h2 className="font-serif text-3xl mb-4 text-charcoal">Access Required</h2>
        <p className="font-sans text-charcoal/70 mb-8 leading-relaxed">
          To access the Lumier High-Fidelity Studio, please connect your premium API key. 
          Standard rates apply for 4K generation.
        </p>
        <Button onClick={onSelectKey} className="w-full justify-center">
          Connect Access Key
        </Button>
        <div className="mt-6">
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-sans text-[10px] uppercase tracking-widest text-charcoal/40 border-b border-charcoal/20 hover:text-charcoal transition-colors"
          >
            Billing Documentation
          </a>
        </div>
      </div>
    </div>
  );
};