import React, { useState, useEffect, useCallback } from 'react';
import { ImageSize, GenerationStatus, HistoryItem } from './types';
import { STYLE_PRESETS } from './constants';
import { generateProductFeed } from './services/geminiService';
import { savePreference, getPreference, saveHistoryItemToDB, getHistoryFromDB } from './services/persistence';
import { Button } from './components/Button';
import { SizeSelector } from './components/SizeSelector';
import { StyleSelector } from './components/StyleSelector';
import { ApiKeyModal } from './components/ApiKeyModal';
import { HistoryDrawer } from './components/HistoryDrawer';

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [checkingKey, setCheckingKey] = useState<boolean>(true);
  
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [expandedPreview, setExpandedPreview] = useState<string | null>(null);
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const [size, setSize] = useState<ImageSize>(() => 
    getPreference('size', ImageSize.SIZE_1K)
  );
  
  const [styleId, setStyleId] = useState<string>(() => 
    getPreference('styleId', STYLE_PRESETS.NATURAL.id)
  );

  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    checkApiKey();
    loadHistory();
  }, []);

  useEffect(() => {
    const newUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(newUrls);
    return () => {
      newUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  useEffect(() => {
    savePreference('size', size);
  }, [size]);

  useEffect(() => {
    savePreference('styleId', styleId);
  }, [styleId]);

  const loadHistory = async () => {
    try {
      const items = await getHistoryFromDB();
      setHistory(items);
    } catch (e) {
      console.error("Failed to load history", e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const checkApiKey = async () => {
    try {
      if (window.aistudio?.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasKey(has);
      } 
      else if (process.env.API_KEY) {
        setHasKey(true);
      } 
      else {
        setHasKey(false);
      }
    } catch (e) {
      console.error("Error checking API key", e);
    } finally {
      setCheckingKey(false);
    }
  };

  const handleConnectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        setHasKey(true);
      } catch (e) {
        console.error("Failed to select key", e);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => {
        const combined = [...prev, ...newFiles];
        return combined.slice(0, 6); 
      });
      e.target.value = '';
      setGeneratedImage(null); 
      setError(null);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleGenerate = async () => {
    if (files.length === 0) return;

    setStatus('generating');
    setError(null);

    try {
      const resultUrl = await generateProductFeed(files, size, styleId);
      setGeneratedImage(resultUrl);
      setStatus('success');
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        imageUrl: resultUrl,
        timestamp: Date.now(),
        size: size,
        styleId: styleId
      };
      setHistory(prev => [newItem, ...prev]);
      
      await saveHistoryItemToDB(newItem);

    } catch (err: any) {
      setStatus('error');
      setError(err.message || "Failed to curate feed. Please try again.");
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("404")) {
          if (window.aistudio) {
             setHasKey(false);
          }
      }
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `lumier-feed-${styleId.toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRestoreFromHistory = (item: HistoryItem) => {
    setGeneratedImage(item.imageUrl);
    setStatus('success');
    setSize(item.size);
    if (item.styleId) {
      setStyleId(item.styleId);
    } else {
      setStyleId(STYLE_PRESETS.NATURAL.id);
    }
  };

  if (checkingKey) {
    return <div className="min-h-screen bg-sand flex items-center justify-center font-serif text-charcoal">Loading Studio...</div>;
  }

  return (
    <div className="h-screen bg-sand text-charcoal selection:bg-charcoal selection:text-white flex flex-col overflow-hidden">
      {!hasKey && <ApiKeyModal onSelectKey={handleConnectKey} />}

      {expandedPreview && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-sand/95 backdrop-blur-sm p-8 animate-in fade-in duration-200" 
          onClick={() => setExpandedPreview(null)}
        >
          <div className="relative max-w-5xl max-h-full">
            <img src={expandedPreview} className="max-w-full max-h-[90vh] shadow-2xl object-contain rounded-theme" alt="Expanded preview" />
            <button className="absolute -top-12 right-0 text-charcoal/50 hover:text-charcoal uppercase text-xs tracking-widest">
              Close [ESC]
            </button>
          </div>
        </div>
      )}

      <HistoryDrawer 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        items={history}
        onSelect={handleRestoreFromHistory}
      />

      <header className="py-4 border-b border-charcoal/10 relative z-30 shrink-0">
        <div className="container mx-auto px-6 flex justify-between items-end">
          <div>
            <h1 className="font-serif text-3xl tracking-tight">LUMIER</h1>
            <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-charcoal/50">Feed Architect v1.0</span>
          </div>
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="group flex items-center gap-3 font-sans text-xs uppercase tracking-[0.2em] text-charcoal/60 hover:text-charcoal transition-colors"
          >
            <span>Archive</span>
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-stone text-charcoal text-[10px] font-medium group-hover:bg-charcoal group-hover:text-white transition-colors">
              {history.length}
            </span>
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar pb-24">
          
          <div className="space-y-2 shrink-0">
            <h2 className="font-serif text-2xl italic">The Atelier</h2>
            <p className="font-sans text-xs leading-5 text-charcoal/70">
              Upload your product(s) to generate a cohesive, luxury 9-grid editorial campaign. 
            </p>
          </div>

          <div className="space-y-2 shrink-0 relative">
            <div className="flex justify-between items-end">
              <label className="text-xs uppercase tracking-widest text-charcoal/60 font-sans">Source Artifacts</label>
              <span className="text-[10px] font-sans text-charcoal/40">{files.length} / 6</span>
            </div>
            
            {/* Added rounded-theme and border-theme */}
            <div className="relative group min-h-[160px] mb-8">
              <input 
                type="file" 
                multiple
                accept="image/*" 
                onChange={handleFileChange}
                disabled={files.length >= 6}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              />
              
              <div className="border-theme border-dashed border-charcoal/30 h-full p-6 transition-all duration-500 bg-transparent group-hover:bg-white group-hover:border-charcoal/50 flex flex-col items-center justify-center text-center rounded-theme">
                 <svg className="w-6 h-6 text-charcoal/40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-serif text-lg text-charcoal/60">
                    {files.length >= 6 ? 'Collection Full' : 'Upload Products'}
                  </span>
                  <span className="font-sans text-[9px] uppercase tracking-widest text-charcoal/30 mt-2">
                    {files.length >= 6 ? 'Remove items to add more' : 'Drop or Click to Append'}
                  </span>
              </div>

              <div className="absolute -bottom-5 left-0 right-0 flex justify-center gap-3 z-20 pointer-events-none px-4">
                 {previewUrls.map((url, idx) => {
                   const rotation = idx % 2 === 0 ? 'rotate-2' : '-rotate-2';
                   
                   return (
                     // Added rounded-theme
                     <div 
                        key={idx} 
                        className={`pointer-events-auto relative group/thumb w-14 h-14 bg-white p-1 shadow-lg border-theme border-charcoal/10 transition-transform hover:scale-110 hover:z-30 cursor-pointer ${rotation} rounded-theme`}
                        onClick={() => setExpandedPreview(url)}
                     >
                        <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover grayscale-[0.2] group-hover/thumb:grayscale-0 rounded-theme" />
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          className="absolute -top-2 -right-2 bg-charcoal text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-sm hover:bg-red-900"
                        >
                          ✕
                        </button>
                     </div>
                   );
                 })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 pt-4">
            <StyleSelector 
              selectedStyleId={styleId} 
              onSelect={setStyleId}
              disabled={status === 'generating'}
            />

            <SizeSelector 
              selectedSize={size} 
              onSelect={setSize} 
              disabled={status === 'generating'}
            />

            <Button 
              onClick={handleGenerate} 
              disabled={files.length === 0 || status === 'generating'}
              className="w-full justify-center"
            >
              {status === 'generating' ? 'Curating Feed...' : 'Generate Campaign'}
            </Button>

            {error && (
              <div className="p-4 bg-stone/30 border-l-2 border-red-900 text-[10px] font-sans text-red-900 leading-relaxed rounded-theme">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-8 bg-white border-theme border-charcoal/5 p-8 flex items-center justify-center relative shadow-sm h-full w-full overflow-hidden rounded-theme">
           {/* Corner accents - Keep sharp or adjust if desired, sticking to sharp for accents usually looks fine but let's hide them if theme is very round? keeping them for now as 'technical marks' */}
           <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-charcoal/20"></div>
           <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-charcoal/20"></div>
           <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-charcoal/20"></div>
           <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-charcoal/20"></div>

           <div className="aspect-square max-h-full max-w-full relative flex items-center justify-center">
             {status === 'success' && generatedImage ? (
               <div className="relative w-full h-full group/image">
                  {/* Image gets rounded-theme to match container */}
                  <img 
                    src={generatedImage} 
                    alt="Generated Feed" 
                    className="w-full h-full object-contain shadow-2xl rounded-theme"
                  />
                  <div className="absolute bottom-4 right-4">
                    <Button variant="primary" onClick={handleDownload} className="py-2 px-6 shadow-xl border border-white/10 z-10">
                      Download Asset
                    </Button>
                  </div>
               </div>
             ) : (
               <div className="text-center opacity-30 max-w-sm">
                  {status === 'generating' ? (
                     <div className="space-y-6">
                        <div className="w-16 h-16 border-theme border-charcoal mx-auto animate-pulse flex items-center justify-center rounded-theme">
                          <div className="w-12 h-12 bg-charcoal/10 rounded-theme"></div>
                        </div>
                        <p className="font-serif text-2xl italic">The AI is dreaming...</p>
                        <p className="font-sans text-xs uppercase tracking-widest">Constructing environments</p>
                     </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="font-serif text-4xl text-stone">Blank Canvas</p>
                      <p className="font-sans text-xs tracking-widest uppercase">Awaiting your vision</p>
                    </div>
                  )}
               </div>
             )}
           </div>
        </div>
      </main>

      <footer className="py-2 text-center shrink-0">
        <p className="font-sans text-[9px] uppercase tracking-widest text-charcoal/30">
          Built by Tom Osman. Shiny Technologies 2021.
        </p>
      </footer>
    </div>
  );
};

export default App;