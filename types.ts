
export enum ImageSize {
  SIZE_1K = "1K",
  SIZE_2K = "2K",
  SIZE_4K = "4K"
}

export interface GeneratedImage {
  url: string;
  blob: Blob;
}

export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

export interface HistoryItem {
  id: string;
  imageUrl: string;
  timestamp: number;
  size: ImageSize;
  styleId: string;
}
