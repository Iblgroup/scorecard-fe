import { Box, Text, VStack } from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export interface GaugeChartProps {
  value: number;       // achieved %
  target: number;      // target %
  title: string;
  subtitle?: string;
  color?: string;
}

export function GaugeChart({
  value,
  target,
  title,
  subtitle,
  color = '#2563eb',
}: GaugeChartProps) {
  const diff = value - target;
  const isAbove = diff >= 0;
  const statusColor = isAbove ? '#059669' : '#dc2626';
  const statusSymbol = isAbove ? '▲' : '▼';

  const data = [
    { value },
    { value: 100 - value },
  ];

  return (
    <VStack gap={0} align="center" justify="center" h="100%" w="100%">
      <Text
        fontSize="13px"
        fontWeight="700"
        color="gray.700"
        textTransform="uppercase"
        letterSpacing="wide"
        textAlign="center"
        lineHeight="1.3"
      >
        {title}
      </Text>
      {subtitle && (
        <Text fontSize="11px" color="gray.400" textAlign="center" mb={1}>
          {subtitle}
        </Text>
      )}

      <Box position="relative" w="140px" h="140px">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius="68%"
              outerRadius="88%"
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill={color} />
              <Cell fill="#e2e8f0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <Box
          position="absolute"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="22px" fontWeight="800" color={color} lineHeight={1}>
            {value}%
          </Text>
        </Box>
      </Box>

      <Text fontSize="11px" color="gray.500" mt={1}>
        Target {target}% · Achieved {value}%
      </Text>
      <Text fontSize="12px" fontWeight="700" color={statusColor} mt={0.5}>
        {statusSymbol} {Math.abs(diff)}% {isAbove ? 'above' : 'below'} target
      </Text>
    </VStack>
  );
}
