
import React, { useState, useCallback, useEffect } from 'react';
import { Tool, Model, UploadedImage, AspectRatio } from '../types';
import { editImageWithPrompt } from '../services/geminiService';
import Spinner from './Spinner';
import { DownloadIcon, UploadIcon } from './IconComponents';

interface ImageEditorProps {
  activeTool: Tool;
  selectedModel: Model;
  onApiKeyError: () => void;
}

const promptPlaceholders: { [key in Tool]?: string } = {
  [Tool.PORTRAIT]: 'Преврати это фото в профессиональный корпоративный портрет...',
  [Tool.PHOTOSHOOT]: 'Сделай фотосессию этого человека в стиле 90-х, на фоне граффити...',
  [Tool.EDIT]: 'Убери человека на заднем плане и сделай небо более драматичным...',
  [Tool.ENHANCE]: 'Улучши качество этого фото: повысь резкость, исправь цвета и освещение.',
};

const fileToUploadedImage = (file: File): Promise<UploadedImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve({
        base64: result.split(',')[1],
        mimeType: file.type,
        previewUrl: result,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const ImageEditor: React.FC<ImageEditorProps> = ({ activeTool, selectedModel, onApiKeyError }) => {
  const [prompt, setPrompt] = useState(promptPlaceholders[activeTool] || '');
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

  useEffect(() => {
    setPrompt(promptPlaceholders[activeTool] || '');
    setUploadedImage(null);
    setGeneratedImage(null);
    setError(null);
  }, [activeTool]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('Размер файла не должен превышать 4 МБ.');
        return;
      }
      try {
        setError(null);
        setGeneratedImage(null);
        const imageData = await fileToUploadedImage(file);
        setUploadedImage(imageData);
      } catch (err) {
        setError('Не удалось загрузить файл.');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedImage) {
      setError('Пожалуйста, загрузите изображение.');
      return;
    }
    if (!prompt.trim()) {
      setError('Пожалуйста, введите текстовое описание для редактирования.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await editImageWithPrompt(prompt, uploadedImage, selectedModel, aspectRatio);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
       if (err.message?.includes('API key not valid')) {
        setError('API ключ недействителен. Пожалуйста, выберите другой ключ.');
        onApiKeyError();
      } else {
        setError(err.message || 'Произошла неизвестная ошибка.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 text-purple-300">{activeTool}</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                 <label className="block mb-2 text-sm font-medium text-gray-300">1. Загрузите изображение</label>
                 <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-900/70 hover:bg-gray-800/80">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-center text-gray-400"><span className="font-semibold">Нажмите для загрузки</span></p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP (до 4МБ)</p>
                    </div>
                    <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} disabled={isLoading} />
                </label>
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">2. Опишите изменения</label>
                 <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={promptPlaceholders[activeTool] || 'Опишите, что нужно изменить...'}
                    className="w-full h-32 p-3 bg-gray-900/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-200 resize-none"
                    disabled={isLoading}
                    />
            </div>
        </div>
        <div className="mt-4">
            <label htmlFor="aspect-ratio-select-editor" className="block text-sm font-medium text-gray-400 mb-1">
                Соотношение сторон
            </label>
            <select
                id="aspect-ratio-select-editor"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full sm:w-1/2 bg-gray-900/70 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
                disabled={isLoading}
            >
                <option value="1:1">Квадрат (1:1)</option>
                <option value="16:9">Пейзаж (16:9)</option>
                <option value="9:16">Портрет (9:16)</option>
                <option value="4:3">Альбом (4:3)</option>
                <option value="3:4">Книга (3:4)</option>
            </select>
        </div>
        <button
          type="submit"
          disabled={isLoading || !uploadedImage}
          className="mt-6 w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? <Spinner /> : 'Применить'}
        </button>
      </form>

      {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg my-4">{error}</div>}

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900/50 rounded-lg p-4 min-h-[300px] sm:min-h-[400px] border border-dashed border-gray-700">
        <div className="flex flex-col items-center justify-center">
            <h3 className="text-gray-400 mb-2 font-semibold">Оригинал</h3>
            <div className="w-full h-full flex items-center justify-center bg-gray-800/50 rounded-md p-2 min-h-[150px]">
                {uploadedImage ? <img src={uploadedImage.previewUrl} alt="Загруженное" className="max-w-full max-h-[35vh] object-contain rounded" /> : <p className="text-gray-500 text-center">Изображение для редактирования</p>}
            </div>
        </div>
        <div className="flex flex-col items-center justify-center">
             <h3 className="text-gray-400 mb-2 font-semibold">Результат</h3>
            <div className="w-full h-full flex items-center justify-center bg-gray-800/50 rounded-md p-2 min-h-[150px]">
                {isLoading && <div className="text-center"><Spinner /><p className="mt-2 text-gray-400">Обработка...</p></div>}
                {generatedImage && !isLoading && (
                    <div className="relative group">
                        <img src={generatedImage} alt="Результат" className="max-w-full max-h-[35vh] object-contain rounded" />
                        <a
                        href={generatedImage}
                        download="edited-image.png"
                        className="absolute bottom-2 right-2 bg-black/60 p-2 rounded-full text-white hover:bg-purple-600 transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Download image"
                        >
                        <DownloadIcon className="w-6 h-6" />
                        </a>
                    </div>
                )}
                {!generatedImage && !isLoading && <p className="text-gray-500 text-center">Здесь появится результат</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
