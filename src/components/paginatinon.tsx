"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type PaginationProps = {
  page?: number;
  perPage?: number;
  total?: number;
  totalPages: number;
};

export default function GeneratePagination({
  //   page ,
  //   perPage = 2,
  //   total = 4,
  totalPages,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) ?? 1;

  // Generate page numbers dynamically
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {currentPage > 1 ? (
            <Link href={`?page=${currentPage - 1}`}>
              <PaginationPrevious />
            </Link>
          ) : (
            <PaginationPrevious
              aria-disabled={true}
              className="opacity-50 pointer-events-none"
            />
          )}
        </PaginationItem>

        {/* Page Numbers */}
        {getPageNumbers().map((pageNum: number) => (
          <PaginationItem key={pageNum}>
            <Link href={`?page=${pageNum}`}>
              <PaginationLink
                isActive={currentPage === pageNum || pageNum === 1}
              >
                {pageNum}
              </PaginationLink>
            </Link>
          </PaginationItem>
        ))}

        {/* Next Button */}
        <PaginationItem>
          {currentPage < totalPages ? (
            <Link href={`?page=${currentPage + 1}`}>
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
