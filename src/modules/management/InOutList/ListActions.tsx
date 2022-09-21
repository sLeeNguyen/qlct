import { Filter as FilterIcon, Trash2 as Trash2Icon } from 'react-feather';
import Button from 'src/components/Button';
import Add from './Add';

export default function ListActions() {
  return (
    <div
      css={{
        '> *:not(:last-child)': {
          marginRight: 10,
        },
      }}
    >
      <Button size="small" variant="contained" color="error" startIcon={<Trash2Icon size={16} />}>
        Delete
      </Button>
      <Add />
      <Button size="small" variant="contained" color="primary" startIcon={<FilterIcon size={16} />}>
        Filter
      </Button>
    </div>
  );
}
