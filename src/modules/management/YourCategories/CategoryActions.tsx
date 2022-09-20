import { PlusCircle as PlusCircleIcon, Trash2 as Trash2Icon } from 'react-feather';
import { colors } from 'src/configs/theme';

export default function CategoryActions() {
  return (
    <div
      css={{
        '> *:not(:last-child)': {
          marginRight: 12,
        },
        '& .category-action': {
          cursor: 'pointer',
          transition: '250ms color ease',
          ':hover': {
            color: colors.primary,
          },
        },
      }}
    >
      <PlusCircleIcon className="category-action" size={16} strokeWidth={2.5} />
      <Trash2Icon className="category-action" size={16} strokeWidth={2.5} />
    </div>
  );
}
