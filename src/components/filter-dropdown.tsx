import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Settings2 } from "lucide-react";
import { Button } from "./ui/button";

type SortOption = {
  value: string;
  label: string;
  isSelected?: boolean;
};

export default function FilterDropdown({
  children,
  sortOptions,
  selectedOrderBy,
}: {
  children?: React.ReactNode;
  sortOptions: SortOption[];
  selectedOrderBy?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [order, setOrder] = React.useState<string | null>(null);
  const [sort, setSort] = React.useState<string | null>(null);

  const selectedSort = sortOptions.find(
    (val) => val.isSelected === true
  )?.value;

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
    <div className="space-x-2 flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings2 />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[210px]">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={sort ?? selectedSort}
            onValueChange={setSort}
          >
            {sortOptions.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Order by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={order ? order : selectedOrderBy ? selectedOrderBy : "desc"}
            onValueChange={setOrder}
          >
            <DropdownMenuRadioItem value="desc">
              Descending
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
