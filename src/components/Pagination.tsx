import { useMemo } from "react";
import { Button } from "./Button";
import { cx } from "../utils/cx";

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  className?: string;
  disabled?: boolean;
}

type PageElement = number | "ellipsis";

const createRange = (start: number, end: number): number[] => {
  const range: number[] = [];
  for (let i = start; i <= end; i += 1) {
    range.push(i);
  }
  return range;
};

export const Pagination = ({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  className,
  disabled = false,
}: PaginationProps) => {
  const items = useMemo<PageElement[]>(() => {
    if (pageCount <= 0) return [];
    const totalNumbers = siblingCount * 2 + boundaryCount * 2 + 3;
    if (pageCount <= totalNumbers) {
      return createRange(1, pageCount);
    }

    const startPage = Math.max(page - siblingCount, boundaryCount + 2);
    const endPage = Math.min(page + siblingCount, pageCount - boundaryCount - 1);

    const shouldShowLeftEllipsis = startPage > boundaryCount + 2;
    const shouldShowRightEllipsis = endPage < pageCount - boundaryCount - 1;

    const pages: PageElement[] = [];

    pages.push(...createRange(1, boundaryCount));

    if (shouldShowLeftEllipsis) {
      pages.push("ellipsis");
    } else {
      pages.push(...createRange(boundaryCount + 1, startPage - 1));
    }

    pages.push(...createRange(startPage, endPage));

    if (shouldShowRightEllipsis) {
      pages.push("ellipsis");
    } else {
      pages.push(...createRange(endPage + 1, pageCount - boundaryCount));
    }

    pages.push(...createRange(Math.max(pageCount - boundaryCount + 1, boundaryCount + 1), pageCount));

    return pages;
  }, [page, pageCount, siblingCount, boundaryCount]);

  const goToPage = (next: number) => {
    if (next < 1 || next > pageCount || disabled) return;
    onPageChange?.(next);
  };

  const canGoPrev = page > 1;
  const canGoNext = page < pageCount;

  return (
    <nav className={cx("mosaic-pagination", className)} aria-label="Pagination">
      <Button
        variant="ghost"
        tone="neutral"
        onClick={() => goToPage(page - 1)}
        disabled={!canGoPrev || disabled}
      >
        Previous
      </Button>
      <ul className="mosaic-pagination__list">
        {items.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <li key={`ellipsis-${index}`} className="mosaic-pagination__ellipsis" aria-hidden="true">
                …
              </li>
            );
          }
          const isActive = item === page;
          return (
            <li key={item}>
              <Button
                variant={isActive ? "solid" : "ghost"}
                tone={isActive ? "primary" : "neutral"}
                onClick={() => goToPage(item)}
                aria-current={isActive ? "page" : undefined}
                disabled={disabled}
              >
                {item}
              </Button>
            </li>
          );
        })}
      </ul>
      <Button
        variant="ghost"
        tone="neutral"
        onClick={() => goToPage(page + 1)}
        disabled={!canGoNext || disabled}
      >
        Next
      </Button>
    </nav>
  );
};
