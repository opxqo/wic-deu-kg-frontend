import React, { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

interface StatItemProps {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  icon: React.ReactNode;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  suffix = '',
  decimals = 0,
  icon,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0 });
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
    <div ref={ref} className="flex flex-col items-center text-center px-3 py-6 md:py-8">
      {/* 图标 */}
      <div className="mb-3 text-wic-accent/80">
        {icon}
      </div>

      {/* 数值 */}
      <div className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-wic-accent mb-1.5 font-mono tabular-nums leading-none">
        {displayValue}
        <span className="text-base md:text-lg lg:text-xl font-medium">{suffix}</span>
      </div>

      {/* 标签 */}
      <div className="text-white/90 text-sm md:text-base font-medium">
        {label}
      </div>
    </div>
  );
};

// 简洁的 SVG 图标组件
const IconArea = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
  </svg>
);

const IconBuilding = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
  </svg>
);

const IconEquipment = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6l2 4H7l2-4zM7 7v10a2 2 0 002 2h6a2 2 0 002-2V7M9 11h6M12 11v4" />
  </svg>
);

const IconEbook = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4M6 8h4M6 11h8" />
  </svg>
);

const IconBook = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    <path d="M8 7h8M8 11h6" />
  </svg>
);

const StatsSection: React.FC = () => {
  const { t, language } = useLanguage();

  const stats = [
    {
      label: language === 'zh' ? '校园占地' : 'Campus Area',
      value: 2041.94,
      suffix: '亩',
      icon: <IconArea />,
    },
    {
      label: language === 'zh' ? '建筑面积' : 'Building Area',
      value: 67.20,
      suffix: '万平方',
      decimals: 2,
      icon: <IconBuilding />,
    },
    {
      label: language === 'zh' ? '教学设备' : 'Equipment',
      value: 12732.01,
      suffix: '万元',
      decimals: 2,
      icon: <IconEquipment />,
    },
    {
      label: language === 'zh' ? '电子资源' : 'E-Resources',
      value: 100,
      suffix: '万册',
      icon: <IconEbook />,
    },
    {
      label: language === 'zh' ? '纸质图书' : 'Paper Books',
      value: 176.97,
      suffix: '万册',
      icon: <IconBook />,
    },
  ];

  return (
    <div className="bg-wic-primary rounded-xl overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-y md:divide-y-0 divide-white/10">
        {stats.map((stat, index) => (
          <StatItem key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default StatsSection;