import styled from '@emotion/styled';
import { colors } from 'src/configs/theme';

export const Text = styled.p((props) => ({
  color: props.color ?? colors.textPrimary,
  fontSize: '16px',
  lineHeight: '19.5px',
  fontWeight: 300,
}));

export const TextSmall = styled.p((props) => ({
  color: props.color ?? colors.textPrimary,
  fontSize: '14px',
  lineHeight: '17.07px',
  fontWeight: 300,
}));
