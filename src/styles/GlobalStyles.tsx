/* eslint-disable quotes */
import { Global } from '@emotion/react';
import { colors } from 'src/configs/theme';

export default function GlobalStyles() {
  return (
    <Global
      styles={{
        '*': {
          boxSizing: 'border-box',
          margin: 0,
        },
        body: {
          backgroundColor: colors.background,
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
          color: colors.textPrimary,
        },
        button: {
          fontWeight: 500,
          fontFamily: "'Montserrat', sans-serif",
        },
        'input, textarea': {
          fontFamily: "'Montserrat', sans-serif",
        },
      }}
    />
  );
}
