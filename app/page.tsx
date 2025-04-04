import CardSong from '@/sections/card-song';

async function fetchSongCount() {
  try {
    const isDev = process.env.NODE_ENV == 'development';
    const correctUrl = isDev ? 'http://localhost:3000' : process.env.WEBSITE_URL!;

    const response = await fetch(correctUrl + '/api/songs', {
      next: { revalidate: 10 },
    });

    if (!response.ok) {
      console.error('Failed to fetch song count');
      return { songsCount: 0 };
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching song count:', error);
    return { songsCount: 0 };
  }
}

export default async function Home() {
  const { songsCount } = await fetchSongCount();

  return (
    <main className="mx-auto my-auto flex h-full w-full flex-col items-center justify-between gap-10 rounded bg-[#303030] py-10 text-zinc-500 transition-all duration-300">
      <div className="bg flex h-full w-full flex-col items-start px-6 py-8 md:py-20">
        <CardSong songsCount={songsCount} />
      </div>
    </main>
  );
}
