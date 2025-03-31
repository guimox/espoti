'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import audioIcon from '../public/audio.svg';

declare namespace SpotifyIframeApi {
  interface Controller {
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    loadUri: (uri: string) => void;
    addListener: (event: string, callback: (data?: any) => void) => void;
    removeListener: (event: string, callback: (data?: any) => void) => void;
  }

  interface IframeOptions {
    width?: string | number;
    height?: string | number;
    uri?: string;
  }

  interface IframeApi {
    createController: (
      element: HTMLElement,
      options: IframeOptions,
      callback?: (controller: Controller) => void
    ) => void;
  }
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi.IframeApi) => void;
    SpotifyIframeAPI?: SpotifyIframeApi.IframeApi;
  }
}

export function SpotifyEmbedded({ spotifyId }: { spotifyId: string | null }) {
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);
  const controllerRef = useRef<SpotifyIframeApi.Controller | null>(null);
  const embedContainerRef = useRef<HTMLDivElement | null>(null);
  const previousSpotifyIdRef = useRef<string | null>(null);

  useEffect(() => {
    isMountedRef.current = true;

    const initializePlayer = () => {
      if (window.SpotifyIframeAPI) {
        createSpotifyController(window.SpotifyIframeAPI);
      }
    };

    const createSpotifyController = (IFrameAPI: SpotifyIframeApi.IframeApi) => {
      const element = embedContainerRef.current;
      if (!element || !spotifyId) return;

      if (!previousSpotifyIdRef.current) {
        element.innerHTML = '';
      }

      const options = { uri: `spotify:track:${spotifyId}` };

      if (controllerRef.current && previousSpotifyIdRef.current) {
        setIsLoading(true);
        controllerRef.current.loadUri(options.uri);
        return;
      }

      IFrameAPI.createController(element, options, (ctrl) => {
        if (!isMountedRef.current) return;

        if (controllerRef.current) {
          controllerRef.current.removeListener('ready', () => {});
          controllerRef.current.removeListener('loading_error', () => {});
        }

        controllerRef.current = ctrl;
        previousSpotifyIdRef.current = spotifyId;

        ctrl.addListener('ready', () => {
          if (!isMountedRef.current) return;
          setIsLoading(false);
          console.log('Spotify Player Ready');
          ctrl.play();
        });

        ctrl.addListener('loading_error', (error) => {
          if (!isMountedRef.current) return;
          setIsLoading(false);
          console.error('Spotify Player Loading Error', error);
        });
      });
    };

    if (spotifyId) {
      setIsLoading(true);

      if (!window.SpotifyIframeAPI) {
        window.onSpotifyIframeApiReady = (api) => {
          if (!isMountedRef.current) return;
          window.SpotifyIframeAPI = api;
          initializePlayer();
        };

        if (
          !document.querySelector(
            'script[src="https://open.spotify.com/embed/iframe-api/v1"]'
          )
        ) {
          const script = document.createElement('script');
          script.src = 'https://open.spotify.com/embed/iframe-api/v1';
          script.async = true;
          document.body.appendChild(script);
        }
      } else {
        initializePlayer();
      }
    } else {
      setIsLoading(false);
    }

    return () => {
      isMountedRef.current = false;
      if (controllerRef.current) {
        controllerRef.current.removeListener('ready', () => {});
        controllerRef.current.removeListener('loading_error', () => {});
      }
    };
  }, [spotifyId]);

  if (!spotifyId) {
    return (
      <div className="relative flex h-90 w-full items-center justify-center rounded-lg bg-zinc-900">
        <Image
          src={audioIcon}
          alt="GitHub"
          className="h-15 w-15 cursor-pointer hover:opacity-50 active:scale-105"
        />
      </div>
    );
  }

  return (
    <div className="bg-[#303030 relative h-90 w-full rounded-lg">
      <div id="embed-iframe" ref={embedContainerRef} className="h-full"></div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-zinc-900">
          <svg
            className="h-8 w-8 animate-spin text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
}
