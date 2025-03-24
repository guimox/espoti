"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

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
  const [statusMessage, setStatusMessage] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);

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
      // Check if the response has a randomId
      if (data.randomId) {
        onSongSubmitted(data.randomId);
      }

      // Set duplicate status and message from API response
      setIsDuplicate(data.isDuplicate);
      setStatusMessage(data.message);

      // Reset form
      setUrl("");
      setError("");
    },
    onError: (err: Error) => {
      console.error("Error:", err);
      setIsDuplicate(false);
      setStatusMessage("");
      setError(err.message || "Something went wrong");
    },
  });

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setStatusMessage("");
    setIsDuplicate(false);

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
    <div className="space-y-4">
      {statusMessage && (
        <Alert
          className={
            isDuplicate
              ? "bg-amber-50 text-amber-800 border-amber-300"
              : "bg-green-50 text-green-800 border-green-300"
          }
        >
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="flex gap-4">
        <div className="space-y-2 flex-1">
          <Input
            value={url}
            placeholder="https://open.spotify.com/track/..."
            onChange={(e) => setUrl(e.target.value)}
            className={error ? "border-red-500" : ""}
            disabled={submitSongMutation.isPending}
          />
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        </div>
        <Button
          type="submit"
          className="hover:cursor-pointer"
          disabled={submitSongMutation.isPending}
        >
          {submitSongMutation.isPending ? "Processing..." : "Share"}
        </Button>
      </form>
    </div>
  );
}
