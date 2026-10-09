import React, { useState, useEffect } from 'react';
import { Heart, Clock } from 'lucide-react';

interface RelationshipCounterProps {
  startDate: string; // "YYYY-MM-DD"
  herName: string;
}

export const RelationshipCounter: React.FC<RelationshipCounterProps> = ({ startDate, herName }) => {
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(startDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeTogether({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="w-full max-w-lg mx-auto mb-10 bg-[#3B1231]/70 border border-[#5E204E]/80 rounded-3xl p-5 shadow-xl backdrop-blur-sm text-center">
      <div className="flex items-center justify-center gap-1.5 text-xs text-[#F8C8D4]/70 uppercase tracking-widest font-semibold mb-3">
        <Clock size={13} className="text-[#E83D64]" />
        <span>Loving {herName} for</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-[#230823]/80 rounded-2xl p-2.5 sm:p-3 border border-[#5E204E]/50">
          <span className="font-serif-title text-2xl sm:text-3xl font-bold text-[#F8C8D4]">
            {timeTogether.days}
          </span>
          <span className="block text-[10px] sm:text-xs text-[#F8C8D4]/60 uppercase tracking-wider mt-0.5">
            Days
          </span>
        </div>

        <div className="bg-[#230823]/80 rounded-2xl p-2.5 sm:p-3 border border-[#5E204E]/50">
          <span className="font-serif-title text-2xl sm:text-3xl font-bold text-[#F8C8D4]">
            {timeTogether.hours}
          </span>
          <span className="block text-[10px] sm:text-xs text-[#F8C8D4]/60 uppercase tracking-wider mt-0.5">
            Hours
          </span>
        </div>

        <div className="bg-[#230823]/80 rounded-2xl p-2.5 sm:p-3 border border-[#5E204E]/50">
          <span className="font-serif-title text-2xl sm:text-3xl font-bold text-[#F8C8D4]">
            {timeTogether.minutes}
          </span>
          <span className="block text-[10px] sm:text-xs text-[#F8C8D4]/60 uppercase tracking-wider mt-0.5">
            Mins
          </span>
        </div>

        <div className="bg-[#230823]/80 rounded-2xl p-2.5 sm:p-3 border border-[#5E204E]/50">
          <span className="font-serif-title text-2xl sm:text-3xl font-bold text-[#E83D64]">
            {timeTogether.seconds}
          </span>
          <span className="block text-[10px] sm:text-xs text-[#F8C8D4]/60 uppercase tracking-wider mt-0.5">
            Secs
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#F8C8D4]/50">
        <Heart size={11} className="fill-[#E83D64] text-[#E83D64]" />
        <span>Every second counted, every moment cherished</span>
      </div>
    </div>
  );
};
