import React, { useRef, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { NoteData, ViewMode } from './types';
import { PAPER_COLORS, INK_COLORS, FONTS, TEXTURES, PAPER_NOISE } from './constants';
import { Trash2 } from 'lucide-react';

interface NoteProps {
    data: NoteData;
    onUpdatePosition: (id: string, x: number, y: number) => void;
    onDelete: (id: string) => void;
    zIndex: number;
    onGrab: (id: string) => void;
    viewMode: ViewMode;
}

const NoteComponent: React.FC<NoteProps> = ({ data, onUpdatePosition, onDelete, zIndex, onGrab, viewMode }) => {
    const noteRef = useRef<HTMLDivElement>(null);

    // Design details based on props
    const bgColor = PAPER_COLORS[data.style.color];
    const inkColor = INK_COLORS[data.style.ink];
    const fontClass = FONTS[data.style.font];
    const textureStyle = TEXTURES[data.style.texture];

    const isFree = viewMode === 'free';
    const isList = viewMode === 'list';

    // Merge the structural pattern (grid/lined) with the noise texture
    const combinedBackgroundImage = useMemo(() => {
        return textureStyle.backgroundImage
            ? `${textureStyle.backgroundImage}, ${PAPER_NOISE}`
            : PAPER_NOISE;
    }, [textureStyle.backgroundImage]);

    const containerStyle = useMemo(() => ({
        backgroundColor: bgColor,
        ...textureStyle,
        backgroundImage: combinedBackgroundImage
    }), [bgColor, textureStyle, combinedBackgroundImage]);

    return (
        <motion.div
            layout={!isFree}
            ref={noteRef}
            drag={isFree}
            dragMomentum={false}
            initial={isFree ? {
                x: data.x,
                y: data.y,
                opacity: 0,
                scale: 0.8,
                rotate: data.rotation
            } : { opacity: 0, scale: 0.8 }}
            animate={isFree ? {
                x: data.x,
                y: data.y,
                opacity: 1,
                scale: 1,
                rotate: data.rotation
            } : {
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                rotate: isList ? 0 : data.rotation
            }}
            whileHover={{
                scale: 1.02,
                rotate: isList ? 0 : (isFree ? data.rotation : 0) + (Math.random() > 0.5 ? 1 : -1),
                transition: { duration: 0.3 },
                zIndex: 1000
            }}
            whileDrag={{
                scale: 1.1,
                rotate: 0,
                zIndex: 1000,
                boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.3)" // Slightly simplified shadow during drag
            }}
            onPointerDown={() => isFree && onGrab(data.id)}
            onDragEnd={(_, info) => {
                if (isFree) {
                    const newX = data.x + info.offset.x;
                    const newY = data.y + info.offset.y;
                    onUpdatePosition(data.id, newX, newY);
                }
            }}
            style={{
                position: isFree ? 'absolute' : 'relative',
                zIndex: isFree ? zIndex : 'auto',
                top: 0,
                left: 0,
            }}
            className={`
        group transition-all duration-500 will-change-transform
        ${isFree ? 'cursor-grab active:cursor-grabbing' : ''}
        ${isList ? 'w-full max-w-2xl' : 'w-64'}
      `}
        >
            <div
                className={`
          relative w-full p-6 
          shadow-[2px_4px_8px_rgba(0,0,0,0.15),0px_10px_20px_rgba(0,0,0,0.1)] 
          transition-colors duration-300
          ${isList ? 'min-h-32 flex flex-row gap-6 items-start' : 'min-h-64 flex-col'}
        `}
                style={containerStyle}
            >
                {/* Glue/Tape area */}
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/5 to-transparent pointer-events-none opacity-50" />

                {/* Delete Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(data.id);
                    }}
                    className="absolute -top-3 -right-3 p-2 bg-white rounded-full shadow-md text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 z-20"
                >
                    <Trash2 size={16} />
                </button>

                {/* Content */}
                <div
                    className={`
            w-full h-full flex ${fontClass} text-xl leading-relaxed select-none overflow-hidden
            ${isList ? 'flex-row items-center' : 'flex-col'}
          `}
                    style={{ color: inkColor }}
                >
                    <p className={`whitespace-pre-wrap flex-grow ${isList ? 'text-2xl' : ''}`}>{data.content}</p>

                    <div className={`
            ${isList ? 'ml-6 pl-6 border-l border-black/10 flex-shrink-0 w-32 flex-col items-end justify-center' : 'mt-4 pt-2 border-t border-black/10 w-full flex-row justify-between items-end'}
            flex text-sm opacity-70 font-sans font-light italic
          `}>
                        <span>{data.author}</span>
                        <span>{data.date}</span>
                    </div>
                </div>

                {/* Curl Effect Corner (Hidden in List mode for cleaner look) */}
                {!isList && (
                    <>
                        <div
                            className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
                            style={{
                                background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.05) 56%, transparent 100%)`,
                            }}
                        />
                        <div
                            className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
                            style={{
                                background: `linear-gradient(135deg, transparent 45%, ${bgColor} 50%, #fff 100%)`,
                                boxShadow: '-1px -1px 2px rgba(0,0,0,0.1)'
                            }}
                        />
                    </>
                )}
            </div>
        </motion.div>
    );
};

export const Note = memo(NoteComponent);
