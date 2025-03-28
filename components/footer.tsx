import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-sm py-6 px-8 lg:px-0 w-full max-w-[1100px] text-zinc-500 flex justify-between">
      <p>Guilherme Lopes</p>
      <p>Project made with 💚</p>
      <Link
        href={"https://github.com/guimox/sinalos"}
        className="hover:opacity-50 duration-300 transition-all"
      >
        <img src="/github.svg" alt="GitHub" className="w-5 h-5" />
      </Link>
    </footer>
  );
}
