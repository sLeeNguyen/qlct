export type Breakpoint = {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};
export const breakpoints: Breakpoint = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 };
export const mq = {
  up: (bp: keyof Breakpoint) => {
    return `@media (min-width: ${breakpoints[bp]}px)`;
  },
  down: (bp: keyof Breakpoint) => {
    return `@media (max-width: ${breakpoints[bp]}px)`;
  },
};
