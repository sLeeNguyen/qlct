import styled from '@emotion/styled';
import { colors } from 'src/configs/theme';
import { Text } from '../Text';

export const Card = styled.div((props) => ({
  backgroundColor: colors.surface,
  borderRadius: 8,
  overflow: 'hidden',
  boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
}));

export const CardTitle = styled.div((props) => ({
  padding: '16px 20px',
}));

export const CardTitleText = styled(Text)({
  fontSize: 20,
  lineHeight: 24 / 20,
  fontWeight: 400,
});

export const CardBody = styled.div((props) => ({
  padding: '16px 20px',
}));
