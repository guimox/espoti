"use client";
import { useEffect, useState } from "react";

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

export function SpotifyPlayer({ spotifyId }: { spotifyId: string }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const initializePlayer = () => {
      if (window.SpotifyIframeAPI) {
        createSpotifyController(window.SpotifyIframeAPI);
      }
    };

    const createSpotifyController = (IFrameAPI: SpotifyIframeApi.IframeApi) => {
      const element = document.getElementById("embed-iframe");
      if (!element || !spotifyId) return;

      const options = { uri: `spotify:track:${spotifyId}` };

      IFrameAPI.createController(element, options, (ctrl) => {
        if (!isMounted) return;

        ctrl.addListener("ready", () => {
          setIsLoading(false);
          console.log("Spotify Player Ready");
          ctrl.play();
        });

        ctrl.addListener("loading_error", () => {
          setIsLoading(false);
        });
      });
    };

    if (!window.SpotifyIframeAPI) {
      window.onSpotifyIframeApiReady = (api) => {
        window.SpotifyIframeAPI = api;
        initializePlayer();
      };

      if (
        !document.querySelector(
          'script[src="https://open.spotify.com/embed/iframe-api/v1"]'
        )
      ) {
        const script = document.createElement("script");
        script.src = "https://open.spotify.com/embed/iframe-api/v1";
        script.async = true;
        script.onload = initializePlayer;
        document.body.appendChild(script);
      }
    } else {
      initializePlayer();
    }

    return () => {
      isMounted = false;
    };
  }, [spotifyId]);

  return (
    <div className="w-full mx-auto max-w-[500px] relative">
      <div id="embed-iframe" className="h-full"></div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <svg
            className="animate-spin h-8 w-8 text-gray-600"
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
