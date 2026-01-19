
import React, { useState, useEffect } from 'react';
import { Tool, Model } from './types';
import Header from './components/Header';
import ToolSelector from './components/ToolSelector';
import ModelSelector from './components/ModelSelector';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import ApiKeyPrompt from './components/ApiKeyPrompt';

// The global type for window.aistudio is now defined in types.ts.

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>(Tool.GENERATE);
  const [selectedModel, setSelectedModel] = useState<Model>(Model.FLASH);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (selectedModel === Model.PRO && window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setShowApiKeyPrompt(!hasKey);
      } else {
        setShowApiKeyPrompt(false);
      }
    };
    checkApiKey();
  }, [selectedModel]);

  const handleApiKeyError = () => {
    setShowApiKeyPrompt(true);
  };

  const editingTools: Tool[] = [Tool.PORTRAIT, Tool.PHOTOSHOOT, Tool.EDIT, Tool.ENHANCE];
  const isEditingTool = editingTools.includes(activeTool);

  const renderContent = () => {
    if (showApiKeyPrompt) {
      return <ApiKeyPrompt onKeySelected={() => setShowApiKeyPrompt(false)} />;
    }
    if (isEditingTool) {
      return <ImageEditor key={activeTool} activeTool={activeTool} selectedModel={selectedModel} onApiKeyError={handleApiKeyError} />;
    }
    return <ImageGenerator key={activeTool} activeTool={activeTool} selectedModel={selectedModel} onApiKeyError={handleApiKeyError} />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white font-sans flex flex-col">
      <Header />
      <main className="p-4 sm:p-6 md:p-8 flex-grow">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4 lg:w-1/5">
              <div className="md:sticky top-8 bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700/50">
                <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
                <hr className="my-4 border-gray-600/50" />
                <ToolSelector activeTool={activeTool} setActiveTool={setActiveTool} />
              </div>
            </aside>
            <div className="flex-1">
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700/50 min-h-[60vh]">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center py-4 px-4">
        <p className="text-sm text-gray-400">Разработано Alex Neiro</p>
      </footer>
    </div>
  );
};

export default App;
