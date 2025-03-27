import { SessionUser } from "@/types/user";

export type Route = {
  label: string;
  url?: string;
  restricted?: boolean;
  children?: Route[];
};

export const routes: Route[] = [
  { label: "Scanner", url: "/scanner" },
  {
    label: "Tables",
    children: [
      { label: "Functional Locations", url: "/functional-locations" },
      { label: "Equipments", url: "/equipments" },
      { label: "Materials", url: "/materials" },
    ],
  },
  { label: "Documents", url: "/documents" },
  { label: "Findings", url: "/findings" },
  { label: "Users", url: "/users", restricted: true },
  { label: "Roles", url: "/roles", restricted: true },
];

export function useFilteredRoutes(user: SessionUser): Route[] {
  return routes.filter((route) => {
    return !route.restricted || user?.role?.name === "Admin";
  });
}
