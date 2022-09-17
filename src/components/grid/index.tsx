import styled from '@emotion/styled';
import { Attributes } from 'react';
import { Breakpoint, breakpoints, mq } from '../breakpoints';

export type GridContainerProps = {
  spacing?: number;
  rowSpacing?: number;
  colSpacing?: number;
};

export const GridContainer = styled.div<GridContainerProps>((props) => ({
  display: 'flex',
  flexWrap: 'wrap',
  marginTop: -(props.rowSpacing ?? props.spacing ?? 1) * 8,
  marginLeft: -(props.colSpacing ?? props.spacing ?? 1) * 8,
  width: `calc(100% + ${(props.colSpacing ?? props.spacing ?? 1) * 8}px)`,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  [String(GridItem)]: {
    paddingTop: (props.rowSpacing ?? props.spacing ?? 1) * 8,
    paddingLeft: (props.colSpacing ?? props.spacing ?? 1) * 8,
  },
}));

//
type GridColumn = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridItemProps = {
  [bp in keyof Breakpoint]?: GridColumn;
};

export const GridItem = styled.div<GridItemProps>((props) => {
  const css: Attributes['css'] = {
    flexGrow: 0,
  };
  let bp: keyof Breakpoint;
  for (bp in breakpoints) {
    if (typeof props[bp] === 'number' && props[bp] >= 0 && props[bp] <= 12) {
      const percent = (props[bp] / 12) * 100;
      css[mq.up(bp)] = {
        flexBasis: `${percent}%`,
        maxWidth: `${percent}%`,
      };
    }
  }
  return css;
});
