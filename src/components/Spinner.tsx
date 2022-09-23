import { keyframes } from '@emotion/react';
import { colors } from 'src/configs/theme';

const spin = keyframes({
  '0%': {
    strokeDasharray: '1 98',
    strokeDashoffset: '-105',
  },
  '50%': {
    strokeDasharray: '80 10',
    strokeDashoffset: '-160',
  },
  '100%': {
    strokeDasharray: '1 98',
    strokeDashoffset: '-300',
  },
});

interface SpinnerProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  size?: number;
  color?: string;
}
const Spinner = (props: SpinnerProps) => {
  const { size = 30, color = colors.primary, ...other } = props;

  return (
    <svg {...other} viewBox="0 0 100 100" width={size} height={size}>
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor={color} />
        </filter>
      </defs>
      <circle
        css={{
          fill: 'transparent',
          stroke: color,
          strokeWidth: 7,
          strokeLinecap: 'round',
          filter: 'url(#shadow)',
          animation: `${spin} 1s ease infinite`,
        }}
        cx="50"
        cy="50"
        r="45"
      />
    </svg>
  );
};

export default Spinner;
