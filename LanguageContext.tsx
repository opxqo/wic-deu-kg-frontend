

import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  zh: {
    // Nav
    'nav.home': '首页',
    'nav.about': '学校概况',
    'nav.chat': '校园社区',
    'nav.food': '食在城院',
    'nav.library': '图书馆',
    'nav.login': '登录',
    'nav.login_register': '登录 / 注册',
    'nav.profile': '个人中心',
    
    // Footer
    'footer.contact': '联系我们',
    'footer.address': '武汉市东湖生态旅游风景管理区黄家大湾1号',
    'footer.quickLinks': '快速链接',
    'footer.academic': '教务系统',
    'footer.admissions': '招生网',
    'footer.employment': '就业指导',
    'footer.rights': '版权所有',
    'footer.designed': '设计制作',
    'footer.motto': '励志修德，勤学创新。\n育人为本、质量立校、特色发展、争创一流。',
    
    // Home
    'home.hero.badge': '武汉城市学院 | City University of Wuhan',
    'home.hero.title1': '励志修德，勤学创新',
    'home.hero.title2': '育人为本 · 质量立校',
    'home.hero.desc': '传统与创新交融的现代化校园，赋能21,000+名学子共创未来。',
    'home.hero.explore': '探索校园',
    'home.hero.about': '学校概况',
    'home.services.title': '智慧校园服务',
    'home.services.subtitle': '让校园生活更简单。',
    'home.services.seniors': '查看学长寄语',
    'home.card.chat.title': '校园社区',
    'home.card.chat.desc': '连接各个学部的实时互动平台。在这里找到你的组织，与同学和老师无缝交流。',
    'home.card.chat.tag': '热议中',
    'home.card.food.title': '食在城院',
    'home.card.food.desc': '二食堂的麻辣烫，还是商业街的奶茶？',
    'home.card.library.title': '图书馆心得',
    'home.card.library.desc': '145万册馆藏，发现你的下一本好书。',
    'home.card.gallery.title': '光影城院',
    'home.card.gallery.desc': '东湖之畔，红安山下。用镜头记录最美的城院时光。',
    'home.depts.title': '学科与学部',
    'home.depts.desc': '11 个教学单位，41 个本科专业，构建多元化人才培养体系',

    // Stats
    'stats.students': '在校生',
    'stats.faculties': '教学单位',
    'stats.majors': '本科专业',
    'stats.books': '图书馆藏',
    'stats.students.sub': 'Students',
    'stats.faculties.sub': 'Depts',
    'stats.majors.sub': 'Programs',
    'stats.books.sub': '万册',
    
    // Detailed Stats (About Page)
    'stats.area': '校园占地',
    'stats.area.sub': '(亩)',
    'stats.building': '建筑面积',
    'stats.building.sub': '(万M²)',
    'stats.equipment': '教学设备',
    'stats.equipment.sub': '(万元)',
    'stats.resources': '电子资源',
    'stats.resources.sub': '(万册)',
    'stats.paper': '纸质图书',
    'stats.paper.sub': '(万册)',

    // About
    'about.title': '武汉城市学院',
    'about.motto': '"为党育人、为国育才"',
    'about.toc.intro': '学院简介',
    'about.toc.faculty': '师资力量',
    'about.toc.research': '学术科研',
    'about.toc.location': '校区分布',
    'about.intro.text1': '武汉城市学院于2002年7月成立，前身是武汉科技大学城市学院。2021年2月，经教育部批准，转设为独立设置的普通本科高校。',
    'about.intro.text2': '学校秉承“育人为本、质量立校、特色发展、争创一流”的办学理念，恪守“励志修德，勤学创新”的校训，不断优化专业结构，提升教学质量，致力于培养适应国家经济社会发展需要的高素质应用型人才。',
    'about.faculty.desc': '学校拥有一支师德高尚、业务精湛、结构合理的教师队伍。现有教师总数 1,225 人。',
    'about.faculty.master': '硕士及以上学位教师',
    'about.faculty.senior': '高级职称教师',
    'about.research.course': '国家级一流本科课程',
    'about.research.course.desc': '并在省级一流本科课程中斩获 25 门。',
    'about.research.paper': '高水平学术论文',
    'about.research.paper.desc': '近五年发表，其中 SCI 收录 48 篇。',
    'about.research.patent': '专利授权',
    'about.research.patent.desc': '包含国家发明专利 5 项，实用新型专利 25 项，充分体现了学校在应用技术创新方面的实力。',
    'about.location.name': '东湖校区',
    'about.location.donghu': '东湖校区',
    'about.location.hongan': '红安校区',
    'about.address.hongan': '湖北省黄冈市红安县金山大道18号',

    // Chat
    'chat.dept': '学部列表',
    'chat.search': '搜索...',
    'chat.user': '学生用户',
    'chat.online': '在线',
    'chat.input': '发送消息...',
    'chat.typing': '对方正在输入...',
    'chat.bot_name': '校园助手',
    'chat.welcome_title': '欢迎来到',
    'chat.welcome_desc': '这里是该学部的公共频道。请文明发言，互帮互助。',
    'chat.dept.1': '信息工程学部',
    'chat.dept.2': '医学部',
    'chat.dept.3': '经济与管理学部',
    'chat.dept.4': '艺术与设计学部',
    'chat.dept.5': '外语学部',
    'chat.dept.6': '城建学部',
    'chat.dept.desc.1': '代码、AI 与 IT 技术支持',
    'chat.dept.desc.2': '未来的医生与护士',
    'chat.dept.desc.3': '商业领袖的摇篮',
    'chat.dept.desc.4': '创意与灵感',
    'chat.dept.desc.5': '连接世界的桥梁',
    'chat.dept.desc.6': '建设未来城市',
    
    // Food
    'food.title': '美食指南',
    'food.subtitle': '探索城院周边的绝佳风味。',
    'food.filter.all': '全部',
    'food.filter.big_canteen_1f': '大食堂一楼',
    'food.filter.big_canteen_2f': '大食堂二楼',
    'food.filter.small_canteen': '小食堂',
    'food.filter.front_street': '前街',
    'food.filter.back_street': '后街',
    'food.filter.side_street': '侧街',
    'food.reviews': '条评价',
    'food.avg': '人均',
    'food.no_results': '暂无该区域餐厅信息。',
    'food.comments_list': '精选评论',
    'food.write_review': '写下你的评价...',
    'food.post': '发布',
    'food.likes': '点赞',
    'food.menu': '特色菜品',
    'food.recommend': '推荐',
    'food.back': '返回列表',
    'food.product_reviews': '单品评价',
    'food.no_comments': '暂无评论，快来抢沙发！',

    // Library
    'library.title': '图书馆心得',
    'library.subtitle': '城院人在读什么？发现同学们推荐的好书。',
    'library.share.title': '最近读了一本好书？',
    'library.share.btn': '分享你的心得',

    // Seniors
    'seniors.title': '学长学姐留言',
    'seniors.subtitle': '一届传一届的智慧、建议与秘密。',
    'seniors.btn': '+ 写个留言',

    // Gallery
    'gallery.title': '光影城院',
    'gallery.subtitle': '记录校园里的每一个精彩瞬间。',
    'gallery.stats': '无限回忆',
    'gallery.students': '21,618 Students',

    // Login
    'login.welcome': '欢迎回到 WIC',
    'login.join': '加入我们的社区',
    'login.desc.login': '访问您的个性化仪表板、图书馆资源，并与校园社区建立联系。',
    'login.desc.register': '创建您的学生帐户以解锁校园服务、餐饮指南和同行聊天的完全访问权限。',
    'login.title.login': '学生登录',
    'login.title.register': '创建账户',
    'login.subtitle.login': '请输入您的详细信息。',
    'login.subtitle.register': '填写信息以开始使用。',
    'login.label.name': '全名',
    'login.label.id': '学号 / 邮箱',
    'login.label.password': '密码',
    'login.forgot': '忘记密码？',
    'login.btn.login': '登录',
    'login.btn.register': '创建账户',
    'login.footer.no_account': "还没有账号？",
    'login.footer.has_account': "已有账号？",
    'login.footer.link.register': "立即注册",
    'login.footer.link.login': "点击登录",
    'login.back': "返回首页",
    'login.success': "登录成功！",

    // Profile
    'profile.title': '个人资料',
    'profile.edit': '编辑资料',
    'profile.save': '保存更改',
    'profile.cancel': '取消',
    'profile.logout': '退出登录',
    'profile.stats.reviews': '条评价',
    'profile.stats.likes': '获赞',
    'profile.stats.days': '入校天数',
    'profile.label.name': '姓名',
    'profile.label.id': '学号',
    'profile.label.email': '邮箱',
    'profile.label.dept': '所属学部',
    'profile.label.major': '专业',
    'profile.label.bio': '个人简介',
    'profile.label.bio_placeholder': '写一句话介绍你自己...',
  },
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.chat': 'Community',
    'nav.food': 'Campus Food',
    'nav.library': 'Library',
    'nav.login': 'Login',
    'nav.login_register': 'Login / Register',
    'nav.profile': 'Profile',

    // Footer
    'footer.contact': 'Contact Us',
    'footer.address': 'No. 1 Huangjia Dawan, East Lake Scenic Area, Wuhan',
    'footer.quickLinks': 'Quick Links',
    'footer.academic': 'Academic System',
    'footer.admissions': 'Admissions',
    'footer.employment': 'Career Guidance',
    'footer.rights': 'All rights reserved.',
    'footer.designed': 'Designed with',
    'footer.motto': 'Moral Education, Innovation.\nStudent-oriented, Quality First, Characteristic Development, Striving for First-class.',

    // Home
    'home.hero.badge': 'City University of Wuhan',
    'home.hero.title1': 'Moral Education, Innovation',
    'home.hero.title2': 'Student-oriented · Quality First',
    'home.hero.desc': 'A modern campus where tradition meets innovation. Empowering 21,000+ students to shape the future.',
    'home.hero.explore': 'Explore',
    'home.hero.about': 'About Us',
    'home.services.title': 'Smart Campus Services',
    'home.services.subtitle': 'Student life, simplified.',
    'home.services.seniors': 'Senior Messages',
    'home.card.chat.title': 'Community',
    'home.card.chat.desc': 'Connect with peers and teachers in real-time.',
    'home.card.chat.tag': 'Trending',
    'home.card.food.title': 'Campus Food',
    'home.card.food.desc': 'Canteen specialties and street food.',
    'home.card.library.title': 'Library Insights',
    'home.card.library.desc': '1.45M+ books waiting for you.',
    'home.card.gallery.title': 'Campus Gallery',
    'home.card.gallery.desc': 'Capturing beautiful moments at WIC.',
    'home.depts.title': 'Faculties & Departments',
    'home.depts.desc': '11 Faculties, 41 Majors, diverse talent cultivation.',

    // Stats
    'stats.students': 'Students',
    'stats.faculties': 'Faculties',
    'stats.majors': 'Majors',
    'stats.books': 'Books',
    'stats.students.sub': 'Active',
    'stats.faculties.sub': 'Depts',
    'stats.majors.sub': 'Programs',
    'stats.books.sub': 'Million',

    // Detailed Stats (About Page)
    'stats.area': 'Campus Area',
    'stats.area.sub': '(Mu)',
    'stats.building': 'Building Area',
    'stats.building.sub': '(10k M²)',
    'stats.equipment': 'Teaching Equip.',
    'stats.equipment.sub': '(10k CNY)',
    'stats.resources': 'E-Resources',
    'stats.resources.sub': '(10k)',
    'stats.paper': 'Paper Books',
    'stats.paper.sub': '(10k)',

    // About
    'about.title': 'City University of Wuhan',
    'about.motto': '"Educating for the Nation"',
    'about.toc.intro': 'Introduction',
    'about.toc.faculty': 'Faculty',
    'about.toc.research': 'Research',
    'about.toc.location': 'Location',
    'about.intro.text1': 'Established in July 2002, formerly City College of WUST. In Feb 2021, approved by the Ministry of Education as an independent undergraduate university.',
    'about.intro.text2': 'Adhering to "Student-oriented, Quality First", we strive to cultivate high-quality applied talents for national development.',
    'about.faculty.desc': 'A team of 1,225 high-quality teachers with noble ethics and exquisite skills.',
    'about.faculty.master': 'Master\'s Degree or Above',
    'about.faculty.senior': 'Senior Professional Titles',
    'about.research.course': 'National First-class Courses',
    'about.research.course.desc': 'And 25 provincial first-class undergraduate courses.',
    'about.research.paper': 'High-level Papers',
    'about.research.paper.desc': 'Published in the last 5 years, including 48 SCI papers.',
    'about.research.patent': 'Patents Authorized',
    'about.research.patent.desc': 'Including 5 national invention patents and 25 utility model patents.',
    'about.location.name': 'East Lake Campus',
    'about.location.donghu': 'East Lake Campus',
    'about.location.hongan': 'Hongan Campus',
    'about.address.hongan': 'No. 18 Jinshan Avenue, Hongan County, Huanggang',

    // Chat
    'chat.dept': 'Departments',
    'chat.search': 'Search...',
    'chat.user': 'Student User',
    'chat.online': 'Online',
    'chat.input': 'Message...',
    'chat.typing': 'Typing...',
    'chat.bot_name': 'Campus Assistant',
    'chat.welcome_title': 'Welcome to',
    'chat.welcome_desc': 'This is the public channel for this department. Please be polite and helpful.',
    'chat.dept.1': 'Information Tech',
    'chat.dept.2': 'Medicine',
    'chat.dept.3': 'Economics & Mgmt',
    'chat.dept.4': 'Arts & Design',
    'chat.dept.5': 'Foreign Languages',
    'chat.dept.6': 'Civil Engineering',
    'chat.dept.desc.1': 'Coding, AI, and IT support',
    'chat.dept.desc.2': 'Future doctors & nurses',
    'chat.dept.desc.3': 'Business leaders',
    'chat.dept.desc.4': 'Creative minds',
    'chat.dept.desc.5': 'Global communicators',
    'chat.dept.desc.6': 'Building the future',

    // Food
    'food.title': 'Food Guide',
    'food.subtitle': 'Explore the best tastes around WIC.',
    'food.filter.all': 'All',
    'food.filter.big_canteen_1f': 'Big Canteen 1F',
    'food.filter.big_canteen_2f': 'Big Canteen 2F',
    'food.filter.small_canteen': 'Small Canteen',
    'food.filter.front_street': 'Front St.',
    'food.filter.back_street': 'Back St.',
    'food.filter.side_street': 'Side St.',
    'food.reviews': 'reviews',
    'food.avg': 'Avg.',
    'food.no_results': 'No restaurants found.',
    'food.comments_list': 'Comments',
    'food.write_review': 'Write a review...',
    'food.post': 'Post',
    'food.likes': 'Likes',
    'food.menu': 'Menu & Products',
    'food.recommend': 'Recommended',
    'food.back': 'Back to List',
    'food.product_reviews': 'Product Reviews',
    'food.no_comments': 'No comments yet. Be the first!',

    // Library
    'library.title': 'Library Insights',
    'library.subtitle': 'What is WIC reading? Discover the trending books.',
    'library.share.title': 'Have you read a good book recently?',
    'library.share.btn': 'Share Your Insight',

    // Seniors
    'seniors.title': 'Senior Messages',
    'seniors.subtitle': 'Wisdom, advice, and secrets passed down from class to class.',
    'seniors.btn': '+ Write a Note',

    // Gallery
    'gallery.title': 'Campus Gallery',
    'gallery.subtitle': 'Captured moments from around the campus.',
    'gallery.stats': 'Infinite Memories',
    'gallery.students': '21,618 Students',

    // Login
    'login.welcome': 'Welcome Back to WIC',
    'login.join': 'Join Our Community',
    'login.desc.login': 'Access your personalized dashboard, library resources, and connect with your campus community.',
    'login.desc.register': 'Create your student account to unlock full access to campus services, dining guides, and peer chat.',
    'login.title.login': 'Student Login',
    'login.title.register': 'Create Account',
    'login.subtitle.login': 'Please enter your details.',
    'login.subtitle.register': 'Fill in your information to start.',
    'login.label.name': 'Full Name',
    'login.label.id': 'Student ID / Email',
    'login.label.password': 'Password',
    'login.forgot': 'Forgot Password?',
    'login.btn.login': 'Sign In',
    'login.btn.register': 'Create Account',
    'login.footer.no_account': "Don't have an account?",
    'login.footer.has_account': "Already have an account?",
    'login.footer.link.register': "Register now",
    'login.footer.link.login': "Login here",
    'login.back': "Back to Home",
    'login.success': "Login successful!",

    // Profile
    'profile.title': 'Profile',
    'profile.edit': 'Edit Profile',
    'profile.save': 'Save Changes',
    'profile.cancel': 'Cancel',
    'profile.logout': 'Logout',
    'profile.stats.reviews': 'Reviews',
    'profile.stats.likes': 'Likes',
    'profile.stats.days': 'Days Joined',
    'profile.label.name': 'Full Name',
    'profile.label.id': 'Student ID',
    'profile.label.email': 'Email',
    'profile.label.dept': 'Department',
    'profile.label.major': 'Major',
    'profile.label.bio': 'Bio',
    'profile.label.bio_placeholder': 'Write a short bio about yourself...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string) => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
