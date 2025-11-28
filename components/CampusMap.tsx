
import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import { 
  Utensils, 
  BookOpen, 
  Bed, 
  Activity, 
  Stethoscope, 
  MapPin, 
  Navigation, 
  ExternalLink,
  School,
  Coffee
} from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useLanguage } from '../LanguageContext';

// --- Data & Config ---

type CategoryType = 'all' | 'canteen' | 'teaching' | 'dorm' | 'sports' | 'medical';

interface POI {
  id: number;
  name: string;
  category: CategoryType;
  coords: [number, number];
  description?: string;
}

const CATEGORIES: { id: CategoryType; label: string; icon: any; color: string }[] = [
  { id: 'all', label: '全部', icon: MapPin, color: 'bg-gray-600' },
  { id: 'canteen', label: '食堂', icon: Utensils, color: 'bg-orange-500' },
  { id: 'teaching', label: '教学楼', icon: School, color: 'bg-blue-500' },
  { id: 'dorm', label: '宿舍', icon: Bed, color: 'bg-indigo-500' },
  { id: 'sports', label: '运动场', icon: Activity, color: 'bg-green-500' },
  { id: 'medical', label: '医务室', icon: Stethoscope, color: 'bg-red-500' },
];

const DONGHU_CENTER: [number, number] = [30.586396, 114.428991];
const HONGAN_CENTER: [number, number] = [31.079095, 114.576511];

const CAMPUS_POIS: POI[] = [
  // Canteens
  { id: 1, name: '南一食堂 (South Canteen)', category: 'canteen', coords: [30.5850, 114.4280], description: 'Main canteen, popular for spicy pot.' },
  { id: 2, name: '北区食堂 (North Canteen)', category: 'canteen', coords: [30.5890, 114.4295], description: 'Recently renovated, good breakfast.' },
  { id: 3, name: '咖啡屋 (Campus Cafe)', category: 'canteen', coords: [30.5865, 114.4285], description: 'Quiet spot for study.' },

  // Teaching
  { id: 4, name: '行政楼 (Admin Building)', category: 'teaching', coords: [30.5870, 114.4300], description: 'Faculty offices and administration.' },
  { id: 5, name: '教学楼 1 (Building 1)', category: 'teaching', coords: [30.5860, 114.4310], description: 'CS and Engineering classes.' },
  { id: 6, name: '图书馆 (Library)', category: 'teaching', coords: [30.5868, 114.4292], description: 'Main library resources.' },
  
  // Dorms
  { id: 7, name: '西区宿舍 (West Dorms)', category: 'dorm', coords: [30.5870, 114.4250], description: 'Undergraduate dormitories.' },
  { id: 8, name: '东区宿舍 (East Dorms)', category: 'dorm', coords: [30.5855, 114.4320], description: 'Graduate dormitories.' },

  // Sports
  { id: 9, name: '主体育场 (Main Stadium)', category: 'sports', coords: [30.5835, 114.4290], description: 'Track and field, football.' },
  { id: 10, name: '篮球场 (Basketball Court)', category: 'sports', coords: [30.5845, 114.4305], description: 'Outdoor courts.' },

  // Medical
  { id: 11, name: '校医院 (Campus Clinic)', category: 'medical', coords: [30.5875, 114.4260], description: '24/7 basic medical services.' },
];

// SVG Paths for Leaflet DivIcon (since we can't easily render React components to HTML string without server-side libs in this context)
const SVG_ICONS: Record<string, string> = {
  all: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  canteen: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
  teaching: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 5v17"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>`,
  dorm: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`,
  sports: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  medical: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 0 0 5 2h14a.3.3 0 0 0 .2.3l-2 7a.6.6 0 0 1-.6.4H7.4a.6.6 0 0 1-.6-.4l-2-7z"/><path d="M8 15v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6"/><path d="M11 11.9c-.8.3-1.6.2-2.3-.2a3 3 0 0 0-4.6 1.7A3 3 0 0 0 5.4 17c1.7 1.7 4.5.4 5.6-.9"/></svg>`
};

const COLOR_MAP: Record<string, string> = {
  all: '#4b5563',
  canteen: '#f97316',
  teaching: '#3b82f6',
  dorm: '#6366f1',
  sports: '#22c55e',
  medical: '#ef4444'
};

const CampusMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  const [activeCampus, setActiveCampus] = useState<'donghu' | 'hongan'>('donghu');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  
  const { theme } = useTheme();
  const { t } = useLanguage();

  const currentCenter = activeCampus === 'donghu' ? DONGHU_CENTER : HONGAN_CENTER;
  const currentName = activeCampus === 'donghu' ? t('about.location.donghu') : t('about.location.hongan');
  const currentAddress = activeCampus === 'donghu' ? t('footer.address') : t('about.address.hongan');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: currentCenter,
        zoom: 16,
        scrollWheelZoom: false, // Prevent page scroll hijacking
        zoomControl: false,
        attributionControl: false
      });
      new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
    }
  }, []);

  // Update Tile Layer Theme
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) mapInstanceRef.current?.removeLayer(layer);
    });

    const tileUrl = theme === 'dark' 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' 
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, { maxZoom: 19, subdomains: 'abcd' }).addTo(mapInstanceRef.current);
  }, [theme]);

  // Handle View Change & Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Fly to new center
    mapInstanceRef.current.flyTo(currentCenter, 16, { duration: 1.5 });

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add Main Campus Marker
    const mainIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative flex items-center justify-center w-12 h-12">
          <div class="absolute w-full h-full bg-wic-primary/30 rounded-full animate-ping"></div>
          <div class="relative w-4 h-4 bg-wic-primary border-2 border-white rounded-full shadow-lg"></div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    const centerMarker = L.marker(currentCenter, { icon: mainIcon }).addTo(mapInstanceRef.current);
    markersRef.current.push(centerMarker);

    // Add POI Markers (Only for Donghu for now as per data)
    if (activeCampus === 'donghu') {
      const filteredPOIs = activeCategory === 'all' 
        ? CAMPUS_POIS 
        : CAMPUS_POIS.filter(p => p.category === activeCategory);

      filteredPOIs.forEach(poi => {
        const svgContent = SVG_ICONS[poi.category] || SVG_ICONS['all'];
        const bgColor = COLOR_MAP[poi.category] || '#3F632F';
        
        const poiIcon = L.divIcon({
          className: 'custom-poi-icon',
          html: `
            <div class="relative group">
              <div class="flex items-center justify-center w-10 h-10 rounded-full text-white shadow-lg border-2 border-white transform transition-transform hover:scale-110" style="background-color: ${bgColor}">
                ${svgContent}
              </div>
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                ${poi.name}
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20] // Center
        });

        const m = L.marker(poi.coords, { icon: poiIcon })
          .addTo(mapInstanceRef.current!)
          .bindTooltip(poi.name, { direction: 'top', offset: [0, -20], opacity: 0.9 });
        
        markersRef.current.push(m);
      });
    }

  }, [activeCampus, activeCategory, currentCenter]);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 group bg-gray-100 dark:bg-gray-900">
      
      {/* 1. Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0 relative outline-none" />

      {/* 2. Top-Left Filter Bar (Scrollable) */}
      <div className="absolute top-4 left-4 right-4 z-[400] overflow-x-auto scrollbar-hide pb-2">
         <div className="flex items-center gap-2">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md transition-all whitespace-nowrap border
                    ${isActive 
                      ? `${cat.color} text-white border-transparent scale-105` 
                      : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700'}
                  `}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
         </div>
      </div>

      {/* 3. Bottom-Left Info Card & Switcher */}
      <div className="absolute bottom-6 left-6 z-[400] flex flex-col gap-3 max-w-[calc(100%-3rem)] md:max-w-sm">
         {/* Campus Switcher Pills */}
         <div className="flex gap-2">
            <button
               onClick={() => setActiveCampus('donghu')}
               className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all ${
                   activeCampus === 'donghu' ? 'bg-wic-primary text-white' : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300'
               }`}
            >
               {t('about.location.donghu')}
            </button>
            <button
               onClick={() => setActiveCampus('hongan')}
               className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all ${
                   activeCampus === 'hongan' ? 'bg-wic-primary text-white' : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300'
               }`}
            >
               {t('about.location.hongan')}
            </button>
         </div>

         {/* Info Box */}
         <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-start justify-between mb-2">
               <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-base">{currentName}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-1 line-clamp-2">{currentAddress}</p>
               </div>
               <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg shrink-0 ml-2">
                  <Navigation size={18} />
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
                <a 
                  href={`https://www.amap.com/search?query=${currentCenter[1]},${currentCenter[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm"
                >
                  <ExternalLink size={10} />
                  高德地图
                </a>
                <a 
                  href={`https://map.baidu.com/search/${encodeURIComponent(currentName)}/@${currentCenter[1]},${currentCenter[0]},17z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-wic-primary hover:bg-wic-secondary text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm"
                >
                  <ExternalLink size={10} />
                  百度地图
                </a>
            </div>
         </div>
      </div>

    </div>
  );
};

export default CampusMap;
