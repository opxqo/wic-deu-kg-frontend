import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, MessageSquareQuote, BookOpen, Coffee, GraduationCap, Pencil, Leaf, Sparkles } from 'lucide-react';
import { NoteData } from '../components/cozyboard/types';
import { INITIAL_NOTES_DATA, PAPER_COLORS, INK_COLORS, FONTS, FONT_NAMES, TEXTURES, PAPER_NOISE } from '../components/cozyboard/constants';
import { PaperColor, PaperTexture, InkColor, FontFamily } from '../components/cozyboard/types';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Soft pastel shadow colors for notes
const NOTE_SHADOWS: Record<string, string> = {
  yellow: '0 8px 30px -4px rgba(251, 191, 36, 0.4)',
  pink: '0 8px 30px -4px rgba(244, 114, 182, 0.4)',
  green: '0 8px 30px -4px rgba(74, 222, 128, 0.4)',
  kraft: '0 8px 30px -4px rgba(180, 140, 80, 0.35)',
};

// Random positions for scattered layout
const SCATTER_POSITIONS = [
  { rotate: -3, translateY: 0 },
  { rotate: 2, translateY: 8 },
  { rotate: -1, translateY: -4 },
  { rotate: 3, translateY: 12 },
  { rotate: -2, translateY: 4 },
  { rotate: 1, translateY: -8 },
  { rotate: -4, translateY: 6 },
  { rotate: 2, translateY: -2 },
];

const Seniors: React.FC = () => {
  const [notes, setNotes] = useState<NoteData[]>(() => {
    const saved = localStorage.getItem('cozyboard_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_NOTES_DATA;
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedColor, setSelectedColor] = useState<PaperColor>('yellow');
  const [selectedTexture, setSelectedTexture] = useState<PaperTexture>('plain');
  const [selectedFont, setSelectedFont] = useState<FontFamily>('caveat');
  const [selectedInk, setSelectedInk] = useState<InkColor>('blue');

  const handleCreateNote = () => {
    if (!content.trim()) return;

    const newNote: NoteData = {
      id: Date.now().toString(),
      x: 0, y: 0, rotation: Math.random() * 6 - 3,
      content,
      author: author.trim() || '某位学长/学姐',
      date: new Date().toLocaleDateString(),
      style: { color: selectedColor, texture: selectedTexture, font: selectedFont, ink: selectedInk }
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem('cozyboard_notes', JSON.stringify(updated));
    setContent(''); setAuthor('');
    setIsEditorOpen(false);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] overflow-hidden bg-white dark:bg-zinc-950">

      {/* Decorative Doodles - Scattered around */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Left */}
        <BookOpen className="absolute top-20 left-[5%] w-12 h-12 text-amber-200 dark:text-amber-800/30 rotate-[-15deg]" />
        <Leaf className="absolute top-40 left-[12%] w-8 h-8 text-green-200 dark:text-green-800/30 rotate-[20deg]" />

        {/* Top Right */}
        <GraduationCap className="absolute top-24 right-[8%] w-14 h-14 text-pink-200 dark:text-pink-800/30 rotate-[10deg]" />
        <Coffee className="absolute top-48 right-[15%] w-10 h-10 text-orange-200 dark:text-orange-800/30 rotate-[-8deg]" />

        {/* Bottom Left */}
        <Pencil className="absolute bottom-32 left-[8%] w-10 h-10 text-blue-200 dark:text-blue-800/30 rotate-[45deg]" />
        <Sparkles className="absolute bottom-20 left-[18%] w-8 h-8 text-purple-200 dark:text-purple-800/30" />

        {/* Bottom Right */}
        <BookOpen className="absolute bottom-28 right-[10%] w-10 h-10 text-teal-200 dark:text-teal-800/30 rotate-[12deg]" />
        <Leaf className="absolute bottom-48 right-[20%] w-6 h-6 text-lime-200 dark:text-lime-800/30 rotate-[-25deg]" />

        {/* Middle decorations */}
        <Coffee className="absolute top-[50%] left-[3%] w-8 h-8 text-rose-200 dark:text-rose-800/30 rotate-[5deg]" />
        <GraduationCap className="absolute top-[60%] right-[5%] w-10 h-10 text-indigo-200 dark:text-indigo-800/30 rotate-[-12deg]" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-pink-100 dark:from-amber-900/30 dark:to-pink-900/30 rounded-2xl mb-4 shadow-lg"
        >
          <MessageSquareQuote size={32} className="text-amber-600 dark:text-amber-400" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-800 dark:text-white mb-3 tracking-tight">
          学长学姐留言板
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg font-light">
          ✨ 薪火相传 · 学习经验与青春寄语 ✨
        </p>
      </div>

      {/* Scattered Note Grid */}
      <div className="relative z-10 px-6 pb-32 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {notes.map((note, idx) => {
              const bgColor = PAPER_COLORS[note.style.color];
              const inkColor = INK_COLORS[note.style.ink];
              const fontClass = FONTS[note.style.font];
              const scatter = SCATTER_POSITIONS[idx % SCATTER_POSITIONS.length];
              const shadow = NOTE_SHADOWS[note.style.color] || NOTE_SHADOWS.yellow;

              return (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 40 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: scatter.translateY,
                    rotate: scatter.rotate
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  whileHover={{
                    scale: 1.03,
                    rotate: 0,
                    y: -4,
                    transition: { duration: 0.2 }
                  }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group relative p-5 rounded-lg cursor-default"
                  style={{
                    backgroundColor: bgColor,
                    boxShadow: shadow,
                  }}
                >
                  {/* Matte texture overlay */}
                  <div className="absolute inset-0 rounded-lg opacity-30 pointer-events-none"
                    style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.03) 100%)' }}
                  />

                  <div className={`relative ${fontClass} text-xl leading-relaxed`} style={{ color: inkColor }}>
                    <p className="whitespace-pre-wrap min-h-[80px]">{note.content}</p>
                    <div className="mt-4 pt-3 border-t border-black/10 flex justify-between text-sm opacity-60 font-sans">
                      <span className="font-medium">{note.author}</span>
                      <span>{note.date}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Add Button */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-500/30 z-50"
          >
            <Plus size={28} strokeWidth={2.5} />
          </motion.button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Pencil size={20} className="text-amber-500" />
              写一条留言
            </DialogTitle>
            <DialogDescription>分享你对学弟学妹的建议、祝福或校园生活贴士。</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">内容</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="分享学习技巧、校园生活贴士，或者一句鼓励的话..."
                className="min-h-[120px] resize-none"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">署名 (可选)</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="例如：24届 学姐"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>便签颜色</Label>
                <div className="flex gap-2">
                  {(Object.keys(PAPER_COLORS) as PaperColor[]).map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === c ? 'border-zinc-400 ring-2 ring-zinc-200 scale-110' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: PAPER_COLORS[c], boxShadow: selectedColor === c ? NOTE_SHADOWS[c] : 'none' }}
                    >
                      {selectedColor === c && <Check size={14} className="text-black/40" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>墨水颜色</Label>
                <div className="flex gap-2">
                  {(Object.keys(INK_COLORS) as InkColor[]).map(i => (
                    <button
                      key={i}
                      onClick={() => setSelectedInk(i)}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${selectedInk === i ? 'border-zinc-400 ring-2 ring-zinc-200 scale-110' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: INK_COLORS[i] }}
                    >
                      {selectedInk === i && <Check size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Font Selector */}
            <div className="space-y-2">
              <Label>字体风格</Label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(FONTS) as FontFamily[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedFont(f)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${selectedFont === f
                      ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                      }`}
                  >
                    <span className={`${FONTS[f]} text-lg block`} style={{ color: INK_COLORS[selectedInk] }}>
                      {FONT_NAMES[f]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>取消</Button>
            <Button
              onClick={handleCreateNote}
              disabled={!content.trim()}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              贴上留言 ✨
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Seniors;