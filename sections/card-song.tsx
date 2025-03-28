"use client";

import { useState } from "react";
import { SongForm } from "./song-form";
import { SpotifyEmbedded } from "./spotify-embedded";

export default function CardSong({ songsCount }: { songsCount: number }) {
  const [randomSongId, setRandomSongId] = useState<string | null>(null);
  const [songCountLocal, setSongCountLocal] = useState(songsCount);

  const handleSongSubmitted = (randomSongId: string) => {
    setRandomSongId(randomSongId);
    setSongCountLocal((prev) => prev + 1);
  };

  return (
    <section className="w-full justify-around flex-col md:flex-row items-center md:px-4 lg:px-10 gap-10 sm:gap-40 flex mx-auto space-y-4">
      <div className="flex flex-col gap-5 w-full">
        <div className="flex text-nowrap text-[#f0f0f0] flex-col gap-2 w-full font-bold">
          <h1 className="md:text-7xl lg:text-8xl text-6xl">
            <span className="underline underline-offset-8 decoration-green-500">
              SHARE
            </span>{" "}
            A SONG
          </h1>
          <h1 className="md:text-7xl lg:text-8xl text-6xl">
            <span className="decoration-green-500 underline underline-offset-8">
              GET
            </span>{" "}
            A SONG
          </h1>
        </div>
        <div className="space-y-10 max-w-sm">
          <SongForm onSongSubmitted={handleSongSubmitted} />
          <div className="flex flex-col gap-3">
            <span className="text-zinc-500 text-sm w-full">
              {`${songCountLocal} unique songs uploaded`}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-20 w-full text-right">
        <SpotifyEmbedded spotifyId={randomSongId} />
      </div>
    </section>
  );
}
