import Link from "next/link";
import React from "react";

type NavlinkProps = {
  route: {
    url: string;
    label: string;
  };
  pathname: string;
};

export default function Navlink({ route, pathname }: NavlinkProps) {
  return (
    <Link
      href={route.url}
      className={`${
        route.url === pathname ? "text-foreground" : "text-muted-foreground"
      } text-sm hover:text-foreground transition`}
    >
      {route.label}
    </Link>
  );
}
