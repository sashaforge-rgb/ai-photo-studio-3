
import React from 'react';
import { PhotoIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 sm:px-6 md:px-8 bg-black/20 backdrop-blur-sm shadow-md">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <PhotoIcon className="w-8 h-8 text-purple-400" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            AI Photo Studio
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
