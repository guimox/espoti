"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SongForm } from "./song-form";
import { SongResult } from "./song-result";

export default function CardSong() {
  const [randomSongId, setRandomSongId] = useState<string | null>(null);

  const queryClient = new QueryClient();

  const handleSongSubmitted = (randomSongId: string) => {
    setRandomSongId(randomSongId);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full max-w-md mx-auto space-y-10">
        <div className="text-3xl flex font-bold">
          <div>
            <h1 className="text-7xl">SHARE A SONG</h1>
            <h1 className="text-7xl">GET A SONG</h1>
          </div>
        </div>
        <div className="space-y-10">
          {!randomSongId && (
            <>
              <SongForm onSongSubmitted={handleSongSubmitted} />
              <p className="text-sm text-left w-full text-[#b1b1b1]">
                Paste your favorite Spotify song above
              </p>
            </>
          )}
        </div>
        {randomSongId && (
          <div className="space-y-20 h-64">
            <SongResult randomSongId={randomSongId} />
            <span
              className="underline cursor-pointer hover:opacity-50 text-gray-500"
              onClick={() => setRandomSongId("")}
            >
              Reset
            </span>
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
}
