import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import cuid from 'cuid';

export const songs = pgTable('song', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => cuid()),
  spotifyId: varchar('spotify_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
