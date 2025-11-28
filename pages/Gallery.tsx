import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, MapPin } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const images = [
  { id: 1, src: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800", title: "Main Library", height: "h-64" },
  { id: 2, src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800", title: "Student Center", height: "h-96" },
  { id: 3, src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800", title: "Graduation Day", height: "h-64" },
  { id: 4, src: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=800", title: "Autumn Campus", height: "h-80" },
  { id: 5, src: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=800", title: "Laboratory", height: "h-64" },
  { id: 6, src: "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?q=80&w=800", title: "Sports Field", height: "h-80" },
  { id: 7, src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800", title: "Study Group", height: "h-72" },
  { id: 8, src: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=800", title: "Sunset at East Lake", height: "h-64" },
];

const Gallery: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
       <div className="max-w-7xl mx-auto">
         <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-gray-800 pb-8">
            <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                    <ImageIcon className="text-wic-accent" />
                    {t('gallery.title')}
                </h1>
                <p className="text-gray-400">{t('gallery.subtitle')}</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-4 text-sm font-mono text-gray-500">
                <span>{t('gallery.students')}</span>
                <span>•</span>
                <span>{t('gallery.stats')}</span>
            </div>
         </div>

         <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {images.map((img, idx) => (
                <motion.div
                    key={img.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative group overflow-hidden rounded-lg break-inside-avoid"
                >
                    <img 
                        src={img.src} 
                        alt={img.title} 
                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <h3 className="text-lg font-bold text-white">{img.title}</h3>
                        <div className="flex items-center gap-1 text-wic-accent text-xs mt-1">
                            <MapPin size={12} />
                            <span>Wuhan City University</span>
                        </div>
                    </div>
                </motion.div>
            ))}
         </div>
       </div>
    </div>
  );
};

export default Gallery;