import { useMemo } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { Card, CardBody, CardTitleText } from 'src/components/card';
import Skeleton from 'src/components/Skeleton';
import { Text } from 'src/components/Text';
import { FS } from 'src/configs/fs';
import { colors } from 'src/configs/theme';
import { useDashboardStore } from 'src/store/dashboard';
import { formatNumber } from 'src/utils';

type DataItem = {
  timestamp: number;
  value: number;
};

export default function BalanceOverall() {
  const [balance, balanceFluctuation, overallFS] = useDashboardStore((state) => [
    state.balance,
    state.balanceFluctuation,
    state.overallFS,
  ]);

  const data = useMemo<DataItem[]>(() => {
    if (!balanceFluctuation) return [] as DataItem[];
    return Object.entries(balanceFluctuation).map(([t, v]) => ({ timestamp: Number(t), value: v }));
  }, [balanceFluctuation]);

  const isLoading = overallFS === FS.FETCHING || overallFS === FS.IDLE;

  return (
    <Card>
      <CardBody css={{ paddingBottom: 8 }}>
        <CardTitleText css={{ marginBottom: 8 }}>Balance</CardTitleText>
        {isLoading ? (
          <Skeleton width={200} height={30} />
        ) : (
          <Text css={{ fontSize: 28, fontWeight: 600, lineHeight: 34 / 28 }}>
            {formatNumber(balance)} <Text as="span">VND</Text>
          </Text>
        )}
      </CardBody>
      <ResponsiveContainer width={'100%'} height={100}>
        <LineChart width={300} height={100} data={data} margin={{ top: 5, bottom: 5, left: 20, right: 20 }}>
          <Line type="monotone" dataKey="value" stroke={colors.primary} strokeWidth={1} dot={false} />
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Tooltip
            labelStyle={{
              fontSize: 12,
              fontWeight: 400,
            }}
            contentStyle={{
              fontSize: 14,
              fontWeight: 500,
            }}
            formatter={(value: number) => [`${formatNumber(value)} VND`, 'Balance']}
            labelFormatter={(_, payload) => {
              if (payload[0]?.payload) {
                return new Date(payload[0].payload.timestamp).toLocaleDateString();
              }
              return undefined;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
