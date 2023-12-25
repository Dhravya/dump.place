import React from "react";
import LoginButton from "@/components/authUI/signin";
import LogoutButton from "@/components/authUI/signout";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { getServerAuthSession } from "@/server/auth";

async function NavigationMenuComp() {
  const auth = await getServerAuthSession();
  return (
    <NavigationMenu className="h-16 overflow-hidden p-4">
      <NavigationMenuList className="flex w-screen items-center justify-between gap-4 px-4 md:px-8">
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className="font-bold text-blue-300">
              DUMP.place
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {auth && auth.user ? (
          <div className="item-center flex justify-center gap-4">
            <NavigationMenuItem>
              <Link href="/me" legacyBehavior passHref>
                <NavigationMenuLink className="text-neutral-950 dark:text-neutral-50">
                  My Dumps
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={`https://unavatar.io/${auth.user.email}`}
                    />
                    <AvatarFallback>
                      {auth.user.email!.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block">
                    {auth.user.username ?? auth.user.email}
                  </span>{" "}
                  <ChevronDownIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    {auth.user.username ? (
                      `@${auth.user.username}`
                    ) : (
                      <span className="italic text-neutral-950 dark:text-neutral-50">
                        No name set
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem>{auth.user.email}</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link className="h-full w-full" href={`/@${auth.user.username}/settings`}>Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogoutButton className="w-full" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          </div>
        ) : (
          <LoginButton />
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavigationMenuComp;
