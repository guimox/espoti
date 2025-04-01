import { db } from '@/db/drizzle';
import { songs } from '@/db/schema';
import { eq, not, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET() {
  const result = await db.select({ count: sql<number>`count(*)` }).from(songs);
  const songsCount = result[0].count;

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
      return NextResponse.json({ error: 'Invalid Spotify URL format' }, { status: 400 });
    }

    const existingSong = await db
      .select()
      .from(songs)
      .where(eq(songs.spotifyId, spotifyId))
      .limit(1);

    if (existingSong.length === 0) {
      await db.insert(songs).values({
        spotifyId,
      });
    } else {
      return NextResponse.json({ error: 'Duplicated song' }, { status: 400 });
    }

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(songs)
      .where(not(eq(songs.spotifyId, spotifyId)));

    const songsCount = countResult[0].count;

    if (songsCount === 0) {
      return NextResponse.json({
        submittedId: spotifyId,
        randomId: null,
      });
    }

    const randomSong = await db
      .select()
      .from(songs)
      .where(not(eq(songs.spotifyId, spotifyId)))
      .orderBy(sql`RANDOM()`)
      .limit(1);

    return NextResponse.json({
      submittedId: spotifyId,
      randomId: randomSong[0].spotifyId,
    });
  } catch (error) {
    console.error('Error processing song:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input format', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to process song' }, { status: 500 });
  }
}
