"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ModeToggle, { ModeSwitch } from "@/components/mode-toggle";
import { Menu } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarImage } from "./ui/avatar";
import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import Navlink from "./nav-link";

export default function Navbar({ className }: { className: unknown }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  type Route = {
    label: string;
    url: string;
  };

  const routes: Route[] = [
    {
      label: "Home",
      url: "/home",
    },
    {
      label: "About",
      url: "/about",
    },
    {
      label: "Contact",
      url: "/contact",
    },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <nav className="w-full p-3 bg-background shadow-md">
      <div
        className={`${className} container mx-auto flex items-center justify-between`}
      >
        <Link href="/home" className="text-xl font-bold">
          TodoApp
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <div className="space-x-6 items-center text-sm">
            {routes.map((route: Route, index: number) => (
              <Navlink key={index} pathname={pathname} route={route} />
            ))}
          </div>
          <div className="flex h-5 items-center space-x-4 text-sm">
            <Separator orientation="vertical" />
            <ModeSwitch />
            <Separator orientation="vertical" />
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-9 w-9">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    className="object-cover"
                  />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu scale={2} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-6">
            <div className="flex flex-col space-y-4 mt-6">
              {routes.map((route: Route, index: number) => (
                <Navlink key={index} pathname={pathname} route={route} />
              ))}
            </div>
            <Button className="cursor-pointer" onClick={handleLogout}>
              Logout
            </Button>
            <div className="ms-auto mt-auto border-1 rounded-sm">
              <ModeToggle />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
