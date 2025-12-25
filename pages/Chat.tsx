
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Phone, MoreVertical, Menu, ArrowLeft } from 'lucide-react';
import { Department, ChatMessage as ChatMessageType } from '../types';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import ChatRightPanel from '../components/ChatRightPanel';
import MobileStickerSheet from '../components/MobileStickerSheet';
import { useMobileMenu } from '../context/MobileMenuContext';

const Chat: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  // --- Data ---
  const departments: Department[] = [
    { id: '1', name: t('chat.dept.1'), icon: '💻', description: t('chat.dept.desc.1'), lastMessage: 'Does anyone have the notes for CS101?', lastTime: '10:36' },
    { id: '2', name: t('chat.dept.2'), icon: '🩺', description: t('chat.dept.desc.2'), lastMessage: 'Lab coats are available at the store.', lastTime: '09:00' },
    { id: '3', name: t('chat.dept.3'), icon: '📊', description: t('chat.dept.desc.3'), lastMessage: 'Marketing seminar starts in 10 mins.', lastTime: 'Yesterday' },
    { id: '4', name: t('chat.dept.4'), icon: '🎨', description: t('chat.dept.desc.4'), lastMessage: 'Reviewing portfolios today!', lastTime: 'Yesterday' },
    { id: '5', name: t('chat.dept.5'), icon: '🌍', description: t('chat.dept.desc.5'), lastMessage: 'English corner meetup?', lastTime: 'Mon' },
    { id: '6', name: t('chat.dept.6'), icon: '🏗️', description: t('chat.dept.desc.6'), lastMessage: 'Site visit postponed.', lastTime: 'Sun' },
  ];

  const mockMessages: Record<string, ChatMessageType[]> = {
    '1': [
      { id: '1', user: 'Alex', avatar: 'https://picsum.photos/seed/alex/40/40', content: 'Anyone knows when the React assignment is due?', timestamp: '10:30', isSelf: false, type: 'text' },
      { id: '2', user: 'Sarah', avatar: 'https://picsum.photos/seed/sarah/40/40', content: 'I think it is next Monday. The professor posted it on the portal.', timestamp: '10:32', isSelf: false, type: 'text' },
      { id: '3', user: 'Me', avatar: 'https://picsum.photos/seed/me/40/40', content: 'Thanks Sarah! Are we using Tailwind or CSS modules?', timestamp: '10:33', isSelf: true, type: 'text' },
      { id: '4', user: 'Mike', avatar: 'https://picsum.photos/seed/mike/40/40', content: 'Tailwind all the way! 🚀', timestamp: '10:35', isSelf: false, type: 'text' },
      { id: '5', user: 'Me', avatar: 'https://picsum.photos/seed/me/40/40', content: 'https://r2.wic.edu.kg/images/meme/AnimatedSticker.tgs', timestamp: '10:36', isSelf: true, type: 'sticker' },
    ],
    '2': [
      { id: '1', user: 'Emily', avatar: 'https://picsum.photos/seed/emily/40/40', content: 'Anatomy lab is open until 8PM today.', timestamp: '09:00', isSelf: false, type: 'text' },
    ]
  };

  // --- State ---
  const [activeDept, setActiveDept] = useState<Department>(departments[0]);
  const [messages, setMessages] = useState<ChatMessageType[]>(mockMessages['1'] || []);
  
  // Mobile Menu Context
  const { isOpen: mobileMenuOpen, setIsOpen: setMobileMenuOpen } = useMobileMenu();
  
  // UI Panels State
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true); // Desktop right panel (default open)
  const [isMobileStickerOpen, setIsMobileStickerOpen] = useState(false); // Mobile sticker sheet
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    setActiveDept(prev => departments.find(d => d.id === prev.id) || departments[0]);
  }, [t]);

  useEffect(() => {
    setMessages(mockMessages[activeDept.id] || []);
    setMobileMenuOpen(false); 
  }, [activeDept.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isRightPanelOpen, isMobileStickerOpen]); 

  // --- Handlers ---
  const handleSendMessage = (content: string, type: 'text' | 'sticker') => {
    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      user: 'Me',
      avatar: 'https://picsum.photos/seed/me/40/40',
      content: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      isSelf: true,
      type: type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleEmojiClick = useCallback((emojiObject: any) => {
    setInputValue(prev => prev + emojiObject.emoji);
  }, []);

  const handleStickerClick = useCallback((src: string) => {
    handleSendMessage(src, 'sticker');
    // On mobile only, close sheet after sending for better UX
    if (window.innerWidth < 768) {
      setIsMobileStickerOpen(false);
    }
  }, []);

  const toggleStickerPanel = () => {
    if (window.innerWidth < 768) {
      // Mobile Logic
      setIsMobileStickerOpen(!isMobileStickerOpen);
    } else {
      // Desktop Logic
      setIsRightPanelOpen(!isRightPanelOpen);
    }
  };

  const handleInputFocus = () => {
    // When typing on mobile, close the sticker sheet to let native keyboard show
    if (window.innerWidth < 768) {
        setIsMobileStickerOpen(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] mt-20 overflow-hidden bg-white dark:bg-gray-950">
      
      {/* 
        ========================================================================
        COLUMN 1: LEFT SIDEBAR (Hidden on Mobile, Toggleable)
        ========================================================================
      */}
      <aside className={`
          absolute md:static z-40 inset-y-0 left-0 w-[300px] lg:w-[25%] max-w-sm bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 transform shadow-xl md:shadow-none
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* HEADER: h-14 Fixed Height */}
        <div className="h-14 shrink-0 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 bg-white dark:bg-gray-900 z-10 gap-2">
            {/* Mobile Close Button */}
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-gray-500">
                <ArrowLeft size={20} />
            </button>
            <div className="relative w-full group">
                <input 
                type="text" 
                placeholder={t('chat.search')}
                className="w-full bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 rounded-full pl-10 pr-4 h-9 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-wic-primary/30 transition-all border border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-wic-primary/30"
                />
                <Search className="absolute left-3.5 top-2.5 text-gray-400 group-focus-within:text-wic-primary transition-colors" size={16} />
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {departments.map(dept => {
            const isActive = activeDept.id === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setActiveDept(dept)}
                className={`w-full relative flex items-center gap-3 px-3 py-3 transition-colors mx-auto border-b border-gray-50 dark:border-gray-800/50
                   ${isActive 
                      ? 'bg-wic-primary/5 dark:bg-wic-primary/10' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                   }`}
              >
                {/* Active Indicator */}
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-wic-primary" />}

                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-2xl shadow-inner">
                        {dept.icon}
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className={`font-bold truncate text-[15px] ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                        {dept.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                        {dept.lastTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                      <p className={`text-[13px] truncate max-w-[90%] ${isActive ? 'text-wic-primary dark:text-wic-accent font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                          {dept.lastMessage}
                      </p>
                      {isActive && <div className="w-2 h-2 rounded-full bg-wic-primary shrink-0" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile Overlay for Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
            />
        )}
      </AnimatePresence>

      {/* 
        ========================================================================
        COLUMN 2: MAIN CHAT AREA (Flex-1)
        ========================================================================
      */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#EFEFEF] dark:bg-[#0f1519] relative shadow-2xl z-10 w-full">
        
        {/* Doodle Background */}
        <div className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.03] pointer-events-none" 
             style={{ 
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23546e7a' fill-opacity='1'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'/%3E%3C/g%3E%3C/svg%3E")` 
             }} 
        />

        {/* HEADER: h-14 Fixed Height */}
        <header className="h-14 px-4 flex items-center justify-between shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-20 sticky top-0 shadow-sm/50">
            <div className="flex items-center gap-3">
                 {/* Top menu button removed in favor of bottom input menu button, but keeping spacer if needed or just removing it. */}
                 <div className="flex flex-col cursor-pointer">
                     <h3 className="font-bold text-gray-900 dark:text-gray-100 text-[16px] leading-none mb-1">
                         {activeDept.name}
                     </h3>
                     <div className="flex items-center gap-1.5 opacity-80">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                            {t('chat.online')}
                        </p>
                     </div>
                 </div>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
                <Search className="hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition hidden sm:block" size={20} />
                <Phone className="hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition" size={20} />
                <MoreVertical className="hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition" size={20} />
            </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-3 md:px-16 md:py-6 relative z-10 custom-scrollbar overscroll-contain">
           {messages.map((msg, index) => {
               const isSequence = index > 0 && messages[index - 1].user === msg.user && messages[index - 1].type !== 'sticker';
               return (
                   <ChatMessage key={msg.id} message={msg} isSequence={isSequence} />
               );
           })}
           <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA: Stacks on top of Mobile Sticker Sheet */}
        <div className="shrink-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              onTogglePanel={toggleStickerPanel}
              isPanelOpen={isRightPanelOpen || isMobileStickerOpen}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onFocus={handleInputFocus}
            />
        </div>

        {/* MOBILE STICKER SHEET (Keyboard Replacement) */}
        <div className="md:hidden shrink-0 z-20 bg-white dark:bg-gray-900">
            <MobileStickerSheet 
                isOpen={isMobileStickerOpen}
                onEmojiClick={handleEmojiClick}
                onStickerClick={handleStickerClick}
                onClose={() => setIsMobileStickerOpen(false)}
            />
        </div>
      </main>

      {/* 
        ========================================================================
        COLUMN 3: DESKTOP RIGHT PANEL (Hidden on Mobile)
        ========================================================================
      */}
      <div className="hidden md:block h-full shrink-0">
          <ChatRightPanel 
            isOpen={isRightPanelOpen} 
            onEmojiClick={handleEmojiClick}
            onStickerClick={handleStickerClick}
          />
      </div>

    </div>
  );
};

export default Chat;
