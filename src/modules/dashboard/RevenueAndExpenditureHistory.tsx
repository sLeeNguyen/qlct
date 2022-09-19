import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardBody, CardTitleText } from 'src/components/card';
import { colors } from 'src/configs/theme';

const data = [
  {
    timestamp: new Date().getTime(),
    revenue: 4000,
    expenditure: 1000,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 1398,
    expenditure: 1500,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 9800,
    expenditure: 6000,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 3908,
    expenditure: 3503,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 4800,
    expenditure: 3123,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 3800,
    expenditure: 5043,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 4300,
    expenditure: 2400,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 4000,
    expenditure: 1000,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 1398,
    expenditure: 1500,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 9800,
    expenditure: 6000,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 3908,
    expenditure: 3503,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 4800,
    expenditure: 3123,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 3800,
    expenditure: 5043,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 4300,
    expenditure: 2400,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 4000,
    expenditure: 1000,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 1398,
    expenditure: 1500,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 9800,
    expenditure: 6000,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 3908,
    expenditure: 3503,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 4800,
    expenditure: 3123,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 3800,
    expenditure: 5043,
  },
  {
    timestamp: new Date().getTime(),
    revenue: 4300,
    expenditure: 2400,
  },
];

export default function RevenueAndExpenditureHistory() {
  return (
    <Card>
      <CardBody>
        <CardTitleText>Revenue and Expenditure history</CardTitleText>
        <ResponsiveContainer width={'100%'} height={250}>
          <AreaChart width={300} height={100} data={data} margin={{ top: 32, bottom: 0, left: 0, right: 5 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenditure" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={'#8884d8'} stopOpacity={0.8} />
                <stop offset="95%" stopColor={'#8884d8'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="5 5" />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={colors.primary}
              strokeWidth={1}
              dot={false}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="expenditure"
              stroke={'#8884d8'}
              strokeWidth={1}
              dot={false}
              fillOpacity={1}
              fill="url(#colorExpenditure)"
            />
            <XAxis
              dataKey="timestamp"
              style={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis style={{ fontSize: 12 }} />
            <Tooltip
              labelStyle={{
                fontSize: 12,
              }}
              contentStyle={{
                fontSize: 14,
              }}
              formatter={(value: number) => [`${value} VND`, 'Balance']}
              labelFormatter={(idx, payload) => {
                if (payload[0]?.payload) {
                  return new Date(payload[0].payload.timestamp).toLocaleDateString();
                }
                return undefined;
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
