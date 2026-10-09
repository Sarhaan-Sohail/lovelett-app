import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, Trash2, ShieldCheck } from 'lucide-react';

interface PhotoFrameProps {
  image?: string;
  placeholderText?: string;
  onImageChange: (dataUrl: string | undefined) => void;
  isEditable?: boolean;
}

export const PhotoFrame: React.FC<PhotoFrameProps> = ({
  image,
  placeholderText = "Photo: added by him, encrypted",
  onImageChange,
  isEditable = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Direct in-browser local client-side read (zero upload to server/backend)
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onImageChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="relative group w-full h-full min-h-[220px] sm:min-h-[260px] bg-[#3B1231]/80 hover:bg-[#431538] border border-[#5E204E]/60 rounded-2xl overflow-hidden flex flex-col items-center justify-center transition-all duration-300 shadow-inner">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {image ? (
        <div className="relative w-full h-full min-h-[220px] sm:min-h-[260px]">
          <img
            src={image}
            alt="Uploaded moment"
            className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#230823]/80 via-transparent to-transparent pointer-events-none" />

          {isEditable && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-[#230823]/90 hover:bg-[#5E204E] text-pink-200 rounded-full shadow-lg backdrop-blur-sm transition-colors text-xs flex items-center gap-1"
                title="Change Photo"
              >
                <Camera size={14} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-950/90 hover:bg-red-800 text-red-200 rounded-full shadow-lg backdrop-blur-sm transition-colors text-xs"
                title="Remove Photo"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => isEditable && fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 text-center w-full h-full ${
            isEditable ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#4A163E] border border-[#6C225B]/50 flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
            <ImageIcon className="text-[#F7D1DC]/70" size={20} />
          </div>
          <span className="text-xs sm:text-sm font-medium text-[#F7D1DC]/80 px-4 leading-relaxed">
            {placeholderText}
          </span>
          {isEditable && (
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#F7D1DC]/50 font-light">
              <ShieldCheck size={12} className="text-pink-300" />
              <span>Click to add photo (self-stored in browser)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
