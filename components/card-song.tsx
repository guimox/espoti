"use client";

import { useState } from "react";
import { SongForm } from "./song-form";
import { SpotifyEmbedded } from "./spotify-embedded";

export default function CardSong({ songsCount }: { songsCount: number }) {
  const [randomSongId, setRandomSongId] = useState<string | null>(null);

  const handleSongSubmitted = (randomSongId: string) => {
    setRandomSongId(randomSongId);
  };

  return (
    <section className="w-full justify-around flex-col md:flex-row items-center px-0 sm:px-10 gap-10 sm:gap-20 flex mx-auto space-y-4">
      <div className="flex flex-col gap-5 w-full">
        <div className="flex text-[#f0f0f0] flex-col gap-2 w-full font-bold">
          <h1 className="md:text-7xl text-6xl">
            <span className="underline underline-offset-8 decoration-green-500">
              SHARE
            </span>{" "}
            A SONG
          </h1>
          <h1 className="md:text-7xl text-6xl">
            <span className="decoration-green-500 underline underline-offset-8">
              GET
            </span>{" "}
            A SONG
          </h1>
        </div>
        <div className="space-y-10 max-w-sm">
          <SongForm onSongSubmitted={handleSongSubmitted} />
          <div className="flex flex-col gap-3">
            <p className="text-sm text-left w-full text-zinc-500">
              Paste your favorite Spotify song above
            </p>
            <span className="text-zinc-500 text-sm w-full">
              {`${songsCount} unique songs uploaded`}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-20 w-full sm:w-2/3 text-right">
        <SpotifyEmbedded spotifyId={randomSongId} />
      </div>
    </section>
  );
}
