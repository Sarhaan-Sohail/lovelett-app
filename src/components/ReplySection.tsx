import React from 'react';
import { HeartHandshake } from 'lucide-react';

interface LetterBoxProps {
  headline: string;
  paragraphs: string[];
  hisName: string;
}

export const LetterBox: React.FC<LetterBoxProps> = ({ headline, paragraphs, hisName }) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-12 bg-[#F8C8D4] text-[#2A0826] rounded-3xl p-7 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(248,200,212,0.25)] animate-fade-in-up">
      {/* Decorative top accent with gentle glow */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#FFB3C6]/50 rounded-full blur-2xl pointer-events-none animate-pulse" />

      <div className="flex items-center justify-between mb-6 border-b border-[#2A0826]/15 pb-4">
        <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#2A0826]">
          {headline}
        </h2>
        <HeartHandshake size={24} className="text-[#2A0826]/60 shrink-0" />
      </div>

      <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#2A0826]/85 font-light">
        {paragraphs.map((p, idx) => (
          <p key={idx} className="indent-4 sm:indent-6">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-8 pt-4 flex flex-col items-end">
        <span className="text-xs uppercase tracking-widest text-[#2A0826]/60 font-semibold mb-1">
          With all my love,
        </span>
        <span className="font-script text-3xl sm:text-4xl font-bold text-[#2A0826]">
          {hisName}
        </span>
      </div>
    </div>
  );
};
