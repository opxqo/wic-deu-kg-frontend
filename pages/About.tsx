
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, MapPin, GraduationCap, FileText, Lightbulb, Building2, FlaskConical, Library } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import CampusMap from '../components/CampusMap';

const About: React.FC = () => {
  const { t } = useLanguage();

  const detailedStats = [
    { icon: <MapPin size={24} />, value: "1763", label: t('stats.area'), sub: t('stats.area.sub') },
    { icon: <Building2 size={24} />, value: "55.17", label: t('stats.building'), sub: t('stats.building.sub') },
    { icon: <FlaskConical size={24} />, value: "9636", label: t('stats.equipment'), sub: t('stats.equipment.sub') },
    { icon: <BookOpen size={24} />, value: "100+", label: t('stats.resources'), sub: t('stats.resources.sub') },
    { icon: <Library size={24} />, value: "160+", label: t('stats.paper'), sub: t('stats.paper.sub') },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* Header */}
      <div className="bg-wic-bg dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-wic-primary dark:text-wic-accent mb-6">{t('about.title')}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 italic font-serif">{t('about.motto')}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Table of Contents */}
        <div className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-24 space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contents</p>
            {[t('about.toc.intro'), t('about.toc.faculty'), t('about.toc.research'), t('about.toc.location')].map((item, idx) => (
              <a 
                key={idx} 
                href={`#section-${idx}`} 
                className="block text-gray-600 dark:text-gray-400 hover:text-wic-primary dark:hover:text-wic-accent hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-20">
          
          {/* Section 1: Intro */}
          <section id="section-0">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-wic-primary dark:text-wic-accent rounded-lg">
                    <BookOpen size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('about.toc.intro')}</h2>
            </div>
            <div className="prose prose-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-10">
              <p>{t('about.intro.text1')}</p>
              <p className="mt-4">{t('about.intro.text2')}</p>
            </div>
            
            {/* New Detailed Stats Card matching screenshot */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-0">
                {detailedStats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center lg:border-r border-gray-100 dark:border-gray-800 last:border-r-0">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-wic-primary dark:text-wic-accent rounded-full flex items-center justify-center mb-3">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.label}
                      <div className="text-xs text-gray-400 dark:text-gray-500 font-normal mt-0.5">{stat.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2: Faculty */}
          <section id="section-1">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    <GraduationCap size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('about.toc.faculty')}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
                {t('about.faculty.desc')}
            </p>
            
            <div className="space-y-8">
                <div>
                    <div className="flex justify-between text-sm font-bold mb-2 text-gray-700 dark:text-gray-200">
                        <span>{t('about.faculty.master')}</span>
                        <span className="text-wic-primary dark:text-wic-accent">83.27%</span>
                    </div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '83.27%' }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-wic-primary rounded-full" 
                        />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm font-bold mb-2 text-gray-700 dark:text-gray-200">
                        <span>{t('about.faculty.senior')}</span>
                        <span className="text-blue-500 dark:text-blue-400">37.63%</span>
                    </div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '37.63%' }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                            className="h-full bg-blue-500 rounded-full" 
                        />
                    </div>
                </div>
            </div>
          </section>

          {/* Section 3: Research */}
          <section id="section-2">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                    <Award size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('about.toc.research')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg"><Award size={20}/></div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">2</span>
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">{t('about.research.course')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('about.research.course.desc')}</p>
                </div>

                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg"><FileText size={20}/></div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">272</span>
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">{t('about.research.paper')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('about.research.paper.desc')}</p>
                </div>

                <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 md:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg"><Lightbulb size={20}/></div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">30</span>
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">{t('about.research.patent')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('about.research.patent.desc')}</p>
                </div>
            </div>
          </section>

          {/* Section 4: Location */}
          <section id="section-3">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                    <MapPin size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('about.toc.location')}</h2>
            </div>
            
            {/* Interactive Campus Map */}
            <CampusMap />
            
          </section>

        </div>
      </div>
    </div>
  );
};

export default About;
