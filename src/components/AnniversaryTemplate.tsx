import React from 'react';
import type { AnniversaryData } from '../types/anniversary';
import { MotionBackground } from './MotionBackground';
import { RelationshipCounter } from './RelationshipCounter';
import { LetterBox } from './LetterBox';
import { PhotoFrame } from './PhotoFrame';
import { MomentsGallery } from './MomentsGallery';
import { ReasonsSection } from './ReasonsSection';
import { NextChapters } from './NextChapters';
import { AudioPlayer } from './AudioPlayer';
import { ReplySection } from './ReplySection';
import { Sparkles, Calendar } from 'lucide-react';

interface AnniversaryTemplateProps {
  data: AnniversaryData;
  isEditable?: boolean;
  onUpdateMilestoneImage: (milestoneId: string, dataUrl: string | undefined) => void;
  onUpdateGalleryImage: (photoId: string, dataUrl: string | undefined) => void;
  onUpdateAudio?: (audioDataUrl: string | undefined) => void;
}

export const AnniversaryTemplate: React.FC<AnniversaryTemplateProps> = ({
  data,
  isEditable = true,
  onUpdateMilestoneImage,
  onUpdateGalleryImage,
  onUpdateAudio,
}) => {
  return (
    <div className="relative min-h-screen bg-[#1D061D] text-[#F7D1DC] py-12 px-4 sm:px-6 flex flex-col items-center selection:bg-[#F8C8D4] selection:text-[#2A0826] overflow-x-hidden">
      {/* Dynamic Romantic Motion Background (Floating Hearts, Orbs & Sparkles) */}
      <MotionBackground />
      
      {/* Container / Main Column */}
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center relative z-10">
        
        {/* Top Header Section */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B1231] border border-[#5E204E] text-[#F8C8D4]/70 text-[11px] font-semibold tracking-widest uppercase mb-4 shadow-sm">
            <Calendar size={12} className="text-pink-300" />
            <span>{data.yearSpan}</span>
          </div>

          <h1 className="font-script text-5xl sm:text-6xl md:text-7xl text-[#F7D1DC] font-bold tracking-tight mb-4 drop-shadow-md">
            Our story
          </h1>

          <p className="text-sm sm:text-base text-[#F7D1DC]/80 font-light max-w-md mx-auto leading-relaxed italic">
            "{data.heroIntro}"
          </p>
        </header>

        {/* 1. Live Relationship Timer Counter */}
        <RelationshipCounter startDate={data.startDate} herName={data.herName} />

        {/* 2. Personal Love Letter / Vows Box */}
        <LetterBox
          headline={data.letterHeadline}
          paragraphs={data.letterParagraphs}
          hisName={data.hisName}
        />

        {/* 3. Vertical Milestones Journey */}
        <section className="w-full relative pl-6 sm:pl-8 space-y-12 my-6">
          {/* Vertical Connecting Line */}
          <div className="absolute top-3 bottom-8 left-[11px] sm:left-[15px] w-[2px] bg-gradient-to-b from-[#E83D64] via-[#6C225B] to-[#F8C8D4]" />

          {data.milestones.map((item, index) => (
            <article
              key={item.id}
              className="relative flex flex-col gap-3 group animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Timeline Bullet Node with romantic pulsing glow */}
              <div className="absolute -left-[30px] sm:-left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#E83D64] border-2 border-[#230823] shadow-[0_0_14px_rgba(232,61,100,0.9)] z-10 group-hover:scale-125 transition-transform duration-300 animate-glow-node" />

              {/* Milestone Details */}
              <div className="flex flex-col">
                <span className="text-xs tracking-wider uppercase font-semibold text-[#E83D64]">
                  {item.date}
                </span>
                <h3 className="font-serif-title text-xl sm:text-2xl font-semibold text-[#F7D1DC] mt-0.5 mb-1.5 transition-colors group-hover:text-pink-200">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#F7D1DC]/80 font-light leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Client-Side Self Serving Photo Placeholder with hover elevation */}
              <div className="w-full max-w-xl transition-transform duration-300 group-hover:-translate-y-1">
                <PhotoFrame
                  image={item.image}
                  placeholderText={item.placeholderText}
                  onImageChange={(dataUrl) => onUpdateMilestoneImage(item.id, dataUrl)}
                  isEditable={isEditable}
                />
              </div>
            </article>
          ))}
        </section>

        {/* 4. "Our Moments" 3-Photo Polaroid Grid */}
        <MomentsGallery
          moments={data.moments}
          onUpdateImage={onUpdateGalleryImage}
          isEditable={isEditable}
        />

        {/* 5. "Reasons I Love You" Flip Cards */}
        <ReasonsSection reasons={data.reasons} />

        {/* 6. "Our Next Chapters" / Bucket List */}
        <NextChapters chapters={data.nextChapters} />

        {/* 7. Milestone Closing Note */}
        <section className="w-full max-w-xl mt-14 pt-8 border-t border-[#4A163E]/80 text-center">
          <div className="inline-block mb-2">
            <span className="text-xs font-semibold tracking-widest text-[#E83D64] uppercase">
              TODAY & FOREVER
            </span>
          </div>
          <h2 className="font-script text-4xl sm:text-5xl text-[#F7D1DC] font-bold mb-3">
            {data.closingTitle}
          </h2>
          <p className="text-sm text-[#F7D1DC]/80 font-light max-w-md mx-auto leading-relaxed">
            {data.closingNote}
          </p>
        </section>

        {/* 8. Our Song Section */}
        <AudioPlayer
          songTitle={data.songTitle}
          songArtist={data.songArtist}
          audioUrl={data.audioUrl}
          isEditable={isEditable}
          onAudioChange={onUpdateAudio}
        />

        {/* 9. "Send [him] your reply" Section (Prominent interactive response tray) */}
        <ReplySection
          hisName={data.hisName}
          quickReactions={data.quickReactions}
          partnerPhoneNumber={data.partnerPhoneNumber}
        />

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-[#F7D1DC]/50 pb-8 flex items-center justify-center gap-1.5">
          <Sparkles size={13} className="text-[#E83D64]" />
          <span className="font-script text-lg text-[#F7D1DC]/80">Made with Lovelett</span>
        </footer>

      </main>
    </div>
  );
};
