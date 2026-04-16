import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "CyberSynth AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Digital Dreams",
    artist: "Neural Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Quantum Groove",
    artist: "Algorithmic Audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      if (dur) {
        setDuration(dur);
        setProgress((current / dur) * 100);
      }
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  return (
    <footer className="h-[100px] bg-black/80 border-t border-white/10 grid grid-cols-[300px_1fr_300px] items-center px-10 z-10 w-full shrink-0">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />
      
      <div className="flex items-center gap-[15px]">
        <div className="w-[50px] h-[50px] bg-gradient-to-tr from-[#222] to-[#444] rounded-[6px] border border-white/10 flex items-center justify-center">
          <Music className="w-5 h-5 text-white/50" />
        </div>
        <div>
          <h4 className="text-[14px] mb-[2px] font-sans font-bold">{currentTrack.title}</h4>
          <p className="text-[11px] opacity-50 font-sans">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <div className="flex items-center justify-center gap-[30px]">
          <button 
            onClick={handlePrev}
            className="bg-transparent border-none text-white cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={handlePlayPause}
            className="w-[48px] h-[48px] rounded-full bg-white text-black flex items-center justify-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>
          <button 
            onClick={handleNext}
            className="bg-transparent border-none text-white cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
        <div className="w-full flex items-center gap-[10px] mt-[10px] max-w-md">
          <span className="font-mono text-[10px] text-white/50">{formatTime(currentTime)}</span>
          <div 
            className="flex-1 h-[4px] bg-[#333] rounded-[2px] relative cursor-pointer" 
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-[#00f2ff] rounded-[2px] shadow-[0_0_8px_#00f2ff] pointer-events-none" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <span className="font-mono text-[10px] text-white/50">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="text-right opacity-50 text-[11px] font-sans flex items-center justify-end gap-4">
        <Volume2 className="w-4 h-4" />
        Bitrate: 320kbps / Stereo
      </div>
    </footer>
  );
}
