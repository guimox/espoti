"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const songUrlSchema = z.object({
  url: z
    .string()
    .min(1, "Enter a Spotify song URL")
    .refine(
      (value) => {
        const regex = /\/track\/([a-zA-Z0-9]+)/;
        return regex.test(value);
      },
      { message: "Invalid Spotify URL format" }
    ),
});

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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm<z.infer<typeof songUrlSchema>>({
    resolver: zodResolver(songUrlSchema),
    defaultValues: {
      url: "",
    },
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("url", e.target.value);
    clearErrors("url");
    setErrorMessage(null);
  };

  const extractSpotifyId = (url: string) => {
    const regex = /\/track\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const onSubmit = async (data: z.infer<typeof songUrlSchema>) => {
    setErrorMessage(null);

    const spotifyId = extractSpotifyId(data.url);
    if (!spotifyId) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: data.url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit song.");
      }

      const responseData: SubmitSongResponse = await response.json();

      if (responseData.isDuplicate) {
        setErrorMessage(responseData.message);
      }

      if (responseData.randomId) {
        onSongSubmitted(responseData.randomId);
        setValue("url", "");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 my-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
        <div className="space-y-2 flex-1 relative">
          <Input
            {...register("url")}
            placeholder="Paste your favorite Spotify song link"
            onChange={handleUrlChange}
            disabled={isLoading}
            className={
              errors.url || errorMessage
                ? "border-red-500 bg-zinc-900"
                : "bg-zinc-900 border-zinc-900"
            }
          />
          <div className="absolute h-5 mt-1">
            {errors.url && (
              <p className="text-sm font-medium text-red-500">
                {errors.url.message}
              </p>
            )}
            {errorMessage && (
              <p className="text-sm font-medium text-red-500">{errorMessage}</p>
            )}
          </div>
        </div>
        <Button
          type="submit"
          className="hover:cursor-pointer active:scale-105 bg-green-500 hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Share"}
        </Button>
      </form>
    </div>
  );
}
