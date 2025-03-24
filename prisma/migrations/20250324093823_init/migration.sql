-- CreateTable
CREATE TABLE "song" (
    "id" TEXT NOT NULL,
    "spotify_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "song_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "song_spotify_id_key" ON "song"("spotify_id");
