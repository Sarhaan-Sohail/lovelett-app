import React, { useState } from 'react';
import { Send, MessageCircle, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReplySectionProps {
  hisName: string;
  quickReactions: string[];
  partnerPhoneNumber?: string;
}

export const ReplySection: React.FC<ReplySectionProps> = ({
  hisName,
  quickReactions,
  partnerPhoneNumber = "",
}) => {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [hasSent, setHasSent] = useState(false);

  const handleSelectReaction = (reaction: string) => {
    setSelectedReaction((prev) => (prev === reaction ? null : reaction));
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#F7D1DC', '#E83D64', '#FFB3C6', '#FFFFFF']
    });
  };

  const handleSendDirect = () => {
    if (!selectedReaction && !customMessage.trim()) return;
    triggerCelebration();
    setHasSent(true);
  };

  const handleWhatsAppSend = () => {
    const textParts = [
      `💌 *Lovelett Reply for ${hisName}*`,
      selectedReaction ? `*Feeling:* ${selectedReaction}` : null,
      customMessage.trim() ? `*Message:* ${customMessage}` : null,
    ].filter(Boolean);

    const encodedText = encodeURIComponent(textParts.join("\n\n"));
    const cleanPhone = partnerPhoneNumber.replace(/[^0-9]/g, "");
    const waUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodedText}` 
      : `https://wa.me/?text=${encodedText}`;

    triggerCelebration();
    window.open(waUrl, "_blank");
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-14 bg-[#F8C8D4] text-[#2A0826] rounded-3xl p-6 sm:p-8 shadow-2xl transition-all">
      <h3 className="font-script text-3xl sm:text-4xl text-center mb-1 font-bold">
        Send {hisName ? `${hisName}` : 'him'} your reply
      </h3>
      <p className="text-center text-xs sm:text-sm text-[#2A0826]/75 mb-6">
        Tell him what this story means to you. He will see it privately.
      </p>

      {/* Quick Reaction Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-5">
        {quickReactions.map((reaction, idx) => {
          const isSelected = selectedReaction === reaction;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectReaction(reaction)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border ${
                isSelected
                  ? 'bg-[#2A0826] text-[#F8C8D4] border-[#2A0826] shadow-md scale-105'
                  : 'bg-transparent text-[#2A0826] border-[#2A0826]/30 hover:border-[#2A0826] hover:bg-white/20'
              }`}
            >
              {reaction}
            </button>
          );
        })}
      </div>

      {/* Optional Custom Message Area */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-[#2A0826]/70 mb-2 pl-1">
          Add a message (optional)
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Write anything you want him to know..."
          rows={3}
          className="w-full bg-white/70 focus:bg-white border border-[#2A0826]/20 rounded-2xl p-3.5 text-sm text-[#2A0826] placeholder-[#2A0826]/40 focus:outline-none focus:ring-2 focus:ring-[#2A0826]/30 transition-all resize-none shadow-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handleSendDirect}
          className="w-full sm:flex-1 bg-[#2A0826] hover:bg-[#3D0C37] text-[#F8C8D4] font-medium py-3.5 px-6 rounded-full flex items-center justify-center gap-2 text-sm shadow-lg transition-transform active:scale-95"
        >
          {hasSent ? (
            <>
              <Check size={16} />
              <span>Sent to {hisName}!</span>
            </>
          ) : (
            <>
              <Send size={15} />
              <span>Send to {hisName ? `${hisName}` : 'him'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleWhatsAppSend}
          className="w-full sm:w-auto text-xs sm:text-sm font-medium text-[#2A0826]/90 hover:text-[#2A0826] underline underline-offset-4 flex items-center justify-center gap-1.5 py-2 px-3 hover:opacity-80 transition-opacity"
        >
          <MessageCircle size={15} className="text-[#128C7E]" />
          <span>Prefer WhatsApp? Send it there instead</span>
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-[#2A0826]/10 text-center">
        <p className="text-[11px] text-[#2A0826]/60">
          Private: encrypted on your phone, so only {hisName ? `${hisName}` : 'he'} can read it.
        </p>
      </div>
    </div>
  );
};
