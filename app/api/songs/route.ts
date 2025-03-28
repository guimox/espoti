import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export async function GET() {
  const songsCount = await prisma.song.count({});
  return NextResponse.json({
    songsCount,
  });
}

const songSchema = z.object({
  url: z.string().url(),
});

function extractSpotifyId(url: string) {
  const regex = /\/track\/([a-zA-Z0-9]+)(?:\?|$)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = songSchema.parse(body);

    const spotifyId = extractSpotifyId(url);
    if (!spotifyId) {
      return NextResponse.json(
        { error: "Invalid Spotify URL format" },
        { status: 400 }
      );
    }

    const existingSong = await prisma.song.findUnique({
      where: {
        spotifyId,
      },
    });

    if (!existingSong) {
      await prisma.song.create({
        data: {
          spotifyId,
        },
      });
    }

    const songsCount = await prisma.song.count({
      where: {
        NOT: {
          spotifyId,
        },
      },
    });

    const randomIndex = Math.floor(Math.random() * songsCount);
    const randomSong = await prisma.song.findMany({
      where: {
        NOT: {
          spotifyId,
        },
      },
      take: 1,
      skip: randomIndex,
    });

    if (!existingSong) {
      return NextResponse.json({
        submittedId: spotifyId,
        randomId: randomSong[0].spotifyId,
      });
    } else {
      return NextResponse.json({ error: "Duplicated song" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing song:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input format", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process song" },
      { status: 500 }
    );
  }
}
