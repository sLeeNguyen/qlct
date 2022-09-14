import { Global } from '@emotion/react';
import { colors } from 'src/configs/theme';

export default function GlobalStyles() {
  return (
    <Global
      styles={{
        body: {
          backgroundColor: colors.background,
          // eslint-disable-next-line quotes
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
          color: colors.textPrimary,
        },
      }}
    />
  );
}
