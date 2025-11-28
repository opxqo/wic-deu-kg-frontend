import React, { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

const StatItem: React.FC<{ label: string; subLabel: string; value: number; suffix?: string; decimals?: number }> = ({ 
  label, 
  subLabel, 
  value, 
  suffix = '', 
  decimals = 0 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2500, bounce: 0 });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(latest.toFixed(decimals));
    });
    return unsubscribe;
  }, [springValue, decimals]);

  return (
    <div ref={ref} className="text-center p-6 md:border-r border-white/20 last:border-r-0 relative group">
      <div className="text-4xl md:text-5xl font-bold text-wic-accent mb-2 font-mono tabular-nums tracking-tight">
        {displayValue}{suffix}
      </div>
      <div className="flex flex-col">
        <span className="text-white text-lg font-bold">{label}</span>
        <span className="text-white/50 text-xs uppercase tracking-widest">{subLabel}</span>
      </div>
    </div>
  );
};

const StatsSection: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-wic-primary rounded-lg shadow-2xl p-4 md:p-8 border-4 border-wic-accent/30 backdrop-blur-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          <StatItem label={t('stats.students')} subLabel={t('stats.students.sub')} value={21618} />
          <StatItem label={t('stats.faculties')} subLabel={t('stats.faculties.sub')} value={11} />
          <StatItem label={t('stats.majors')} subLabel={t('stats.majors.sub')} value={41} />
          <StatItem label={t('stats.books')} subLabel={t('stats.books.sub')} value={145.6} suffix={t('stats.books.sub') === '万册' ? '万' : 'M'} decimals={1} />
      </div>
    </div>
  );
};

export default StatsSection;