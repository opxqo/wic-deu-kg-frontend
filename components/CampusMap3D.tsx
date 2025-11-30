
import React, { useRef, useState, useMemo } from 'react';
import Map, { Marker, NavigationControl, MapRef, Popup } from 'react-map-gl';
import { 
  MapPin, 
  Utensils, 
  BookOpen, 
  Bed, 
  Dumbbell, 
  Stethoscope, 
  Navigation, 
  School,
  Coffee,
  ShieldAlert,
  Info
} from 'lucide-react';
import { CAMPUS_POIS, POI, CategoryType } from '../data/campus-poi';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiM3NlbmEiLCJhIjoiY21nMmk1cWZ3MTU2dDJsc2R6YnN5N291NiJ9.IR9jUw6jVYtvbKKFjRVjrQ';

// Locations
const DONGHU_COORDS = { longitude: 114.421431, latitude: 30.589036 };
const HONGAN_COORDS = { longitude: 114.576448, latitude: 31.078002 };

// Helper for Icons and Colors
const getMarkerStyle = (category: CategoryType) => {
    switch (category) {
        case 'canteen':
            return { icon: Utensils, color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500' };
        case 'dorm':
            return { icon: Bed, color: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500' };
        case 'building':
            return { icon: School, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500' };
        case 'sports':
            return { icon: Dumbbell, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500' };
        case 'service':
            return { icon: Stethoscope, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500' };
        case 'other':
        default:
            return { icon: MapPin, color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500' };
    }
};

const CampusMap3D: React.FC = () => {
  const mapRef = useRef<MapRef>(null);
  const [activeCampus, setActiveCampus] = useState<'donghu' | 'hongan'>('donghu');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedMarker, setSelectedMarker] = useState<POI | null>(null);

  const [viewState, setViewState] = useState({
    ...DONGHU_COORDS,
    zoom: 16,
    pitch: 60,
    bearing: -20
  });

  const goToCampus = (campus: 'donghu' | 'hongan') => {
    setActiveCampus(campus);
    const target = campus === 'donghu' ? DONGHU_COORDS : HONGAN_COORDS;

    mapRef.current?.flyTo({
      center: [target.longitude, target.latitude],
      zoom: 16,
      pitch: 60,
      bearing: -20,
      duration: 3000,
      essential: true
    });
  };

  // Filter Logic
  const visiblePOIs = useMemo(() => {
    if (selectedCategory === 'all') return CAMPUS_POIS;
    return CAMPUS_POIS.filter(poi => poi.category === selectedCategory);
  }, [selectedCategory]);

  const onMapLoad = () => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Safety check for style loading
    const style = map.getStyle();
    if (!style || !style.layers) return;

    // 1. Add 3D Buildings
    const layers = style.layers;
    const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
    )?.id;

    if (!map.getLayer('3d-buildings')) {
        map.addLayer(
            {
                'id': '3d-buildings',
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 14,
                'paint': {
                    'fill-extrusion-color': '#2a2a2a', 
                    'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 0.9
                }
            },
            labelLayerId
        );
    }

    // 2. Set Atmosphere
    map.setFog({
        'range': [0.5, 10],
        'color': 'rgb(10, 20, 30)', 
        'horizon-blend': 0.1,
        'high-color': 'rgb(36, 92, 223)', 
        'space-color': 'rgb(11, 11, 25)', 
        'star-intensity': 0.6
    });
  };

  return (
    <div className="w-full h-full relative bg-black">
        {/* Overlay Controls */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-4 pointer-events-none">
            {/* Campus Navigator */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl w-64 pointer-events-auto">
                <h2 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                    <Navigation size={18} className="text-wic-accent"/>
                    Campus Navigator
                </h2>
                <p className="text-gray-400 text-xs mb-4">Select a campus to fly over.</p>
                
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => goToCampus('donghu')}
                        className={`px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                            activeCampus === 'donghu' 
                            ? 'bg-wic-primary text-white shadow-lg shadow-wic-primary/30' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                    >
                        <span>Donghu Campus</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">✈️</span>
                    </button>
                    <button 
                         onClick={() => goToCampus('hongan')}
                         className={`px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                            activeCampus === 'hongan' 
                            ? 'bg-wic-primary text-white shadow-lg shadow-wic-primary/30' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                    >
                        <span>Hongan Campus</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">✈️</span>
                    </button>
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 pointer-events-auto max-w-sm">
                 {[
                    { id: 'all', label: '全部' },
                    { id: 'canteen', label: '食堂' },
                    { id: 'dorm', label: '宿舍' },
                    { id: 'building', label: '教学/行政' },
                    { id: 'sports', label: '运动' },
                    { id: 'service', label: '服务' }
                 ].map(filter => (
                     <button 
                        key={filter.id} 
                        onClick={() => setSelectedCategory(filter.id as CategoryType | 'all')}
                        className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-bold transition-all ${
                            selectedCategory === filter.id 
                            ? 'bg-white text-black border-white' 
                            : 'bg-black/40 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                     >
                        {filter.label}
                     </button>
                 ))}
            </div>
        </div>

        {/* Map */}
        <Map
            ref={mapRef}
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={viewState}
            onMove={evt => setViewState(evt.viewState)}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            onLoad={onMapLoad}
            attributionControl={false}
            terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
            onClick={() => setSelectedMarker(null)} // Click map to close popup
        >
            <NavigationControl position="bottom-right" />
            
            {/* Markers */}
            {visiblePOIs.map(poi => {
                const style = getMarkerStyle(poi.category);
                const Icon = style.icon;

                return (
                    <Marker 
                        key={poi.id} 
                        longitude={poi.coords.longitude} 
                        latitude={poi.coords.latitude}
                        anchor="bottom"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            setSelectedMarker(poi);
                        }}
                    >
                        <div className="group relative cursor-pointer">
                            {/* Ping Animation */}
                            <div className={`absolute -inset-2 rounded-full opacity-20 group-hover:opacity-40 animate-ping ${style.bg.replace('/20', '')}`}></div>
                            
                            {/* Icon Circle */}
                            <div className={`
                                relative w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm border-2 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 group-hover:-translate-y-1
                                ${style.border}
                            `}>
                                <Icon size={18} className={style.color} />
                            </div>

                            {/* Label (Hover) */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 z-50 pointer-events-none">
                                {poi.name}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-b border-r border-white/10"></div>
                            </div>
                        </div>
                    </Marker>
                );
            })}

            {/* Popup */}
            {selectedMarker && (
                <Popup
                    longitude={selectedMarker.coords.longitude}
                    latitude={selectedMarker.coords.latitude}
                    anchor="top"
                    onClose={() => setSelectedMarker(null)}
                    closeOnClick={false}
                    className="z-50"
                    offset={10}
                >
                    <div className="p-1 min-w-[160px]">
                        <h3 className="text-sm font-bold text-gray-900 mb-1">{selectedMarker.name}</h3>
                        <p className="text-xs text-gray-500">{selectedMarker.description !== "无描述" ? selectedMarker.description : getMarkerStyle(selectedMarker.category).icon.name || "Campus Location"}</p>
                        <div className={`mt-2 text-[10px] px-2 py-0.5 rounded inline-block font-bold uppercase tracking-wider ${
                             getMarkerStyle(selectedMarker.category).bg.replace('/20', '/10')
                        } ${getMarkerStyle(selectedMarker.category).color}`}>
                            {selectedMarker.category.toUpperCase()}
                        </div>
                    </div>
                </Popup>
            )}
        </Map>
    </div>
  );
};

export default CampusMap3D;
