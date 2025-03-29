'use client';

import { useState } from 'react';
import { SongForm } from './song-form';
import { SpotifyEmbedded } from './spotify-embedded';

export default function CardSong({ songsCount }: { songsCount: number }) {
  const [randomSongId, setRandomSongId] = useState<string | null>(null);
  const [songCountLocal, setSongCountLocal] = useState(songsCount);

  const handleSongSubmitted = (randomSongId: string) => {
    setRandomSongId(randomSongId);
    setSongCountLocal((prev) => prev + 1);
  };

  return (
    <section className="mx-auto flex w-full flex-col items-center justify-around gap-10 space-y-4 sm:gap-40 md:flex-row md:px-4 lg:px-10">
      <div className="flex w-full flex-col gap-5">
        <div className="flex w-full flex-col gap-2 font-bold text-nowrap text-[#f0f0f0]">
          <h1 className="text-6xl md:text-7xl lg:text-8xl">
            <span className="underline decoration-green-500 underline-offset-8">
              SHARE
            </span>{' '}
            A SONG
          </h1>
          <h1 className="text-6xl md:text-7xl lg:text-8xl">
            <span className="underline decoration-green-500 underline-offset-8">GET</span>{' '}
            A SONG
          </h1>
        </div>
        <div className="max-w-sm space-y-10">
          <SongForm onSongSubmitted={handleSongSubmitted} />
          <div className="flex flex-col gap-3">
            <span className="w-full text-sm text-zinc-500">
              {`${songCountLocal} unique songs uploaded`}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full space-y-20 text-right">
        <SpotifyEmbedded spotifyId={randomSongId} />
      </div>
    </section>
  );
}
