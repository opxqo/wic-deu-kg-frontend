
import { StickerPack, Sticker } from '../types/sticker';

/**
 * Helper to generate a sticker pack configuration
 * @param format - The file extension for the stickers (default: 'tgs')
 */
const generatePack = (id: string, name: string, baseUrl: string, count: number, format: 'tgs' | 'webm' = 'tgs'): StickerPack => {
  const stickers: Sticker[] = Array.from({ length: count }, (_, i) => {
    const fileNum = i + 1;
    return {
      id: `${id}-${fileNum}`,
      fileUrl: `${baseUrl}${fileNum}.${format}`,
    };
  });

  return {
    id,
    name,
    // Use the first sticker as the pack's thumbnail icon
    thumbnailUrl: `${baseUrl}1.${format}`,
    stickers,
  };
};

export const stickerService = {
  fetchStickerPacks: async (): Promise<StickerPack[]> => {
    // Simulate network latency (500ms)
    return new Promise((resolve) => {
      setTimeout(() => {
        // 1. Duck Pack (40 items) - TGS
        const duckPack = generatePack(
          'duck',
          'Duck',
          'https://r2.wic.edu.kg/stickers/duck/',
          40
        );

        // 2. Crocosaurus Pack (30 items) - TGS
        const crocoPack = generatePack(
          'crocosaurus',
          'Croco',
          'https://r2.wic.edu.kg/stickers/crocosaurus/',
          30
        );

        // 3. Cute Chick (16 items) - WebM (Transparent Video)
        const chickPack = generatePack(
          'cjflc01',
          'Chick',
          'https://r2.wic.edu.kg/stickers/cjflc01/',
          16,
          'webm'
        );

        resolve([duckPack, crocoPack, chickPack]);
      }, 500);
    });
  },
};
