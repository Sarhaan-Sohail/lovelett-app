import React from 'react';
import type { BucketListItem } from '../types/anniversary';
import { Compass, CheckCircle2 } from 'lucide-react';

interface NextChaptersProps {
  chapters: BucketListItem[];
}

export const NextChapters: React.FC<NextChaptersProps> = ({ chapters }) => {
  return (
    <section className="w-full max-w-2xl mx-auto my-14">
      <div className="text-center mb-6">
        <h2 className="font-script text-4xl sm:text-5xl text-[#F7D1DC] font-bold">
          Our next chapters
        </h2>
        <p className="text-xs sm:text-sm text-[#F7D1DC]/70 font-light mt-1 flex items-center justify-center gap-1.5">
          <Compass size={13} className="text-[#E83D64]" />
          <span>Adventures and dreams still waiting for us</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {chapters.map((item, idx) => (
          <div
            key={item.id}
            className="bg-[#330D26]/80 hover:bg-[#3B1231] border border-[#5E204E]/70 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 group hover:border-[#E83D64]/60"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E83D64]">
                  Dream #{idx + 1}
                </span>
                <CheckCircle2 size={14} className="text-[#F8C8D4]/40 group-hover:text-[#E83D64] transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-[#F7D1DC] mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-[#F7D1DC]/70 font-light leading-relaxed">
                {item.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
