
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowDown, MessageCircle, Utensils, BookOpen, MapPin } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const HeroSection: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });
  const { t } = useLanguage();

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={targetRef} className="relative min-h-[100dvh] w-full flex flex-col overflow-hidden -mt-16">
      {/* Background Image Layer */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        {/* Mobile Gradient: Strong bottom fade for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent md:bg-gradient-to-b md:from-black/60 md:via-black/30 md:to-black/70 z-10" />
        <img 
            src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2886&auto=format&fit=crop" 
            alt="WIC Campus" 
            className="w-full h-full object-cover scale-110" 
        />
      </motion.div>

      {/* Content Layer */}
      <div className="relative z-20 flex-1 flex flex-col justify-end md:justify-center items-start md:items-center px-6 pb-24 md:pb-0 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full"
        >
           {/* 1. Pill Badge */}
           <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/30 bg-white/10 text-white/90 text-xs md:text-sm font-medium backdrop-blur-md mb-6 md:mb-8 shadow-lg">
              <Sparkles size={12} className="text-yellow-300 md:w-3.5 md:h-3.5" />
              <span>{t('home.hero.badge')}</span>
           </div>
           
           {/* 2. Typography: Stacked on Mobile, Centered on Desktop */}
           <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold text-white mb-4 md:mb-6 leading-tight tracking-tight drop-shadow-2xl md:text-center">
              <span className="block font-serif tracking-widest mb-1 md:mb-4">{t('home.hero.title1')}</span>
              <span className="block text-3xl sm:text-4xl md:text-3xl font-light text-wic-accent tracking-widest uppercase opacity-90 md:mt-0">
                  {t('home.hero.title2')}
              </span>
           </h1>
           
           <p className="text-sm sm:text-base md:text-xl text-gray-200 font-light mb-8 md:mb-12 max-w-sm md:max-w-3xl leading-relaxed drop-shadow-md md:text-center md:mx-auto text-left">
              {t('home.hero.desc')}
           </p>
           
           {/* 3. NEW: Mobile Quick Access Grid (The "App" Feel) */}
           <div className="grid grid-cols-4 gap-4 w-full md:hidden mt-2">
              <Link to="/chat" className="flex flex-col items-center gap-2 group">
                 <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-lg group-active:scale-95 transition-transform">
                    <MessageCircle size={24} className="text-blue-300" />
                 </div>
                 <span className="text-xs text-white/90 font-medium tracking-wide">{t('nav.chat')}</span>
              </Link>
              
              <Link to="/food" className="flex flex-col items-center gap-2 group">
                 <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-lg group-active:scale-95 transition-transform">
                    <Utensils size={24} className="text-orange-300" />
                 </div>
                 <span className="text-xs text-white/90 font-medium tracking-wide">{t('nav.food')}</span>
              </Link>

              <Link to="/library" className="flex flex-col items-center gap-2 group">
                 <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-lg group-active:scale-95 transition-transform">
                    <BookOpen size={24} className="text-emerald-300" />
                 </div>
                 <span className="text-xs text-white/90 font-medium tracking-wide">{t('nav.library')}</span>
              </Link>

              <Link to="/about" className="flex flex-col items-center gap-2 group">
                 <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-lg group-active:scale-95 transition-transform">
                    <MapPin size={24} className="text-red-300" />
                 </div>
                 <span className="text-xs text-white/90 font-medium tracking-wide">{t('about.toc.location')}</span>
              </Link>
           </div>

           {/* 4. Desktop Buttons (Hidden on Mobile) */}
           <div className="hidden md:flex flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-wic-primary hover:bg-wic-secondary text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-wic-primary/50 active:scale-95 flex items-center gap-2"
              >
                  {t('home.hero.explore')}
                  <ArrowDown size={20} />
              </button>
              <Link to="/about" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white rounded-full font-bold text-lg transition-all active:scale-95">
                  {t('home.hero.about')}
              </Link>
           </div>
        </motion.div>
      </div>

      {/* Scroll Indicator (Desktop Only) */}
      <motion.div 
          style={{ opacity }}
          className="hidden md:block absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 text-white/50 animate-bounce"
      >
          <ArrowDown size={24} />
      </motion.div>
    </section>
  );
};

export default HeroSection;
