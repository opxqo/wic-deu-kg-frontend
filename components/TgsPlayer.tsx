import React, { useEffect, useState, useRef } from 'react';
import pako from 'pako';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { Loader2, Sticker as StickerIcon } from 'lucide-react';

interface TgsPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
}

const TgsPlayer: React.FC<TgsPlayerProps> = ({ 
  src, 
  className = "w-32 h-32", 
  autoplay = false, // Optimization: Default to false (hover to play)
  loop = true,
  ...props // Allow passing onClick, onMouseDown, etc.
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);

    const fetchAndDecode = async () => {
      try {
        // 1. Fetch
        const response = await fetch(src);
        if (!response.ok) throw new Error(`Failed to fetch TGS: ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();

        // 2. Ungzip using pako
        // TGS files are GZIP compressed JSON
        const uint8Array = pako.ungzip(new Uint8Array(arrayBuffer));

        // 3. Decode to string
        const jsonString = new TextDecoder("utf-8").decode(uint8Array);

        // 4. Parse JSON
        const data = JSON.parse(jsonString);

        if (isMounted) {
          setAnimationData(data);
          setLoading(false);
        }
      } catch (err) {
        // console.error("TGS Decode Error:", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    if (src) {
      fetchAndDecode();
    }

    return () => {
      isMounted = false;
    };
  }, [src]);

  const handleMouseEnter = () => {
    // Only manually play on hover if autoplay is DISABLED
    if (!autoplay) {
      lottieRef.current?.play();
    }
  };

  const handleMouseLeave = () => {
    // Only stop/reset on leave if autoplay is DISABLED
    if (!autoplay) {
      lottieRef.current?.stop(); // Stops and goes to first frame
    }
  };

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-wic-primary">
          <Loader2 className="animate-spin" size={24} />
        </div>
      )}
      
      {error && (
        <div className="flex flex-col items-center justify-center text-gray-400 opacity-50">
          <StickerIcon size={32} />
          <span className="text-[10px] font-medium mt-1">Unavailable</span>
        </div>
      )}

      {!loading && !error && animationData && (
        <Lottie 
          lottieRef={lottieRef}
          animationData={animationData} 
          loop={loop} 
          autoplay={autoplay}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
};

export default TgsPlayer;