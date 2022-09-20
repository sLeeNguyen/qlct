/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useState } from 'react';

export interface UsePaginationProps<T> {
  data: Array<T>;
  pageSize: number;
}

export default function usePagination<T = any>(props: UsePaginationProps<T>) {
  const { data, pageSize } = props;
  const n = data.length;

  const [page, _setPage] = useState<number>(1);

  const numberOfPages = useMemo<number>(() => {
    return Math.ceil(n / pageSize);
  }, [n, pageSize]);

  const from = useMemo<number>(() => pageSize * (page - 1), [page, pageSize]);
  const to = useMemo<number>(() => (from + pageSize > n ? n : from + pageSize), [n, from, pageSize]);

  const renderList = useMemo<Array<T>>(() => {
    return data.slice(from, to);
  }, [from, to, data]);

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
    renderList,
    from,
    to: to,
    total: n,
  };
}
