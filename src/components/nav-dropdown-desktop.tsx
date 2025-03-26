import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Route } from "@/hooks/useFilteredRoutes";
import Link from "next/link";

export default function NavDropdownDesktop({
  route,
  pathname,
}: {
  route: Route;
  pathname: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-muted-foreground">
        <div className="flex items-center gap-1">
          {route.label}
          <ChevronDown className="mt-1" size={14} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {route.children &&
          route.children.map((nestedRoute: Route, index: number) => (
            <DropdownMenuItem asChild key={index}>
              <Link
                href={nestedRoute.url ?? "/"}
                className={`${
                  nestedRoute.url === pathname
                    ? "text-foreground"
                    : "text-muted-foreground"
                } text-sm hover:text-foreground transition`}
              >
                {nestedRoute.label}
              </Link>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
