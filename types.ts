export enum Tool {
  GENERATE = 'Генерация фото',
  PORTRAIT = 'Портретный адаптер',
  AVATAR = 'Создание аватара',
  PHOTOSHOOT = 'Фотосессия',
  EDIT = 'Редактирование',
  ENHANCE = 'Улучшение фото',
}

export enum Model {
  FLASH = 'gemini-2.5-flash-image',
  PRO = 'gemini-3-pro-image-preview',
}

export interface UploadedImage {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

// Centralize AIStudio interface and global declaration to avoid type conflicts across files.
// FIX: Removed 'export' from AIStudio to fix "Subsequent property declarations" error.
// The interface is used for global augmentation and does not need to be exported.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio?: AIStudio;
  }
}
