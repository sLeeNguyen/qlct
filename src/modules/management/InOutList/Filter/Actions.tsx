import Button from 'src/components/Button';
import { useFilterStore } from './store';
import { User, useManagementStore, useUserStore } from 'src/store';

export default function Actions({ onFilter }: { onFilter?: () => void }) {
  const user = useUserStore((state) => state.user as User);
  const fetchInOut2 = useManagementStore((state) => state.fetchInOut2);
  const clearFilter = useFilterStore((state) => state.clearFilter);
  const applyCurrentFilter = useFilterStore((state) => state.applyCurrentFilter);
  const filters = useFilterStore((state) => ({
    time: state.time,
    type: state.type,
    categories: state.categories,
  }));

  const handleFilter = async () => {
    if (filters.time && typeof filters.time === 'object') {
      if (!filters.time.from || !filters.time.to) {
        return;
      }
    }
    onFilter && onFilter();
    applyCurrentFilter();
    await fetchInOut2(user.uid, filters);
  };

  return (
    <div css={{ marginTop: 24, textAlign: 'right' }}>
      <Button
        variant="outlined"
        color="primary"
        css={{ marginRight: 16 }}
        onClick={() => {
          clearFilter();
        }}
      >
        Clear
      </Button>
      <Button color="primary" onClick={handleFilter}>
        Apply
      </Button>
    </div>
  );
}
