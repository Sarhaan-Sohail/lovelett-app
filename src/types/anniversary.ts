
export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  placeholderText?: string;
}

export interface GalleryPhoto {
  id: string;
  caption?: string;
  image?: string;
  placeholderText: string;
}

export interface ReasonItem {
  id: string;
  title: string;
  detail: string;
}

export interface BucketListItem {
  id: string;
  title: string;
  note: string;
}

export interface AnniversaryData {
  herName: string;
  hisName: string;
  yearSpan: string;
  heroIntro: string;
  startDate: string; // e.g. "2021-10-14"
  // Letter Section
  letterHeadline: string;
  letterParagraphs: string[];
  // Milestones Timeline
  milestones: Milestone[];
  // Gallery Moments (3-card photo grid)
  moments: GalleryPhoto[];
  // Reasons I love you
  reasons: ReasonItem[];
  // Next Chapters / Bucket List
  nextChapters: BucketListItem[];
  // Music & Closing
  closingTitle: string;
  closingNote: string;
  songTitle: string;
  songArtist: string;
  audioUrl?: string;
  // Reply Section
  quickReactions: string[];
  partnerPhoneNumber?: string;
}

export const defaultAnniversaryData: AnniversaryData = {
  herName: "Elena",
  hisName: "Julian",
  yearSpan: "2021 TO TODAY",
  startDate: "2021-10-14",
  heroIntro: "A little story of us, and how you became my entire world.",
  
  letterHeadline: "Happy anniversary, Elena",
  letterParagraphs: [
    "Looking back at everything we've shared, today reminds me of just how lucky I am. You walked into my life with your gentle smile and effortless grace, turning everyday moments into unforgettable memories.",
    "From late-night diner runs and road trips where we lost our way, to quiet evenings just holding hands on the couch—every second spent by your side is my favorite place to be.",
    "This year and all the years ahead, I promise to always listen, laugh with you through every adventure, and love you more deeply every single day."
  ],

  milestones: [
    {
      id: "m1",
      date: "14 OCTOBER 2021",
      title: "The day we met",
      description: "You ordered an iced latte in the middle of autumn, laughed at my terrible jokes, and I knew I never wanted that afternoon to end.",
      placeholderText: "Photo: added by him, encrypted",
    },
    {
      id: "m2",
      date: "08 JULY 2022",
      title: "Our first trip",
      description: "Getting lost on mountain roads, sharing headphones in the rain, and discovering we are the best team in the world.",
      placeholderText: "Photo: added by him, encrypted",
    },
    {
      id: "m3",
      date: "24 DECEMBER 2023",
      title: "A moment that made me sure",
      description: "Watching you sing in the kitchen with messy hair. In that exact second, every doubt in my life disappeared forever.",
      placeholderText: "Photo: added by him, encrypted",
    }
  ],

  moments: [
    {
      id: "g1",
      placeholderText: "Photo: added by him, encrypted",
      caption: "Our spontaneous coffee dates"
    },
    {
      id: "g2",
      placeholderText: "Photo: added by him, encrypted",
      caption: "Golden hour with you"
    },
    {
      id: "g3",
      placeholderText: "Photo: added by him, encrypted",
      caption: "The little moments in between"
    }
  ],

  reasons: [
    {
      id: "r1",
      title: "Your infectious laugh",
      detail: "The way you laugh from your stomach when something is genuinely funny makes everyone around you instantly happy."
    },
    {
      id: "r2",
      title: "How you care for people",
      detail: "Your kindness is effortless. You notice the little things that others miss and always bring warmth wherever you go."
    },
    {
      id: "r3",
      title: "The comfort in your silence",
      detail: "We can sit in a room for hours without saying a word, and it still feels like the most peaceful place in the world."
    },
    {
      id: "r4",
      title: "How you make me better",
      detail: "You believe in me even when I doubt myself. Being loved by you makes me want to be the best version of who I am."
    }
  ],

  nextChapters: [
    {
      id: "c1",
      title: "Visit the Amalfi Coast",
      note: "Eat authentic pizza by the sea and watch the sunset from the cliffs."
    },
    {
      id: "c2",
      title: "Adopt our first rescue puppy",
      note: "Give him a funny name and spoil him with endless treats."
    },
    {
      id: "c3",
      title: "Build our dream cozy home",
      note: "A big kitchen, a sunlit reading nook, and plenty of plants."
    }
  ],

  closingTitle: "Happy anniversary, Elena",
  closingNote: "Here is to forever with you — through every laugh, every adventure, and everything still to come.",
  songTitle: "Lover",
  songArtist: "Taylor Swift",
  quickReactions: [
    "Happy anniversary ❤️",
    "I love you",
    "Call me",
    "Take me there",
    "You made me cry 😭",
    "Come here"
  ],
  partnerPhoneNumber: ""
};
