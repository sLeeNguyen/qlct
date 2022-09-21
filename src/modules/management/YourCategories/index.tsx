import chroma from 'chroma-js';
import React from 'react';
import { Card, CardBody, CardHeader } from 'src/components/card';
import StatusContainer from 'src/components/StatusContainer';
import { Text } from 'src/components/Text';
import { colors } from 'src/configs/theme';
import { CategoryDoc } from 'src/firebase/collections';
import { useManagementStore } from 'src/store/management';
import CategoryActions from './CategoryActions';
import CategoryItem from './CategoryItem';
import { useYourCategoriesStore } from './store';

export type CategoryItemData = CategoryDoc;

function YourCategories() {
  const [status, categories] = useManagementStore((state) => [state.categoriesFS, state.categories]);
  const selectedCategories = useYourCategoriesStore((state) => state.selectedCategories);

  return (
    <Card>
      <CardHeader
        css={{
          backgroundColor: chroma(colors.primary).alpha(0.25).hex(),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text css={{ fontWeight: 500 }}>Your Categories</Text>
        <CategoryActions />
      </CardHeader>
      <CardBody>
        <StatusContainer status={status}>
          <div
            css={{
              '> *:not(:last-child)': {
                marginBottom: 8,
              },
            }}
          >
            {categories?.map((item) => (
              <CategoryItem data={item} key={item.id} selected={selectedCategories[item.id]} />
            ))}
          </div>
        </StatusContainer>
      </CardBody>
    </Card>
  );
}

export default React.memo(YourCategories);
