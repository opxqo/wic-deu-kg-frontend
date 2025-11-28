import React from 'react';
import { motion } from 'framer-motion';

export interface EmojiConfig {
  id: string;
  name: string;
  src: string;
  fallback: string;
}

// Using high-quality CDN assets to simulate "public/emojis/3d/" for immediate visual feedback
const FLUENT_EMOJIS: EmojiConfig[] = [
  { id: 'joy', name: 'Joy', src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Grinning%20Face%20with%20Smiling%20Eyes.png', fallback: '😄' },
  { id: 'heart', name: 'Love', src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Red%20Heart.png', fallback: '❤️' },
  { id: 'lol', name: 'Laughing', src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Rolling%20on%20the%20Floor%20Laughing.png', fallback: '🤣' },
  { id: 'cool', name: 'Cool', src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Sunglasses.png', fallback: '😎' },
  { id: 'cry', name: 'Cry', src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Loudly%20Crying%20Face.png', fallback: '😭' },
  { id: 'angry', name: 'Angry', src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Enraged%20Face.png', fallback: '😡' },
  { id: 'party', name: 'Party', src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Partying%20Face.png', fallback: '🥳' },
  { id: 'thumbsup', name: 'Thumbs Up', src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Thumbs%20Up.png', fallback: '👍' },
  { id: 'fire', name: 'Fire', src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Fire.png', fallback: '🔥' },
  { id: 'rocket', name: 'Rocket', src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png', fallback: '🚀' },
  { id: 'star', name: 'Star', src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Star.png', fallback: '⭐' },
  { id: 'poop', name: 'Poop', src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Pile%20of%20Poo.png', fallback: '💩' },
];

interface FluentEmojiPickerProps {
  onSelect: (emoji: EmojiConfig) => void;
}

const FluentEmojiPicker: React.FC<FluentEmojiPickerProps> = ({ onSelect }) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
      <div className="grid grid-cols-4 gap-4">
        {FLUENT_EMOJIS.map((emoji) => (
          <motion.button
            key={emoji.id}
            onClick={() => onSelect(emoji)}
            whileHover={{ 
              scale: 1.2, 
              rotate: 5,
              filter: "drop-shadow(0px 5px 5px rgba(0,0,0,0.2))",
              zIndex: 10
            }}
            whileTap={{ scale: 0.9 }}
            className="relative w-full aspect-square flex items-center justify-center p-2 rounded-xl transition-colors hover:bg-white dark:hover:bg-gray-800"
          >
            <img 
              src={emoji.src} 
              alt={emoji.name} 
              className="w-full h-full object-contain filter drop-shadow-sm" 
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FluentEmojiPicker;
