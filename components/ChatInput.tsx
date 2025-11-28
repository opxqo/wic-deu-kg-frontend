import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Send, Mic, Paperclip, X, Keyboard, Menu } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import ChatAttachmentMenu from './ChatAttachmentMenu';
import { useMobileMenu } from '../context/MobileMenuContext';

interface ChatInputProps {
  onSendMessage: (content: string, type: 'text' | 'sticker') => void;
  onTogglePanel: () => void;
  isPanelOpen: boolean;
  inputValue: string;
  setInputValue: (val: string) => void;
  onFocus?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onTogglePanel, 
  isPanelOpen, 
  inputValue, 
  setInputValue,
  onFocus
}) => {
  const { t } = useLanguage();
  const { setIsOpen: setMobileMenuOpen } = useMobileMenu();
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue, 'text');
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiButton = () => {
    if (isPanelOpen) {
        // Switching back to keyboard?
        inputRef.current?.focus();
    } else {
        // Opening sticker panel, blur input to hide native keyboard on mobile
        inputRef.current?.blur();
    }
    onTogglePanel();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
       if (showAttachmentMenu) {
           // setShowAttachmentMenu(false);
       }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showAttachmentMenu]);

  return (
    <div className="w-full flex items-center justify-center py-2 px-3 md:px-4 max-w-5xl mx-auto min-h-[56px]">
      
      {/* Attachment Menu Popover */}
      <AnimatePresence>
        {showAttachmentMenu && (
          <ChatAttachmentMenu 
            onSelect={(type) => {
                console.log('Selected:', type);
            }} 
            onClose={() => setShowAttachmentMenu(false)} 
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 md:gap-3 w-full">
        {/* Left: Menu Button (Mobile Only) */}
        <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 shrink-0"
        >
            <Menu size={22} />
        </button>

        {/* Left: Attachment Button */}
        <div className="relative shrink-0">
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    setShowAttachmentMenu(!showAttachmentMenu);
                }}
                className={`p-2 rounded-full transition-colors ${
                    showAttachmentMenu 
                    ? 'text-wic-primary bg-wic-primary/10 rotate-45' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
             >
                <Paperclip size={22} className="transform transition-transform" />
             </button>
        </div>

        {/* Center: Input Field */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center relative h-[40px] md:h-[44px]">
            <input 
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
                placeholder={t('chat.input')}
                className="w-full bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 h-full pl-4 pr-10 text-[15px]"
            />
            
            {/* Emoji Toggle Inside Input (Right) */}
            <button
                onClick={handleEmojiButton}
                className={`absolute right-1 p-2 rounded-full transition-colors ${
                    isPanelOpen 
                    ? 'text-wic-primary' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
            >
                {isPanelOpen ? <Keyboard size={20} /> : <Smile size={22} />}
            </button>
        </div>

        {/* Right: Mic / Send */}
        <div className="shrink-0 w-10 flex justify-center">
            <AnimatePresence mode="wait">
                {inputValue.trim() ? (
                    <motion.button
                        key="send"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={handleSend}
                        className="w-10 h-10 flex items-center justify-center bg-wic-primary hover:bg-wic-secondary text-white rounded-full shadow-md shadow-wic-primary/30 transition-all active:scale-95"
                    >
                        <Send size={18} className="ml-0.5" />
                    </motion.button>
                ) : (
                    <motion.button
                        key="mic"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full transition-all"
                    >
                        <Mic size={22} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;