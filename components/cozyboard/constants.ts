import React from 'react';
import { PaperColor, PaperTexture, InkColor, FontFamily } from './types';

export const PAPER_COLORS: Record<PaperColor, string> = {
    yellow: '#fef3c7', // amber-100
    pink: '#fce7f3',   // pink-100
    green: '#dcfce7',  // green-100
    kraft: '#d6c096',  // Custom kraft color
};

export const INK_COLORS: Record<InkColor, string> = {
    blue: '#1e3a8a',   // blue-900
    black: '#1f2937',  // gray-800
    red: '#991b1b',    // red-800
    pencil: '#4b5563', // gray-600
};

export const FONTS: Record<FontFamily, string> = {
    caveat: 'font-mashan',      // ID: 1 马上正
    dancing: 'font-longcang',   // ID: 2 龙藏
    indie: 'font-kuaile',       // ID: 3 站酷快乐体
    shadows: 'font-liujian',    // ID: 4 刘建毛草
};

// Chinese font display names for UI (match database name field)
export const FONT_NAMES: Record<FontFamily, string> = {
    caveat: '马上正',      // ID: 1
    dancing: '龙藏体',     // ID: 2
    indie: '快乐体',       // ID: 3
    shadows: '毛草体',     // ID: 4
};

// Font ID mapping for database storage
export const FONT_IDS: Record<FontFamily, number> = {
    caveat: 1,
    dancing: 2,
    indie: 3,
    shadows: 4,
};

// Reverse mapping: database ID to FontFamily key
export const ID_TO_FONT: Record<number, FontFamily> = {
    1: 'caveat',
    2: 'dancing',
    3: 'indie',
    4: 'shadows',
};

// CSS patterns for textures
export const TEXTURES: Record<PaperTexture, React.CSSProperties> = {
    plain: {},
    lined: {
        backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, rgba(0,0,0,0.1) 30px)',
        backgroundAttachment: 'local',
    },
    grid: {
        backgroundImage: `
      linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
    `,
        backgroundSize: '20px 20px',
    },
};

export const PAPER_NOISE = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAA5OTkAAABMTExERERmZmYzMzMyMjJ4Fk3xAAAACHRSTlMAMwA3M3YzM3OqO0LrAAABHglEQVQ4y6XTsW0DMQyF4R931xCnD2D2Dq4gj9WbfkyoUEg2j+A0GdyT5yN19+v9/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f392879v8B')";

export const INITIAL_NOTES_DATA = [
    {
        id: '1',
        x: 100,
        y: 100,
        rotation: -2,
        content: "欢迎来到毕业生留言板！🎓\n\n这里是留给学弟学妹们的建议、回忆和祝福的地方。请畅所欲言！",
        author: "学生会",
        date: new Date().toLocaleDateString(),
        style: { color: 'yellow', texture: 'lined', font: 'caveat', ink: 'blue' }
    },
    {
        id: '2',
        x: 450,
        y: 120,
        rotation: 3,
        content: "王老师的历史课虽然作业多，但是真的能学到东西！记得多去图书馆查资料。📚",
        author: "24届 学姐",
        date: new Date().toLocaleDateString(),
        style: { color: 'pink', texture: 'plain', font: 'indie', ink: 'black' }
    },
    {
        id: '3',
        x: 200,
        y: 400,
        rotation: -1,
        content: "最佳自习地点：图书馆三楼靠窗的位置。风景好，而且非常安静。🤫",
        author: "张同学",
        date: new Date().toLocaleDateString(),
        style: { color: 'kraft', texture: 'grid', font: 'shadows', ink: 'pencil' }
    },
    {
        id: '4',
        x: 600,
        y: 350,
        rotation: 2,
        content: "别错过新生联谊会！那是认识新朋友最好的机会，不要害羞。",
        author: "李明",
        date: new Date().toLocaleDateString(),
        style: { color: 'green', texture: 'plain', font: 'dancing', ink: 'red' }
    }
] as const;
