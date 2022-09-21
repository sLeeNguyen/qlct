import styled from '@emotion/styled';
import React from 'react';
import { colors } from 'src/configs/theme';
import { TextSmall } from '../Text';

interface AdditionalInputProps {
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

type InputProps = AdditionalInputProps & React.InputHTMLAttributes<HTMLInputElement>;

const StyledInput = styled.input<AdditionalInputProps>((props) => ({
  borderRadius: 4,
  border: '1px solid',
  borderColor: props.error ? colors.error : 'rgba(110, 107, 123, 0.35)',
  outlineColor: props.error ? colors.error : colors.primary,
  color: 'inherit',
  padding: '10px 12px',
  fontSize: 16,
  fontWeight: 300,
  width: props.fullWidth ? '100%' : undefined,
}));

export const Label = TextSmall.withComponent('label');

export const Form = styled.form({
  width: '100%',
  '& > *:not(:last-child)': {
    marginBottom: 16,
  },
});

export const FormField = styled.div<{ row?: boolean }>((props) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: props.row ? 'row' : 'column',
  '& > :not(:last-child)': {
    marginBottom: 6,
  },
}));

interface AdditionalInputWithIconProps {
  position: 'start' | 'end';
}
export const InputWithIcon = styled.div<AdditionalInputWithIconProps>((props) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '& .inp-icon-end, & .inp-icon-start': {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    transition: '250ms all linear',
    ':hover': {
      color: colors.primary,
    },
  },
  '& .inp-icon-end': {
    right: 12,
  },
  '& .inp-icon-start': {
    left: 12,
  },
  '& > input': {
    paddingRight: props.position === 'end' ? 44 : undefined,
    paddingLeft: props.position === 'start' ? 44 : undefined,
  },
}));

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const { helperText, error, fullWidth, ...other } = props;
  return (
    <>
      <StyledInput ref={ref} {...other} error={error} />
      {helperText && <TextSmall color={error ? colors.error : undefined}>{helperText}</TextSmall>}
    </>
  );
});
