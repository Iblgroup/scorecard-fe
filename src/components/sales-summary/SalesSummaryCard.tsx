import { Box, Flex, Text } from '@chakra-ui/react';
import { clsColors } from '@/constants/theme';

interface SalesRow {
  label: string;
  sales: string;
  pct: string;
  up: boolean | null;
}

interface SalesSummaryCardProps {
  rows: SalesRow[];
  total?: { sales: string; pct: string };
}

function pctColor(up: boolean | null) {
  if (up === true) return '#059669';
  if (up === false) return '#dc2626';
  return '#64748b';
}

function labelColor(label: string) {
  if (label.startsWith('A')) return clsColors.A;
  if (label.startsWith('B')) return clsColors.B;
  if (label.startsWith('C')) return clsColors.C;
  return '#64748b';
}

function Pill({
  label,
  color,
  bg,
  border,
}: {
  label: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <Box
      px={3}
      py="3px"
      borderRadius="4px"
      bg={bg}
      border="1px solid"
      borderColor={border}
      flexShrink={0}
    >
      <Text fontSize="12px" fontWeight="700" color={color} whiteSpace="nowrap">
        {label}
      </Text>
    </Box>
  );
}

export function SalesSummaryCard({ rows, total }: SalesSummaryCardProps) {
  return (
    <Box bg="white" borderRadius="xl" p={4} boxShadow="md" h="full">
      <Text
        fontSize="13px"
        fontWeight="800"
        color="gray.700"
        textTransform="uppercase"
        letterSpacing="wide"
        mb={3}
      >
        Sales Summary
      </Text>

      {/* Header */}
      <Flex
        align="center"
        pb={2}
        borderBottom="2px solid"
        borderColor="gray.100"
        gap={3}
      >
        <Text
          flex={1}
          fontSize="12px"
          fontWeight="700"
          color="gray.400"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          Classification
        </Text>
        <Text
          w="90px"
          fontSize="12px"
          fontWeight="700"
          color="gray.400"
          textTransform="uppercase"
          letterSpacing="wide"
          textAlign="center"
        >
          Sales
        </Text>
        <Text
          w="70px"
          fontSize="12px"
          fontWeight="700"
          color="gray.400"
          textTransform="uppercase"
          letterSpacing="wide"
          textAlign="center"
        >
          %
        </Text>
      </Flex>

      {/* Rows */}
      {rows.map((row, idx) => {
        const lc = labelColor(row.label);
        const pc = pctColor(row.up);
        const isLast = idx === rows.length - 1;
        return (
          <Flex
            key={row.label}
            align="center"
            py={2}
            borderBottom={isLast ? 'none' : '1px solid'}
            borderColor="gray.100"
            gap={3}
          >
            <Text flex={1} fontSize="13px" fontWeight="500" color={lc}>
              {row.label}
            </Text>
            <Box w="90px" display="flex" justifyContent="center">
              <Pill
                label={row.sales}
                color="#374151"
                bg="#f9fafb"
                border="#e5e7eb"
              />
            </Box>
            <Box w="70px" display="flex" justifyContent="center">
              <Pill
                label={row.pct}
                color={pc}
                bg={`${pc}12`}
                border={`${pc}35`}
              />
            </Box>
          </Flex>
        );
      })}

      {/* Total */}
      {total && (
        <Flex
          align="center"
          py={2}
          pb={0}
          mt={1}
          borderTop="2px solid"
          borderColor="gray.200"
          gap={3}
        >
          <Text flex={1} fontSize="13px" fontWeight="700" color="#1e293b">
            Σ Total
          </Text>
          <Box w="90px" display="flex" justifyContent="center">
            <Pill
              label={total.sales}
              color="#1e293b"
              bg="#f1f5f9"
              border="#cbd5e1"
            />
          </Box>
          <Box w="70px" display="flex" justifyContent="center">
            <Pill
              label={total.pct}
              color="#059669"
              bg="#05996912"
              border="#05996935"
            />
          </Box>
        </Flex>
      )}
    </Box>
  );
}
