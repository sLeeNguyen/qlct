import { Options, VirtualElement } from '@popperjs/core';
import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import { colors } from 'src/configs/theme';
import { setRef } from 'src/utils';
import { Card } from './card';

export interface PopperProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  anchorEl?: null | VirtualElement | (() => VirtualElement);
  popperOptions?: Partial<Options>;
  arrow?: boolean;
}

function resolveAnchorEl(anchorEl: PopperProps['anchorEl']) {
  return typeof anchorEl === 'function' ? anchorEl() : anchorEl;
}

const Popper = React.forwardRef<HTMLDivElement, React.PropsWithChildren<PopperProps>>(function Popper(props, ref) {
  const { anchorEl, children, open, popperOptions, arrow, ...other } = props;

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

  setRef(ref, popperElement);

  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const modifiers = useMemo(() => {
    const m: Options['modifiers'] = [{ name: 'eventListeners', enabled: open }];
    if (arrow) {
      m.push(
        { name: 'arrow', options: { element: arrowElement } },
        {
          name: 'offset',
          options: {
            offset: [0, 12],
          },
        }
      );
    }

    if (popperOptions && popperOptions.modifiers) {
      m.push(...popperOptions.modifiers);
    }
    return m;
  }, [open, arrow, arrowElement, popperOptions]);

  const { styles, attributes, forceUpdate } = usePopper(resolveAnchorEl(anchorEl), popperElement, {
    ...popperOptions,
    modifiers,
  });

  useEffect(() => {
    if (open && forceUpdate) {
      forceUpdate();
    }
  }, [open, forceUpdate]);

  if (!open) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      {...other}
      role="presentation"
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
      css={{
        '&[data-popper-placement^="top"] .popper-arrow': {
          bottom: -6,
        },
        '&[data-popper-placement^="bottom"] .popper-arrow': {
          top: -6,
        },
        '&[data-popper-placement^="left"] .popper-arrow': {
          right: -6,
        },
        '&[data-popper-placement^="right"] .popper-arrow': {
          left: -6,
        },
      }}
    >
      {arrow ? (
        <div>
          <div
            ref={setArrowElement}
            className="popper-arrow"
            style={styles.arrow}
            css={{
              visibility: 'hidden',
              // overflow: 'hidden',
              '&, &:before': {
                position: 'absolute',
                width: 12,
                height: 12,
              },
              '&:before': {
                visibility: 'visible',
                content: '""',
                backgroundColor: colors.surface,
                transform: 'rotate(45deg)',
                // transformOrigin: '100% 0px',
                boxShadow: '-4px -4px 6px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
          <Card>{children}</Card>
        </div>
      ) : (
        <Card>{children}</Card>
      )}
    </div>,
    document.body
  );
});

export default Popper;
