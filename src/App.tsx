import { useState, useEffect } from 'react';
import type { AnniversaryData } from './types/anniversary';
import { defaultAnniversaryData } from './types/anniversary';
import { ROMANTIC_SONG_PRESETS } from './types/songs';
import { AnniversaryTemplate } from './components/AnniversaryTemplate';
import { encodePayloadToHash, decodePayloadFromHash } from './utils/cryptoPayload';
import { Edit3, Eye, Share2, Sparkles, Phone, Music, Plus, Check, Heart, BookOpen, Trash2 } from 'lucide-react';

export function App() {
  const [data, setData] = useState<AnniversaryData>(() => {
    try {
      // Decode full encrypted gift payload (including photos) directly from URL hash
      if (window.location.hash) {
        const decoded = decodePayloadFromHash<AnniversaryData>(window.location.hash);
        if (decoded) {
          return { ...defaultAnniversaryData, ...decoded };
        }
      }
      const saved = localStorage.getItem('lovelett_anniversary_data');
      if (saved) return { ...defaultAnniversaryData, ...JSON.parse(saved) };
    } catch {
      // Fallback
    }
    return defaultAnniversaryData;
  });

  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('lovelett_anniversary_data', JSON.stringify(data));
    } catch {
      // Storage quota or privacy mode handled
    }
  }, [data]);

  const handleUpdateMilestoneImage = (milestoneId: string, dataUrl: string | undefined) => {
    setData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === milestoneId ? { ...m, image: dataUrl } : m
      ),
    }));
  };

  const handleUpdateGalleryImage = (photoId: string, dataUrl: string | undefined) => {
    setData((prev) => ({
      ...prev,
      moments: prev.moments.map((g) =>
        g.id === photoId ? { ...g, image: dataUrl } : g
      ),
    }));
  };

  const handleUpdateAudio = (audioDataUrl: string | undefined) => {
    setData((prev) => ({ ...prev, audioUrl: audioDataUrl }));
  };

  const handleUpdateField = (field: keyof AnniversaryData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateMilestone = (id: string, key: 'date' | 'title' | 'description', value: string) => {
    setData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === id ? { ...m, [key]: value } : m
      ),
    }));
  };

  const handleAddMilestone = () => {
    const newId = `m-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          id: newId,
          date: 'NEW MEMORY DATE',
          title: 'A New Milestone',
          description: 'Write about this unforgettable memory together...',
          placeholderText: 'Photo: added by him, encrypted',
        },
      ],
    }));
  };

  const handleRemoveMilestone = (id: string) => {
    setData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => m.id !== id),
    }));
  };

  const handleUpdateLetterParagraph = (index: number, text: string) => {
    setData((prev) => {
      const updated = [...prev.letterParagraphs];
      updated[index] = text;
      return { ...prev, letterParagraphs: updated };
    });
  };

  const handleShareLink = () => {
    try {
      // Compress and package the entire gift (including photos, letters, memories, and audio settings)
      const encoded = encodePayloadToHash(data);
      const shareUrl = `${window.location.origin}${window.location.pathname}#data=${encoded}`;
      
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (err) {
      console.error('Error generating link:', err);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#230823]">
      {/* Top Floating Header & Nav */}
      <header className="sticky top-0 z-50 bg-[#2A0826]/90 backdrop-blur-md border-b border-[#4A163E] px-4 py-2.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#E83D64]" size={18} />
          <span className="font-script text-2xl font-bold text-[#F8C8D4]">Lovelett</span>
          <span className="hidden sm:inline text-[10px] uppercase font-semibold tracking-wider text-[#F8C8D4]/50 bg-[#3B1231] px-2 py-0.5 rounded-full border border-[#5E204E]">
            Anniversary Gift
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#3B1231] hover:bg-[#5E204E] text-[#F8C8D4] border border-[#5E204E] transition-all shadow-sm cursor-pointer"
          >
            {mode === 'edit' ? (
              <>
                <Eye size={14} />
                <span>View Full Page</span>
              </>
            ) : (
              <>
                <Edit3 size={14} />
                <span>Customize Page</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShareLink}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#E83D64] hover:bg-[#FF4B72] text-white transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check size={14} />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>Share Link</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Customizer View */}
      {mode === 'edit' ? (
        <section className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
          <div className="bg-[#330D26] border border-[#5E204E] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F7D1DC] space-y-6">
            <div>
              <h2 className="font-serif-title text-2xl font-bold mb-1 text-white">
                Customize Your Anniversary Page
              </h2>
              <p className="text-xs text-[#F7D1DC]/70">
                Personalize the love letter, relationship start date, memories, and reply phone number.
              </p>
            </div>

            {/* Names & Headers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F7D1DC]/70 mb-1.5">
                  Her Name (Partner)
                </label>
                <input
                  type="text"
                  value={data.herName}
                  onChange={(e) => handleUpdateField('herName', e.target.value)}
                  className="w-full bg-[#230823] border border-[#5E204E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E83D64]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F7D1DC]/70 mb-1.5">
                  Your Name (Sender)
                </label>
                <input
                  type="text"
                  value={data.hisName}
                  onChange={(e) => handleUpdateField('hisName', e.target.value)}
                  className="w-full bg-[#230823] border border-[#5E204E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E83D64]"
                />
              </div>
            </div>

            {/* Relationship Start Date & WhatsApp Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F7D1DC]/70 mb-1.5">
                  Relationship Start Date (for counter)
                </label>
                <input
                  type="date"
                  value={data.startDate}
                  onChange={(e) => handleUpdateField('startDate', e.target.value)}
                  className="w-full bg-[#230823] border border-[#5E204E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E83D64]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F7D1DC]/70 mb-1.5 flex items-center gap-1">
                  <Phone size={12} className="text-[#E83D64]" />
                  <span>Your WhatsApp # (For "Send Reply to Him")</span>
                </label>
                <input
                  type="tel"
                  placeholder="+1 555 123 4567"
                  value={data.partnerPhoneNumber || ''}
                  onChange={(e) => handleUpdateField('partnerPhoneNumber', e.target.value)}
                  className="w-full bg-[#230823] border border-[#5E204E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E83D64]"
                />
              </div>
            </div>

            {/* Letter Section Customization */}
            <div className="pt-2 border-t border-[#4A163E] space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={16} className="text-[#E83D64]" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Personal Love Letter
                </h3>
              </div>
              {data.letterParagraphs.map((para, idx) => (
                <div key={idx}>
                  <label className="block text-[11px] text-[#F7D1DC]/60 mb-1 font-medium">
                    Paragraph {idx + 1}
                  </label>
                  <textarea
                    rows={2}
                    value={para}
                    onChange={(e) => handleUpdateLetterParagraph(idx, e.target.value)}
                    className="w-full bg-[#230823] border border-[#5E204E] rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#E83D64] resize-none"
                  />
                </div>
              ))}
            </div>

            {/* Song details & Audio Chooser */}
            <div className="pt-2 border-t border-[#4A163E] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music size={16} className="text-[#E83D64]" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Our Song (Soundtrack)</h3>
                </div>
                {data.audioUrl && (
                  <span className="text-[11px] text-pink-300 bg-[#E83D64]/20 border border-[#E83D64]/40 px-2 py-0.5 rounded-full font-medium">
                    Custom Audio Active
                  </span>
                )}
              </div>

              {/* Quick Romantic Music Presets */}
              <div>
                <label className="block text-xs text-[#F7D1DC]/70 mb-2 font-medium">
                  Choose a Romantic Preset or Upload Your Own:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROMANTIC_SONG_PRESETS.map((preset) => {
                    const isSelected = data.audioUrl === preset.audioUrl || (!data.audioUrl && preset.id === 'acoustic-love');
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setData((prev) => ({
                            ...prev,
                            songTitle: preset.title,
                            songArtist: preset.artist,
                            audioUrl: preset.audioUrl,
                          }));
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#E83D64]/20 border-[#E83D64] text-white font-semibold shadow-md'
                            : 'bg-[#230823] border-[#5E204E] text-[#F7D1DC]/80 hover:bg-[#3B1231]'
                        }`}
                      >
                        <span className="truncate">{preset.title}</span>
                        <span className="text-[10px] text-[#F7D1DC]/50 truncate font-normal">
                          {preset.artist}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Artist custom text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#F7D1DC]/70 mb-1">Display Title</label>
                  <input
                    type="text"
                    value={data.songTitle}
                    onChange={(e) => handleUpdateField('songTitle', e.target.value)}
                    className="w-full bg-[#230823] border border-[#5E204E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#E83D64]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#F7D1DC]/70 mb-1">Display Artist</label>
                  <input
                    type="text"
                    value={data.songArtist}
                    onChange={(e) => handleUpdateField('songArtist', e.target.value)}
                    className="w-full bg-[#230823] border border-[#5E204E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#E83D64]"
                  />
                </div>
              </div>

              {/* Direct Audio MP3 file upload or custom URL */}
              <div className="bg-[#230823] border border-[#5E204E] rounded-2xl p-3.5 space-y-2">
                <label className="block text-xs font-semibold text-white">
                  Upload Any MP3 / Audio File Directly from your Computer/Phone:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const dataUrl = event.target?.result as string;
                        handleUpdateAudio(dataUrl);
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="text-xs text-[#F7D1DC]/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#E83D64] file:text-white hover:file:bg-[#FF4B72] file:cursor-pointer cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-[#F7D1DC]/50">
                  You can upload any song file (e.g. Taylor Swift, Ed Sheeran, your own recorded voice note, or any MP3).
                </p>
              </div>
            </div>

            {/* Milestones list */}
            <div className="pt-2 border-t border-[#4A163E] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-[#E83D64]" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                    Timeline Milestones ({data.milestones.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="flex items-center gap-1 text-xs font-semibold text-[#E83D64] hover:text-[#FF4B72] cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Moment</span>
                </button>
              </div>

              {data.milestones.map((m, idx) => (
                <div key={m.id} className="bg-[#230823] border border-[#5E204E]/80 rounded-2xl p-4 space-y-3 relative">
                  <div className="flex items-center justify-between text-xs text-[#E83D64] font-semibold">
                    <span>Moment #{idx + 1}</span>
                    {data.milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(m.id)}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                        title="Remove moment"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Date (e.g. 14 OCTOBER 2021)"
                      value={m.date}
                      onChange={(e) => handleUpdateMilestone(m.id, 'date', e.target.value)}
                      className="bg-[#330D26] border border-[#5E204E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Title (e.g. The day we met)"
                      value={m.title}
                      onChange={(e) => handleUpdateMilestone(m.id, 'title', e.target.value)}
                      className="bg-[#330D26] border border-[#5E204E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <textarea
                    placeholder="Describe this memory..."
                    value={m.description}
                    onChange={(e) => handleUpdateMilestone(m.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full bg-[#330D26] border border-[#5E204E] rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                  />
                </div>
              ))}
            </div>

            {/* Done button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setMode('preview')}
                className="w-full bg-[#E83D64] hover:bg-[#FF4B72] text-white font-semibold py-3.5 rounded-full text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                Done Editing & View Page
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* Recipient Live Full Page Experience */
        <AnniversaryTemplate
          data={data}
          onUpdateMilestoneImage={handleUpdateMilestoneImage}
          onUpdateGalleryImage={handleUpdateGalleryImage}
          onUpdateAudio={handleUpdateAudio}
        />
      )}
    </div>
  );
}

export default App;
