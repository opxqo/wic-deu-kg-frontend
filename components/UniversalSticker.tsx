import React from 'react';
import TgsPlayer from './TgsPlayer';
import WebmSticker from './WebmSticker';

interface UniversalStickerProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  [key: string]: any; // Allow passing down other props like onClick, onMouseDown
}

const UniversalSticker: React.FC<UniversalStickerProps> = ({ src, ...props }) => {
  if (!src) return null;

  const isWebm = src.toLowerCase().endsWith('.webm');

  if (isWebm) {
    return <WebmSticker src={src} {...props} />;
  }

  return <TgsPlayer src={src} {...props} />;
};

export default UniversalSticker;