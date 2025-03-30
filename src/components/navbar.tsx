"use client";

import { ModeSwitch } from "@/components/mode-toggle";
import { Separator } from "./ui/separator";
import { APP_NAME } from "@/lib/config";
import AvatarNavbar from "./avatar";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import NavSheet from "./nav-sheet";
import { Route, useFilteredRoutes } from "@/hooks/useFilteredRoutes";
import { usePathname } from "next/navigation";
import Navlink from "./nav-link";

export default function Navbar({ className }: { className: unknown }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const filteredRoutes = useFilteredRoutes(user);

  return (
    <nav className="w-full py-3 bg-background shadow-md">
      <div
        className={`${className} container mx-auto flex items-center lg:justify-between space-x-4`}
      >
        <NavSheet filteredRoutes={filteredRoutes} />

        <Link href="/home" className="text-xl font-bold">
          {APP_NAME}
        </Link>

        <div className="ms-auto me-0 lg:hidden">
          <AvatarNavbar />
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          <div className="space-x-6 items-center text-sm flex">
            {filteredRoutes.map((route: Route, index: number) => (
              <Navlink
                key={index}
                route={route}
                pathname={pathname}
                isMobile={false}
              />
            ))}
          </div>
          <div className="flex h-5 items-center space-x-4 text-sm">
            <Separator orientation="vertical" />
            <ModeSwitch />
            <Separator orientation="vertical" />
          </div>

          <div className="flex items-center">
            <AvatarNavbar />
          </div>
        </div>
      </div>
    </nav>
  );
}
