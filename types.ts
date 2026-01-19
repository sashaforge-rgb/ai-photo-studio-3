
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
