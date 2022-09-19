import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardBody, CardTitleText } from 'src/components/card';
import { Text } from 'src/components/Text';
import { colors } from 'src/configs/theme';

const data = [
  {
    timestamp: new Date().getTime(),
    value: 4000,
  },
  {
    timestamp: new Date().getTime(),
    value: 1398,
  },
  {
    timestamp: new Date().getTime(),
    value: 9800,
  },
  {
    timestamp: new Date().getTime(),
    value: 3908,
  },
  {
    timestamp: new Date().getTime(),
    value: 4800,
  },
  {
    timestamp: new Date().getTime(),
    value: 3800,
  },
  {
    timestamp: new Date().getTime(),
    value: 4300,
  },
];

export default function BalanceOverall() {
  return (
    <Card>
      <CardBody css={{ paddingBottom: 8 }}>
        <CardTitleText css={{ marginBottom: 8 }}>Balance</CardTitleText>
        <Text css={{ fontSize: 28, fontWeight: 600, lineHeight: 34 / 28 }}>
          123,345,000 <Text as="span">VND</Text>
        </Text>
      </CardBody>
      <ResponsiveContainer width={'100%'} height={100}>
        <LineChart width={300} height={100} data={data} margin={{ top: 5, bottom: 5, left: 20, right: 20 }}>
          <Line type="monotone" dataKey="value" stroke={colors.primary} strokeWidth={1} dot={false} />
          <Tooltip
            labelStyle={{
              fontSize: 12,
            }}
            contentStyle={{
              fontSize: 14,
            }}
            formatter={(value: any) => [`${value} VND`, 'Balance']}
            labelFormatter={(idx, payload) => {
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
