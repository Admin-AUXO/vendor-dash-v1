import { useState, useMemo, useEffect } from 'react';

export interface UsePaginationOptions {
  itemsPerPage?: number;
  initialPage?: number;
}

export interface PaginationResult<T> {
  page: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (itemsPerPage: number) => void;
  paginatedData: T[];
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

/**
 * Custom hook for pagination
 */
export function usePagination<T>(
  data: T[],
  options: UsePaginationOptions = {}
): PaginationResult<T> {
  const { itemsPerPage: initialItemsPerPage = 10, initialPage = 0 } = options;
  const [page, setPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const totalItems = data.length;

  // Reset page if current page is out of bounds
  useEffect(() => {
    if (totalPages > 0 && page >= totalPages) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, page]);

  const paginatedData = useMemo(() => {
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [data, page, itemsPerPage]);

  const startIndex = page * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    paginatedData,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
  };
}

