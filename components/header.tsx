'use client';

import * as React from 'react';
import Image from 'next/image';
import cogIcon from '../public/cog.svg';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';

export default function Header() {
  return (
    <header className="mx-auto flex w-full max-w-[1100px] items-center justify-between px-4 py-6 text-sm xl:px-0">
      <p className="text-lg font-bold text-white">Sinalos</p>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="cursor-pointer bg-transparent hover:bg-transparent">
              <Image src={cogIcon} className="h-6 w-6" alt="cog" />
            </NavigationMenuTrigger>
            <NavigationMenuContent className="cursor-pointer rounded border-zinc-900 bg-[#303030] text-white">
              <NavigationMenuLink>Autoplay</NavigationMenuLink>
              <NavigationMenuLink>Theme</NavigationMenuLink>
              <NavigationMenuLink>Sound</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
