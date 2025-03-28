import CardSong from "@/components/card-song";

async function fetchSongCount() {
  try {
    const response = await fetch("http://localhost:3000/api/songs", {
      next: { revalidate: 10 },
    });

    if (!response.ok) {
      console.error("Failed to fetch song count");
      return { songsCount: 0 };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching song count:", error);
    return { songsCount: 0 };
  }
}

export default async function Home() {
  const { songsCount } = await fetchSongCount();

  return (
    <main className="w-full mx-auto flex-col justify-between duration-300 transition-all bg-[#303030] text-zinc-500 gap-10 items-center h-full my-auto rounded flex py-10">
      <div className="flex bg flex-col items-start w-full h-full py-8 md:py-20 px-8">
        <CardSong songsCount={songsCount} />
      </div>
    </main>
  );
}
