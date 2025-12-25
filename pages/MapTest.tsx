import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CampusMap3D from '../components/CampusMap3D';

const MapTest: React.FC = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative">
      {/* Back Button Overlay */}
      <Link to="/" className="absolute top-6 right-6 z-50 group">
         <div className="flex items-center gap-2 px-4 py-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white/80 hover:text-white border border-white/10 transition-all">
             <ChevronLeft size={16} />
             <span className="text-sm font-bold">Exit 3D View</span>
         </div>
      </Link>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-full"
      >
         <CampusMap3D />
      </motion.div>
    </div>
  );
};

export default MapTest;
