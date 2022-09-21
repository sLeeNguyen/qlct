import Checkbox from 'src/components/Checkbox';
import { TextSmall } from 'src/components/Text';
import { CategoryItemData } from '.';

interface CategoryItemProps {
  data: CategoryItemData;
}

export default function CategoryItem(props: CategoryItemProps) {
  return (
    <div css={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
      <Checkbox id={props.data.id} label={props.data.name} />
      <span
        css={{
          marginLeft: 12,
          display: 'inline-block',
          backgroundColor: '#8884d8',
          padding: '4px 12px',
          borderRadius: 24,
        }}
      >
        <TextSmall css={{ fontWeight: 400, color: 'white' }}>{0}</TextSmall>
      </span>
    </div>
  );
}
