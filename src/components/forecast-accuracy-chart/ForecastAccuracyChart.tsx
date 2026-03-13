import { colors } from '@/constants/theme';
import { Box } from '@chakra-ui/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface ForecastAccuracyData {
  classification: string;
  Jan: number;
  Feb: number;
  Mar: number;
}

export interface ForecastAccuracyChartProps {
  data: ForecastAccuracyData[];
  height?: number;
}

const MONTH_COLORS: Record<string, string> = {
  Jan: '#bfdbfe',
  Feb: '#38bdf8',
  Mar: '#0369a1',
};

export function ForecastAccuracyChart({ data, height = 240 }: ForecastAccuracyChartProps) {
  return (
    <Box w="100%" h={height}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 4, right: 56, left: 12, bottom: 4 }}
          barGap={2}
          barCategoryGap={16}
        >
          <CartesianGrid
            horizontal={false}
            vertical={true}
            stroke={colors.gridStroke}
            strokeDasharray="4 4"
          />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <YAxis
            dataKey="classification"
            type="category"
            tickLine={false}
            axisLine={false}
            width={14}
            tick={{ fontSize: 13, fontWeight: 700, fill: '#1e293b' }}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`]}
            contentStyle={{
              background: '#fff',
              borderRadius: 6,
              border: '1px solid #e5e7eb',
              fontSize: 12,
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingBottom: 4 }}
          />
          {(['Jan', 'Feb', 'Mar'] as const).map((month) => (
            <Bar
              key={month}
              dataKey={month}
              name={month}
              fill={MONTH_COLORS[month]}
              radius={[0, 3, 3, 0]}
              barSize={14}
            >
              <LabelList
                dataKey={month}
                position="right"
                formatter={(v: number) => `${v}%`}
                style={{ fontSize: 11, fontWeight: 600, fill: '#334155' }}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
