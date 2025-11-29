import React from 'react';
import { HistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, items, onSelect }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`
        fixed inset-y-0 right-0 z-50 w-full max-w-md bg-sand border-l border-charcoal/10 shadow-2xl transform transition-transform duration-500 ease-in-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-8 border-b border-charcoal/10 flex justify-between items-end bg-white">
          <div>
            <h2 className="font-serif text-3xl italic">Archive</h2>
            <p className="font-sans text-[10px] uppercase tracking-widest text-charcoal/50 mt-2">Past Collections</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone/30 transition-colors -mr-2 rounded-theme">
            <svg className="w-6 h-6 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <span className="font-serif text-4xl mb-4 text-stone">Empty</span>
              <p className="font-sans text-xs uppercase tracking-widest">No collections generated yet</p>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.id} 
                className="group cursor-pointer"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                {/* Added rounded-theme and border-theme */}
                <div className="relative overflow-hidden border-theme border-charcoal/10 bg-white p-3 transition-all duration-500 group-hover:border-charcoal/40 group-hover:shadow-xl rounded-theme">
                  <img src={item.imageUrl} alt="History Item" className="w-full h-auto object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 rounded-theme" />
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/5 transition-colors duration-300"></div>
                </div>
                <div className="mt-4 flex justify-between items-center border-t border-charcoal/5 pt-3">
                    <span className="font-sans text-[9px] uppercase tracking-widest text-charcoal/60">
                        {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <span className="font-sans text-[9px] font-medium border-theme border-charcoal/20 px-2 py-1 uppercase tracking-wider hover:bg-charcoal hover:text-white transition-colors rounded-theme">
                        Restore {item.size}
                    </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};