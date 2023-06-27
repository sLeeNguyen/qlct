import Add from './Add';
import Delete from './Delete';
import Filter from './Filter';

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
      <Filter />
    </div>
  );
}
