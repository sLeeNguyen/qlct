import styled from '@emotion/styled';
import { Attributes } from 'react';
import { Breakpoint, breakpoints } from '../breakpoints';

export type ContainerProps = {
  maxWidth?: keyof Breakpoint | number;
};
export const Container = styled.div<ContainerProps>((props) => {
  const css: Attributes['css'] = {
    margin: 'auto',
    width: '100%',
  };
  if (typeof props.maxWidth === 'number') {
    css['maxWidth'] = props.maxWidth;
  } else if (props.maxWidth !== undefined) {
    css['maxWidth'] = breakpoints[props.maxWidth];
  }
  return css;
});
