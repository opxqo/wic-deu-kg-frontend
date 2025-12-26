import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { PaperColor, PaperTexture, InkColor, FontFamily, NoteData } from './types';
import { PAPER_COLORS, INK_COLORS, FONTS, TEXTURES } from './constants';

interface NoteEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (note: Omit<NoteData, 'id' | 'x' | 'y' | 'rotation'>) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ isOpen, onClose, onCreate }) => {
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [selectedColor, setSelectedColor] = useState<PaperColor>('yellow');
    const [selectedTexture, setSelectedTexture] = useState<PaperTexture>('plain');
    const [selectedFont, setSelectedFont] = useState<FontFamily>('caveat');
    const [selectedInk, setSelectedInk] = useState<InkColor>('blue');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        onCreate({
            content,
            author: author.trim() || '某位学长/学姐',
            date: new Date().toLocaleDateString(),
            style: {
                color: selectedColor,
                texture: selectedTexture,
                font: selectedFont,
                ink: selectedInk
            }
        });

        // Reset and close
        setContent('');
        setAuthor('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 50, opacity: 0 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Left: Preview */}
                        <div className="w-full md:w-1/2 p-8 bg-neutral-100 flex items-center justify-center relative overflow-hidden">
                            {/* Pattern for desk background */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                            <div className="relative">
                                <div className="text-center mb-6 text-neutral-400 text-sm uppercase tracking-widest font-semibold">Preview</div>
                                <div
                                    className={`
                      w-72 h-72 p-6 shadow-xl transition-all duration-300 transform rotate-1
                    `}
                                    style={{
                                        backgroundColor: PAPER_COLORS[selectedColor],
                                        ...TEXTURES[selectedTexture]
                                    }}
                                >
                                    <div className={`w-full h-full flex flex-col ${FONTS[selectedFont]} text-2xl overflow-hidden`} style={{ color: INK_COLORS[selectedInk] }}>
                                        <p className="whitespace-pre-wrap break-words">{content || '写下你的建议...'}</p>
                                        <div className="mt-auto pt-4 border-t border-black/10 text-base opacity-70 flex justify-between">
                                            <span>{author || '某位学长/学姐'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Controls */}
                        <div className="w-full md:w-1/2 bg-white p-8 flex flex-col overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif font-bold text-neutral-800">写留言</h2>
                                <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                                    <X size={24} className="text-neutral-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
                                {/* Text Inputs */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">内容</label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="分享学习技巧、校园生活贴士，或者一句鼓励的话..."
                                            className="w-full p-3 border-2 border-neutral-200 rounded-lg focus:border-neutral-400 focus:outline-none transition-colors resize-none h-32 bg-neutral-50"
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">署名 (可选)</label>
                                        <input
                                            type="text"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            placeholder="例如：24届 学姐"
                                            className="w-full p-2 border-2 border-neutral-200 rounded-lg focus:border-neutral-400 focus:outline-none bg-neutral-50"
                                        />
                                    </div>
                                </div>

                                {/* Customization Grid */}
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Paper Color */}
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">便签颜色</label>
                                        <div className="flex gap-2">
                                            {(Object.keys(PAPER_COLORS) as PaperColor[]).map(color => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-8 h-8 rounded-full border border-black/10 shadow-sm flex items-center justify-center transition-transform hover:scale-110 ${selectedColor === color ? 'ring-2 ring-neutral-400 ring-offset-2' : ''}`}
                                                    style={{ backgroundColor: PAPER_COLORS[color] }}
                                                >
                                                    {selectedColor === color && <Check size={14} className="text-black/50" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ink Color */}
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">墨水颜色</label>
                                        <div className="flex gap-2">
                                            {(Object.keys(INK_COLORS) as InkColor[]).map(ink => (
                                                <button
                                                    key={ink}
                                                    type="button"
                                                    onClick={() => setSelectedInk(ink)}
                                                    className={`w-8 h-8 rounded-full border border-black/10 shadow-sm flex items-center justify-center transition-transform hover:scale-110 ${selectedInk === ink ? 'ring-2 ring-neutral-400 ring-offset-2' : ''}`}
                                                    style={{ backgroundColor: INK_COLORS[ink] }}
                                                >
                                                    {selectedInk === ink && <Check size={14} className="text-white" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Font */}
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">字体风格</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {(Object.keys(FONTS) as FontFamily[]).map(font => (
                                                <button
                                                    key={font}
                                                    type="button"
                                                    onClick={() => setSelectedFont(font)}
                                                    className={`p-2 rounded border border-neutral-200 hover:bg-neutral-50 transition-all ${selectedFont === font ? 'bg-neutral-100 border-neutral-400 shadow-inner' : ''}`}
                                                >
                                                    <span className={`${FONTS[font]} text-lg`}>字体</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Texture */}
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">纸张纹理</label>
                                        <div className="flex gap-3">
                                            {(['plain', 'lined', 'grid'] as PaperTexture[]).map(tex => (
                                                <button
                                                    key={tex}
                                                    type="button"
                                                    onClick={() => setSelectedTexture(tex)}
                                                    className={`px-4 py-2 text-sm rounded-full border border-neutral-200 transition-all ${selectedTexture === tex ? 'bg-neutral-800 text-white' : 'bg-white hover:bg-neutral-50'}`}
                                                >
                                                    {tex === 'plain' ? '空白' : tex === 'lined' ? '横线' : '方格'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!content.trim()}
                                    className="w-full mt-6 py-4 bg-neutral-900 text-white rounded-lg font-medium tracking-wide shadow-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1 active:translate-y-0"
                                >
                                    贴上留言
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
