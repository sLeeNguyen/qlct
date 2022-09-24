/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { Attributes, ButtonHTMLAttributes, useMemo } from 'react';
import { colors } from 'src/configs/theme';
import chroma from 'chroma-js';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: 'contained' | 'outlined';
  color?: 'primary' | 'default' | 'error';
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: 'large' | 'medium' | 'small';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    children,
    color = 'default',
    size = 'medium',
    variant = 'contained',
    fullWidth = false,
    loading = false,
    loadingText,
    startIcon,
    endIcon,
    ...other
  } = props;

  const css = useMemo(() => {
    const colorsMap = {
      primary: colors.primary,
      default: colors.textPrimary,
      error: colors.error,
      primaryDarker: colors.primaryDarker,
      defaultDarker: colors.textPrimaryDarker,
      errorDarker: colors.errorDarker,
    };

    const _css: Attributes['css'] = {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      fontWeight: 500,
      padding: '10px 16px',
      cursor: loading ? 'progress' : 'pointer',
      border: 'none',
      fontSize: '14px',
      ':hover': {
        transition: '250ms all linear',
      },
      ':disabled': {
        opacity: 0.3,
        cursor: !loading ? 'not-allowed' : undefined,
      },
    };
    if (variant === 'contained') {
      _css['color'] = 'white';
      _css['backgroundColor'] = colorsMap[color];
      !other.disabled && (_css[':hover']!['backgroundColor'] = colorsMap[`${color}Darker`]);
    } else if (variant === 'outlined') {
      _css['color'] = colorsMap[color];
      _css['border'] = '1px solid';
      _css['borderColor'] = colorsMap[color];
      _css[':hover']!['borderColor'] = colorsMap[`${color}Darker`];
      _css['backgroundColor'] = 'transparent';
      !other.disabled && (_css[':hover']!['backgroundColor'] = chroma(colorsMap[color]).alpha(0.1).hex());
    }

    if (fullWidth) {
      _css['width'] = '100%';
    }

    if (size === 'large') {
      _css['padding'] = '12px 20px';
      _css['fontSize'] = 18;
    } else if (size === 'small') {
      _css['padding'] = '8px 12px';
      _css['fontSize'] = 14;
    } else {
      _css['padding'] = '10px 16px';
      _css['fontSize'] = 16;
    }

    return _css;
  }, [loading, variant, fullWidth, color, other.disabled, size]);

  return (
    <button ref={ref} css={css} {...other}>
      {startIcon && <span css={{ display: 'inline-flex', alignItems: 'center', marginRight: 8 }}>{startIcon}</span>}
      <span>{loading ? loadingText ? loadingText : <>{children}...</> : children}</span>
      {endIcon && <span css={{ display: 'inline-flex', alignItems: 'center', marginRight: 8 }}>{startIcon}</span>}
    </button>
  );
});

export default Button;
