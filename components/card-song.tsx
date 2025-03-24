"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SongForm } from "./song-form";
import { SongResult } from "./song-result";

export default function CardSong() {
  const [randomSongId, setRandomSongId] = useState("");

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
        <div>
          {!randomSongId && <SongForm onSongSubmitted={handleSongSubmitted} />}
          <SongResult randomSongId={randomSongId} />
        </div>
        {!randomSongId && (
          <p className="text-sm text-left w-full text-gray-500">
            Paste your favorite Spotify song above
          </p>
        )}
        {randomSongId && (
          <span
            className="underline text-gray-500"
            onClick={() => setRandomSongId("")}
          >
            Reset
          </span>
        )}
      </div>
    </QueryClientProvider>
  );
}
