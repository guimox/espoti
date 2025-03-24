"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface SongFormProps {
  onSongSubmitted: (randomSongId: string) => void;
}

interface SubmitSongResponse {
  submittedId: string;
  randomId: string;
}

export function SongForm({ onSongSubmitted }: SongFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const extractSpotifyId = (url: string) => {
    const regex = /\/track\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const submitSongMutation = useMutation({
    mutationFn: async (songUrl: string) => {
      const response = await fetch("/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: songUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit song");
      }

      return response.json() as Promise<SubmitSongResponse>;
    },
    onSuccess: (data) => {
      onSongSubmitted(data.randomId);
      setUrl("");
    },
    onError: (err: Error) => {
      console.error("Error:", err);
      setError(err.message || "Something went wrong");
    },
  });

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");

    if (!url) {
      setError("Please enter a Spotify song URL");
      return;
    }

    const spotifyId = extractSpotifyId(url);
    if (!spotifyId) {
      setError(
        "Invalid Spotify URL format. Please use a link like: https://open.spotify.com/track/..."
      );
      return;
    }

    submitSongMutation.mutate(url);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8 flex gap-4">
      <div className="space-y-2">
        <Input
          value={url}
          placeholder="https://open.spotify.com/track/..."
          onChange={(e) => setUrl(e.target.value)}
          className={error ? "border-red-500 w-55" : "w-55"}
          disabled={submitSongMutation.isPending}
        />
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        {submitSongMutation.error && (
          <p className="text-sm font-medium text-red-500">
            {submitSongMutation.error.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-1/4 hover:cursor-pointer"
        disabled={submitSongMutation.isPending}
      >
        {submitSongMutation.isPending ? "Processing..." : "Share"}
      </Button>
    </form>
  );
}
