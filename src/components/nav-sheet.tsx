"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ModeToggle from "@/components/mode-toggle";
import { Menu } from "lucide-react";
import Navlink from "./nav-link";
import { usePathname } from "next/navigation";
import { Route } from "@/hooks/useFilteredRoutes";

export default function NavSheet({
  filteredRoutes,
}: {
  filteredRoutes: Route[];
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <Menu scale={2} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-6">
        <div className="flex flex-col space-y-3 mt-6">
          {filteredRoutes.map((route: Route, index: number) => (
            <Navlink
              isMobile={true}
              key={index}
              route={route}
              pathname={pathname}
            />
          ))}
        </div>

        <div className="ms-auto mt-auto border-1 rounded-sm">
          <ModeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
