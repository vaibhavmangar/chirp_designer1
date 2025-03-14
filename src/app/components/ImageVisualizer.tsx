import { useState } from 'react';

interface ImageVisualizerProps {
  imagePath: string;
  alt: string;
}

export default function ImageVisualizer({ imagePath, alt }: ImageVisualizerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleOpenInNewTab = () => {
    window.open(imagePath, '_blank');
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-gray-800 rounded-lg p-4">
      <div className="relative">
        <img
          src={imagePath}
          alt={alt}
          className="w-full h-auto rounded-lg"
          style={{ maxWidth: '100%' }}
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleOpenInNewTab}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
          >
            Open in New Tab
          </button>
          <button
            onClick={handleFullscreen}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>
    </div>
  );
} 