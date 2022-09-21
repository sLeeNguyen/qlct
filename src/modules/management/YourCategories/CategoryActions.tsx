import { PlusCircle as PlusCircleIcon } from 'react-feather';
import { colors } from 'src/configs/theme';
import Delete from './Delete';

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
          '&.focused, &:hover': {
            color: colors.primary,
          },
        },
      }}
    >
      <PlusCircleIcon className="category-action" size={16} strokeWidth={2.5} />
      <Delete />
    </div>
  );
}
