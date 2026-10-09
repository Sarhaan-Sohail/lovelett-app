import React from 'react';
import type { GalleryPhoto } from '../types/anniversary';
import { PhotoFrame } from './PhotoFrame';
import { Sparkles } from 'lucide-react';

interface MomentsGalleryProps {
  moments: GalleryPhoto[];
  onUpdateImage: (photoId: string, dataUrl: string | undefined) => void;
  isEditable?: boolean;
}

export const MomentsGallery: React.FC<MomentsGalleryProps> = ({
  moments,
  onUpdateImage,
  isEditable = true,
}) => {
  return (
    <section className="w-full max-w-2xl mx-auto my-14">
      <div className="text-center mb-6">
        <h2 className="font-script text-4xl sm:text-5xl text-[#F7D1DC] font-bold">
          Our moments
        </h2>
        <p className="text-xs sm:text-sm text-[#F7D1DC]/70 font-light mt-1 flex items-center justify-center gap-1.5">
          <Sparkles size={13} className="text-[#E83D64]" />
          <span>Snapshots of memories we'll cherish forever</span>
        </p>
      </div>

      {/* 3-card photo grid matching PDF design */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {moments.map((item) => (
          <div key={item.id} className="flex flex-col">
            <div className="h-56 sm:h-64">
              <PhotoFrame
                image={item.image}
                placeholderText={item.placeholderText}
                onImageChange={(dataUrl) => onUpdateImage(item.id, dataUrl)}
                isEditable={isEditable}
              />
            </div>
            {item.caption && (
              <span className="text-center text-xs text-[#F7D1DC]/60 font-light mt-2 italic truncate px-1">
                {item.caption}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
