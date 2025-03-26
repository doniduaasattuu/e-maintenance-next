import React from "react";
import { Separator } from "./ui/separator";
import { Route } from "@/hooks/useFilteredRoutes";
import Link from "next/link";

export default function NavDropdown({
  route,
  pathname,
}: {
  route: Route;
  pathname: string;
}) {
  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">{route.label}</div>
      {route.children && (
        <div className="flex space-x-3">
          <Separator className="text-foreground" orientation="vertical" />
          <div>
            <ul className="space-y-3">
              {route.children.map((nestedRoute: Route, index) => (
                <li key={index}>
                  <Link
                    href={nestedRoute.url as string}
                    className={`${
                      nestedRoute.url === pathname
                        ? "text-foreground"
                        : "text-muted-foreground"
                    } text-sm hover:text-foreground transition`}
                  >
                    {nestedRoute.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
