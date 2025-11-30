import React from 'react';
import { motion } from 'framer-motion';
import { Image, FileText, BarChart2, MapPin } from 'lucide-react';

interface ChatAttachmentMenuProps {
  onSelect: (type: string) => void;
  onClose: () => void;
}

const menuItems = [
  { id: 'media', label: 'Photo or Video', icon: Image, color: 'text-blue-500' },
  { id: 'file', label: 'File', icon: FileText, color: 'text-indigo-500' },
  { id: 'poll', label: 'Poll', icon: BarChart2, color: 'text-yellow-500' },
  { id: 'location', label: 'Location', icon: MapPin, color: 'text-red-500' },
];

const ChatAttachmentMenu: React.FC<ChatAttachmentMenuProps> = ({ onSelect, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-16 left-0 z-50 w-56 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden py-2"
    >
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            onSelect(item.id);
            onClose();
          }}
          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors group text-left"
        >
          <div className={`p-2 rounded-full bg-gray-50 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors shadow-sm`}>
            <item.icon size={20} className={item.color} />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {item.label}
          </span>
        </button>
      ))}
    </motion.div>
  );
};

export default ChatAttachmentMenu;