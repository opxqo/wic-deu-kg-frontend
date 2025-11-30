import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Quote } from 'lucide-react';
import { BookItem } from '../types';
import { useLanguage } from '../LanguageContext';

const books: BookItem[] = [
  { id: '1', title: 'The Three-Body Problem', author: 'Liu Cixin', cover: 'https://picsum.photos/seed/book1/200/300', studentComment: "Mind-blowing scifi that redefines scale.", studentName: "Physics Dept" },
  { id: '2', title: 'Atomic Habits', author: 'James Clear', cover: 'https://picsum.photos/seed/book2/200/300', studentComment: "Changed my morning routine completely.", studentName: "Med Student" },
  { id: '3', title: 'Design of Everyday Things', author: 'Don Norman', cover: 'https://picsum.photos/seed/book3/200/300', studentComment: "Essential for any UX designer.", studentName: "Art Dept" },
  { id: '4', title: 'Deep Work', author: 'Cal Newport', cover: 'https://picsum.photos/seed/book4/200/300', studentComment: "Hard to practice, but worth it.", studentName: "CS Major" },
];

const Library: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-950 py-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-wic-primary/10 dark:bg-wic-primary/20 rounded-full mb-4 text-wic-primary dark:text-wic-accent">
                    <BookOpen size={32} />
                </div>
                <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">{t('library.title')}</h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('library.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {books.map((book, index) => (
                    <motion.div
                        key={book.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="group"
                    >
                        {/* 3D Book Cover Effect */}
                        <div className="relative w-48 mx-auto mb-8 perspective-1000">
                             <motion.div 
                                className="relative w-full aspect-[2/3] rounded-r-md shadow-2xl origin-left"
                                style={{ transformStyle: 'preserve-3d' }}
                                whileHover={{ rotateY: -15, scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                             >
                                 <img src={book.cover} alt={book.title} className="w-full h-full object-cover rounded-r-md" />
                                 {/* Book Spine Simulation */}
                                 <div className="absolute top-0 bottom-0 left-0 w-3 bg-gray-800 transform -translate-x-full origin-right rotate-y-90 opacity-80" />
                                 <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none rounded-r-md" />
                             </motion.div>
                        </div>

                        {/* Review Card */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-700 relative mt-4">
                            <Quote className="absolute top-4 left-4 text-wic-primary/20 dark:text-wic-accent/20" size={32} />
                            <div className="relative z-10 pt-4">
                                <p className="text-gray-700 dark:text-gray-300 italic font-serif mb-4 leading-relaxed">"{book.studentComment}"</p>
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{book.title}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">by {book.author}</p>
                                    </div>
                                    <div className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                                        {book.studentName}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <div className="mt-20 p-8 bg-wic-primary dark:bg-wic-primary/90 rounded-3xl text-center text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4">{t('library.share.title')}</h3>
                    <button className="px-6 py-3 bg-white text-wic-primary rounded-full font-bold hover:bg-green-50 transition">
                        {t('library.share.btn')}
                    </button>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                     <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] bg-white rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    </div>
  );
};

export default Library;