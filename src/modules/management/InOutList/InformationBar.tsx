import { useMemo } from 'react';
import { Text, TextSmall } from 'src/components/Text';
import { colors } from 'src/configs/theme';
import { useManagementStore } from 'src/store';
import { formatNumber } from 'src/utils';

export default function InformationBar() {
  const rows = useManagementStore((state) =>
    state.revenuesAndExpenditures ? Object.values(state.revenuesAndExpenditures) : []
  );

  const totalIn = useMemo(
    () => rows.filter((item) => item.type === 'income').reduce((acc, item) => acc + item.value, 0),
    [rows]
  );
  const totalOut = useMemo(
    () => rows.filter((item) => item.type === 'outcome').reduce((acc, item) => acc + item.value, 0),
    [rows]
  );

  return (
    <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Text css={{ textAlign: 'right', marginRight: 24 }}>
        In: <span css={{ fontWeight: 500, color: colors.primary }}>{formatNumber(totalIn)}</span>{' '}
        <TextSmall as={'span'}>VND</TextSmall>
      </Text>
      <Text css={{ textAlign: 'right' }}>
        Out: <span css={{ fontWeight: 500, color: colors.error }}>{formatNumber(totalOut)}</span>{' '}
        <TextSmall as={'span'}>VND</TextSmall>
      </Text>
    </div>
  );
}
