
import React from 'react';
import { Model } from '../types';

interface ModelSelectorProps {
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
}

const modelDisplayNames: { [key in Model]: string } = {
  [Model.FLASH]: 'Nano Banana (Быстрый)',
  [Model.PRO]: 'Gemini Pro (Качественный)',
};

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, setSelectedModel }) => {
  return (
    <div>
      <label htmlFor="model-select" className="block text-sm font-semibold text-gray-400 mb-2 px-2">
        Модель генерации
      </label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value as Model)}
        className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
      >
        {Object.values(Model).map((model) => (
          <option key={model} value={model}>
            {modelDisplayNames[model]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;
