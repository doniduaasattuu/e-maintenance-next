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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FunctionalLocationHeader() {
  const [order, setOrder] = React.useState<"asc" | "desc" | string | null>(
    null
  );
  const [sort, setSort] = React.useState<"id" | "description" | string | null>(
    null
  );
  const [perPage, setPerPage] = React.useState<string | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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

    if (perPage) {
      const handlePerPage = (perPage: string) => {
        if (perPage) {
          params.set("perPage", perPage);
        } else {
          params.delete("perPage");
        }

        replace(`${pathname}?${params.toString()}`);
      };

      handlePerPage(perPage);
    }
  }, [order, pathname, perPage, replace, searchParams, sort]);

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
            <DropdownMenuSeparator />
            <Select
              onValueChange={(e) => setPerPage(e)}
              defaultValue={perPage ?? "15"}
            >
              <div className="w-full flex justify-between space-x-2 items-center">
                <div className="text-sm font-normal ms-3">Per page:</div>
                <SelectTrigger>
                  <SelectValue placeholder="Number of row" />
                </SelectTrigger>
              </div>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
