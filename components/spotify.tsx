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
    onSpotifyIframeApiReady: (api: SpotifyIframeApi.IframeApi) => void;
  }
}

export function SpotifyPlayer({ spotifyId }: { spotifyId: string }) {
  const [controller, setController] =
    useState<SpotifyIframeApi.Controller | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        const element = document.getElementById("embed-iframe");
        if (!element) return;

        const options = { uri: `spotify:track:${spotifyId}` };

        IFrameAPI.createController(element, options, (ctrl) => {
          setController(ctrl);

          ctrl.addListener("ready", () => {
            console.log("Spotify Player Ready");
            ctrl.play();
          });
        });
      };
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [spotifyId]);

  return (
    <div className="w-full mx-auto max-w-[500px]">
      <div id="embed-iframe"></div>
    </div>
  );
}
