export type PaperColor = 'yellow' | 'pink' | 'green' | 'kraft';
export type PaperTexture = 'plain' | 'lined' | 'grid';
export type InkColor = 'blue' | 'black' | 'red' | 'pencil';
export type FontFamily = 'caveat' | 'dancing' | 'indie' | 'shadows';
export type ViewMode = 'free' | 'grid' | 'list';

export interface NoteData {
    id: string;
    x: number;
    y: number;
    rotation: number;
    content: string;
    author: string;
    date: string;
    style: {
        color: PaperColor;
        texture: PaperTexture;
        font: FontFamily;
        ink: InkColor;
    };
}

export interface NoteStyleConfig {
    bg: string;
    shadow: string;
}
