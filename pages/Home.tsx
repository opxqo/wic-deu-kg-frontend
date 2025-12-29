
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronRight, TrendingUp, Building2, Cpu, Stethoscope, Wrench,
  Languages, Palette, Car, X, MapPin, Users, Calendar, Loader2, MessageCircle
} from 'lucide-react';
import StatsSection from '../components/StatsSection';
import HeroSection from '../components/HeroSection';
import { useLanguage } from '../LanguageContext';
import departmentService, { DepartmentVO } from '../services/departmentService';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { articleService } from "@/services/articleService";
import { Article } from "@/types/article";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

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

const getIconComponent = (iconName: string): React.ComponentType<{ size?: number }> => {
  return iconMap[iconName] || Cpu;
};

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
    counselors: [{ id: 1, name: "张伟", avatar: "", title: "" }, { id: 2, name: "李娜", avatar: "", title: "" }, { id: 3, name: "王强", avatar: "", title: "" }],
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
    counselors: [{ id: 4, name: "陈医生", avatar: "", title: "" }, { id: 5, name: "刘护士长", avatar: "", title: "" }],
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
    counselors: [{ id: 6, name: "赵敏", avatar: "", title: "" }, { id: 7, name: "周杰", avatar: "", title: "" }],
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
    counselors: [{ id: 8, name: "Wu Art", avatar: "", title: "" }, { id: 9, name: "Teacher Li", avatar: "", title: "" }],
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
    counselors: [{ id: 10, name: "孙工", avatar: "", title: "" }, { id: 11, name: "钱工", avatar: "", title: "" }],
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
    counselors: [{ id: 12, name: "Ms. Smith", avatar: "", title: "" }, { id: 13, name: "Mr. Brown", avatar: "", title: "" }],
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
    counselors: [{ id: 14, name: "郑工", avatar: "", title: "" }],
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
    counselors: [{ id: 15, name: "马斯克(客座)", avatar: "", title: "" }],
    location: "汽车实验中心",
    descriptionZh: "探索新能源与自动驾驶技术的前沿领域。",
    descriptionEn: "Exploring the frontiers of new energy and autonomous driving technology.",
    sortOrder: 8
  }
];

const Home: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [departments, setDepartments] = useState<DepartmentVO[]>([]);
  const [loading, setLoading] = useState(true);

  // Article State
  const [articles, setArticles] = useState<Article[]>([]);

  const { scrollY } = useScroll();
  const { t, language } = useLanguage();

  // Load Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const result = await departmentService.getAllDepartments();
        if ((result.code === 0 || result.code === 200) && result.data) {
          setDepartments(result.data);
        }
      } catch (error) {
        console.error('获取学部列表失败:', error);
        setDepartments(fallbackDepartmentsData);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // Load Articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await articleService.getArticles(1, 6); // Fetch 6 items for carousel
        // Relaxed check: Accept response if data.records exists, even if code is missing/undefined/200
        if (response.data && response.data.records) {
          setArticles(response.data.records);
        } else if (response.code === 0 && response.data && response.data.records) {
          // Fallback to strict check just in case
          setArticles(response.data.records);
        }
      } catch (error) {
        console.error("Failed to load home articles", error);
      }
    };
    fetchArticles();
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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('zh-CN');
    } catch (e) {
      return dateString;
    }
  };

  // Stats Card Parallax Effect
  const statsY = useTransform(scrollY, [0, 800], [200, -50]);
  const statsOpacity = useTransform(scrollY, [0, 100, 400], [0, 0, 1]);

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

      {/* Welcome Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                欢迎来到武汉城市学院
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                武汉城市学院（原武汉科技大学城市学院）是经教育部批准设置的全日制普通本科高等学校。学校现有武汉、红安两个校区，校园占地2041.94亩。
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                学校始终坚守“为党育人、为国育才”初心，秉承“励志修德，勤学创新”校训，遵循“育人为本，质量立校，特色发展，争创一流”办学理念，致力于培养高素质应用型人才。
              </p>
              <Link to="https://www.wic.edu.cn/list_2.html" target="_blank" className="inline-flex items-center text-wic-primary font-semibold hover:underline">
                了解更多关于我们的信息 <ChevronRight size={18} />
              </Link>
            </div>
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop"
                alt="Campus Sailboat"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">最新动态</h2>
              <p className="text-gray-500 dark:text-gray-400">关注学院发展的每一个精彩瞬间</p>
            </div>
            <Link to="/news" className="hidden md:flex items-center text-wic-primary font-semibold hover:underline">
              查看所有新闻 <ChevronRight size={18} />
            </Link>
          </div>

          <div className="w-full relative px-4 md:px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 5000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <CarouselItem key={article.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className="p-1 h-full">
                        <Card className="hover:shadow-lg transition-all border-none shadow-sm overflow-hidden group cursor-pointer h-full flex flex-col" onClick={() => window.location.hash = `#/article/${article.id}`}>
                          <div className="h-48 overflow-hidden relative shrink-0">
                            <img
                              src={article.coverImage || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"; // Fallback image
                              }}
                            />
                            {article.tags && article.tags.length > 0 && (
                              <div className="absolute top-4 left-4 bg-wic-primary text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                                {article.tags[0]}
                              </div>
                            )}
                          </div>
                          <CardContent className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-wic-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                              {article.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                              {article.subtitle || "点击查看详情..."}
                            </p>
                            <div className="text-gray-400 text-xs flex items-center mt-auto">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(article.publishDate || article.createdAt)}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  // Fallback Loading Skeleton (Simulated)
                  [1, 2, 3].map((i) => (
                    <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className="p-1 h-full">
                        <div className="rounded-xl border bg-card text-card-foreground shadow h-[380px] flex flex-col p-6 space-y-4">
                          <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse" />
                          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-full" />
                          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/2" />
                        </div>
                      </div>
                    </CarouselItem>
                  ))
                )}

              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="mt-8 md:hidden text-center">
            <Link to="/news" className="text-wic-primary font-semibold hover:underline">
              查看所有新闻 &rarr;
            </Link>
          </div>
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

          {/* Grid of Shadcn Cards with Shared Layout Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-wic-primary" />
                <span className="ml-2 text-gray-500 dark:text-gray-400">加载学部信息...</span>
              </div>
            ) : (
              departments.map((dept) => {
                const IconComponent = getIconComponent(dept.icon);
                return (
                  <motion.div
                    layoutId={`card-${dept.id}`}
                    key={dept.id}
                    onClick={() => setSelectedId(dept.id)}
                    className="cursor-pointer group"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="h-full overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-4">
                          <motion.div
                            layoutId={`icon-${dept.id}`}
                            className="w-12 h-12 bg-wic-primary/5 dark:bg-wic-primary/20 rounded-2xl flex items-center justify-center text-wic-primary dark:text-wic-accent shrink-0 group-hover:bg-wic-primary group-hover:text-white transition-colors duration-300"
                          >
                            <IconComponent size={24} />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <motion.h3 layoutId={`title-${dept.id}`} className="font-bold text-gray-900 dark:text-white truncate text-lg">
                              {language === 'zh' ? dept.nameZh : dept.nameEn}
                            </motion.h3>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                          {language === 'zh' ? dept.descriptionZh : dept.descriptionEn}
                        </p>

                        {/* Footer */}
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tabular-nums">{dept.onlineCount} Online</span>
                          </div>
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40">
                            {language === 'zh' ? dept.hotMajorZh : dept.hotMajorEn}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Enhanced AnimatePresence Modal (Shared Element Transition) */}
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

                  {/* Expanded Card Container */}
                  <motion.div
                    layoutId={`card-${selectedId}`}
                    className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden z-20 flex flex-col md:flex-row h-[85vh] md:h-auto md:max-h-[85vh]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {/* Close Button interaction wrapper */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                      className="absolute top-4 right-4 p-2 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors z-30 backdrop-blur-sm"
                    >
                      <X size={20} />
                    </button>

                    {/* Left Side: Icon & Basic Info */}
                    <div className="w-full md:w-1/3 bg-slate-50 dark:bg-slate-950/50 p-8 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800">
                      <motion.div
                        layoutId={`icon-${selectedId}`}
                        className="w-24 h-24 bg-wic-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-wic-primary/20 mb-6"
                      >
                        <SelectedIcon size={48} />
                      </motion.div>

                      <motion.h2 layoutId={`title-${selectedId}`} className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {language === 'zh' ? selectedDept.nameZh : selectedDept.nameEn}
                      </motion.h2>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-2 mb-6"
                      >
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">{selectedDept.onlineCount} Students Online</span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full space-y-3 mt-auto"
                      >
                        <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 w-full text-left">
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                            <MapPin size={12} /> Location
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-gray-200 text-sm truncate">{selectedDept.location}</div>
                        </div>
                        <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 w-full text-left">
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                            <TrendingUp size={12} /> Hot Major
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-gray-200 text-sm truncate">{language === 'zh' ? selectedDept.hotMajorZh : selectedDept.hotMajorEn}</div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Right Side: Details & Actions */}
                    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-900">
                      <div className="p-8 flex-1 min-h-0 relative">
                        <ScrollArea className="h-full pr-4">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-8">
                              {language === 'zh' ? selectedDept.descriptionZh : selectedDept.descriptionEn}
                            </p>

                            {/* Counselors */}
                            <div className="pt-2">
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Users size={16} className="text-wic-primary dark:text-wic-accent" />
                                Counselor Team
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                {selectedDept.counselors?.map((counselor, i) => (
                                  <div key={counselor.id || i} className="flex items-center gap-3 bg-slate-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 pr-4 rounded-full p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-gray-800">
                                    <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-700">
                                      <AvatarImage src={counselor.avatar} alt={counselor.name} />
                                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-xs font-bold text-blue-600 dark:text-blue-300">
                                        {counselor.name[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{counselor.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        </ScrollArea>
                      </div>

                      {/* Footer Actions */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 md:p-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4"
                      >
                        <Link
                          to={`/chat?dept=${selectedDept.id}`}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-wic-primary text-white font-bold hover:bg-wic-secondary transition-all shadow-lg shadow-wic-primary/20 active:scale-95"
                        >
                          <MessageCircle size={18} />
                          Enter Chat Group
                        </Link>
                        <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95">
                          <Calendar size={18} />
                          View Schedule
                        </button>
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
