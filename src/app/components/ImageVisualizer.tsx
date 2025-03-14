import { useState } from 'react';
import Image from 'next/image';

interface ImageVisualizerProps {
  imagePath: string;
  alt: string;
}

const ImageVisualizer = ({ imagePath, alt }: ImageVisualizerProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const openInNewTab = () => {
    window.open(imagePath, '_blank');
  };

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
        <button
          onClick={handleFullScreen}
          className="absolute top-4 right-4 text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md"
        >
          Close
        </button>
        <img
          src={imagePath}
          alt={alt}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 space-x-4 z-10">
        <button
          onClick={handleFullScreen}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
        >
          Full Screen
        </button>
        <button
          onClick={openInNewTab}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
        >
          Open in New Tab
        </button>
      </div>
      <div className="relative w-full h-[400px]">
        <Image
          src={imagePath}
          alt={alt}
          layout="fill"
          objectFit="contain"
        />
      </div>
    </div>
  );
};

export default ImageVisualizer; 