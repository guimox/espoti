import Image from 'next/image';
import Link from 'next/link';
import githubIcon from '../../public/github.svg';

export default function Footer() {
  return (
    <footer className="flex w-full max-w-[1100px] justify-between px-6 py-6 text-sm text-zinc-500 xl:px-0">
      <p>Guilherme Lopes</p>
      <Link
        rel="noopener noreferrer"
        target="_blank"
        href={'https://github.com/guimox/espoti'}
        className="transition-all duration-300 hover:opacity-50"
      >
        <Image src={githubIcon} alt="GitHub" className="h-5 w-5" />
      </Link>
    </footer>
  );
}
