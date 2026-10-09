export interface SongPreset {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
}

export const ROMANTIC_SONG_PRESETS: SongPreset[] = [
  {
    id: 'acoustic-love',
    title: 'Acoustic Serenade',
    artist: 'Lovelett Melodies',
    audioUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
  },
  {
    id: 'piano-memories',
    title: 'Warm Piano Waltz',
    artist: 'Romantic Nostalgia',
    audioUrl: 'https://cdn.freesound.org/previews/415/415804_5121236-lq.mp3',
  },
  {
    id: 'lofi-sunset',
    title: 'Midnight Starlight',
    artist: 'Lo-Fi Chill & Romance',
    audioUrl: 'https://cdn.freesound.org/previews/563/563728_11861866-lq.mp3',
  },
  {
    id: 'strings-forever',
    title: 'Strings of Forever',
    artist: 'Classical Ensemble',
    audioUrl: 'https://cdn.freesound.org/previews/387/387232_1478204-lq.mp3',
  }
];
