/* eslint-disable @typescript-eslint/no-non-null-assertion */
import chroma from 'chroma-js';
import Spinner from 'src/components/Spinner';
import { FS } from 'src/configs/fs';
import { colors } from 'src/configs/theme';
import { useManagementStore } from 'src/store';
import { useFilterStore } from './store';

export default function CategoryFilter() {
  const { categoriesFS, categories } = useManagementStore();
  const selectedCategories = useFilterStore((state) => state.categories);
  const updateCategories = useFilterStore((state) => state.updateCategories);

  const toggleCategoryHandler = (id: string) => () => {
    const idx = selectedCategories.findIndex((item) => item === id);
    if (idx === -1) {
      updateCategories([...selectedCategories, id]);
    } else {
      updateCategories(selectedCategories.slice(0, idx).concat(selectedCategories.slice(idx + 1)));
    }
  };

  if (categoriesFS === FS.FETCHING) {
    return (
      <div css={{ textAlign: 'center' }}>
        <Spinner />
      </div>
    );
  }
  if (categoriesFS !== FS.SUCCESS) {
    return null;
  }

  return (
    <div css={{ display: 'flex', flexWrap: 'wrap', marginTop: 4 }}>
      {categories!.map((item) => (
        <div
          key={item.id}
          className={selectedCategories.includes(item.id) ? 'selected' : undefined}
          css={{
            marginTop: 8,
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px 12px',
            border: '1px solid',
            borderColor: chroma(colors.textPrimary).alpha(0.35).hex(),
            borderRadius: '16px',
            cursor: 'pointer',
            color: colors.textPrimary,
            '&:hover': {
              borderColor: colors.textPrimary,
            },
            '&:not(:last-of-type)': { marginRight: 8 },
            '&.selected': {
              borderColor: colors.primary,
              color: colors.primary,
              backgroundColor: chroma(colors.primary).alpha(0.1).hex(),
            },
          }}
          onClick={toggleCategoryHandler(item.id)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}
