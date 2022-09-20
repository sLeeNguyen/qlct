import { Filter as FilterIcon, Plus as PlusIcon, Trash2 as Trash2Icon } from 'react-feather';
import Button from 'src/components/Button';

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
      <Button size="small" variant="contained" color="primary" startIcon={<PlusIcon size={16} />}>
        Add
      </Button>
      <Button size="small" variant="contained" color="primary" startIcon={<FilterIcon size={16} />}>
        Filter
      </Button>
    </div>
  );
}
