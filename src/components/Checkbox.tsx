import { Attributes, InputHTMLAttributes } from 'react';
import { colors } from 'src/configs/theme';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  size: number;
  label?: string;
  checkmarkCss?: Attributes['css'];
}

export default function Checkbox(props: CheckboxProps) {
  const { size, label, className, checkmarkCss, ...inputProps } = props;
  return (
    <label
      htmlFor={inputProps.id}
      css={[
        {
          position: 'relative',
          paddingLeft: size + (label ? 8 : 0),
          lineHeight: `${size}px`,
          cursor: 'pointer',
          '& input:checked': {
            '& ~ .checkmark': {
              backgroundColor: colors.primary,
              borderColor: 'transparent',
            },
            '& ~ .checkmark:after': {
              display: 'block',
            },
          },
        },
      ]}
      className={className}
    >
      {label}
      <input
        {...inputProps}
        type="checkbox"
        css={{
          opacity: 0,
          position: 'absolute',
          cursor: 'pointer',
          height: 0,
          width: 0,
          top: 0,
          left: 0,
        }}
      />
      <span
        className="checkmark"
        css={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'block',
            width: size,
            height: size,
            border: '1px solid rgba(110, 107, 123, 0.35)',
            borderRadius: 4,
            '&:after': {
              content: '""',
              position: 'absolute',
              display: 'none',
              left: '50%',
              top: '50%',
              height: size * 0.5,
              width: size * 0.25,
              border: 'solid white',
              borderWidth: '0 2px 2px 0',
              transform: 'translate(-50%, -60%) rotate(45deg)',
            },
          },
          checkmarkCss,
        ]}
      />
    </label>
  );
}

Checkbox.defaultProps = {
  size: 20,
};
