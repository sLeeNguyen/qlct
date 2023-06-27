import { Disc } from 'react-feather';
import { colors } from 'src/configs/theme';
import { TypeOption, useFilterStore } from './store';

const configs: Array<{ key: TypeOption; title: string }> = [
  { key: 'in', title: 'In' },
  { key: 'out', title: 'Out' },
  { key: 'both', title: 'In/Out' },
];

export default function TypeFilter() {
  const selectedType = useFilterStore((state) => state.type);
  const updateType = useFilterStore((state) => state.updateType);

  return (
    <div css={{ display: 'flex', flexWrap: 'wrap', marginTop: 12 }}>
      {configs.map((item) => (
        <div
          key={item.key}
          className={item.key === selectedType ? 'selected' : undefined}
          onClick={() => {
            updateType(item.key as TypeOption);
          }}
          css={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:not(:last-of-type)': { marginRight: 32 },
            '&.selected': {
              '.icon': {
                fill: colors.primary,
                'circle:nth-child(2)': {
                  fill: colors.background,
                },
              },
            },
          }}
        >
          <Disc size={16} css={{ marginRight: 8 }} className="icon" />
          {item.title}
        </div>
      ))}
    </div>
  );
}
