import chroma from 'chroma-js';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Filter as FilterIcon } from 'react-feather';
import Button, { ButtonProps } from 'src/components/Button';
import Popper from 'src/components/Popper';
import { Text } from 'src/components/Text';
import { CardBody, CardHeader } from 'src/components/card';
import { colors } from 'src/configs/theme';
import Actions from './Actions';
import CategoryFilter from './CategoryFilter';
import TimeFilter from './TimeFilter';
import TypeFilter from './TypeFilter';
import { useFilterStore } from './store';

const FilterLabel = ({ title }: { title: string }) => {
  return (
    <div css={{ paddingBottom: 4, borderBottom: `1px solid ${chroma(colors.textPrimary).alpha(0.2).hex()}` }}>
      <Text css={{ fontWeight: 500 }}>{title}</Text>
    </div>
  );
};

export default function Filter(props: Partial<ButtonProps>) {
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(null);
  const [openPopper, setOpenPopper] = useState<boolean>(false);
  const filters = useFilterStore((state) => state.appliedFilters);
  const [reset, resetCurrentFilter] = useFilterStore((state) => [state.reset, state.resetCurrentFilter]);

  const toggleButton = (ev: SyntheticEvent) => {
    ev.stopPropagation();
    setOpenPopper(!openPopper);
    resetCurrentFilter();
  };

  useEffect(() => {
    const handleClick = () => {
      setOpenPopper(false);
    };

    if (openPopper) {
      window.addEventListener('click', handleClick);
    }

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [openPopper]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <>
      <Button
        ref={setButtonElement}
        size="small"
        variant="contained"
        color="primary"
        startIcon={<FilterIcon size={16} />}
        {...props}
        css={{
          position: 'relative',
        }}
        onClick={toggleButton}
      >
        Filter
        {filters && (
          <span
            css={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: colors.error,
              position: 'absolute',
              right: 0,
              top: 0,
              transform: 'translate(40%, -40%)',
            }}
          />
        )}
      </Button>
      <Popper
        open={openPopper}
        anchorEl={buttonElement}
        arrow
        popperOptions={{
          placement: 'bottom-end',
        }}
        onClick={(ev) => ev.stopPropagation()}
        css={{
          filter: 'drop-shadow(0px 0px 4px rgba(97, 151, 51, 0.6)) drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25))',
          maxWidth: 500,
          width: '100%',
        }}
      >
        <CardHeader>
          <Text color={colors.primary} css={{ fontWeight: 600, fontSize: 20, textAlign: 'center' }}>
            Add Filters
          </Text>
        </CardHeader>
        <CardBody>
          <div css={{ marginBottom: 24 }}>
            <FilterLabel title="Category" />
            <CategoryFilter />
          </div>
          <div css={{ marginBottom: 24 }}>
            <FilterLabel title="Type" />
            <TypeFilter />
          </div>
          <div>
            <FilterLabel title="Time" />
            <TimeFilter />
          </div>
          <Actions
            onFilter={() => {
              setOpenPopper(false);
            }}
          />
        </CardBody>
      </Popper>
    </>
  );
}
