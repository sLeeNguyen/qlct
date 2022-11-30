/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useState } from 'react';
import { isNumeric } from 'src/utils';

export interface UsePaginationProps<T> {
  total?: number;
  pageSize: number;
  data?: Array<T>;
}

export default function usePagination<T = unknown>(props: UsePaginationProps<T>) {
  const { total, pageSize, data } = props;

  if (!data && !isNumeric(total)) {
    throw new Error('Must provide at least `total` or `data` property');
  }

  const n = (total ?? data?.length) as number;

  const [page, _setPage] = useState<number>(1);

  const numberOfPages = useMemo<number>(() => {
    return Math.ceil(n / pageSize);
  }, [n, pageSize]);

  const from = useMemo<number>(() => pageSize * (page - 1), [page, pageSize]);
  const to = useMemo<number>(() => (from + pageSize > n ? n : from + pageSize), [n, from, pageSize]);

  const dataShow = useMemo<Array<T> | undefined>(() => (data ? data.slice(from, to) : undefined), [data, from, to]);

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
    dataShow,
  };
}
