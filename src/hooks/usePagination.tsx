/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useState } from 'react';

export interface UsePaginationProps {
  total: number;
  pageSize: number;
}

export default function usePagination(props: UsePaginationProps) {
  const { total, pageSize } = props;
  const n = total;

  const [page, _setPage] = useState<number>(1);

  const numberOfPages = useMemo<number>(() => {
    return Math.ceil(n / pageSize);
  }, [n, pageSize]);

  const from = useMemo<number>(() => pageSize * (page - 1), [page, pageSize]);
  const to = useMemo<number>(() => (from + pageSize > n ? n : from + pageSize), [n, from, pageSize]);

  const setPage = useCallback(
    (newPage: number) => {
      if (newPage < 1) {
        newPage = 1;
      }
      if (newPage > numberOfPages) {
        newPage = numberOfPages;
      }
      _setPage(newPage);
    },
    [numberOfPages, _setPage]
  );

  return {
    page,
    setPage,
    pageSize,
    numberOfPages,
    from,
    to: to,
    total: n,
  };
}
