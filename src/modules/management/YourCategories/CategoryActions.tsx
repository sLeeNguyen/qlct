import { PlusCircle as PlusCircleIcon } from 'react-feather';
import { colors } from 'src/configs/theme';
import Delete from './Delete';
import { useYourCategoriesStore } from './store';

export default function CategoryActions() {
  const [openAddForm, toggleAddForm] = useYourCategoriesStore((state) => [state.openAddForm, state.toggleAddForm]);

  return (
    <div
      css={{
        '> *:not(:last-child)': {
          marginRight: 12,
        },
        '& .category-action': {
          cursor: 'pointer',
          transition: '250ms color ease',
          '&.focused, &:hover': {
            color: colors.primary,
          },
        },
      }}
    >
      <PlusCircleIcon
        className={`category-action${openAddForm ? ' focused' : ''}`}
        size={16}
        strokeWidth={2.5}
        onClick={toggleAddForm}
      />
      <Delete />
    </div>
  );
}
