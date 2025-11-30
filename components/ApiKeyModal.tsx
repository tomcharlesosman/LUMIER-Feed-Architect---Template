
import React from 'react';
import { Button } from './Button';

interface ApiKeyModalProps {
  onSelectKey: () => void;
  isAIStudioAvailable: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSelectKey, isAIStudioAvailable }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sand/90 backdrop-blur-sm p-4">
      {/* Added rounded-theme and border-theme */}
      <div className="max-w-md w-full bg-white border-theme border-stone p-12 shadow-2xl text-center rounded-theme">
        <h2 className="font-serif text-3xl mb-4 text-charcoal">Access Required</h2>
        
        {isAIStudioAvailable ? (
          <>
            <p className="font-sans text-charcoal/70 mb-8 leading-relaxed">
              To access the Lumier High-Fidelity Studio, please connect your premium API key. 
              Standard rates apply for 4K generation.
            </p>
            <Button onClick={onSelectKey} className="w-full justify-center">
              Connect Access Key
            </Button>
          </>
        ) : (
          <>
            <p className="font-sans text-charcoal/70 mb-6 leading-relaxed">
              <strong>Environment Configuration Missing</strong>
            </p>
            <p className="font-sans text-xs text-charcoal/60 mb-8 leading-relaxed">
              You are running this template outside of Google AI Studio. 
              To proceed, you must configure your API Key in your environment variables.
            </p>
            <div className="bg-stone/20 p-4 rounded-theme mb-8 text-left overflow-x-auto">
              <code className="font-mono text-[10px] text-charcoal block">
                # Create a .env file<br/>
                API_KEY=AIzaSy...
              </code>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full justify-center">
              Retry Connection
            </Button>
          </>
        )}

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
