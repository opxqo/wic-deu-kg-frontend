
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Sticker, Film, Clock, Star, Delete, Heart, RotateCcw, Send } from 'lucide-react';
import EmojiPicker, { Theme, EmojiStyle } from 'emoji-picker-react';
import UniversalSticker from './UniversalSticker';
import { useTheme } from '../ThemeContext';
import { stickerService } from '../services/stickerService';
import { StickerPack, Sticker as StickerType } from '../types/sticker';

interface MobileStickerSheetProps {
  isOpen: boolean;
  onEmojiClick: (emojiObject: any) => void;
  onStickerClick: (src: string) => void;
  onClose: () => void;
}

// Sub-component for individual stickers to handle complex touch interactions
const StickerItem: React.FC<{ 
  sticker: StickerType; 
  onSend: (src: string) => void; 
  onToggleFavorite: (sticker: StickerType) => void; 
  isSelected: boolean;
  onSelect: (id: string | null) => void;
}> = ({ sticker, onSend, onToggleFavorite, isSelected, onSelect }) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressHandled = useRef(false);
  const isPressValid = useRef(false); // Tracks if the interaction is a valid tap (not a scroll)

  const startPress = () => {
    isLongPressHandled.current = false;
    isPressValid.current = true; // Assume start of a valid tap
    timerRef.current = setTimeout(() => {
      // If we haven't moved/cancelled, trigger long press
      if (isPressValid.current) {
        isLongPressHandled.current = true;
        onToggleFavorite(sticker);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, 500); // 500ms for long press
  };

  const endPress = (e?: React.TouchEvent | React.MouseEvent) => {
    // Clear timer immediately
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Only proceed if the press is still valid (user didn't scroll)
    if (isPressValid.current && !isLongPressHandled.current) {
      if (isSelected) {
        // Step 2: Already selected, send it
        onSend(sticker.fileUrl);
        onSelect(null); // Deselect after sending
      } else {
        // Step 1: Select it
        onSelect(sticker.id);
      }
    }
    
    // Reset state
    isPressValid.current = false;
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isPressValid.current = false; // Mark as invalid (scrolled or moved out)
  };

  return (
    <div
      className={`aspect-square flex items-center justify-center p-1 rounded-xl transition-all select-none cursor-pointer relative overflow-hidden ${
        isSelected 
        ? 'bg-wic-primary/10 ring-2 ring-wic-primary ring-offset-1 dark:ring-offset-gray-900 z-10' 
        : 'hover:bg-white/50 dark:hover:bg-white/5 active:scale-95'
      }`}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={(e) => {
        // Prevent default to stop mouse events firing after touch
        // e.preventDefault(); // Commented out to allow scroll inertia, handled logic manually
        endPress(e);
      }}
      onTouchMove={cancelPress} // Critical: Moving finger cancels the "tap"
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <UniversalSticker src={sticker.fileUrl} autoplay={isSelected} loop={true} className="w-16 h-16 pointer-events-none" />
      
      {/* Send Overlay Indicator */}
      <AnimatePresence>
        {isSelected && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.5 }}
             className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-xl pointer-events-none"
           >
             <div className="bg-wic-primary text-white p-1.5 rounded-full shadow-lg">
                <Send size={14} fill="currentColor" />
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileStickerSheet: React.FC<MobileStickerSheetProps> = ({ 
  isOpen, 
  onEmojiClick, 
  onStickerClick,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'emoji' | 'stickers' | 'gifs'>('stickers');
  const [activePackId, setActivePackId] = useState<string>('duck'); // Default pack
  const [stickerPacks, setStickerPacks] = useState<StickerPack[]>([]);
  const [favorites, setFavorites] = useState<StickerType[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null); // New Selection State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { theme } = useTheme();

  const fetchPacks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const packs = await stickerService.fetchStickerPacks();
        setStickerPacks(packs);
        // If we have packs and current activePackId is the default 'duck' but 'duck' doesn't exist in fetched packs,
        // switch to the first available pack.
        setActivePackId(prev => {
             if (prev === 'duck' && packs.length > 0 && !packs.find(p => p.id === 'duck')) {
                 return packs[0].id;
             }
             return prev;
        });
    } catch (err) {
        console.error("Failed to load sticker packs:", err);
        setError("Failed to load stickers.");
    } finally {
        setIsLoading(false);
    }
  }, []);

  // Load Data
  useEffect(() => {
    if (isOpen) {
        fetchPacks();
        // Load favorites
        const savedFavs = localStorage.getItem('wic_sticker_favorites');
        if (savedFavs) {
            try {
                setFavorites(JSON.parse(savedFavs));
            } catch (e) {
                console.error("Failed to parse favorites", e);
            }
        }
    }
  }, [isOpen, fetchPacks]);

  // Reset selection when changing packs or tabs
  useEffect(() => {
    setSelectedStickerId(null);
  }, [activePackId, activeTab, isOpen]);

  // Toast Auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const toggleFavorite = (sticker: StickerType) => {
    setFavorites(prev => {
        const exists = prev.some(s => s.id === sticker.id);
        let newFavs;
        
        if (exists) {
            setToastMessage("Removed from Favorites 💔");
            newFavs = prev.filter(s => s.id !== sticker.id);
        } else {
            setToastMessage("Added to Favorites ❤️");
            newFavs = [...prev, sticker];
        }
        
        localStorage.setItem('wic_sticker_favorites', JSON.stringify(newFavs));
        return newFavs;
    });
  };

  // Render Grid Content Logic
  const renderGridContent = () => {
      // Case A: Recent
      if (activePackId === 'recent') {
          return (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                  <Clock size={32} className="opacity-20 mb-2" />
                  <span className="text-sm">No recent stickers yet</span>
              </div>
          );
      }

      // Case B: Favorites
      if (activePackId === 'favorites') {
          if (favorites.length === 0) {
              return (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                      <Heart size={32} className="opacity-20 mb-2" />
                      <span className="text-sm">Long press a sticker to favorite it! ⭐</span>
                  </div>
              );
          }
          return (
              <div className="grid grid-cols-4 gap-2 pb-20">
                  {favorites.map(sticker => (
                      <StickerItem 
                        key={sticker.id}
                        sticker={sticker}
                        onSend={onStickerClick}
                        onToggleFavorite={toggleFavorite}
                        isSelected={selectedStickerId === sticker.id}
                        onSelect={setSelectedStickerId}
                      />
                  ))}
              </div>
          );
      }

      // Case C: Normal Packs
      const activePack = stickerPacks.find(p => p.id === activePackId);
      if (activePack) {
          return (
              <div className="grid grid-cols-4 gap-2 pb-20">
                  {activePack.stickers.map(sticker => (
                      <StickerItem 
                        key={sticker.id}
                        sticker={sticker}
                        onSend={onStickerClick}
                        onToggleFavorite={toggleFavorite}
                        isSelected={selectedStickerId === sticker.id}
                        onSelect={setSelectedStickerId}
                      />
                  ))}
              </div>
          );
      }

      return <div className="flex items-center justify-center h-full text-gray-400 text-sm">Select a pack</div>;
  };

  // Render Logic
  const renderContent = () => {
    if (activeTab === 'emoji') {
        return (
            <div className="h-full w-full">
                <EmojiPicker 
                    width="100%" 
                    height="100%"
                    theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
                    emojiStyle={EmojiStyle.NATIVE}
                    searchDisabled={false}
                    skinTonesDisabled
                    onEmojiClick={onEmojiClick}
                    previewConfig={{ showPreview: false }}
                />
            </div>
        );
    }

    if (activeTab === 'stickers') {
        if (isLoading) {
             return (
                <div className="h-full flex flex-col">
                    {/* Skeleton Pack Selector */}
                    <div className="h-12 shrink-0 border-b border-gray-200 dark:border-gray-800 flex items-center px-2 overflow-x-auto scrollbar-hide bg-gray-50 dark:bg-gray-900/50 gap-2">
                        {/* Static icons skeletons */}
                        <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse shrink-0" />
                        <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse shrink-0" />
                        <div className="w-[1px] h-5 bg-gray-300 dark:bg-gray-700 mx-1 shrink-0" />
                        {/* Pack icons skeletons */}
                        {Array.from({length: 5}).map((_, i) => (
                            <div key={i} className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse shrink-0" />
                        ))}
                    </div>

                    {/* Skeleton Grid */}
                    <div className="flex-1 p-2 bg-gray-100 dark:bg-[#0f1519]">
                        <div className="grid grid-cols-4 gap-2">
                            {Array.from({length: 16}).map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
             );
        }

        if (error) {
            return (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-gray-500">
                    <p>{error}</p>
                    <button 
                        onClick={fetchPacks}
                        className="px-4 py-2 bg-wic-primary text-white rounded-lg font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center gap-2"
                    >
                        <RotateCcw size={16} />
                        Retry
                    </button>
                </div>
            );
        }

        return (
            <div className="h-full flex flex-col">
                {/* Pack Selector (Horizontal Scroll) */}
                <div className="h-12 shrink-0 border-b border-gray-200 dark:border-gray-800 flex items-center px-2 overflow-x-auto scrollbar-hide bg-gray-50 dark:bg-gray-900/50">
                    <button 
                        onClick={() => setActivePackId('recent')}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg mr-1 transition-all shrink-0 ${
                            activePackId === 'recent' 
                            ? 'bg-white dark:bg-gray-800 shadow-sm text-wic-primary border border-gray-200 dark:border-gray-700' 
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                    >
                        <Clock size={18} />
                    </button>
                    <button 
                        onClick={() => setActivePackId('favorites')}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg mr-2 transition-all shrink-0 ${
                            activePackId === 'favorites' 
                            ? 'bg-white dark:bg-gray-800 shadow-sm text-wic-primary border border-gray-200 dark:border-gray-700' 
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                    >
                        <Star size={18} />
                    </button>
                    <div className="w-[1px] h-5 bg-gray-300 dark:bg-gray-700 mx-1 shrink-0" />
                    
                    {stickerPacks.map(pack => (
                        <button
                            key={pack.id}
                            onClick={() => setActivePackId(pack.id)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg mr-1 transition-all shrink-0 ${
                                activePackId === pack.id 
                                ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700' 
                                : 'opacity-60 grayscale hover:opacity-100'
                            }`}
                        >
                            <UniversalSticker src={pack.thumbnailUrl} autoplay={false} className="w-6 h-6" />
                        </button>
                    ))}
                    <div className="w-4 shrink-0" /> {/* Right Padding */}
                </div>

                {/* Main Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 bg-gray-100 dark:bg-[#0f1519]">
                    {renderGridContent()}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <Film size={32} className="opacity-50" />
            <span className="text-sm">GIFs coming soon</span>
        </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
            initial={{ height: 0 }}
            animate={{ height: 350 }}
            exit={{ height: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex flex-col z-10 relative"
        >
             {/* Toast Notification */}
             <AnimatePresence>
                {toastMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-900/90 dark:bg-white/90 backdrop-blur text-white dark:text-gray-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg z-50 whitespace-nowrap pointer-events-none"
                    >
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {renderContent()}
            </div>

            {/* Bottom Tabs */}
            <div className="h-12 shrink-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-around pb-safe">
                <TabButton 
                    active={activeTab === 'emoji'} 
                    onClick={() => setActiveTab('emoji')} 
                    icon={<Smile size={20} />} 
                    label="Emoji" 
                />
                <TabButton 
                    active={activeTab === 'stickers'} 
                    onClick={() => setActiveTab('stickers')} 
                    icon={<Sticker size={20} />} 
                    label="Stickers" 
                />
                <TabButton 
                    active={activeTab === 'gifs'} 
                    onClick={() => setActiveTab('gifs')} 
                    icon={<Film size={20} />} 
                    label="GIFs" 
                />
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Delete size={20} />
                </button>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
            active 
            ? 'bg-gray-100 dark:bg-gray-800 text-wic-primary dark:text-wic-accent' 
            : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default MobileStickerSheet;
