
import React, { useState } from 'react';
import { Tool, Model, AspectRatio } from '../types';
import { generateImageFromPrompt } from '../services/geminiService';
import Spinner from './Spinner';
import { DownloadIcon } from './IconComponents';

interface ImageGeneratorProps {
  activeTool: Tool;
  selectedModel: Model;
  onApiKeyError: () => void;
}

const promptPlaceholders: { [key in Tool]?: string } = {
    [Tool.GENERATE]: 'Фотореалистичный кот в скафандре, сидящий на луне...',
    [Tool.AVATAR]: 'Аватар киберпанк-самурая, неоновые огни, вид спереди...',
    [Tool.PHOTOSHOOT]: 'Фотосессия модели в винтажном стиле, улица Парижа, золотой час...',
};

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ activeTool, selectedModel, onApiKeyError }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Пожалуйста, введите текстовое описание.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImageFromPrompt(prompt, selectedModel, aspectRatio);
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
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={promptPlaceholders[activeTool] || 'Опишите изображение, которое вы хотите создать...'}
          className="w-full h-24 p-3 bg-gray-900/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-200 resize-none"
          disabled={isLoading}
        />

        <div className="mt-4">
            <label htmlFor="aspect-ratio-select" className="block text-sm font-medium text-gray-400 mb-1">
                Соотношение сторон
            </label>
            <select
                id="aspect-ratio-select"
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
          disabled={isLoading}
          className="mt-6 w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? <Spinner /> : 'Сгенерировать'}
        </button>
      </form>

      {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}

      <div className="flex-grow flex items-center justify-center bg-gray-900/50 rounded-lg p-4 min-h-[300px] sm:min-h-[400px] border border-dashed border-gray-700">
        {isLoading && <div className="text-center"><Spinner /><p className="mt-2 text-gray-400">Генерация изображения...</p></div>}
        {generatedImage && !isLoading && (
          <div className="relative group">
            <img src={generatedImage} alt="Сгенерированное изображение" className="max-w-full max-h-[45vh] object-contain rounded-md shadow-lg" />
            <a
              href={generatedImage}
              download="generated-image.png"
              className="absolute bottom-4 right-4 bg-black/60 p-2 rounded-full text-white hover:bg-purple-600 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Download image"
            >
              <DownloadIcon className="w-6 h-6" />
            </a>
          </div>
        )}
        {!generatedImage && !isLoading && <p className="text-gray-500">Здесь появится ваше изображение.</p>}
      </div>
    </div>
  );
};

export default ImageGenerator;
