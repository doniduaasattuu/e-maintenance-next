"use client";

import * as React from "react";
import SearchBar from "./search-bar";
import { Button } from "./ui/button";
import { Plus, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function FunctionalLocationHeader() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [order, setOrder] = React.useState<"asc" | "desc" | string | null>(
    null
  );
  const [sort, setSort] = React.useState<"id" | "description" | string | null>(
    null
  );

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (order) {
      const handleOrder = (order: string) => {
        if (order) {
          params.set("order", order);
        } else {
          params.delete("order");
        }

        replace(`${pathname}?${params.toString()}`);
      };

      handleOrder(order);
    }

    if (sort) {
      const handleSort = (sort: string) => {
        if (sort) {
          params.set("sortBy", sort);
        } else {
          params.delete("sortBy");
        }

        replace(`${pathname}?${params.toString()}`);
      };

      handleSort(sort);
    }
  }, [order, pathname, replace, searchParams, sort]);

  return (
    <div className="flex justify-between items-center space-x-2">
      <SearchBar />
      <div className="space-x-2 flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings2 />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[180px]">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={sort ?? "id"}
              onValueChange={setSort}
            >
              <DropdownMenuRadioItem value="id">ID</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="description">
                Description
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="createdAt">
                Created at
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="updatedAt">
                Updated at
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Order by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={order ?? "desc"}
              onValueChange={setOrder}
            >
              <DropdownMenuRadioItem value="desc">
                Descending
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="asc">
                Ascending
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button asChild className="cursor-pointer" variant="outline">
          <Link href="/functional-locations/create">
            <Plus />
            New
          </Link>
        </Button>
      </div>
    </div>
  );
}
