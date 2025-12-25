
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, Utensils, BookOpen, ChevronRight, Sparkles, 
  MessageSquareQuote, TrendingUp, Building2, Cpu, Stethoscope, Wrench, 
  Languages, Palette, Car, X, MapPin, Users, Calendar, Loader2
} from 'lucide-react';
import StatsSection from '../components/StatsSection';
import HeroSection from '../components/HeroSection';
import { useLanguage } from '../LanguageContext';
import departmentService, { DepartmentVO } from '../services/departmentService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

// 图标映射表：根据后端返回的 icon 字段名匹配前端图标
const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  'Cpu': Cpu,
  'Stethoscope': Stethoscope,
  'TrendingUp': TrendingUp,
  'Palette': Palette,
  'Building2': Building2,
  'Languages': Languages,
  'Wrench': Wrench,
  'Car': Car,
};

// 获取图标组件
const getIconComponent = (iconName: string): React.ComponentType<{ size?: number }> => {
  return iconMap[iconName] || Cpu; // 默认返回 Cpu 图标
};

// 硬编码的学部数据（作为后备数据）
const fallbackDepartmentsData = [
  { 
    id: 1,
    code: 'dept-1',
    nameZh: "信息工程学部", 
    nameEn: "Information Engineering", 
    icon: "Cpu",
    onlineCount: 428,
    hotMajorZh: "软件工程",
    hotMajorEn: "Software Engineering",
    counselors: [{id: 1, name: "张伟", avatar: "", title: ""}, {id: 2, name: "李娜", avatar: "", title: ""}, {id: 3, name: "王强", avatar: "", title: ""}],
    location: "实验楼 B-402",
    descriptionZh: "拥抱数字化未来，培养全栈开发与人工智能领域的顶尖人才。",
    descriptionEn: "Embrace the digital future, nurturing top talents in full-stack development and AI.",
    sortOrder: 1
  },
  { 
    id: 2,
    code: 'dept-2',
    nameZh: "医学部", 
    nameEn: "Medicine", 
    icon: "Stethoscope",
    onlineCount: 356,
    hotMajorZh: "护理学",
    hotMajorEn: "Nursing",
    counselors: [{id: 4, name: "陈医生", avatar: "", title: ""}, {id: 5, name: "刘护士长", avatar: "", title: ""}],
    location: "医学中心 3F",
    descriptionZh: "仁心仁术，专注于现代医疗护理技术与生命科学研究。",
    descriptionEn: "With compassion and skill, focusing on modern healthcare and life sciences.",
    sortOrder: 2
  },
  { 
    id: 3,
    code: 'dept-3',
    nameZh: "经济与管理学部", 
    nameEn: "Economics & Management", 
    icon: "TrendingUp",
    onlineCount: 210,
    hotMajorZh: "会计学",
    hotMajorEn: "Accounting",
    counselors: [{id: 6, name: "赵敏", avatar: "", title: ""}, {id: 7, name: "周杰", avatar: "", title: ""}],
    location: "文科楼 A-201",
    descriptionZh: "培养具有全球视野的商业领袖与金融精英。",
    descriptionEn: "Cultivating business leaders and financial elites with global vision.",
    sortOrder: 3
  },
  { 
    id: 4,
    code: 'dept-4',
    nameZh: "艺术与设计学部", 
    nameEn: "Art & Design", 
    icon: "Palette",
    onlineCount: 189,
    hotMajorZh: "环境设计",
    hotMajorEn: "Environmental Design",
    counselors: [{id: 8, name: "Wu Art", avatar: "", title: ""}, {id: 9, name: "Teacher Li", avatar: "", title: ""}],
    location: "创意大楼 Studio X",
    descriptionZh: "激发无限创意，用设计美学重塑生活空间。",
    descriptionEn: "Inspire unlimited creativity, reshaping life spaces with design aesthetics.",
    sortOrder: 4
  },
  { 
    id: 5,
    code: 'dept-5',
    nameZh: "城建学部", 
    nameEn: "Urban Construction", 
    icon: "Building2",
    onlineCount: 145,
    hotMajorZh: "土木工程",
    hotMajorEn: "Civil Engineering",
    counselors: [{id: 10, name: "孙工", avatar: "", title: ""}, {id: 11, name: "钱工", avatar: "", title: ""}],
    location: "建工楼 505",
    descriptionZh: "建设智慧城市，打造绿色可持续的居住环境。",
    descriptionEn: "Building smart cities, creating green and sustainable living environments.",
    sortOrder: 5
  },
  { 
    id: 6,
    code: 'dept-6',
    nameZh: "外语学部", 
    nameEn: "Foreign Languages", 
    icon: "Languages",
    onlineCount: 132,
    hotMajorZh: "英语翻译",
    hotMajorEn: "English Translation",
    counselors: [{id: 12, name: "Ms. Smith", avatar: "", title: ""}, {id: 13, name: "Mr. Brown", avatar: "", title: ""}],
    location: "国际交流中心",
    descriptionZh: "连接世界的桥梁，培养跨文化交流的高级人才。",
    descriptionEn: "A bridge connecting the world, nurturing advanced talents in cross-cultural communication.",
    sortOrder: 6
  },
  { 
    id: 7,
    code: 'dept-7',
    nameZh: "机电工程学部", 
    nameEn: "Mech & Elec Eng", 
    icon: "Wrench",
    onlineCount: 167,
    hotMajorZh: "机械自动化",
    hotMajorEn: "Mechanical Automation",
    counselors: [{id: 14, name: "郑工", avatar: "", title: ""}],
    location: "实训中心 C区",
    descriptionZh: "大国工匠的摇篮，专注于智能制造与自动化控制。",
    descriptionEn: "The cradle of great craftsmen, focusing on intelligent manufacturing and automation.",
    sortOrder: 7
  },
  { 
    id: 8,
    code: 'dept-8',
    nameZh: "汽车与电子工程", 
    nameEn: "Auto & Electronic Eng", 
    icon: "Car",
    onlineCount: 98,
    hotMajorZh: "车辆工程",
    hotMajorEn: "Vehicle Engineering",
    counselors: [{id: 15, name: "马斯克(客座)", avatar: "", title: ""}],
    location: "汽车实验中心",
    descriptionZh: "探索新能源与自动驾驶技术的前沿领域。",
    descriptionEn: "Exploring the frontiers of new energy and autonomous driving technology.",
    sortOrder: 8
  }
];

const BentoCard: React.FC<{
  to: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
}> = ({ to, className, children, delay = 0 }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.98 }}
    className={`relative group overflow-hidden rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 ${className}`}
  >
    <Link to={to} className="block w-full h-full p-6">
      {children}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full p-2 text-wic-primary dark:text-wic-accent shadow-sm">
            <ChevronRight size={16} />
        </div>
      </div>
    </Link>
  </motion.div>
);

const Home: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [departments, setDepartments] = useState<DepartmentVO[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll(); // Use global window scroll for the stats parallax
  const { t, language } = useLanguage();

  // Stats Card Parallax Effect
  // Slightly adjusted values for better mobile/desktop sync
  const statsY = useTransform(scrollY, [0, 800], [200, -50]); 
  const statsOpacity = useTransform(scrollY, [0, 100, 400], [0, 0, 1]);

  // 从后端获取学部数据
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const result = await departmentService.getAllDepartments();
        if (result.code === 200 && result.data) {
          setDepartments(result.data);
        }
      } catch (error) {
        console.error('获取学部列表失败:', error);
        // 使用后备数据
        setDepartments(fallbackDepartmentsData);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Handle body scroll locking when modal is open
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedId]);

  return (
    <div className="w-full">
      {/* Refactored Hero Section */}
      <HeroSection />
      
      {/* Animated Stats Banner with Parallax */}
      <motion.div 
         style={{ y: statsY, opacity: statsOpacity }}
         className="relative z-30 max-w-7xl mx-auto px-4 -mt-32 mb-20 pointer-events-none" 
      >
         <div className="pointer-events-auto">
            <StatsSection />
         </div>
      </motion.div>

      {/* Bento Grid Navigation (Services) */}
      <section id="explore" className="py-24 px-4 max-w-7xl mx-auto bg-white dark:bg-transparent relative z-10 transition-colors duration-300">
        <div className="flex items-end justify-between mb-12">
            <div>
                <span className="text-wic-primary dark:text-wic-accent font-bold tracking-wider text-sm uppercase mb-2 block">Our Services</span>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{t('home.services.title')}</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">{t('home.services.subtitle')}</p>
            </div>
            
            <Link to="/seniors" className="hidden md:flex items-center gap-2 text-wic-primary dark:text-wic-accent font-bold hover:underline">
               <span>{t('home.services.seniors')}</span>
               <ChevronRight size={18} />
            </Link>
        </div>

        <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
        >
            {/* Chat - Large Left */}
            <BentoCard to="/chat" className="md:row-span-2 bg-gradient-to-br from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20 dark:hover:from-indigo-900/30 dark:hover:to-blue-900/30">
                <div className="h-full flex flex-col justify-between">
                    <div>
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-200 dark:shadow-none">
                            <MessageCircle size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('home.card.chat.title')}</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('home.card.chat.desc')}</p>
                    </div>
                    <div className="mt-8 space-y-3">
                        {(language === 'zh' ? ['信息工程学部', '医学部', '艺术与设计学部'] : ['Info Tech', 'Medicine', 'Art & Design']).map(dept => (
                            <div key={dept} className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 p-3 rounded-xl backdrop-blur-sm shadow-sm border border-white/50 dark:border-slate-700">
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{dept}</span>
                                <span className="ml-auto text-xs font-medium text-indigo-500 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">{t('home.card.chat.tag')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </BentoCard>

            {/* Food - Top Mid */}
            <BentoCard to="/food" className="bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 dark:from-orange-900/20 dark:to-red-900/20 dark:hover:from-orange-900/30 dark:hover:to-red-900/30">
                <div className="flex items-start justify-between h-full flex-col">
                     <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-orange-200 dark:shadow-none">
                        <Utensils size={24} />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('home.card.food.title')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('home.card.food.desc')}</p>
                     </div>
                </div>
            </BentoCard>

            {/* Library - Top Right */}
            <BentoCard to="/library" className="bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30">
                <div className="flex items-start justify-between h-full flex-col">
                     <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-emerald-200 dark:shadow-none">
                        <BookOpen size={24} />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('home.card.library.title')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('home.card.library.desc')}</p>
                     </div>
                </div>
            </BentoCard>

            {/* Gallery - Bottom Wide */}
            <BentoCard to="/gallery" className="md:col-span-2 bg-gray-900 text-white relative group overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://picsum.photos/seed/wicgallery/800/400" alt="Campus" className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="relative z-10 h-full flex flex-col justify-end p-2">
                    <div className="flex items-center gap-2 mb-2">
                         <div className="bg-yellow-400/20 p-1.5 rounded-lg backdrop-blur-sm">
                            <Sparkles className="text-yellow-400" size={20} />
                         </div>
                         <h3 className="text-xl font-bold">{t('home.card.gallery.title')}</h3>
                    </div>
                    <p className="text-gray-300 text-sm max-w-lg">{t('home.card.gallery.desc')}</p>
                </div>
            </BentoCard>
        </motion.div>
        
        {/* Mobile link for Seniors */}
        <div className="mt-6 md:hidden text-center">
             <Link to="/seniors" className="inline-flex items-center gap-2 text-wic-primary font-bold bg-gray-50 dark:bg-gray-800 px-6 py-3 rounded-full">
               <MessageSquareQuote size={18} />
               <span>{t('home.services.seniors')}</span>
            </Link>
        </div>
      </section>

      {/* Departments Section (Expandable Cards) */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 border-y border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('home.depts.title')}</h2>
                  <div className="w-20 h-1 bg-wic-primary dark:bg-wic-accent mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">{t('home.depts.desc')}</p>
              </div>
              
              {/* Grid of Small Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {loading ? (
                    // 加载状态
                    <div className="col-span-full flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-wic-primary" />
                      <span className="ml-2 text-gray-500 dark:text-gray-400">加载学部信息...</span>
                    </div>
                  ) : (
                    departments.map((dept) => {
                      const IconComponent = getIconComponent(dept.icon);
                      return (
                      <motion.div
                        layoutId={`card-container-${dept.id}`}
                        key={dept.id}
                        onClick={() => setSelectedId(dept.id)}
                        className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm hover:shadow-xl cursor-pointer border border-gray-200 dark:border-gray-800 flex flex-col h-full group relative overflow-hidden"
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.3 }}
                      >
                          {/* Header Content */}
                          <motion.div layoutId={`card-content-${dept.id}`} className="flex flex-col h-full">
                              <div className="flex items-center gap-4 mb-4">
                                  <motion.div 
                                    layoutId={`card-icon-${dept.id}`}
                                    className="w-12 h-12 bg-wic-primary/5 dark:bg-wic-primary/20 rounded-2xl flex items-center justify-center text-wic-primary dark:text-wic-accent shrink-0"
                                  >
                                      <IconComponent size={24} />
                                  </motion.div>
                                  <div className="flex-1 min-w-0">
                                      <motion.h3 layoutId={`card-title-${dept.id}`} className="font-bold text-gray-900 dark:text-white truncate text-lg">
                                        {language === 'zh' ? dept.nameZh : dept.nameEn}
                                      </motion.h3>
                                  </div>
                              </div>
                              
                              <motion.p 
                                layoutId={`card-desc-${dept.id}`}
                                className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4"
                              >
                                {language === 'zh' ? dept.descriptionZh : dept.descriptionEn}
                              </motion.p>

                              {/* Dashboard Footer (Small Card) */}
                              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                      <span className="relative flex h-2.5 w-2.5">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                      </span>
                                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tabular-nums">{dept.onlineCount} Online</span>
                                  </div>
                                  <div className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase rounded-md tracking-wider">
                                      {language === 'zh' ? dept.hotMajorZh : dept.hotMajorEn}
                                  </div>
                              </div>
                          </motion.div>
                      </motion.div>
                    );})
                  )}
              </div>

              {/* Expanded Modal */}
              <AnimatePresence>
                  {selectedId && (() => {
                      const selectedDept = departments.find(d => d.id === selectedId);
                      if (!selectedDept) return null;
                      const SelectedIcon = getIconComponent(selectedDept.icon);
                      return (
                          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                              {/* Backdrop */}
                              <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  onClick={() => setSelectedId(null)}
                                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                              />
                              
                              {/* Expanded Card */}
                              <motion.div
                                  layoutId={`card-container-${selectedId}`}
                                  className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden z-20 flex flex-col max-h-[90vh]"
                                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              >
                                  {/* Close Button */}
                                  <button 
                                      onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                                      className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors z-20"
                                  >
                                      <X size={20} />
                                  </button>

                                  <div className="p-8 overflow-y-auto custom-scrollbar">
                                      {/* Header Content Match */}
                                      <motion.div layoutId={`card-content-${selectedId}`} className="flex flex-col">
                                          <div className="flex items-center gap-5 mb-6">
                                              <motion.div 
                                                layoutId={`card-icon-${selectedId}`}
                                                className="w-16 h-16 bg-wic-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-wic-primary/30 shrink-0"
                                              >
                                                  <SelectedIcon size={32} />
                                              </motion.div>
                                              
                                              <div>
                                                  <motion.h2 layoutId={`card-title-${selectedId}`} className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                                    {language === 'zh' ? selectedDept.nameZh : selectedDept.nameEn}
                                                  </motion.h2>
                                                  <motion.div 
                                                    initial={{ opacity: 0 }} 
                                                    animate={{ opacity: 1 }} 
                                                    transition={{ delay: 0.1 }}
                                                    className="flex items-center gap-2 mt-2"
                                                  >
                                                     <span className="relative flex h-2.5 w-2.5">
                                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                                      </span>
                                                      <span className="text-sm font-medium text-green-600 dark:text-green-400">{selectedDept.onlineCount} Students Online</span>
                                                  </motion.div>
                                              </div>
                                          </div>
                                          
                                          {/* Description moves here to match layout flow */}
                                          <motion.p 
                                            layoutId={`card-desc-${selectedId}`}
                                            className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-8"
                                          >
                                              {language === 'zh' ? selectedDept.descriptionZh : selectedDept.descriptionEn}
                                          </motion.p>
                                      </motion.div>

                                      {/* Expanded Content (Fade In Only) */}
                                      <motion.div 
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.2, duration: 0.4 }}
                                          className="space-y-6"
                                      >
                                          {/* Info Grid */}
                                          <div className="grid grid-cols-2 gap-4">
                                              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">
                                                      <MapPin size={14} /> Location
                                                  </div>
                                                  <div className="font-bold text-gray-900 dark:text-white text-sm md:text-base">{selectedDept.location}</div>
                                              </div>
                                              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">
                                                      <TrendingUp size={14} /> Hot Major
                                                  </div>
                                                  <div className="font-bold text-gray-900 dark:text-white text-sm md:text-base">{language === 'zh' ? selectedDept.hotMajorZh : selectedDept.hotMajorEn}</div>
                                              </div>
                                          </div>

                                          {/* Counselors */}
                                          <div className="pt-2">
                                              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                  <Users size={16} className="text-wic-primary dark:text-wic-accent"/> 
                                                  Counselor Team
                                              </h4>
                                              <div className="flex flex-wrap gap-3">
                                                  {selectedDept.counselors?.map((counselor, i) => (
                                                      <div key={counselor.id || i} className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 pr-4 rounded-full p-1.5 shadow-sm">
                                                          {counselor.avatar ? (
                                                            <img src={counselor.avatar} alt={counselor.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-700" />
                                                          ) : (
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-300 ring-2 ring-white dark:ring-gray-700">
                                                                {counselor.name[0]}
                                                            </div>
                                                          )}
                                                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{counselor.name}</span>
                                                      </div>
                                                  ))}
                                              </div>
                                          </div>

                                          {/* Actions */}
                                          <div className="grid grid-cols-2 gap-4 pt-6 mt-4 border-t border-gray-100 dark:border-gray-800">
                                              <Link 
                                                to={`/chat?dept=${selectedDept.id}`}
                                                className="flex items-center justify-center gap-2 py-4 rounded-xl bg-wic-primary text-white font-bold hover:bg-wic-secondary transition-all shadow-lg shadow-wic-primary/20 active:scale-95"
                                              >
                                                  <MessageCircle size={18} />
                                                  Enter Chat Group
                                              </Link>
                                              <button className="flex items-center justify-center gap-2 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95">
                                                  <Calendar size={18} />
                                                  View Schedule
                                              </button>
                                          </div>
                                      </motion.div>
                                  </div>
                              </motion.div>
                          </div>
                      );
                  })()}
              </AnimatePresence>
          </div>
      </section>
    </div>
  );
};

export default Home;
