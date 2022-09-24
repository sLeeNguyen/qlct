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
export type AdditionalGridItemProps = {
  [bp in keyof Breakpoint]?: GridColumn;
};

export const GridItem = styled.div<AdditionalGridItemProps>((props) => {
  const css: Attributes['css'] = {
    flexGrow: 0,
  };
  props['xs'];
  let bp: keyof Breakpoint;
  for (bp in breakpoints) {
    const v = props[bp];
    if (typeof v === 'number' && v >= 0 && v <= 12) {
      const percent = (v / 12) * 100;
      css[mq.up(bp)] = {
        flexBasis: `${percent}%`,
        maxWidth: `${percent}%`,
      };
    }
  }
  return css;
});
