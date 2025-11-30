import React, { useState } from 'react';
import UniversalSticker from '../components/UniversalSticker';
import { RefreshCcw } from 'lucide-react';

const TestTgs: React.FC = () => {
  const [key, setKey] = useState(0);
  const testUrl = "https://r2.wic.edu.kg/images/meme/AnimatedSticker.tgs";

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Sticker Rendering Test</h1>
        <p className="text-slate-400">Native decoding of Telegram Animated Stickers (.tgs) & WebM</p>
      </div>

      <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 flex flex-col items-center gap-6">
        <div className="relative w-64 h-64 bg-slate-900/50 rounded-xl border border-slate-700/50 flex items-center justify-center overflow-hidden">
          {/* Grid pattern for transparency check */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          
          <UniversalSticker 
            key={key}
            src={testUrl} 
            className="w-48 h-48"
          />
        </div>

        <button 
          onClick={() => setKey(k => k + 1)}
          className="flex items-center gap-2 px-6 py-3 bg-wic-primary hover:bg-wic-secondary text-white rounded-full font-bold transition-all active:scale-95"
        >
          <RefreshCcw size={18} />
          Reload Animation
        </button>
      </div>

      <div className="max-w-md text-center text-sm text-slate-500 font-mono bg-black/20 p-4 rounded-lg">
        Src: {testUrl}
      </div>
    </div>
  );
};

export default TestTgs;