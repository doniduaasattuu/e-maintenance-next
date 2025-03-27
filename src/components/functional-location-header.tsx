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
// import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function FunctionalLocationHeader() {
  const [order, setOrder] = React.useState<"asc" | "desc" | string>("desc");

  // const [isCreateTodo, setIsCreateTodo] = React.useState<boolean>(false);

  // const handleCreateDialog = () => {
  //   setIsCreateTodo(true);
  // };

  // const handleCloseDialog = () => {
  //   setIsCreateTodo(false);
  // };

  // const searchParams = useSearchParams();
  // const pathname = usePathname();
  // const { replace } = useRouter();

  // useEffect(() => {
  //   if (order) {
  //     const handleOrder = (order: string) => {
  //       const params = new URLSearchParams(searchParams);

  //       if (order) {
  //         params.set("order", order);
  //       } else {
  //         params.delete("order");
  //       }

  //       replace(`${pathname}?${params.toString()}`);
  //     };

  //     handleOrder(order);
  //   }
  // }, [order, pathname, replace, searchParams]);

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
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Order by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={order} onValueChange={setOrder}>
              <DropdownMenuRadioItem value="desc">Latest</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="asc">Oldest</DropdownMenuRadioItem>
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
