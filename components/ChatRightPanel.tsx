
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Sticker, Film, Clock, Star, Settings, Search, Heart } from 'lucide-react';
import EmojiPicker, { Theme, EmojiStyle } from 'emoji-picker-react';
import UniversalSticker from './UniversalSticker';
import { useTheme } from '../ThemeContext';
import { stickerService } from '../services/stickerService';
import { StickerPack, Sticker as StickerType } from '../types/sticker';

interface ChatRightPanelProps {
  isOpen: boolean;
  onEmojiClick: (emojiObject: any) => void;
  onStickerClick: (src: string) => void;
}

const TABS = [
  { id: 'emoji', label: 'Emoji', icon: Smile },
  { id: 'stickers', label: 'Stickers', icon: Sticker },
  { id: 'gifs', label: 'GIFs', icon: Film },
];

const ChatRightPanel: React.FC<ChatRightPanelProps> = ({ isOpen, onEmojiClick, onStickerClick }) => {
  const [activeTab, setActiveTab] = useState('stickers');
  const [activePackId, setActivePackId] = useState('recent'); // Default to recent view
  const [stickerPacks, setStickerPacks] = useState<StickerPack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  // Favorites State
  const [favorites, setFavorites] = useState<StickerType[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Long Press Refs
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  // Load Data & Favorites
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const packs = await stickerService.fetchStickerPacks();
        setStickerPacks(packs);
      } catch (error) {
        console.error("Failed to load sticker packs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

    // Load favorites from local storage
    const savedFavs = localStorage.getItem('wic_sticker_favorites');
    if (savedFavs) {
        try {
            setFavorites(JSON.parse(savedFavs));
        } catch (e) {
            console.error("Failed to parse favorites", e);
        }
    }
  }, []);

  // Save favorites when changed
  useEffect(() => {
    localStorage.setItem('wic_sticker_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toast Timer
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Interaction Handlers: Toggle Favorites (Add/Remove)
  const toggleFavorite = (sticker: StickerType) => {
    setFavorites(prev => {
        const exists = prev.some(s => s.id === sticker.id);
        
        if (exists) {
            setToastMessage("Removed from Favorites 💔");
            // Remove it
            return prev.filter(s => s.id !== sticker.id);
        } else {
            setToastMessage("Added to Favorites ❤️");
            // Add it
            return [...prev, sticker];
        }
    });
  };

  const handlePointerDown = (sticker: StickerType) => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        // Trigger visual feedback (Vibrate on mobile)
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }
        toggleFavorite(sticker);
    }, 800);
  };

  const handlePointerUp = () => {
    if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
    }
  };

  const handleStickerClickWithLogic = (sticker: StickerType) => {
    if (isLongPress.current) {
        // Was a long press, prevent sending
        isLongPress.current = false; 
        return;
    }
    onStickerClick(sticker.fileUrl);
  };

  // Helper to render the content based on activePackId
  const renderStickerContent = () => {
    if (isLoading) {
      return (
        <div className="p-4 grid grid-cols-4 gap-3">
            {Array.from({length: 12}).map((_, i) => <SkeletonSticker key={i} />)}
        </div>
      );
    }

    // 1. Recent View (Placeholder logic for now)
    if (activePackId === 'recent') {
      return (
        <div className="p-2">
           <div className="sticky top-0 bg-[#F4F4F5] dark:bg-[#0f1519] z-10 py-2 px-1 mb-2">
               <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Clock size={12} /> Recent Stickers
               </h3>
           </div>
           <div className="text-xs text-gray-400 p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
              No recent stickers
           </div>
        </div>
      );
    }

    // 2. Favorites View
    if (activePackId === 'favorites') {
      return (
        <div className="p-2">
           <div className="sticky top-0 bg-[#F4F4F5] dark:bg-[#0f1519] z-10 py-2 px-1 mb-2">
               <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Star size={12} /> Favorite Stickers
               </h3>
           </div>
           {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-gray-400 text-xs bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                    <Heart size={24} className="mb-2 opacity-50" />
                    <span>Long press a sticker to add it here</span>
                </div>
           ) : (
                <div className="grid grid-cols-4 gap-2 pb-4">
                    <AnimatePresence mode='popLayout'>
                        {favorites.map((sticker) => (
                            <motion.button 
                                layout
                                key={sticker.id} 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 0.2 }}
                                onMouseDown={() => handlePointerDown(sticker)}
                                onMouseUp={handlePointerUp}
                                onMouseLeave={handlePointerUp}
                                onTouchStart={() => handlePointerDown(sticker)}
                                onTouchEnd={handlePointerUp}
                                onClick={() => handleStickerClickWithLogic(sticker)}
                                className="aspect-square flex items-center justify-center p-1 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:scale-105 transition-shadow overflow-hidden border border-gray-100 dark:border-gray-800 relative group"
                            >
                                <UniversalSticker src={sticker.fileUrl} autoplay={false} loop={true} className="w-16 h-16" />
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
           )}
        </div>
      );
    }

    // 3. Specific Pack View
    const pack = stickerPacks.find(p => p.id === activePackId);
    if (pack) {
      return (
        <div className="p-2">
           <div className="sticky top-0 bg-[#F4F4F5] dark:bg-[#0f1519] z-10 py-2 px-1 mb-2 backdrop-blur-sm">
               <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  {pack.name}
               </h3>
           </div>
           <div className="grid grid-cols-4 gap-2 pb-4">
               {pack.stickers.map((sticker) => (
                   <button 
                     key={sticker.id} 
                     onMouseDown={() => handlePointerDown(sticker)}
                     onMouseUp={handlePointerUp}
                     onMouseLeave={handlePointerUp}
                     onTouchStart={() => handlePointerDown(sticker)}
                     onTouchEnd={handlePointerUp}
                     onClick={() => handleStickerClickWithLogic(sticker)}
                     className="aspect-square flex items-center justify-center p-1 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:scale-105 transition-all overflow-hidden border border-gray-100 dark:border-gray-800"
                   >
                       <UniversalSticker src={sticker.fileUrl} autoplay={false} loop={true} className="w-16 h-16" />
                   </button>
               ))}
           </div>
        </div>
      );
    }

    return <div className="p-4 text-center text-gray-400 text-sm">Pack not found</div>;
  };

  return (
    <motion.div
      initial={false}
      animate={{ 
        width: isOpen ? 350 : 0,
        opacity: isOpen ? 1 : 0
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col overflow-hidden shrink-0 shadow-xl z-20 relative"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-50 whitespace-nowrap"
            >
                {toastMessage}
            </motion.div>
        )}
      </AnimatePresence>

      <div className="w-[350px] h-full flex flex-col relative">
        
        {/* HEADER */}
        <div className="h-14 shrink-0 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-30">
            {activeTab !== 'emoji' ? (
                <div className="relative w-full group">
                    <Search className="absolute left-3.5 top-2.5 text-gray-400 group-focus-within:text-wic-primary transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search stickers..." 
                        className="w-full bg-gray-100 dark:bg-gray-800/50 rounded-full pl-10 pr-4 h-9 text-sm font-medium outline-none focus:ring-2 focus:ring-wic-primary/20 focus:bg-white dark:focus:bg-gray-800 transition-all text-gray-900 dark:text-white placeholder-gray-500 border border-transparent focus:border-wic-primary/30"
                    />
                </div>
            ) : (
                <div className="w-full font-bold text-gray-900 dark:text-white pl-1">
                    Choose Emoji
                </div>
            )}
        </div>

        {/* TABS STRIP */}
        <div className="shrink-0 z-20 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-around pt-2">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative pb-2 px-4 flex items-center gap-2 text-sm font-bold transition-colors ${
                            activeTab === tab.id ? 'text-wic-primary dark:text-wic-accent' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                    >
                        <tab.icon size={18} />
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-wic-primary rounded-t-full"
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* MAIN CONTENT BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#F4F4F5] dark:bg-[#0f1519] relative z-0">
          
          {activeTab === 'emoji' && (
            <div className="emoji-picker-wrapper w-full h-full">
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
          )}

          {activeTab === 'stickers' && (
             <AnimatePresence mode='wait'>
                 <motion.div
                    key={activePackId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="h-full flex flex-col"
                 >
                     {renderStickerContent()}
                 </motion.div>
             </AnimatePresence>
          )}

          {activeTab === 'gifs' && (
             <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
                 <Film size={48} className="opacity-20" />
                 <span>GIF search coming soon</span>
             </div>
          )}
        </div>

        {/* FOOTER NAVIGATION */}
        {activeTab === 'stickers' && (
            <div className="h-[60px] border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-2 justify-between shrink-0 relative z-30">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 pr-2">
                    <NavIcon 
                        active={activePackId === 'recent'} 
                        onClick={() => setActivePackId('recent')}
                        icon={<Clock size={20} />}
                        title="Recent"
                    />
                    <NavIcon 
                        active={activePackId === 'favorites'} 
                        onClick={() => setActivePackId('favorites')}
                        icon={<Star size={20} />}
                        title="Favorites"
                    />
                    <div className="w-[1px] h-5 bg-gray-300 dark:bg-gray-700 mx-2 shrink-0" />
                    
                    {/* Render Icons for Sticker Packs */}
                    {isLoading ? (
                        <div className="flex gap-1">
                             {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse shrink-0" />
                             ))}
                        </div>
                    ) : (
                        stickerPacks.map(pack => (
                             <NavIcon 
                                key={pack.id}
                                active={activePackId === pack.id}
                                onClick={() => setActivePackId(pack.id)}
                                title={pack.name}
                                // Use the thumbnail from the pack data
                                customContent={
                                    <UniversalSticker src={pack.thumbnailUrl} autoplay={false} className="w-6 h-6" />
                                }
                            />
                        ))
                    )}
                </div>
                <div className="pl-2 border-l border-gray-200 dark:border-gray-800">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Settings size={18} />
                    </button>
                </div>
            </div>
        )}
      </div>
    </motion.div>
  );
};

// Skeleton Component
const SkeletonSticker = () => (
    <div className="aspect-square rounded-xl bg-gray-200/50 dark:bg-gray-800/60 animate-pulse" />
);

// Helper component for bottom nav icons
const NavIcon = ({ active, onClick, icon, customContent, title }: any) => (
    <button
        onClick={onClick}
        title={title}
        className={`
            relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 shrink-0
            ${active 
                ? 'bg-wic-primary/10 text-wic-primary' 
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300'
            }
        `}
    >
        <div className={`transition-all duration-200 transform ${active ? 'scale-110 grayscale-0' : 'grayscale opacity-70 scale-95'}`}>
            {customContent || icon}
        </div>
        {active && (
            <motion.div 
                layoutId="activePackIndicator"
                className="absolute bottom-1 w-1 h-1 bg-wic-primary rounded-full"
            />
        )}
    </button>
);

export default ChatRightPanel;
