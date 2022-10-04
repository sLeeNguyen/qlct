import chroma from 'chroma-js';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardBody, CardTitleText } from 'src/components/card';
import { GridContainer, GridItem } from 'src/components/grid';
import { TextSmall } from 'src/components/Text';
import { colors } from 'src/configs/theme';
import { useDashboardStore } from 'src/store/dashboard';
import { compactNumber, formatNumber } from 'src/utils';

type DataItem = {
  timestamp: number;
  income: number;
  outcome: number;
};

type DataItem2 = {
  timestamp: number;
  value: number;
};

export default function RevenueAndExpenditureHistory() {
  const [incomeHistory, outcomeHistory] = useDashboardStore((state) => [
    state.incomeHistory,
    state.outcomeHistory,
    state.historiesFS,
  ]);

  const dataOut = useMemo<DataItem2[]>(() => {
    if (!outcomeHistory) return [] as DataItem2[];
    return Object.entries(outcomeHistory).map(([t, v]) => ({ timestamp: Number(t), value: v }));
  }, [outcomeHistory]);

  const dataIn = useMemo<DataItem2[]>(() => {
    if (!incomeHistory) return [] as DataItem2[];
    return Object.entries(incomeHistory).map(([t, v]) => ({ timestamp: Number(t), value: v }));
  }, [incomeHistory]);

  const data = useMemo<DataItem[]>(() => {
    if (!incomeHistory || !outcomeHistory) return [] as DataItem[];
    return Object.keys(incomeHistory).map((t) => ({
      timestamp: Number(t),
      income: incomeHistory[Number(t)] ?? 0,
      outcome: outcomeHistory[Number(t)] ?? 0,
    }));
  }, [incomeHistory, outcomeHistory]);

  return (
    <Card>
      <CardBody>
        <CardTitleText>Income and Outcome history</CardTitleText>
        <GridContainer spacing={4}>
          <GridItem xs={12} md={6}>
            <ResponsiveContainer width={'100%'} height={250}>
              <BarChart data={dataIn} margin={{ top: 32, bottom: 0, left: 0, right: 5 }}>
                <CartesianGrid vertical={false} strokeDasharray="5 5" />
                <XAxis
                  dataKey="timestamp"
                  style={{ fontSize: 14 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis
                  style={{
                    fontSize: 12,
                  }}
                  tickFormatter={(value) => {
                    return compactNumber(value);
                  }}
                >
                  <Label position="insideLeft" angle={-90} fontSize={12} value={'VND'} />
                </YAxis>
                <Tooltip
                  cursor={{ fill: chroma('#000').alpha(0.1).hex() }}
                  labelStyle={{
                    fontSize: 12,
                    fontWeight: 400,
                  }}
                  contentStyle={{
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                  formatter={(value: number) => [`${formatNumber(value)} `, 'Value']}
                  labelFormatter={(idx, payload) => {
                    if (payload[0]?.payload) {
                      return new Date(payload[0].payload.timestamp).toLocaleDateString();
                    }
                    return undefined;
                  }}
                />
                <Bar dataKey="value" fill={colors.primary} unit={'VND'} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
            <TextSmall css={{ textAlign: 'center', marginLeft: 32 }}>Income history</TextSmall>
          </GridItem>
          <GridItem xs={12} md={6}>
            <ResponsiveContainer width={'100%'} height={250}>
              <BarChart data={dataOut} margin={{ top: 28, bottom: 0, left: 0, right: 5 }}>
                <CartesianGrid vertical={false} strokeDasharray="5 5" />
                <XAxis
                  dataKey="timestamp"
                  style={{ fontSize: 14 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis
                  style={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    return compactNumber(value);
                  }}
                >
                  <Label position="insideLeft" angle={-90} fontSize={12} value={'VND'} />
                </YAxis>
                <Tooltip
                  cursor={{ fill: chroma('#000').alpha(0.1).hex() }}
                  labelStyle={{
                    fontSize: 12,
                    fontWeight: 400,
                  }}
                  contentStyle={{
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                  formatter={(value: number) => [`${formatNumber(value)} `, 'Value']}
                  labelFormatter={(_, payload) => {
                    if (payload[0]?.payload) {
                      return new Date(payload[0].payload.timestamp).toLocaleDateString();
                    }
                    return undefined;
                  }}
                />
                <Bar dataKey="value" fill={colors.error} unit={'VND'} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
            <TextSmall css={{ textAlign: 'center', marginLeft: 32 }}>Outcome history</TextSmall>
          </GridItem>
        </GridContainer>
      </CardBody>
      <CardBody>
        <ResponsiveContainer width={'100%'} height={250}>
          <AreaChart data={data} margin={{ top: 32, bottom: 0, left: 0, right: 5 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOutcome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.error} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors.error} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="5 5" />

            <XAxis
              dataKey="timestamp"
              style={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis
              style={{ fontSize: 12 }}
              yAxisId="left"
              orientation="left"
              tickFormatter={(value) => {
                return compactNumber(value);
              }}
            >
              <Label position="insideLeft" angle={-90} fontSize={12} value={'VND'} />
            </YAxis>
            <YAxis
              style={{ fontSize: 12 }}
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => {
                return compactNumber(value);
              }}
            >
              <Label position="insideRight" angle={90} fontSize={12} value={'VND'} />
            </YAxis>
            <Tooltip
              labelStyle={{
                fontSize: 12,
                fontWeight: 400,
              }}
              contentStyle={{
                fontSize: 14,
                fontWeight: 500,
              }}
              formatter={(value: number) => {
                return `${formatNumber(value)} `;
              }}
              labelFormatter={(_, payload) => {
                if (payload[0]?.payload) {
                  return new Date(payload[0].payload.timestamp).toLocaleDateString();
                }
                return undefined;
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke={colors.primary}
              strokeWidth={1}
              dot={false}
              fillOpacity={1}
              fill="url(#colorIncome)"
              yAxisId="left"
              unit={'VND'}
            />
            <Area
              type="monotone"
              dataKey="outcome"
              stroke={colors.error}
              strokeWidth={1}
              dot={false}
              fillOpacity={1}
              fill="url(#colorOutcome)"
              yAxisId="right"
              unit={'VND'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
