
import React from 'react';

interface ApiKeyPromptProps {
  onKeySelected: () => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success and immediately hide the prompt to allow the API call to proceed.
      // This handles a potential race condition where hasSelectedApiKey() might not be updated instantly.
      onKeySelected();
    } else {
      alert('Функция выбора API-ключа недоступна в этой среде.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-gray-900/50 rounded-lg p-6">
      <h3 className="text-2xl font-bold text-purple-300 mb-4">Требуется API-ключ</h3>
      <p className="text-gray-300 max-w-md mb-6">
        Для использования модели Gemini Pro (Качественный) необходимо выбрать API-ключ из платного проекта Google Cloud.
      </p>
      <button
        onClick={handleSelectKey}
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all duration-200"
      >
        Выбрать API-ключ
      </button>
      <a
        href="https://ai.google.dev/gemini-api/docs/billing"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-sm text-purple-400 hover:text-purple-300 underline"
      >
        Узнать больше о биллинге
      </a>
    </div>
  );
};

export default ApiKeyPrompt;
