import { colors } from '@/constants/theme';
import { Box } from '@chakra-ui/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface ServiceMeasureData {
  branch: string;
  skuA: number;
  skuB: number;
  skuC: number;
}

export interface ServiceMeasureChartProps {
  data: ServiceMeasureData[];
  height?: number;
  variant?: 'line' | 'stacked-bar';
}

const SERIES = [
  { key: 'skuA', label: 'SKU-A%', color: '#06b6d4' },
  { key: 'skuB', label: 'SKU-B%', color: '#f59e0b' },
  { key: 'skuC', label: 'SKU-C%', color: '#10b981' },
] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeBubbleDot(color: string): (props: any) => JSX.Element {
  return (props) => {
    const { cx, cy, value } = props;
    if (!cx || !cy) return <g />;
    return (
      <g key={`${cx}-${cy}`}>
        <ellipse
          cx={cx}
          cy={cy}
          rx={22}
          ry={18}
          fill={`${color}18`}
          stroke={color}
          strokeWidth={1.5}
        />
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          style={{ fontSize: 10, fontWeight: 700 }}
        >
          {value}%
        </text>
      </g>
    );
  };
}

const commonAxisProps = {
  tickLine: false,
  axisLine: false,
};

export function ServiceMeasureChart({
  data,
  height = 300,
  variant = 'line',
}: ServiceMeasureChartProps) {
  const minWidth = Math.max(640, data.length * 88);

  if (variant === 'stacked-bar') {
    return (
      <Box w="100%" h={height} overflowX="auto">
        <Box style={{ minWidth }} h={height}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 16, right: 24, left: 0, bottom: 44 }}
              barCategoryGap="30%"
            >
              <CartesianGrid
                stroke={colors.gridStroke}
                strokeDasharray="4 4"
                vertical={false}
              />
              <XAxis
                dataKey="branch"
                {...commonAxisProps}
                tick={{ fontSize: 11, fontWeight: 600, fill: '#334155' }}
                interval={0}
                angle={-28}
                textAnchor="end"
                height={56}
              />
              <YAxis
                {...commonAxisProps}
                tickFormatter={(v: number) => `${v}%`}
                tick={{ fontSize: 11, fill: '#64748b' }}
                width={36}
              />
              <Tooltip
                formatter={(v: number, name: string) => [`${v}%`, name]}
                cursor={{ fill: '#f1f5f9' }}
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
                wrapperStyle={{ fontSize: 12 }}
              />
              {SERIES.map(({ key, label, color }) => (
                <Bar key={key} dataKey={key} name={label} stackId="a" fill={color} radius={0}>
                  {data.map((_, idx) => (
                    <Cell key={idx} fill={color} />
                  ))}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    );
  }

  return (
    <Box w="100%" h={height} overflowX="auto">
      <Box style={{ minWidth }} h={height}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 28, right: 24, left: 0, bottom: 44 }}
          >
            <CartesianGrid
              stroke={colors.gridStroke}
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis
              dataKey="branch"
              {...commonAxisProps}
              tick={{ fontSize: 11, fontWeight: 600, fill: '#334155' }}
              interval={0}
              angle={-28}
              textAnchor="end"
              height={56}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v: number) => `${v}%`}
              {...commonAxisProps}
              tick={{ fontSize: 11, fill: '#64748b' }}
              width={36}
            />
            <Tooltip
              formatter={(v: number, name: string) => [`${v}%`, name]}
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
              wrapperStyle={{ fontSize: 12 }}
            />
            {SERIES.map(({ key, label, color }) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={label}
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray="6 3"
                dot={makeBubbleDot(color)}
                activeDot={{ r: 5, fill: color }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
