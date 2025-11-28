import React from 'react';
import { motion } from 'framer-motion';
import UniversalSticker from './UniversalSticker';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
  isSequence: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isSequence }) => {
  const isSticker = message.type === 'sticker';

  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`flex w-full ${message.isSelf ? 'justify-end' : 'justify-start'} ${isSequence ? 'mt-1' : 'mt-2 md:mt-3'}`}
    >
      <div className={`flex max-w-[90%] md:max-w-[70%] ${message.isSelf ? 'flex-row-reverse' : 'flex-row'} items-end gap-1.5 md:gap-2`}>
        
        {/* Avatar (Left side only, bottom aligned) */}
        {!message.isSelf && (
          <div className="w-7 md:w-8 flex-shrink-0">
            {!isSequence ? (
              <img 
                src={message.avatar} 
                alt={message.user} 
                className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-200 object-cover shadow-sm" 
              />
            ) : <div className="w-7 md:w-8" />}
          </div>
        )}

        {/* Message Content */}
        <div className={`relative group flex flex-col ${message.isSelf ? 'items-end' : 'items-start'}`}>
            
            {/* Sender Name (Only for first message in group, received only) */}
            {!message.isSelf && !isSequence && !isSticker && (
                <span className="text-[10px] md:text-[11px] font-bold text-wic-primary ml-1 mb-0.5">
                    {message.user}
                </span>
            )}

            {isSticker ? (
                // Sticker Style
                <div className="relative active:scale-95 transition-transform duration-200">
                    <UniversalSticker 
                        src={message.content} 
                        autoplay={true}
                        className="w-28 h-28 md:w-40 md:h-40 filter drop-shadow-sm md:drop-shadow-md"
                    />
                    <div className={`
                        absolute bottom-1 px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-medium backdrop-blur-md
                        ${message.isSelf ? 'right-0 bg-black/20 text-white' : 'right-0 bg-white/50 text-gray-700'}
                    `}>
                        {message.timestamp}
                    </div>
                </div>
            ) : (
                // Text Bubble Style
                <div className={`
                    px-3 py-1.5 md:px-3 md:py-2 text-[14px] md:text-[15px] leading-relaxed shadow-sm relative min-w-[50px] pb-4 md:pb-5
                    ${message.isSelf 
                        ? 'bg-wic-primary text-white rounded-2xl rounded-tr-sm' 
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-sm'
                    }
                `}>
                    <span className="break-words whitespace-pre-wrap">{message.content}</span>
                    
                    {/* Timestamp inside bubble */}
                    <span className={`
                        absolute bottom-0.5 right-2 md:bottom-1 text-[9px] md:text-[10px] 
                        ${message.isSelf ? 'text-white/70' : 'text-gray-400'}
                    `}>
                        {message.timestamp}
                    </span>
                </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;