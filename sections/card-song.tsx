'use client';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useState } from 'react';
import { SongForm } from './form-song';
import { SpotifyEmbedded } from './spotify-embedded';

export default function CardSong({ songsCount }: { songsCount: number }) {
  const [randomSongId, setRandomSongId] = useState<string | null>(null);
  const [songCountLocal, setSongCountLocal] = useState(songsCount);
  const [open, setOpen] = useState(true);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleSongSubmitted = (randomSongId: string) => {
    setRandomSongId(randomSongId);
    setSongCountLocal((prev) => Number(prev) + 1);
    setOpen(true);
  };

  return (
    <section className="section-enter mx-auto flex w-full flex-col items-center justify-around gap-10 space-y-4 border-zinc-600 sm:gap-14 md:flex-row lg:px-10">
      <div className="flex w-full flex-col gap-5">
        <div className="flex w-full flex-col gap-2 font-bold text-nowrap text-[#f0f0f0]">
          <h1 className="heading-enter-first text-6xl sm:text-8xl">
            <span className="underline decoration-green-500 underline-offset-8">
              SHARE
            </span>{' '}
            A SONG
          </h1>
          <h1 className="heading-enter-second text-6xl sm:text-8xl">
            <span className="underline decoration-green-500 underline-offset-8">GET</span>{' '}
            A SONG
          </h1>
        </div>
        <div className="max-w-sm space-y-10">
          <div className="form-enter">
            <SongForm onSongSubmitted={handleSongSubmitted} />
          </div>
          <div className="counter-enter flex flex-col gap-3">
            <span className="w-full text-sm text-zinc-500">
              {`${songCountLocal} unique songs uploaded`}
            </span>
          </div>
        </div>
      </div>
      {isDesktop ? (
        <div className="player-enter w-3/4 text-right">
          <SpotifyEmbedded spotifyId={randomSongId} />
        </div>
      ) : (
        <>
          {randomSongId && (
            <>
              <div
                className="fixed inset-x-0 right-0 bottom-0 left-0 z-50 flex h-30 w-full justify-center"
                onClick={() => setOpen(true)}
              >
                <Button className="flex items-center justify-center gap-2 border border-zinc-600 bg-zinc-800 px-8 py-2">
                  Open random song
                </Button>
              </div>
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className="h-3/5 border-zinc-600 bg-zinc-900">
                  <div className="sr-only">
                    <DrawerHeader>
                      <DrawerTitle>Spotify song being played</DrawerTitle>
                    </DrawerHeader>
                  </div>
                  <div className="drawer-content-enter mt-6 flex h-3/4 w-full flex-col items-center justify-center">
                    <div className="w-3/4 max-w-md">
                      <SpotifyEmbedded spotifyId={randomSongId} />
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </>
          )}
        </>
      )}
    </section>
  );
}
