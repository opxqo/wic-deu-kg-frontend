import React, { useRef, useEffect, useState } from 'react';
import { Sticker as StickerIcon } from 'lucide-react';

interface WebmStickerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  autoplay?: boolean;
}

const WebmSticker: React.FC<WebmStickerProps> = ({
  src,
  autoplay = false,
  className = "w-32 h-32",
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (autoplay) {
        videoRef.current.play().catch(() => {
           // Autoplay might be blocked by browser policies if not muted or interacted with
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [autoplay, src]);

  const handleMouseEnter = () => {
    if (!autoplay && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (!autoplay && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center text-gray-400 opacity-50 ${className}`}>
        <StickerIcon size={24} />
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={src}
      className={`object-contain ${className}`}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      autoPlay={autoplay}
      controls={controls}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default WebmSticker;