"use client";

import Link from "next/link";
import React from "react";
import { Route } from "@/hooks/useFilteredRoutes";
import NavDropdown from "./nav-dropdown";
import NavDropdownDesktop from "./nav-dropdown-desktop";

type NavlinkProps = {
  route: {
    url?: string;
    label: string;
    children?: Route[];
  };
  pathname: string;
  isMobile?: boolean;
};

export default function Navlink({ route, pathname, isMobile }: NavlinkProps) {
  if (route.url && !route.children) {
    return (
      <Link
        href={route.url}
        className={`${
          route.url === pathname || String(pathname).includes(route.url)
            ? "text-foreground"
            : "text-muted-foreground"
        } text-sm hover:text-foreground transition`}
      >
        {route.label}
      </Link>
    );
  } else if (route.children && isMobile) {
    // Dropdown menu in mobile
    return <NavDropdown route={route} pathname={pathname} />;
  } else {
    // Dropdown menu in desktop
    return <NavDropdownDesktop route={route} pathname={pathname} />;
  }
}
