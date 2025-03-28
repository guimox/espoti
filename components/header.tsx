"use client";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";

export default function Header() {
  return (
    <header className="text-sm py-6 px-8 lg:px-0 w-full max-w-[1100px] flex justify-between items-center">
      <p className="text-[#f0f0f0] font-bold text-lg">Sinalos</p>
      <NavigationMenu>
        <NavigationMenuList className="relative">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-white cursor-pointer">
              a
              <img src="/cog.svg" alt="GitHub" className="w-7 h-7" />
            </NavigationMenuTrigger>
            <NavigationMenuContent className="absolute z-50 top-full right-0 mt-2 w-48 bg-[#303030] shadow-2xl border border-zinc-800 rounded-md text-[#fafafa] overflow-hidden">
              <div className="flex flex-col">
                <NavigationMenuLink
                  className="px-4 py-2 hover:bg-zinc-800 cursor-pointer"
                  asChild
                >
                  <div>Autoplay</div>
                </NavigationMenuLink>
                <NavigationMenuLink
                  className="px-4 py-2 hover:bg-zinc-800 cursor-pointer"
                  asChild
                >
                  <div>Song</div>
                </NavigationMenuLink>
                <NavigationMenuLink
                  className="px-4 py-2 hover:bg-zinc-800 cursor-pointer"
                  asChild
                >
                  <div>Theme</div>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
