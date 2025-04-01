import { pgTable, timestamp, text } from 'drizzle-orm/pg-core';

export const songs = pgTable('songs', {
  spotifyId: text('spotify_id').primaryKey().notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
