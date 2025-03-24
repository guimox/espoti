import CardSong from "@/components/card-song";

export default async function Home() {
  return (
    <main className="w-fit mx-auto flex-col gap-3 items-center h-3/4 flex justify-center p-10">
      <div className="flex gap-3 w-full font-custom">
        <CardSong />
      </div>
    </main>
  );
}
