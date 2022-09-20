import chroma from 'chroma-js';
import { Card, CardBody, CardHeader } from 'src/components/card';
import { Text } from 'src/components/Text';
import { colors } from 'src/configs/theme';
import CategoryActions from './CategoryActions';
import CategoryItem from './CategoryItem';

export type CategoryItemData = {
  id: string;
  name: string;
  description: string;
  nItems: number;
};

const list: Array<CategoryItemData> = [
  {
    id: '43KexdddAbUWIvs7XaAh',
    name: 'breakfast',
    description: 'Expense for breakfast',
    nItems: 10,
  },
  {
    id: 'FwegWGz41C6ZNlHLuCNW',
    name: 'lunch',
    description: 'Expense for lunch',
    nItems: 10,
  },
  {
    id: '43KexdddAbUWIvs7XaAl',
    name: 'eat',
    description: 'Expense for eating',
    nItems: 10,
  },
];

export default function YourCategories() {
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
        <div
          css={{
            '> *:not(:last-child)': {
              marginBottom: 8,
            },
          }}
        >
          {list.map((item) => (
            <CategoryItem data={item} key={item.id} />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
