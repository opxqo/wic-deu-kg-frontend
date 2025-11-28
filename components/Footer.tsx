
import React, { useState } from 'react';
import { 
  Heart, Phone, MapPin, Mail, ChevronDown, 
  Github, MessageCircle, Globe, ExternalLink, 
  BookOpen, Calendar, Map as MapIcon, Users 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

// --- Sub-components ---

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    aria-label={label}
    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-wic-primary hover:text-white transition-all duration-300"
  >
    {icon}
  </a>
);

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 lg:border-none last:border-none">
      {/* Mobile Toggle / Desktop Title */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 lg:py-0 lg:mb-6 text-left group"
      >
        <h3 className="font-bold text-slate-900 dark:text-white text-base lg:text-sm lg:uppercase lg:tracking-wider">
          {title}
        </h3>
        {/* Chevron only on Mobile */}
        <ChevronDown 
          size={16} 
          className={`lg:hidden text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Mobile Accordion Content */}
      <div className="lg:hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pb-6 space-y-3">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Static Content (Always Visible) */}
      <div className="hidden lg:block space-y-3">
        {children}
      </div>
    </div>
  );
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  external?: boolean;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children, icon, external }) => {
  const content = (
    <>
      {icon && <span className="mr-2 text-slate-400 group-hover:text-wic-primary transition-colors">{icon}</span>}
      <span>{children}</span>
      {external && <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />}
    </>
  );

  const className = "group flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-wic-primary dark:hover:text-wic-accent transition-colors py-1 lg:py-0";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {content}
    </Link>
  );
};

// --- Main Component ---

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t-4 border-wic-primary transition-colors pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-12 gap-y-8 lg:gap-y-0 mb-16">
          
          {/* Column 1: Brand Info (Always Visible) */}
          <div className="text-center lg:text-left space-y-6 mb-8 lg:mb-0">
            <Link to="/" className="inline-block group">
              <div className="flex flex-col lg:flex-row items-center lg:items-end gap-3">
                 <img 
                   src="https://r2.wic.edu.kg/images/logo2.png" 
                   alt="WIC Logo" 
                   className="h-12 w-auto dark:invert dark:opacity-90 transition-transform group-hover:scale-105 duration-300"
                 />
              </div>
            </Link>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto lg:mx-0">
              {t('footer.motto')}
            </p>

            {/* Social Icons */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
              <SocialLink href="#" icon={<MessageCircle size={16} />} label="WeChat" />
              <SocialLink href="#" icon={<Globe size={16} />} label="Weibo" />
              <SocialLink href="https://github.com/wic-dev" icon={<Github size={16} />} label="GitHub" />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <FooterSection title={t('footer.quickLinks')}>
            <FooterLink href="#" external>{t('footer.academic')}</FooterLink>
            <FooterLink href="#" external>{t('footer.admissions')}</FooterLink>
            <FooterLink href="#" external>{t('footer.employment')}</FooterLink>
            <FooterLink href="mailto:dean@wic.edu.kg" icon={<Mail size={14} />}>Dean's Mailbox</FooterLink>
          </FooterSection>

          {/* Column 3: Campus Life (New) */}
          <FooterSection title="Campus Life">
            <FooterLink href="/library" icon={<BookOpen size={14} />}>{t('nav.library')}</FooterLink>
            <FooterLink href="/about#section-3" icon={<MapIcon size={14} />}>Campus Map</FooterLink>
            <FooterLink href="/gallery" icon={<Users size={14} />}>Student Clubs</FooterLink>
            <FooterLink href="#" icon={<Calendar size={14} />}>Academic Calendar</FooterLink>
          </FooterSection>

          {/* Column 4: Contact Us */}
          <FooterSection title={t('footer.contact')}>
             <div className="space-y-4">
               <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin size={18} className="text-wic-primary shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t('footer.address')}</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Phone size={18} className="text-wic-primary shrink-0" />
                  <span>027-86490575</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Mail size={18} className="text-wic-primary shrink-0" />
                  <a href="mailto:contact@wic.edu.kg" className="hover:text-wic-primary transition-colors">contact@wic.edu.kg</a>
               </div>
             </div>
          </FooterSection>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              &copy; {new Date().getFullYear()} Wuhan City University. {t('footer.rights')}
            </p>
            
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
              <span>Designed & Built by</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">WIC Student Devs</span>
              <Heart size={10} className="text-red-500 fill-current animate-pulse ml-0.5" />
            </div>
          </div>

          {/* Legal / Disclaimer */}
          <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
             <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center max-w-3xl mx-auto leading-relaxed font-light">
                本网站（WIC Campus Wiki）为非营利性校园服务平台，仅供内部学习与交流使用。
                站内部分动态贴纸 (.tgs) 及表情素材来源于 Telegram 及开源社区，版权归原作者或 Telegram FZ-LLC 所有。
                如侵犯您的权益，请联系我们移除。
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
