import CardSong from "@/components/card-song";

export default async function Home() {
  return (
    <main className="w-fit mx-auto flex-col duration-300 transition-all bg-[#303030] text-white gap-3 items-center h-1/2 my-auto  rounded flex justify-center p-10">
      <div className="flex gap-3 w-full font-custom">
        <CardSong />
      </div>
    </main>
  );
}
