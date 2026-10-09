import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music, Upload, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  songTitle: string;
  songArtist: string;
  audioUrl?: string;
  isEditable?: boolean;
  onAudioChange?: (audioDataUrl: string | undefined) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  songTitle,
  songArtist,
  audioUrl,
  isEditable = true,
  onAudioChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default sweet acoustic ambient music track fallback if no custom audio is uploaded
  const defaultTrack = "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3";
  const activeAudioSrc = audioUrl || defaultTrack;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0);
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Audio autoplay / play restricted:", err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAudioChange) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onAudioChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8 bg-[#3B1231]/80 hover:bg-[#431538] border border-[#5E204E]/70 rounded-full px-5 py-3.5 flex items-center justify-between shadow-lg backdrop-blur-sm transition-all group relative">
      <audio
        ref={audioRef}
        src={activeAudioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        muted={isMuted}
        preload="metadata"
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAudioUpload}
        accept="audio/*"
        className="hidden"
      />

      <div className="flex items-center gap-3.5 overflow-hidden">
        <button
          type="button"
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#F8C8D4] hover:bg-white text-[#2A0826] flex items-center justify-center shrink-0 shadow-md transition-transform active:scale-95 cursor-pointer"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={17} className="fill-current text-[#2A0826]" />
          ) : (
            <Play size={17} className="fill-current text-[#2A0826] ml-0.5" />
          )}
        </button>

        <div className="flex flex-col truncate">
          <span className="text-[10px] uppercase tracking-widest text-[#F8C8D4]/60 font-bold">
            OUR SONG
          </span>
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-sm font-semibold text-[#F8C8D4] truncate">
              {songTitle}
            </span>
            <span className="text-xs text-[#F8C8D4]/60 truncate">
              — {songArtist}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pr-2">
        {/* Equalizer animation */}
        <div className="flex items-center gap-1">
          <div className={`w-1 h-3 rounded-full bg-[#F8C8D4] transition-all duration-300 ${isPlaying ? 'animate-bounce' : 'opacity-40'}`} />
          <div className={`w-1 h-5 rounded-full bg-[#F8C8D4] transition-all duration-300 ${isPlaying ? 'animate-bounce delay-150' : 'opacity-60'}`} />
          <div className={`w-1 h-4 rounded-full bg-[#F8C8D4] transition-all duration-300 ${isPlaying ? 'animate-bounce delay-300' : 'opacity-40'}`} />
        </div>

        {/* Mute/Unmute */}
        {isPlaying && (
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 text-[#F8C8D4]/70 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        )}

        {/* Custom Audio Upload Button */}
        {isEditable && onAudioChange && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 bg-[#230823]/80 hover:bg-[#5E204E] text-[#F8C8D4]/70 hover:text-white rounded-full transition-colors cursor-pointer"
            title="Upload your MP3 / audio file"
          >
            <Upload size={13} />
          </button>
        )}

        <Music size={15} className="text-[#F8C8D4]/60 ml-1 hidden sm:inline" />
      </div>

      {/* Mini track progress indicator under the pill */}
      {isPlaying && (
        <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#E83D64] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
