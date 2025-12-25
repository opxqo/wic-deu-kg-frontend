
export interface Sticker {
  id: string;
  fileUrl: string;
  emoji?: string; // Optional: linked emoji for future features
}

export interface StickerPack {
  id: string;
  name: string;
  thumbnailUrl: string; // URL for the pack icon (bottom nav)
  stickers: Sticker[];
}
