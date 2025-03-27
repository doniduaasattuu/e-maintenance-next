"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

type PaginationProps = {
  totalPages: number;
};

type PageNumber = number | "ellipsis";

export default function GeneratePagination({ totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams);
  const currentPage = Number(searchParams.get("page") ?? 1);
  const pathname = usePathname();
  const MAX_VISIBLE_PAGES: number = 5;
  const pageNumbers = [];

  for (let i = 1; i < totalPages; i++) {
    pageNumbers.push(i);
  }

  // Generate page numbers dynamically
  const getPageNumbers = (): PageNumber[] => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: PageNumber[] = [];
    const hasLeftEllipsis = currentPage > 3;
    const hasRightEllipsis = currentPage < totalPages - 2;

    pages.push(1);

    if (hasLeftEllipsis) pages.push("ellipsis");

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (hasRightEllipsis) pages.push("ellipsis");

    pages.push(totalPages);

    return pages;
  };

  const createPageUrl = (pageNumber: number | string) => {
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {currentPage > 1 ? (
            <Link href={createPageUrl(currentPage - 1)}>
              <PaginationPrevious />
            </Link>
          ) : (
            <PaginationPrevious className="opacity-50 pointer-events-none" />
          )}
        </PaginationItem>

        {/* Page Numbers */}
        {getPageNumbers().map((pageNum, index) =>
          pageNum === "ellipsis" ? (
            <PaginationItem key={`${pageNum}-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={`${pageNum}-${index}`}>
              <Link href={createPageUrl(pageNum)}>
                <PaginationLink isActive={currentPage === pageNum}>
                  {pageNum}
                </PaginationLink>
              </Link>
            </PaginationItem>
          )
        )}

        {/* Next Button */}
        <PaginationItem>
          {currentPage < totalPages ? (
            <Link href={createPageUrl(currentPage + 1)}>
              <PaginationNext />
            </Link>
          ) : (
            <PaginationNext
              aria-disabled={true}
              className="opacity-50 pointer-events-none"
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
