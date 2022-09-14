/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { Attributes, ButtonHTMLAttributes, useMemo } from 'react';
import { colors } from 'src/configs/theme';
import chroma from 'chroma-js';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant: 'contained' | 'outlined';
  color: 'primary' | 'default';
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
}

export default function Button(props: React.PropsWithChildren<ButtonProps>) {
  const { children, color, variant, fullWidth, loading, loadingText, ...other } = props;

  const css = useMemo(() => {
    const colorsMap = {
      primary: colors.primary,
      default: colors.textPrimary,
      primaryDarker: colors.primaryDarker,
      defaultDarker: colors.textPrimaryDarker,
    };

    const _css: Attributes['css'] = {
      borderRadius: 4,
      fontWeight: 500,
      padding: '10px 16px',
      cursor: loading ? 'progress' : 'pointer',
      border: 'none',
      fontSize: '16px',
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

    return _css;
  }, [loading, variant, fullWidth, color, other.disabled]);

  return (
    <button css={css} {...other}>
      {loading ? loadingText ? loadingText : <>{children}...</> : children}
    </button>
  );
}

Button.defaultProps = {
  variant: 'contained',
  color: 'default',
  fullWidth: false,
  loading: false,
};
