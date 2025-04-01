import { songs } from '@/db/schema';
import { eq, not, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export async function GET() {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false });
  const db = drizzle({ client });

  try {
    const result = await db.select({ count: sql<number>`count(*)` }).from(songs);
    const songsCount = result.length > 0 ? result[0].count : 0;
    return NextResponse.json({ songsCount });
  } catch (error) {
    console.error('Error fetching song count:', error);
    return NextResponse.json({ error: 'Failed to fetch song count' }, { status: 500 });
  }
}

const songSchema = z.object({
  url: z.string().url(),
});

function extractSpotifyId(url: string): string | null {
  const regex = /spotify\.com\/track\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false });
  const db = drizzle({ client });
  let spotifyId = null;
  let randomId = null;
  let isNewSong = false;

  try {
    const body = await req.json();

    const validation = songSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input format', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { url } = validation.data;
    spotifyId = extractSpotifyId(url);

    if (!spotifyId) {
      console.error('Invalid Spotify URL format');
      return NextResponse.json(
        { error: 'Invalid or unrecognized Spotify URL format' },
        { status: 400 }
      );
    }

    let existingSong = [];
    try {
      existingSong = await db
        .select({ spotifyId: songs.spotifyId })
        .from(songs)
        .where(eq(songs.spotifyId, spotifyId))
        .limit(1);
    } catch (error) {
      console.error('Error checking existing song:', error);
      return NextResponse.json(
        { error: 'Database error while checking for existing song' },
        { status: 500 }
      );
    }

    if (existingSong.length === 0) {
      await db.insert(songs).values({ spotifyId });
      isNewSong = true;
    } else if (req.headers.get('X-Allow-Duplicate') !== 'true') {
      console.warn('Duplicate song detected');
      return NextResponse.json({ error: 'Duplicated song' }, { status: 409 });
    }

    let countResult = [];
    try {
      countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(songs)
        .where(not(eq(songs.spotifyId, spotifyId)));
    } catch (error) {
      console.error('Error counting other songs:', error);
      return NextResponse.json(
        { error: 'Database error while counting songs' },
        { status: 500 }
      );
    }

    const otherSongsCount = countResult[0]?.count || 0;

    if (otherSongsCount > 0) {
      try {
        const randomSong = await db
          .select({ spotifyId: songs.spotifyId })
          .from(songs)
          .where(not(eq(songs.spotifyId, spotifyId)))
          .orderBy(sql`RANDOM()`)
          .limit(1);

        if (randomSong.length > 0) {
          randomId = randomSong[0].spotifyId;
        }
      } catch (error) {
        console.error('Error fetching random song:', error);
      }
    }

    return NextResponse.json({
      submittedId: spotifyId,
      randomId,
      isNew: isNewSong,
    });
  } catch (error) {
    console.error('Error processing song:', error);

    if (spotifyId) {
      console.warn('Partial processing completed:', {
        submittedId: spotifyId,
        randomId,
        isNew: isNewSong,
      });
      return NextResponse.json(
        {
          submittedId: spotifyId,
          randomId,
          isNew: isNewSong,
          error: 'Partial processing completed',
        },
        { status: 207 }
      );
    }

    console.error('Failed to process song request');
    return NextResponse.json(
      { error: 'Failed to process song request' },
      { status: 500 }
    );
  }
}
