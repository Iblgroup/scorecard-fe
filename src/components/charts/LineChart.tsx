import { useRef, useEffect, useState } from 'react';
import { Box, Flex, HStack } from '@chakra-ui/react';
import {
  LineChart as RechartsLineChart,
  AreaChart as RechartsAreaChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { colors } from '@/constants/theme';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LineConfig {
  key: string;
  label?: string;
  color: string;
  dashed?: boolean;
  gradient?: boolean;
}

export interface LineChartProps {
  data: Record<string, unknown>[];
  lines: LineConfig[];
  xKey: string;
  height?: number | string;
  labelFormatter?: (value: number) => string;
  variant?: 'line' | 'filled';
}

// ─── Formatters ──────────────────────────────────────────────────────────────

function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return Math.round(value).toLocaleString('en-US');
}

// ─── Custom Ticks ────────────────────────────────────────────────────────────

function renderXTick(tickWidth: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (props: any) => {
    const { x, y, payload } = props;
    const val = payload?.value;
    if (val === undefined || val === null) return null;
    const charsPerLine = Math.max(1, Math.floor(tickWidth / 7));
    const full = String(val);
    let line1 = full.slice(0, charsPerLine);
    const rest = full.slice(charsPerLine);
    let line2 = rest
      ? rest.length > charsPerLine
        ? rest.slice(0, charsPerLine - 1) + '…'
        : rest
      : '';
    // if line1 itself is longer than charsPerLine (no room for 2 chars), truncate with ellipsis
    if (full.length > charsPerLine * 2) {
      line1 = full.slice(0, charsPerLine);
      line2 = full.slice(charsPerLine, charsPerLine * 2 - 1) + '…';
    }
    const textLines = line2 ? [line1, line2] : [line1];
    return (
      <g transform={`translate(${x},${y + 16})`}>
        {textLines.map((t, i) => (
          <text
            key={i}
            x={0}
            y={i * 13}
            textAnchor="middle"
            fill="#000"
            style={{ fontSize: '11px', fontWeight: 600 }}
          >
            {t}
          </text>
        ))}
      </g>
    );
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderYTick(
  props: any,
  formatter: (v: number) => string = formatCompact
) {
  const { x, y, payload } = props;
  const val = payload?.value;
  if (val === undefined || val === null) return null;
  return (
    <text
      x={x}
      y={y}
      dy={4}
      textAnchor="end"
      fill="#0E1C29B2"
      style={{ fontSize: '12px', fontWeight: 500 }}
    >
      {formatter(Number(val))}
    </text>
  );
}

export function LineChart({
  data,
  lines,
  xKey,
  height = 250,
  labelFormatter = formatCompact,
  variant = 'line',
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const showLegend = lines.length > 1;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setChartWidth(el.offsetWidth);
    const ro = new ResizeObserver(() => setChartWidth(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const tickWidth =
    chartWidth && data.length ? chartWidth / data.length - 10 : 50;

  const sharedChildren = (
    <>
      <defs>
        {lines.map((line) => (
          <linearGradient
            key={line.key}
            id={`fill-${line.key}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={line.color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={line.color} stopOpacity={0.03} />
          </linearGradient>
        ))}
      </defs>
      <CartesianGrid
        stroke={colors.gridStroke}
        strokeDasharray="4 4"
        vertical={false}
        horizontal={true}
      />
      <XAxis
        dataKey={xKey}
        tickLine={false}
        axisLine={false}
        tick={renderXTick(tickWidth)}
        interval={0}
        height={48}
      />
      <YAxis
        tick={(props) => renderYTick(props, labelFormatter)}
        tickLine={false}
        axisLine={false}
        width={40}
      />
      <Tooltip
        contentStyle={{
          background: '#ffffff',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          padding: '8px 12px',
          fontSize: 13,
        }}
        formatter={(value) => formatCompact(Number(value))}
        labelStyle={{ fontSize: 13, fontWeight: 500 }}
      />
    </>
  );

  return (
    <Flex w="100%" h={height} direction="column" position="relative">
      {showLegend && (
        <HStack
          justify="flex-end"
          gap={3}
          flexShrink={0}
          pos="relative"
          zIndex={1}
          top="-32px"
          right={0}
        >
          {lines.map((line) => (
            <HStack key={line.key} gap={1} fontSize="13px" fontWeight={500}>
              <Box
                w={2}
                h={2}
                borderRadius="sm"
                bg={line.color}
                flexShrink={0}
              />
              {line.label}
            </HStack>
          ))}
        </HStack>
      )}
      <Box ref={containerRef} flex={1}>
        <ResponsiveContainer width="100%" height="100%">
          {variant === 'filled' ? (
            <RechartsAreaChart
              data={data}
              margin={{ top: 24, right: 20, left: 0, bottom: 20 }}
            >
              {sharedChildren}
              {lines.map((line, lineIdx) => {
                const yOffset = lineIdx === 0 ? -8 : lineIdx === 1 ? 14 : 24;
                return (
                  <Area
                    key={line.key}
                    type="monotone"
                    dataKey={line.key}
                    name={line.label}
                    stroke={line.color}
                    strokeWidth={2}
                    strokeDasharray={line.dashed ? '5 5' : undefined}
                    fill={`url(#fill-${line.key})`}
                    dot={{ r: 3, fill: line.color, strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  >
                    <LabelList
                      dataKey={line.key}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      content={(props: any) => {
                        const { x, y, value } = props;
                        if (value === undefined || value === null) return null;
                        return (
                          <text
                            x={x}
                            y={y + yOffset}
                            textAnchor="middle"
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              fill: line.color,
                            }}
                          >
                            {labelFormatter(Number(value))}
                          </text>
                        );
                      }}
                    />
                  </Area>
                );
              })}
            </RechartsAreaChart>
          ) : (
            <RechartsLineChart
              data={data}
              margin={{ top: 24, right: 20, left: 0, bottom: 0 }}
            >
              {sharedChildren}
              {lines.map((line) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  name={line.label}
                  stroke={line.color}
                  strokeWidth={2}
                  strokeDasharray={line.dashed ? '5 5' : undefined}
                  fill={line.gradient ? `url(#fill-${line.key})` : undefined}
                  dot={{ r: 3, fill: line.color, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                >
                  <LabelList
                    dataKey={line.key}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content={(props: any) => {
                      const { x, y, value, index } = props;
                      if (value === undefined || value === null) return null;
                      const isTop = index % 2 === 0;
                      return (
                        <text
                          x={x}
                          y={isTop ? y - 6 : y + 16}
                          textAnchor="middle"
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            fill: '#000',
                          }}
                        >
                          {labelFormatter(Number(value))}
                        </text>
                      );
                    }}
                  />
                </Line>
              ))}
            </RechartsLineChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Flex>
  );
}
