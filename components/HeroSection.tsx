
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
            src="https://r2.wic.edu.kg/images/cover.avif" 
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
           <div className="flex w-fit items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/30 bg-white/10 text-white/90 text-xs md:text-sm font-medium backdrop-blur-md mb-6 md:mb-8 shadow-lg mx-0 md:mx-auto">
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
           <div className="hidden md:flex flex-col gap-6 justify-center items-center">
              <div className="flex flex-row gap-6">
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

              {/* 3D Map Button - Premium Modern Style with Meteor Effect */}
              <a 
                href="http://localhost:3001/campus" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-5 py-2 overflow-hidden rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:border-white/20 hover:shadow-blue-500/20 active:scale-95"
              >
                {/* Subtle flowing background - Deep Ocean/Map colors */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 via-blue-900/60 to-emerald-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-gradient-slow"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shine" />

                {/* Meteor Effect (Visible on Hover) - Corrected Direction & Head */}
                <div className="absolute inset-0 overflow-hidden rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {/* Meteor 1: Fast, bright, top-ish */}
                    <div className="absolute top-[30%] left-[-100%] w-24 h-[1px] bg-gradient-to-r from-transparent via-blue-100 to-white animate-meteor-pass-1">
                        {/* Glowing Head */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]"></div>
                    </div>
                    
                    {/* Meteor 2: Slower, subtle, bottom-ish */}
                    <div className="absolute top-[70%] left-[-100%] w-16 h-[1px] bg-gradient-to-r from-transparent via-emerald-100/50 to-emerald-50 animate-meteor-pass-2">
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1.5px] h-[1.5px] bg-emerald-100 rounded-full shadow-[0_0_6px_1px_rgba(167,243,208,0.6)]"></div>
                    </div>
                </div>

                <div className="relative flex items-center gap-2.5">
                  <span className="font-medium text-xs tracking-[0.15em] uppercase text-white/90 group-hover:text-white transition-colors drop-shadow-sm">3D Campus Map</span>
                  <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors border border-white/10 shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                    <MapPin size={10} className="text-emerald-300 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                  </div>
                </div>
              </a>
              <style>{`
                @keyframes gradient-slow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-slow {
                    background-size: 200% 200%;
                    animation: gradient-slow 6s ease infinite;
                }
                @keyframes shine {
                    0% { transform: translateX(-100%) skewX(-12deg); }
                    100% { transform: translateX(200%) skewX(-12deg); }
                }
                .group:hover .animate-shine {
                    animation: shine 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    animation-delay: 0.5s;
                }
                /* Corrected Meteor Animation: Left to Right */
                @keyframes meteor-pass {
                    0% { transform: translateX(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateX(400px); opacity: 0; }
                }
                .animate-meteor-pass-1 {
                    animation: meteor-pass 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    animation-delay: 0.2s;
                }
                .animate-meteor-pass-2 {
                    animation: meteor-pass 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    animation-delay: 1.5s;
                }
              `}</style>
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
