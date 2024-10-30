import React from 'react';
import ReactPlayer from 'react-player';
import { Play } from 'lucide-react';

interface VideoProps {
  video: {
    id: string;
    title: string;
    url: string;
    description: string;
  };
}

function VideoPlayer({ video }: VideoProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{video.title}</h3>
        <p className="text-sm text-gray-500">{video.description}</p>
      </div>

      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {!isPlaying ? (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-60 transition-opacity"
          >
            <Play className="h-16 w-16 text-white" />
          </button>
        ) : (
          <ReactPlayer
            url={video.url}
            width="100%"
            height="100%"
            controls
            playing={isPlaying}
          />
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;