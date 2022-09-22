import { Filter as FilterIcon } from 'react-feather';
import Button from 'src/components/Button';
import Add from './Add';
import Delete from './Delete';

export default function ListActions() {
  return (
    <div
      css={{
        '> *:not(:last-child)': {
          marginRight: 10,
        },
      }}
    >
      <Delete />
      <Add />
      <Button size="small" variant="contained" color="primary" startIcon={<FilterIcon size={16} />}>
        Filter
      </Button>
    </div>
  );
}
