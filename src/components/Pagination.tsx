import chroma from 'chroma-js';
import { HTMLAttributes, useCallback, useMemo } from 'react';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronsLeft as ChevronsLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronsRight as ChevronsRightIcon,
  IconProps,
} from 'react-feather';
import { colors } from 'src/configs/theme';

const makeArray = (fromValue: number, n: number) => {
  return new Array(n).fill(0).map((_, idx) => fromValue + idx);
};

interface PageItemProps extends HTMLAttributes<HTMLSpanElement> {
  page: number;
  active?: boolean;
}
const PageItem: React.FC<PageItemProps> = (props: PageItemProps) => {
  const { active, page, ...other } = props;
  return (
    <span {...other} className={active ? 'pagination-item active' : 'pagination-item'}>
      {page}
    </span>
  );
};

export interface PaginationProps {
  page: number;
  nPages: number;
  onChange?: (newPage: number) => void;
  size: 'small' | 'medium' | 'large';
  siblingCount: number;
  boundaryCount: number;
}

export default function Pagination(props: PaginationProps) {
  const { page, nPages, size, onChange, siblingCount, boundaryCount } = props;

  const handlePageChange = useCallback(
    (newPage: number) => {
      onChange && onChange(newPage);
    },
    [onChange]
  );

  const renderedPages = useMemo(() => {
    let sc = siblingCount;
    let bc = boundaryCount;

    // validate siblingCount, boundaryCount
    // 1 <= boundaryCount <= nPages
    // 0 <= siblingCount <= nPages
    if (bc < 1 || bc > nPages) {
      bc = Math.min(1, nPages);
    }
    if (sc < 0 || sc > nPages) {
      sc = Math.min(1, nPages);
    }

    let pages: Array<number | null> = [];
    const n = 2 * sc + 2 * bc + 2 + 1; // size of pages

    if (n < nPages) {
      if (bc + sc + 1 >= page - 1) {
        pages = [...makeArray(1, bc + 2 * sc + 1 + 1), null, ...makeArray(nPages - bc + 1, bc)];
      } else if (bc + sc + 1 >= nPages - page) {
        pages = [...makeArray(1, bc), null, ...makeArray(nPages - (bc + 2 * sc + 1), bc + 2 * sc + 1 + 1)];
      } else {
        pages = [
          ...makeArray(1, bc),
          null,
          ...makeArray(page - sc, 2 * sc + 1),
          null,
          ...makeArray(nPages - bc + 1, bc),
        ];
      }
    } else {
      pages = makeArray(1, nPages);
    }

    return (
      <span
        css={{
          '> *:not(:last-child)': {
            marginRight: 4,
            userSelect: 'none',
          },
          '.pagination-item': {
            fontSize: 14,
            lineHeight: 1,
            '&.active': {
              backgroundColor: colors.primary,
              fontWeight: 400,
              color: 'white',
            },
            '&.pagination-more': {
              cursor: 'text',
            },
          },
        }}
      >
        {pages.map((item, idx) => {
          if (item === null)
            return (
              <span key={idx} className="pagination-item pagination-more">
                ...
              </span>
            );
          return (
            <PageItem
              key={idx}
              page={item}
              active={item === page}
              onClick={() => handlePageChange(item)}
              aria-label={item === page ? `Page ${item}` : `Go to page ${item}`}
            />
          );
        })}
      </span>
    );
  }, [siblingCount, boundaryCount, nPages, page, handlePageChange]);

  const iconProps = useMemo<IconProps>(() => {
    const p: IconProps = {};
    if (size === 'medium') {
      Object.assign(p, {
        size: 18,
        strokeWidth: 1.5,
      });
    } else if (size === 'small') {
      Object.assign(p, {
        size: 16,
        strokeWidth: 1.5,
      });
    } else {
      Object.assign(p, {
        size: 20,
        strokeWidth: 2,
      });
    }
    return p;
  }, [size]);

  return (
    <span
      css={{
        display: 'inline-flex',
        alignItems: 'center',
        '> *:not(:last-child)': {
          marginRight: 8,
        },
        '.pagination-item': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: 4,
          transition: '250ms background-color ease',
          minWidth: 32,
          height: 26,
          ':hover:not(.active):not(.pagination-more)': {
            backgroundColor: chroma('#000').alpha(0.1).hex(),
          },
        },
      }}
      aria-label="pagination"
    >
      <span className="pagination-item" aria-label="Go to first page" onClick={() => handlePageChange(1)}>
        <ChevronsLeftIcon {...iconProps} />
      </span>
      <span className="pagination-item" aria-label="Go to previous page" onClick={() => handlePageChange(page - 1)}>
        <ChevronLeftIcon {...iconProps} />
      </span>
      {renderedPages}
      <span className="pagination-item" aria-label="Go to next page" onClick={() => handlePageChange(page + 1)}>
        <ChevronRightIcon {...iconProps} />
      </span>
      <span className="pagination-item" aria-label="Go to last page" onClick={() => handlePageChange(nPages)}>
        <ChevronsRightIcon {...iconProps} />
      </span>
    </span>
  );
}

Pagination.defaultProps = {
  size: 'medium',
  siblingCount: 1,
  boundaryCount: 1,
};
