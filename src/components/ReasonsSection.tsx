import React, { useState } from 'react';
import type { ReasonItem } from '../types/anniversary';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ReasonsSectionProps {
  reasons: ReasonItem[];
}

export const ReasonsSection: React.FC<ReasonsSectionProps> = ({ reasons }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleReason = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full max-w-2xl mx-auto my-14">
      <div className="text-center mb-6">
        <h2 className="font-script text-4xl sm:text-5xl text-[#F7D1DC] font-bold">
          Reasons I love you
        </h2>
        <p className="text-xs sm:text-sm text-[#F7D1DC]/70 font-light mt-1">
          A few little reasons among millions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {reasons.map((item, idx) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => toggleReason(item.id)}
              className={`cursor-pointer rounded-2xl border transition-all duration-300 p-4 ${
                isExpanded
                  ? 'bg-[#4A163E] border-[#E83D64] shadow-lg'
                  : 'bg-[#330D26]/80 hover:bg-[#3B1231] border-[#5E204E]/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#E83D64]/20 border border-[#E83D64]/40 flex items-center justify-center text-[10px] font-bold text-[#E83D64]">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-[#F7D1DC]">
                    {item.title}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp size={15} className="text-[#E83D64]" />
                ) : (
                  <ChevronDown size={15} className="text-[#F7D1DC]/50" />
                )}
              </div>

              {isExpanded && (
                <div className="mt-3 pt-2.5 border-t border-[#5E204E]/50 text-xs sm:text-sm text-[#F7D1DC]/80 font-light leading-relaxed animate-fadeIn">
                  {item.detail}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
