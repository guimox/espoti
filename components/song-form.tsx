"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFetch } from "@/hooks/useFetch";

interface SongFormProps {
  onSongSubmitted: (randomSongId: string) => void;
}

interface SubmitSongResponse {
  submittedId: string;
  randomId: string;
  isDuplicate: boolean;
  message: string;
}

export function SongForm({ onSongSubmitted }: SongFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [submissionUrl, setSubmissionUrl] = useState<string | null>(null);

  const extractSpotifyId = (url: string) => {
    const regex = /\/track\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const {
    data,
    error: fetchError,
    isLoading,
  } = useFetch<SubmitSongResponse>(submissionUrl, {
    immediate: !!submissionUrl,
    onSuccess: (responseData) => {
      // Check if the response has a randomId
      if (responseData.randomId) {
        onSongSubmitted(responseData.randomId);
      }

      // Reset form
      setUrl("");
      setError("");
    },
    transformer: (rawData) => rawData as SubmitSongResponse,
  });

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setSubmissionUrl(null);

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

    // Construct the submission URL to trigger the fetch
    setSubmissionUrl(`/api/sonsgs?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="space-y-4 my-8">
      {data?.message && (
        <Alert
          className={
            data.isDuplicate
              ? "bg-amber-50 text-amber-800 border-amber-300"
              : "bg-green-50 text-green-800 border-green-300"
          }
        >
          <AlertDescription>{data.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="flex gap-4">
        <div className="space-y-2 flex-1">
          <Input
            value={url}
            placeholder="https://open.spotify.com/track/..."
            onChange={(e) => setUrl(e.target.value)}
            className={
              error
                ? "border-red-500 bg-[#202020] "
                : " bg-[#202020] border-[#202020]"
            }
            disabled={isLoading}
          />
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        </div>
        <Button
          type="submit"
          className="hover:cursor-pointer bg-green-500 hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Share"}
        </Button>
      </form>
    </div>
  );
}
