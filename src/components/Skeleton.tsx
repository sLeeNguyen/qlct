import { keyframes } from '@emotion/react';
import chroma from 'chroma-js';
import { colors } from 'src/configs/theme';

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
  rounded?: number | string;
}

const flicker = keyframes({
  '0%': {
    backgroundColor: '#edecec',
  },
  '40%': {
    backgroundColor: chroma('#edecec').brighten(0.2).hex(),
  },
  '100%': {
    backgroundColor: '#edecec',
  },
});

export default function Skeleton(props: SkeletonProps) {
  const { width, height = 20, rounded = 4, ...other } = props;

  return (
    <span
      {...other}
      css={{
        display: 'inline-block',
        borderRadius: rounded,
        width,
        height,
        backgroundColor: colors.background,
        position: 'relative',
        animation: `${flicker} 2s ease infinite`,
      }}
    />
  );
}
