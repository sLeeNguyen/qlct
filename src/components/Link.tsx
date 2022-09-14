import styled from '@emotion/styled';
import { colors } from 'src/configs/theme';

const Link = styled.a({
  color: colors.primary,
  cursor: 'pointer',
  ':hover': {
    textDecoration: 'underline',
    transition: '250ms color linear',
  },
});

export default Link;
