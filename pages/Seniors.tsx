import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareQuote, User } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const notes = [
  { id: 1, text: "Don't skip breakfast at Canteen 2! The Baozi queue is long but worth it.", author: "Class of '22", color: "bg-yellow-100", rotation: "-rotate-2" },
  { id: 2, text: "Join a club in your first semester. It's the best way to make friends outside your major.", author: "Art Dept Senior", color: "bg-green-100", rotation: "rotate-1" },
  { id: 3, text: "The library 4th floor is the quietest spot for finals week. Get there early!", author: "Med Student", color: "bg-blue-100", rotation: "rotate-3" },
  { id: 4, text: "Prof. Zhang's algorithms class is tough but fair. Do the practice problems!", author: "CS Major", color: "bg-red-100", rotation: "-rotate-1" },
  { id: 5, text: "Take advantage of the free gym hours on weekdays.", author: "Sports Center", color: "bg-purple-100", rotation: "rotate-2" },
  { id: 6, text: "Explore the East Lake greenway on weekends. It's right next door!", author: "Nature Lover", color: "bg-orange-100", rotation: "-rotate-3" },
  { id: 7, text: "Keep your dorm key safe. Replacements take forever.", author: "Anonymous", color: "bg-pink-100", rotation: "rotate-1" },
  { id: 8, text: "Participate in the coding hackathons. Great for your resume.", author: "Tech Lead", color: "bg-teal-100", rotation: "-rotate-2" },
];

const Seniors: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 px-4 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-wic-primary/10 dark:bg-wic-primary/20 rounded-full mb-4 text-wic-primary dark:text-wic-accent">
            <MessageSquareQuote size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('seniors.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('seniors.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
          {notes.map((note, idx) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, type: "spring" }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
              className={`p-6 rounded-sm shadow-md ${note.color} ${note.rotation} transform transition-all duration-300 min-h-[200px] flex flex-col justify-between`}
            >
              {/* Keep text dark on sticky notes even in dark mode as they are pastel colored */}
              <p className="text-gray-800 font-medium font-serif text-lg leading-relaxed mb-4">
                "{note.text}"
              </p>
              <div className="flex items-center gap-2 text-gray-600 text-sm font-bold opacity-70">
                <User size={14} />
                <span>{note.author}</span>
              </div>
              {/* Pin effect */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-red-400 shadow-sm border border-red-500 opacity-80"></div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
            <button className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:border-wic-primary dark:hover:border-wic-accent hover:text-wic-primary dark:hover:text-wic-accent transition-colors font-medium">
                {t('seniors.btn')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Seniors;