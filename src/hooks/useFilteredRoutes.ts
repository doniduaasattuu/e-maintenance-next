"use client";

import React from "react";
import { getSession, useSession } from "next-auth/react";

export type Route = {
  label: string;
  url?: string;
  restricted?: boolean;
  children?: Route[];
};

export const routes: Route[] = [
  { label: "Scanner", url: "/scanner", restricted: false },
  {
    label: "Tables",
    children: [
      { label: "Functional Locations", url: "/functional-locations" },
      { label: "Equipments", url: "/equipments" },
      { label: "Materials", url: "/materials" },
    ],
    restricted: false,
  },
  { label: "Documents", url: "/documents", restricted: false },
  { label: "Findings", url: "/findings", restricted: false },
  { label: "Users", url: "/users", restricted: true },
  { label: "Roles", url: "/roles", restricted: true },
];

export function useFilteredRoutes(): Route[] | undefined {
  const { data: session, status } = useSession();
  const [filteredRoutes, setfilteredRoutes] = React.useState<
    Route[] | undefined
  >();
  const [role, setRole] = React.useState<string | undefined>(undefined);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const response = getSession();

      response.then((result) => {
        setRole(result?.user.role);
        setLoaded(true);
      });

      if (loaded) {
        const filtered = routes.filter((route) => {
          return !route.restricted || role === "Admin";
        });

        setfilteredRoutes(filtered);
      }
    } else if (status === "unauthenticated") {
      setfilteredRoutes(routes.filter((route) => !route.restricted));
    } else {
      setfilteredRoutes(undefined);
    }
  }, [loaded, role, session, status]);

  return filteredRoutes;
}
