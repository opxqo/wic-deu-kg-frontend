
import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
      <div className={`flex max-w-[85%] md:max-w-[70%] ${message.isSelf ? 'flex-row-reverse' : 'flex-row'} items-end gap-1.5 md:gap-2`}>
        
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
        <div className={`relative group flex flex-col ${message.isSelf ? 'items-end' : 'items-start'} min-w-0 max-w-full`}>
            
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
                        className="w-24 h-24 md:w-32 md:h-32 filter drop-shadow-sm"
                    />
                    <div className={`
                        absolute bottom-1 px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-medium backdrop-blur-md
                        ${message.isSelf ? 'right-0 bg-black/20 text-white' : 'right-0 bg-white/50 text-gray-700'}
                    `}>
                        {message.timestamp}
                    </div>
                </div>
            ) : (
                // Text Bubble Style with Compact Markdown
                <div className={`
                    px-3 py-2 md:px-4 md:py-2.5 shadow-sm relative overflow-hidden min-w-[60px]
                    ${message.isSelf 
                        ? 'bg-wic-primary text-white rounded-2xl rounded-tr-sm' 
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-sm'
                    }
                `}>
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        className={`
                            prose prose-sm max-w-none break-words
                            text-sm md:text-[15px] leading-snug
                            ${message.isSelf ? 'prose-invert text-white' : 'text-gray-900 dark:text-gray-100 dark:prose-invert'}
                            
                            /* === Core Compact Overrides === */
                            [&>p]:my-0 
                            [&>p+p]:mt-1.5
                            
                            /* Headings */
                            prose-headings:my-1 prose-headings:text-sm prose-headings:font-bold
                            
                            /* Lists */
                            [&>ul]:my-1 [&>ul]:pl-4
                            [&>ol]:my-1 [&>ol]:pl-4
                            [&>li]:my-0
                            
                            /* Blockquotes */
                            prose-blockquote:my-1 prose-blockquote:border-l-2 prose-blockquote:pl-2 prose-blockquote:italic prose-blockquote:not-italic:opacity-80
                            
                            /* Code Blocks - limit width to prevent overflow on mobile */
                            prose-pre:my-1.5 prose-pre:p-2 prose-pre:rounded-lg prose-pre:bg-black/20 
                            prose-pre:text-xs 
                            [&>pre]:max-w-[240px] sm:[&>pre]:max-w-md
                            
                            /* Inline Code */
                            prose-code:px-1 prose-code:rounded prose-code:bg-black/10 prose-code:before:content-none prose-code:after:content-none
                            
                            /* Links */
                            prose-a:underline prose-a:opacity-90 hover:prose-a:opacity-100
                        `}
                        components={{
                            a: ({node, ...props}) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="underline opacity-90 hover:opacity-100" />
                            )
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                    
                    {/* Timestamp naturally flowing at bottom right */}
                    <div className={`
                        text-[9px] md:text-[10px] mt-1 text-right select-none opacity-70
                        ${message.isSelf ? 'text-white' : 'text-gray-500 dark:text-gray-400'}
                    `}>
                        {message.timestamp}
                    </div>
                </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
