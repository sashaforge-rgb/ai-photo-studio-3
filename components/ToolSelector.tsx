
import React from 'react';
import { Tool } from '../types';
import { GenerateIcon, PortraitIcon, AvatarIcon, PhotoshootIcon, EditIcon, EnhanceIcon } from './IconComponents';

interface ToolSelectorProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
}

const toolIcons: { [key in Tool]: React.ReactNode } = {
  [Tool.GENERATE]: <GenerateIcon className="w-5 h-5" />,
  [Tool.PORTRAIT]: <PortraitIcon className="w-5 h-5" />,
  [Tool.AVATAR]: <AvatarIcon className="w-5 h-5" />,
  [Tool.PHOTOSHOOT]: <PhotoshootIcon className="w-5 h-5" />,
  [Tool.EDIT]: <EditIcon className="w-5 h-5" />,
  [Tool.ENHANCE]: <EnhanceIcon className="w-5 h-5" />,
};


const ToolSelector: React.FC<ToolSelectorProps> = ({ activeTool, setActiveTool }) => {
  return (
    <nav>
      <h2 className="text-sm font-semibold text-gray-400 mb-3 px-2">Инструменты</h2>
      <ul className="space-y-2">
        {Object.values(Tool).map((tool) => (
          <li key={tool}>
            <button
              onClick={() => setActiveTool(tool)}
              className={`w-full flex items-center gap-4 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                activeTool === tool
                  ? 'bg-purple-600 text-white font-semibold shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'
              }`}
            >
              {toolIcons[tool]}
              <span className="text-base">{tool}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ToolSelector;
