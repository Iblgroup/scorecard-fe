import { useState } from 'react';
import { useGetSalesSummary } from '@/api/salesSummary';
import { useGetCoverDays } from '@/api/coverDays';
import { useGetForecastAccuracyMonthly } from '@/api/forecastAccuracyMonthly';
import { useGetForecastAccuracyYearly } from '@/api/forecastAccuracyYearly';
import { useGetInventoryDays } from '@/api/inventoryDays';
import { useGetAboveBelowThreshold } from '@/api/aboveBelowThreshold';
import { useGetForecastAccuracyCategoryMonthly } from '@/api/forcastAccuracyCategoryMonthly';
import { useGetForecastAccuracyCategoryYearly } from '@/api/forcastAccuracyCategoryYearly';
import { useGetIblVsTscl } from '@/api/iblVsTscl';
import { useGetDispatchVsOrder } from '@/api/dispatchVsOrder';
import { useAppSelector } from '@/app/hooks';
import { ChartCard } from '@/components/chart-card';
import { BarChart, GaugeChart, LineChart } from '@/components/charts';
import { DataTable, DataTableRow } from '@/components/data-table';
import { FilterBar } from '@/components/filter-bar';
import { HeaderActions } from '@/components/header-actions';
import { clsColors, colors, gradients } from '@/constants/theme';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { SalesSummaryCard } from '@/components/sales-summary/SalesSummaryCard';
import { useGetWip } from '@/api/wip';
import { useGetRpm } from '@/api/rpm';
import { useGetServiceMeasure } from '@/api/serviceMeasure';
import { useGetTgtVsActual } from '@/api/tgtVsActual';
import { useGetTotalSku } from '@/api/totalSku';

const INVENTORY_THRESHOLD_DAYS: Record<string, number> = {
  A: 30,
  B: 20,
  C: 15,
};

const DAYS_BENCHMARKS = [
  {
    cls: 'A',
    days: 35,
    bm: 92,
    rd: 99,
    color: clsColors.A,
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
  {
    cls: 'B',
    days: 25,
    bm: 80,
    rd: 95,
    color: clsColors.B,
    bg: '#f0fdf4',
    border: '#a7f3d0',
  },
  {
    cls: 'C',
    days: 20,
    bm: 70,
    rd: 90,
    color: clsColors.C,
    bg: '#fffbeb',
    border: '#fde68a',
  },
];

const INV_BENCHMARKS = [
  {
    cls: 'A',
    days: 30,
    bm: 92,
    rd: 99,
    color: clsColors.A,
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
  {
    cls: 'B',
    days: 20,
    bm: 80,
    rd: 95,
    color: clsColors.B,
    bg: '#f0fdf4',
    border: '#a7f3d0',
  },
  {
    cls: 'C',
    days: 15,
    bm: 70,
    rd: 90,
    color: clsColors.C,
    bg: '#fffbeb',
    border: '#fde68a',
  },
];

const COVER_DAYS = [
  {
    label: 'Total Days',
    value: 54,
    inv: '54,188',
    color: '#0891b2',
    bg: '#fff',
    border: 'transparent',
    dot: '=',
  },
  {
    label: 'A – Cover Days',
    value: 28,
    inv: '28,408',
    color: clsColors.A,
    bg: clsColors.Abg,
    border: clsColors.Aborder,
    dot: '●',
  },
  {
    label: 'B – Cover Days',
    value: 18,
    inv: '13,608',
    color: clsColors.B,
    bg: clsColors.Bbg,
    border: clsColors.Bborder,
    dot: '●',
  },
  {
    label: 'C – Cover Days',
    value: 8,
    inv: '7,188',
    color: clsColors.C,
    bg: clsColors.Cbg,
    border: clsColors.Cborder,
    dot: '●',
  },
  {
    label: 'Others – Cover Days',
    value: 0,
    inv: '0',
    color: '#64748b',
    bg: '#64748b15',
    border: '#64748b35',
    dot: '●',
  },
];

const CHART_COLORS = ['#646ECB', '#5AC8D8', '#16476A'] as const;

const INV_API_BRANCHES = [
  { key: 'bahawalpur', label: 'Bahawalpur' },
  { key: 'dss_korangi', label: 'DSS Korangi' },
  { key: 'faisalabad', label: 'Faisalabad' },
  { key: 'gujranwala', label: 'Gujranwala' },
  { key: 'hyderabad', label: 'Hyderabad' },
  { key: 'islamabad', label: 'Islamabad' },
  { key: 'karachi', label: 'Karachi' },
  { key: 'korangi', label: 'Korangi' },
  { key: 'lahore', label: 'Lahore' },
  { key: 'mingora', label: 'Mingora' },
  { key: 'multan', label: 'Multan' },
  { key: 'peshawar', label: 'Peshawar' },
  { key: 'quetta', label: 'Quetta' },
  { key: 'sukkur', label: 'Sukkur' },
] as const;

function BenchmarkBanner({
  cls,
  days,
  color,
  bg,
  border,
  sku,
}: Omit<(typeof INV_BENCHMARKS)[0], 'rd' | 'bm'> & {
  isLast?: boolean;
  sku?: string;
}) {
  return (
    <Box
      border="1.5px dashed"
      borderColor={border}
      borderRadius="md"
      overflow="hidden"
      opacity={0.9}
    >
      <Flex>
        <Flex flex={1} align="center" gap={3} bg={bg} px={3} py={2}>
          <Flex
            w={9}
            h={9}
            borderRadius="sm"
            bg={color}
            color="white"
            align="center"
            justify="center"
            fontWeight="900"
            fontSize="lg"
            flexShrink={0}
          >
            {cls}
          </Flex>
          <Flex align="center" gap={1}>
            <Text
              fontSize="1.4rem"
              fontWeight="900"
              color={color}
              lineHeight="1"
            >
              {days}
            </Text>
            <Text
              fontSize="11px"
              fontWeight="600"
              color={color}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Days
            </Text>
          </Flex>
        </Flex>
        {/* Divider + SKU cell — only when sku is provided */}
        {sku !== undefined && (
          <>
            <Box w="1.5px" bg={border} />
            <Flex flex={1} align="center" bg={bg} px={3} py={2} gap={0}>
              <Text
                fontSize="12px"
                fontWeight="700"
                color="gray.400"
                textTransform="uppercase"
                letterSpacing="wide"
                mt={0.5}
              >
                SKUs :
              </Text>
              <Text
                ml={2}
                fontSize="1.4rem"
                fontWeight="900"
                color={color}
                lineHeight="1"
              >
                {sku}
              </Text>
            </Flex>
          </>
        )}
      </Flex>
    </Box>
  );
}

function CoverDaysCard({
  label,
  value,
  inv,
  color,
  bg,
  border,
  dot,
  endDate,
}: (typeof COVER_DAYS)[0] & { endDate?: string }) {
  const isClassified = dot === '●';
  const letter = label.charAt(0);

  if (!isClassified) {
    return (
      <Flex
        align="center"
        gap={4}
        bg="white"
        borderRadius="lg"
        px={4}
        py={3}
        border="1px solid"
        borderColor="gray.100"
        boxShadow="sm"
        w="full"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          bottom={0}
          w="3px"
          bg={color}
          borderLeftRadius="lg"
        />
        <Text
          fontSize="2.8rem"
          fontWeight="900"
          color={color}
          lineHeight="1"
          pl={1}
        >
          {value}
        </Text>
        <Box>
          <Text fontSize="13px" fontWeight="700" color="gray.600">
            Total as of{' '}
            {endDate
              ? new Date(endDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })
              : 'selected'}
          </Text>
          <Text fontSize="12px" color="gray.400" mt={0.5}>
            Inventory:{' '}
            <Box as="span" fontWeight="600" color="gray.600">
              {`${inv} (ibl inventory)`}
            </Box>
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Box
      bg={bg}
      borderRadius="md"
      px={3}
      py={2}
      boxShadow="sm"
      border="1px solid"
      borderColor={border}
    >
      <Flex align="center" gap={3}>
        <Flex
          w={10}
          h={10}
          borderRadius="sm"
          bg={color}
          color="white"
          align="center"
          justify="center"
          fontWeight="900"
          fontSize="xl"
          flexShrink={0}
        >
          {letter}
        </Flex>
        <Box>
          {!label.startsWith('Others') && (
            <Flex align="center" gap={2}>
              <Text
                fontSize="1.6rem"
                fontWeight="900"
                color={color}
                lineHeight="1"
              >
                {value}
              </Text>
              <Text
                fontSize="12px"
                fontWeight="600"
                color={color}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Days
              </Text>
            </Flex>
          )}
          <Text fontSize="12px" color="gray.500" mt={0.5}>
            Inventory:{' '}
            <Box as="span" fontWeight="600" color="gray.600">
              {inv}
            </Box>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

const LABEL_MAP: Record<string, string> = {
  A: 'A',
  B: 'B',
  C: 'C',
  Other: 'Other',
};

interface ForecastCategoryRow {
  classification?: string | null;
  category?: string | null;
  month: string;
  forecast_accuracy_pct: number;
}

interface SupplyChainTabProps {
  salesRows: {
    label: string;
    sku: string;
    sales: string;
    pct: string;
    up: boolean | null;
  }[];
  salesTotal: { sales: string; pct: string };
  coverDaysRows: typeof COVER_DAYS;
  tsclAccuracy: number | null;
  tsclSalesDisplay?: { achieved: string; target: string };
  forecastBarData: Record<string, string | number>[];
  forecastMonths: string[];
  iblAccuracy: number | null;
  iblSalesDisplay?: { achieved: string; target: string };
  iblBarData: Record<string, string | number>[];
  iblMonths: string[];
  isLoadingSales: boolean;
  isLoadingCoverDays: boolean;
  isLoadingForecastTscl: boolean;
  isLoadingForecastIbl: boolean;
  pctSkusData: { class: string; pct: number }[];
  isLoadingPctSkus: boolean;
  skuCounts: Record<string, number>;
  endDate?: string;
}

function SupplyChainTab({
  salesRows,
  salesTotal,
  tsclAccuracy,
  tsclSalesDisplay,
  forecastBarData,
  forecastMonths,
  iblAccuracy,
  iblSalesDisplay,
  iblBarData,
  iblMonths,
  coverDaysRows,
  isLoadingSales,
  isLoadingCoverDays,
  isLoadingForecastTscl,
  isLoadingForecastIbl,
  pctSkusData,
  isLoadingPctSkus,
  skuCounts,
  endDate,
}: SupplyChainTabProps) {
  return (
    <Flex direction="column" gap={4}>
      {/* Benchmarks + Sales Summary */}
      <Grid templateColumns="repeat(12, 1fr)" gap={4} alignItems="stretch">
        {/* Sales Summary — 6 cols */}
        <GridItem colSpan={{ base: 12, lg: 3 }}>
          <Box bg="gray.200" borderRadius="xl" p={4} boxShadow="md" h="full">
            <HStack mb={4} gap={2} justify="space-between">
              <HStack gap={2}>
                <Box w={1} h={5} bg="gray.700" borderRadius="full" />
                <Text
                  fontSize="13px"
                  fontWeight="800"
                  color="gray.700"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Benchmark
                </Text>
              </HStack>
              <Box px={2} py="2px" borderRadius="md" bg="gray.700">
                <Text
                  fontSize="12px"
                  fontWeight="800"
                  color="white"
                  textTransform="uppercase"
                  letterSpacing="widest"
                >
                  LEGEND
                </Text>
              </Box>
            </HStack>
            <Box>
              {/* Header row */}
              <Flex mb={1} px={1}>
                <Box w={10} flexShrink={0} />
                <Flex flex={1} justify="center">
                  <Text
                    fontSize="14px"
                    fontWeight="700"
                    color="gray.400"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Cover Days
                  </Text>
                </Flex>
                <Flex flex={1} justify="center">
                  <Text
                    fontSize="14px"
                    fontWeight="700"
                    color="gray.400"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    No of SKUs
                  </Text>
                </Flex>
              </Flex>
              {/* Data rows */}
              <Flex direction="column" gap={2}>
                {DAYS_BENCHMARKS.map((b) => {
                  const dayVal = b.days;
                  const skuVal =
                    skuCounts[b.cls] !== undefined
                      ? skuCounts[b.cls]
                      : undefined;
                  return (
                    <Box
                      key={b.cls}
                      border="1.5px dashed"
                      borderColor={b.border}
                      borderRadius="md"
                      overflow="hidden"
                    >
                      <Flex align="stretch">
                        <Flex
                          w={10}
                          flexShrink={0}
                          bg={b.color}
                          color="white"
                          align="center"
                          justify="center"
                          fontWeight="900"
                          fontSize="lg"
                        >
                          {b.cls}
                        </Flex>
                        <Flex
                          flex={1}
                          align="center"
                          justify="center"
                          bg={b.bg}
                          py={4}
                          borderLeft="1.5px dashed"
                          borderColor={b.border}
                        >
                          <Text
                            fontSize="1.4rem"
                            fontWeight="900"
                            color={b.color}
                            lineHeight="1"
                          >
                            {dayVal}
                          </Text>
                        </Flex>
                        {/* SKUs cell */}
                        <Flex
                          flex={1}
                          align="center"
                          justify="center"
                          bg={b.bg}
                          py={2}
                          borderLeft="1.5px dashed"
                          borderColor={b.border}
                        >
                          <Text
                            fontSize="1.4rem"
                            fontWeight="900"
                            color={b.color}
                            lineHeight="1"
                          >
                            {skuVal ?? '—'}
                          </Text>
                        </Flex>
                      </Flex>
                    </Box>
                  );
                })}
              </Flex>
            </Box>
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 5 }}>
          <SalesSummaryCard
            rows={salesRows}
            total={salesTotal}
            isLoading={isLoadingSales}
          />
        </GridItem>
        {/* Cover Days — 3 cols */}
        <GridItem colSpan={{ base: 12, lg: 4 }}>
          <Box bg="white" borderRadius="xl" p={4} boxShadow="md" h="full">
            <Text
              fontSize="13px"
              fontWeight="800"
              color="gray.700"
              textTransform="uppercase"
              letterSpacing="wide"
              mb={3}
            >
              Cover Days
            </Text>
            {isLoadingCoverDays ? (
              <Flex direction="column" gap={2}>
                <Skeleton height="60px" borderRadius="lg" />
                <Grid templateColumns="1fr 1fr" gap={2}>
                  <Skeleton height="72px" borderRadius="md" />
                  <Skeleton height="72px" borderRadius="md" />
                  <Skeleton height="72px" borderRadius="md" />
                  <Skeleton height="72px" borderRadius="md" />
                </Grid>
              </Flex>
            ) : (
              <Flex direction="column" gap={2}>
                <CoverDaysCard {...coverDaysRows[0]} endDate={endDate} />
                <Grid templateColumns="1fr 1fr" gap={2}>
                  {coverDaysRows.slice(1).map((c) => (
                    <CoverDaysCard key={c.label} {...c} endDate={endDate} />
                  ))}
                </Grid>
              </Flex>
            )}
          </Box>
        </GridItem>
      </Grid>

      {/* Forecast Accuracy Charts */}
      <Grid templateColumns="repeat(15, 1fr)" gap={4}>
        <ChartCard
          colSpan={6}
          title="Budget Accuracy TSCL"
          height="280px"
          isLoading={isLoadingForecastIbl}
          variant="gauge-bar"
        >
          <Flex h="100%" gap={0}>
            <Box
              w="175px"
              flexShrink={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <GaugeChart
                value={iblAccuracy ?? 0}
                target={100}
                title=""
                subtitle=""
                color={'#726A95'}
                displayAchieved={iblSalesDisplay?.achieved}
                displayTarget={iblSalesDisplay?.target}
                targetLabel="Budget"
                isLoading={isLoadingForecastIbl}
              />
            </Box>
            <Box w="1px" bg="gray.100" mx={3} flexShrink={0} />
            <Box flex={1} minW={0}>
              <BarChart
                data={forecastBarData}
                xKey="classification"
                barSize={35}
                bars={
                  forecastMonths.length
                    ? forecastMonths.map((m, i) => ({
                        key: m,
                        label: m,
                        color: CHART_COLORS[i] ?? CHART_COLORS[0],
                      }))
                    : [
                        {
                          key: 'accuracy',
                          label: 'Forecast Accuracy',
                          color: CHART_COLORS[0],
                        },
                      ]
                }
                height={260}
                yTickFormatter={(v) => `${Math.round(Number(v))}%`}
                labelFormatter={(v) => `${Math.round(Number(v))}%`}
                showLabels
                xTickMargin={4}
                xLabelColors={{
                  A: clsColors.A,
                  B: clsColors.B,
                  C: clsColors.C,
                }}
              />
            </Box>
          </Flex>
        </ChartCard>

        <ChartCard
          colSpan={6}
          title="Forecast Accuracy IBL"
          height="280px"
          isLoading={isLoadingForecastTscl}
          variant="gauge-bar"
        >
          <Flex h="100%" gap={0}>
            <Box
              w="175px"
              flexShrink={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <GaugeChart
                value={tsclAccuracy ?? 0}
                target={100}
                title=""
                subtitle=""
                color={'#726A95'}
                displayAchieved={tsclSalesDisplay?.achieved}
                displayTarget={tsclSalesDisplay?.target}
                isLoading={isLoadingForecastTscl}
              />
            </Box>
            <Box w="1px" bg="gray.100" mx={3} flexShrink={0} />
            <Box flex={1} minW={0}>
              <BarChart
                data={iblBarData}
                xKey="classification"
                barSize={35}
                bars={
                  iblMonths.length
                    ? iblMonths.map((m, i) => ({
                        key: m,
                        label: m,
                        color: CHART_COLORS[i] ?? CHART_COLORS[0],
                      }))
                    : [
                        {
                          key: 'accuracy',
                          label: 'Forecast Accuracy',
                          color: CHART_COLORS[0],
                        },
                      ]
                }
                height={260}
                yTickFormatter={(v) => `${Math.round(Number(v))}%`}
                labelFormatter={(v) => `${Math.round(Number(v))}%`}
                showLabels
                xTickMargin={4}
                xLabelColors={{
                  A: clsColors.A,
                  B: clsColors.B,
                  C: clsColors.C,
                }}
              />
            </Box>
          </Flex>
        </ChartCard>
        <ChartCard
          colSpan={3}
          title="Forecast Vs Budget %"
          height="280px"
          isLoading={isLoadingPctSkus}
        >
          <Box pt="20px">
            <BarChart
              data={pctSkusData}
              xKey="class"
              barSize={48}
              height={226}
              bars={[
                {
                  key: 'pct',
                  label: '% SKUs',
                  color: clsColors.A,
                  cellColor: (e) =>
                    String(e.class) === 'A'
                      ? clsColors.A
                      : String(e.class) === 'B'
                        ? clsColors.B
                        : String(e.class) === 'C'
                          ? clsColors.C
                          : '#6b7280',
                },
              ]}
              showLabels
              // showOthers
              showTotal
              yTickFormatter={(v) => `${v}%`}
              labelFormatter={(v) => `${v}%`}
              xLabelColors={{
                A: clsColors.A,
                B: clsColors.B,
                C: clsColors.C,
              }}
            />
          </Box>
        </ChartCard>
      </Grid>
    </Flex>
  );
}

function ServiceMeasureTab({
  inventoryDaysData,
  skusThresholdData,
  serviceMeasureData,
  tgtVsActualData,
  classification,
  isLoadingInventoryDays,
  isLoadingServiceMeasure,
  isLoadingTgtVsActual,
  isLoadingThreshold,
}: {
  inventoryDaysData: unknown;
  skusThresholdData: { class: string; above: number; below: number }[];
  pctSkusData: { class: string; pct: number }[];
  serviceMeasureData: unknown;
  tgtVsActualData: unknown;
  classification: string;
  isLoadingInventoryDays: boolean;
  isLoadingServiceMeasure: boolean;
  isLoadingTgtVsActual: boolean;
  isLoadingThreshold: boolean;
  isLoadingPctSkus: boolean;
}) {
  type ServiceRow = {
    branch: string;
    'SKU-A%': string;
    'SKU-B%': string;
    'SKU-C%': string;
  };
  const serviceMeasureChartData = (
    (serviceMeasureData as { data?: ServiceRow[] })?.data ?? []
  ).map((r) => ({
    branch: r.branch,
    skuA: !isNaN(parseFloat(r['SKU-A%'])) ? parseFloat(r['SKU-A%']) : undefined,
    skuB: !isNaN(parseFloat(r['SKU-B%'])) ? parseFloat(r['SKU-B%']) : undefined,
    skuC: !isNaN(parseFloat(r['SKU-C%'])) ? parseFloat(r['SKU-C%']) : undefined,
  }));
  type TgtVsActualRow = {
    classification: string;
    cover_days_tgt: string;
    actual_cover_days: string;
  };
  const coverDaysChartData = (
    (tgtVsActualData as { data?: TgtVsActualRow[] })?.data ?? []
  ).map((r) => ({
    class: r.classification,
    tgt: parseFloat(r.cover_days_tgt),
    actual: parseFloat(r.actual_cover_days),
  }));

  type InvApiRow = Record<string, string | null>;
  const branchKeys = INV_API_BRANCHES.map((b) => b.key);
  const invApiRows = (inventoryDaysData as { data?: InvApiRow[] })?.data ?? [];

  const avgVals = (rows: InvApiRow[]) =>
    branchKeys.map((key) =>
      rows.length > 0
        ? rows.reduce((s, r) => s + Number(r[key] ?? 0), 0) / rows.length
        : 0
    );

  const grouped = invApiRows.reduce<Record<string, InvApiRow[]>>((acc, row) => {
    const key = (row.classification as string) || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  const computedRows = (['A', 'B', 'C', 'Other'] as const)
    .filter((c) => grouped[c]?.length)
    .map((cls) => ({
      cls,
      vals: avgVals(grouped[cls]),
      bold: false,
      subRows: grouped[cls].map((r: InvApiRow) => ({
        sku: (r.item_desc as string) ?? '',
        vals: branchKeys.map((k) => Number(r[k] ?? 0)),
      })),
    }));

  const tableHeaders = ['Class', ...INV_API_BRANCHES.map((b) => b.label)];

  return (
    <Flex direction="column" gap={4}>
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        {/* Benchmark */}
        <GridItem colSpan={{ base: 12, lg: 3 }}>
          <Box
            bg="gray.50"
            borderRadius="xl"
            p={4}
            border="1.5px dashed"
            borderColor="gray.300"
            h="full"
          >
            <HStack mb={4} gap={2} justify="space-between">
              <HStack gap={2}>
                <Box w={1} h={5} bg="gray.700" borderRadius="full" />
                <Text
                  fontSize="13px"
                  fontWeight="800"
                  color="gray.700"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Inventory Days Threshold
                </Text>
              </HStack>
              <Box px={2} py="2px" borderRadius="md" bg="gray.700">
                <Text
                  fontSize="12px"
                  fontWeight="800"
                  color="white"
                  textTransform="uppercase"
                  letterSpacing="widest"
                >
                  LEGEND
                </Text>
              </Box>
            </HStack>
            <Flex direction="column" gap={3}>
              {INV_BENCHMARKS.map((b, i) => (
                <BenchmarkBanner
                  key={b.cls}
                  {...b}
                  days={INVENTORY_THRESHOLD_DAYS[b.cls] ?? b.days}
                  isLast={i === INV_BENCHMARKS.length - 1}
                />
              ))}
            </Flex>
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 9 }}>
          <DataTable
            title="Inventory Days"
            headerGradient={gradients.tableBlue}
            headers={tableHeaders}
            searchable={false}
            rowCollapsible
            height="270px"
            isLoading={isLoadingInventoryDays}
          >
            {computedRows.map((row) => {
              const clsColor =
                row.cls === 'A'
                  ? clsColors.A
                  : row.cls === 'B'
                    ? clsColors.B
                    : row.cls === 'C'
                      ? clsColors.C
                      : undefined;
              const clsRowBg =
                row.cls === 'A'
                  ? clsColors.Abg
                  : row.cls === 'B'
                    ? clsColors.Bbg
                    : row.cls === 'C'
                      ? clsColors.Cbg
                      : undefined;
              const clsBadge = clsColor ? (
                <Box
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  w="22px"
                  h="22px"
                  borderRadius="4px"
                  bg={clsColor}
                  color="white"
                  fontSize="12px"
                  fontWeight="700"
                >
                  {row.cls}
                </Box>
              ) : undefined;
              const threshold =
                row.cls === 'A'
                  ? 30
                  : row.cls === 'B'
                    ? 20
                    : row.cls === 'C'
                      ? 15
                      : null;
              return (
                <DataTableRow
                  key={row.cls}
                  cells={[
                    row.cls,
                    ...row.vals.map((v) => String(Math.trunc(v))),
                  ]}
                  isTotal={row.bold}
                  rowBg={clsRowBg}
                  cellColors={[clsColor]}
                  cellNodes={[clsBadge]}
                  cellWeights={['700', ...row.vals.map(() => '600')]}
                  subRows={row.subRows.map((s) => ({
                    cells: [s.sku, ...s.vals.map((v) => String(Math.trunc(v)))],
                    cellColors: [
                      undefined,
                      ...s.vals.map((v) =>
                        threshold !== null && v >= threshold
                          ? '#067242'
                          : undefined
                      ),
                    ],
                  }))}
                />
              );
            })}
          </DataTable>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <ChartCard
          colSpan={6}
          title="Service Measure by Branch"
          height="340px"
          isLoading={isLoadingServiceMeasure}
          variant="line"
        >
          <LineChart
            variant="filled"
            data={serviceMeasureChartData}
            xKey="branch"
            lines={[
              { key: 'skuA', label: 'SKU-A%', color: clsColors.A },
              { key: 'skuB', label: 'SKU-B%', color: clsColors.B },
              { key: 'skuC', label: 'SKU-C%', color: clsColors.C },
            ].filter(
              (l) => !classification || l.key === `sku${classification}`
            )}
            height={340}
            labelFormatter={(v) => `${v}%`}
          />
        </ChartCard>
        <ChartCard
          colSpan={3}
          title="Cover Days Threshold vs Actual"
          height="321px"
          isLoading={isLoadingTgtVsActual}
        >
          <BarChart
            data={coverDaysChartData}
            xKey="class"
            height={'100%'}
            bars={[
              { key: 'tgt', label: 'TGT', color: CHART_COLORS[0] },
              {
                key: 'actual',
                label: 'Actual',
                color: CHART_COLORS[1],
              },
            ]}
            showLabels
            labelFormatter={(v) => `${Math.round(Number(v))}`}
            yTickFormatter={(v) => `${Math.round(Number(v))}`}
            xLabelColors={{ A: clsColors.A, B: clsColors.B, C: clsColors.C }}
          />
        </ChartCard>

        <ChartCard
          colSpan={3}
          title="SKUs Against Threshold"
          titleNode={
            <>
              SKU<span style={{ textTransform: 'lowercase' }}>s</span> VS
              Threshold
            </>
          }
          height="321px"
          isLoading={isLoadingThreshold}
        >
          <BarChart
            data={skusThresholdData}
            xKey="class"
            height={'100%'}
            compact
            barCategoryGap="10%"
            bars={[
              {
                key: 'above',
                label: 'Above',
                color: '#067242',
              },
              {
                key: 'below',
                label: 'Below',
                color: '#E52020',
              },
            ]}
            showLabels
            xLabelColors={{ A: clsColors.A, B: clsColors.B, C: clsColors.C }}
          />
        </ChartCard>
      </Grid>
    </Flex>
  );
}

function DispatchWipTab({
  dispatchVsOrderData,
  wipData,
  rpmData,
  isLoadingDispatch,
  isLoadingWip,
  isLoadingRpm,
}: {
  dispatchVsOrderData: unknown;
  wipData: unknown;
  rpmData: unknown;
  isLoadingDispatch: boolean;
  isLoadingWip: boolean;
  isLoadingRpm: boolean;
}) {
  type DispatchRow = {
    material_name: string;
    delivery_pct: string;
    total_order_qty: string;
    total_delivery_qty: string;
  };
  type WipRow = { 'item desc': string; Wip_total: string };
  type RpmRow = {
    materialname: string;
    total_value: string;
    producttype?: string;
  };
  const dispatchRows =
    (dispatchVsOrderData as { data?: DispatchRow[] })?.data ?? [];
  const wipRows = (wipData as { data?: WipRow[] })?.data ?? [];
  const allRpmRows = (rpmData as { data?: RpmRow[] })?.data ?? [];
  const [rpmTypeFilter, setRpmTypeFilter] = useState<'All' | 'TPKG' | 'TRAW'>(
    'All'
  );
  const rpmRows =
    rpmTypeFilter === 'All'
      ? allRpmRows
      : allRpmRows.filter((r) => r.producttype === rpmTypeFilter);

  return (
    <Grid templateColumns="repeat(10, 1fr)" gap={4}>
      <GridItem colSpan={4}>
        <DataTable
          title="Dispatch Vs Order"
          headerGradient={gradients.tableBlue}
          headers={['Material Name', 'Order Qty', 'Delivery Qty', '%']}
          colAligns={['left', 'left', 'left', 'right']}
          pageSize={15}
          isLoading={isLoadingDispatch}
        >
          {dispatchRows.map((row) => {
            const rawPct = parseInt(row.delivery_pct);
            const pct = `${rawPct < 0 ? 0 : rawPct}%`;
            const isBelow95 = parseFloat(row.delivery_pct) < 95;
            const orderQty = Number(row.total_order_qty ?? 0).toLocaleString(
              'en-US',
              { maximumFractionDigits: 0 }
            );
            const deliveryQty = Number(
              row.total_delivery_qty ?? 0
            ).toLocaleString('en-US', { maximumFractionDigits: 0 });
            return (
              <DataTableRow
                key={row.material_name}
                cells={[row.material_name, orderQty, deliveryQty, pct]}
                cellColors={[
                  undefined,
                  undefined,
                  undefined,
                  isBelow95 ? '#dc2626' : '#067242',
                ]}
                cellWeights={[undefined, undefined, undefined, '700']}
              />
            );
          })}
        </DataTable>
      </GridItem>

      {/* WIP */}
      <GridItem colSpan={3}>
        <DataTable
          title="WIP"
          headerGradient={gradients.tableBlue}
          headers={['Material Name', 'WIP Value']}
          colAligns={['left', 'right']}
          pageSize={15}
          isLoading={isLoadingWip}
        >
          <DataTableRow
            key="__wip_total__"
            cells={[
              'Total',
              wipRows
                .reduce((s, r) => s + Number(r.Wip_total ?? 0), 0)
                .toLocaleString('en-US', { maximumFractionDigits: 0 }),
            ]}
            cellWeights={['700', '700']}
          />
          {wipRows.map((row) => (
            <DataTableRow
              key={row['item desc']}
              cells={[
                row['item desc'],
                Number(row.Wip_total ?? 0).toLocaleString('en-US', {
                  maximumFractionDigits: 0,
                }),
              ]}
              cellWeights={[undefined, '600']}
            />
          ))}
        </DataTable>
      </GridItem>

      {/* RPM */}
      <GridItem colSpan={3}>
        <DataTable
          title="RPM"
          headerGradient={gradients.tableIndigo}
          headers={['Material Name', 'RPM Value']}
          colAligns={['left', 'right']}
          pageSize={15}
          isLoading={isLoadingRpm}
          headerActions={
            <HStack
              gap={0}
              borderRadius="md"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.200"
            >
              {(
                [
                  ['All', 'All'],
                  ['PM', 'TPKG'],
                  ['RM', 'TRAW'],
                ] as const
              ).map(([label, value]) => (
                <Box
                  key={value}
                  as="button"
                  px={3}
                  py="5px"
                  cursor={'pointer'}
                  fontSize="12px"
                  fontWeight="700"
                  bg={rpmTypeFilter === value ? 'blue.600' : 'white'}
                  color={rpmTypeFilter === value ? 'white' : 'gray.600'}
                  _hover={{
                    bg: rpmTypeFilter === value ? 'blue.600' : 'gray.50',
                  }}
                  onClick={() => setRpmTypeFilter(value)}
                  borderRight={value !== 'TRAW' ? '1px solid' : undefined}
                  borderColor="gray.200"
                  transition="all 0.15s"
                >
                  {label}
                </Box>
              ))}
            </HStack>
          }
        >
          <DataTableRow
            key="__rpm_total__"
            cells={[
              'Total',
              rpmRows
                .reduce((s, r) => s + Number(r.total_value ?? 0), 0)
                .toLocaleString('en-US', { maximumFractionDigits: 0 }),
            ]}
            cellWeights={['700', '700']}
          />
          {rpmRows.map((row) => (
            <DataTableRow
              key={row.materialname}
              cells={[
                row.materialname,
                Number(row.total_value ?? 0).toLocaleString('en-US', {
                  maximumFractionDigits: 0,
                }),
              ]}
              cellWeights={[undefined, '600']}
            />
          ))}
        </DataTable>
      </GridItem>
    </Grid>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ScorecardDashboard() {
  const { mainTab, filters } = useAppSelector((state) => state.salesDashboard);

  const params = {
    ...(filters.classification && { classification: filters.classification }),
    ...(filters.branch.length > 0 && { branch: filters.branch }),
    ...(filters.sku.length > 0 && { sku: filters.sku }),
    ...(filters.dateFrom && { startDate: filters.dateFrom }),
    ...(filters.dateTo && { endDate: filters.dateTo }),
  };

  const { data: totalSkuData } = useGetTotalSku({
    ...(filters.classification && { classification: filters.classification }),
    ...(filters.sku.length > 0 && { sku: filters.sku }),
  });
  type TotalSkuRow = { classification: string; count: number };
  const skuCounts = (
    (totalSkuData as { data?: TotalSkuRow[] })?.data ?? []
  ).reduce<Record<string, number>>((acc, r) => {
    if (r.classification) acc[r.classification] = r.count;
    return acc;
  }, {});

  const { data: salesSummaryData, isFetching: isLoadingSales } =
    useGetSalesSummary(params);
  const { data: coverDaysData, isFetching: isLoadingCoverDays } =
    useGetCoverDays(params);
  const { data: forecastAccuracyMonthlyData } =
    useGetForecastAccuracyMonthly(params);
  const {
    data: forecastAccuracyCategoryMonthlyData,
    isFetching: isLoadingForecastTscl,
  } = useGetForecastAccuracyCategoryMonthly({
    ...params,
    endDate: filters.dateTo || new Date().toISOString().slice(0, 10),
  });

  const { data: forecastAccuracyYearlyData } = useGetForecastAccuracyYearly({
    ...params,
    date: filters.dateTo || new Date().toISOString().slice(0, 10),
  });
  const {
    data: forecastAccuracyCategoryYearlyData,
    isFetching: isLoadingForecastIbl,
  } = useGetForecastAccuracyCategoryYearly({
    ...params,
    endDate: filters.dateTo || new Date().toISOString().slice(0, 10),
  });

  const { data: inventoryDaysData, isFetching: isLoadingInventoryDays } =
    useGetInventoryDays(params);
  const { data: aboveBelowThresholdData, isFetching: isLoadingThreshold } =
    useGetAboveBelowThreshold(params);
  const { data: iblVsTsclData, isFetching: isLoadingIblVsTscl } =
    useGetIblVsTscl(params);
  const { data: dispatchVsOrderData, isFetching: isLoadingDispatch } =
    useGetDispatchVsOrder(params);

  const { data: wipData, isFetching: isLoadingWip } = useGetWip(params);
  const { data: rpmData, isFetching: isLoadingRpm } = useGetRpm(params);
  const { data: serviceMeasureData, isFetching: isLoadingServiceMeasure } =
    useGetServiceMeasure(params);
  const { data: tgtVsActualData, isFetching: isLoadingTgtVsActual } =
    useGetTgtVsActual(params);

  const apiRows = salesSummaryData?.data as
    | { classification: string; sku: number; new_total_all_sales: number }[]
    | undefined;

  const totalSales = apiRows
    ? apiRows.reduce((sum, item) => sum + Number(item.new_total_all_sales), 0)
    : null;

  const UP_MAP: Record<string, boolean | null> = {
    A: true,
    B: true,
    C: false,
    Other: null,
  };

  const salesRows =
    apiRows && totalSales
      ? apiRows.map((item) => {
          const pct = (
            (Number(item.new_total_all_sales) / totalSales) *
            100
          ).toFixed(1);
          return {
            label: LABEL_MAP[item.classification] ?? item.classification,
            sku: String(item.sku),
            sales: Number(item.new_total_all_sales).toLocaleString('en-US', {
              maximumFractionDigits: 0,
            }),
            pct: `${pct}%`,
            up: UP_MAP[item.classification] ?? null,
          };
        })
      : [];

  const salesTotal = {
    sales: totalSales
      ? totalSales.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : '—',
    pct: '100%',
  };

  type CoverDayRow = {
    classification: string;
    inv_value: string;
    cover_days: string;
    daily_target: string;
  };
  const coverDayApiRows =
    (coverDaysData as { data?: CoverDayRow[] })?.data ?? [];

  const findCls = (cls: string) =>
    coverDayApiRows.find((r) => r.classification === cls);

  const fmtInv = (v: string | undefined) =>
    Number(v ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 });

  const totalInv = coverDayApiRows.reduce(
    (s, r) => s + Number(r.inv_value ?? 0),
    0
  );
  const totalDailyTarget = coverDayApiRows.reduce(
    (s, r) => s + Number(r.daily_target ?? 0),
    0
  );
  const totalCoverDays =
    totalDailyTarget > 0 ? Math.round(totalInv / totalDailyTarget) : 0;

  const coverDaysRows: typeof COVER_DAYS = [
    {
      ...COVER_DAYS[0],
      value: totalCoverDays,
      inv: fmtInv(String(totalInv)),
    },
    {
      ...COVER_DAYS[1],
      value: Math.round(Number(findCls('A')?.cover_days ?? 0)),
      inv: fmtInv(findCls('A')?.inv_value),
    },
    {
      ...COVER_DAYS[2],
      value: Math.round(Number(findCls('B')?.cover_days ?? 0)),
      inv: fmtInv(findCls('B')?.inv_value),
    },
    {
      ...COVER_DAYS[3],
      value: Math.round(Number(findCls('C')?.cover_days ?? 0)),
      inv: fmtInv(findCls('C')?.inv_value),
    },
    {
      ...COVER_DAYS[4],
      value: Math.round(Number(findCls('Others')?.cover_days ?? 0)),
      inv: fmtInv(findCls('Others')?.inv_value),
    },
  ];

  type ThresholdRow = {
    Classification: string;
    'No Of SKUs > Threshold': number;
    'No Of SKUs < Threshold': number;
  };
  const thresholdRows =
    (aboveBelowThresholdData as { data?: ThresholdRow[] })?.data ?? [];
  const skusThresholdData = thresholdRows
    .filter(
      (r) =>
        !filters.classification || r.Classification === filters.classification
    )
    .map((r) => ({
      class: r.Classification,
      above: Number(r['No Of SKUs > Threshold']) ?? 0,
      below: Number(r['No Of SKUs < Threshold']) ?? 0,
    }));

  type IblVsTsclRow = {
    classification: string;
    forecast_vs_budget_pct: number;
  };
  const iblVsTsclRows =
    (iblVsTsclData as { data?: IblVsTsclRow[] })?.data ?? [];
  const pctSkusData = (['A', 'B', 'C', 'Others', 'Total'] as const)
    .filter(
      (cls) =>
        cls === 'Total' ||
        !filters.classification ||
        cls === filters.classification
    )
    .map((cls) => {
      const row = iblVsTsclRows.find(
        (r) => (r.classification ?? 'Others') === cls
      );
      return {
        class: cls,
        pct: row ? Math.round(Number(row.forecast_vs_budget_pct)) : 0,
      };
    });

  const tsclAccuracy = (() => {
    const row = (
      forecastAccuracyMonthlyData as {
        data?: { forecast_accuracy_pct: number; new_total_all_sales: number }[];
      }
    )?.data?.[0];
    return row ? Math.round(row.forecast_accuracy_pct * 100 * 10) / 10 : null;
  })();

  const tsclSalesDisplay = (() => {
    const row = (
      forecastAccuracyMonthlyData as {
        data?: {
          new_total_all_sales: number;
          period_sales_trg_ibl_primary: number;
        }[];
      }
    )?.data?.[0];
    if (!row) return undefined;
    return {
      achieved: Number(row.new_total_all_sales).toLocaleString('en-US', {
        maximumFractionDigits: 0,
      }),
      target: Number(row.period_sales_trg_ibl_primary).toLocaleString('en-US', {
        maximumFractionDigits: 0,
      }),
    };
  })();

  const iblAccuracy = (() => {
    const row = (
      forecastAccuracyYearlyData as {
        data?: {
          forecast_accuracy_pct: number;
          new_total_all_sales: number;
          budget: number;
        }[];
      }
    )?.data?.[0];
    return row ? Math.round(row.forecast_accuracy_pct * 100 * 10) / 10 : null;
  })();

  const iblSalesDisplay = (() => {
    const row = (
      forecastAccuracyYearlyData as {
        data?: { new_total_all_sales: number; budget: number }[];
      }
    )?.data?.[0];
    if (!row) return undefined;
    return {
      achieved: Number(row.new_total_all_sales).toLocaleString('en-US', {
        maximumFractionDigits: 0,
      }),
      target: Number(row.budget).toLocaleString('en-US', {
        maximumFractionDigits: 0,
      }),
    };
  })();

  const iblCategoryRows: ForecastCategoryRow[] =
    (forecastAccuracyCategoryYearlyData as { data?: ForecastCategoryRow[] })
      ?.data ?? [];

  const iblMonths = [...new Set(iblCategoryRows.map((r) => r.month))].sort(
    (a, b) => new Date(`1 ${a}`).getTime() - new Date(`1 ${b}`).getTime()
  );

  const iblBarData: Record<string, string | number>[] = Object.values(
    iblCategoryRows.reduce<Record<string, Record<string, string | number>>>(
      (acc, r) => {
        const key = r.category ?? r.classification ?? 'Others';
        const label = key === '' || key === null ? 'Others' : key;
        if (!acc[label]) acc[label] = { classification: label };
        acc[label][r.month] =
          Math.round(r.forecast_accuracy_pct * 100 * 10) / 10;
        return acc;
      },
      {}
    )
  );

  const forecastCategoryRows: ForecastCategoryRow[] =
    (forecastAccuracyCategoryMonthlyData as { data?: ForecastCategoryRow[] })
      ?.data ?? [];

  const forecastMonths = [
    ...new Set(forecastCategoryRows.map((r) => r.month)),
  ].sort((a, b) => new Date(`1 ${a}`).getTime() - new Date(`1 ${b}`).getTime());

  const forecastBarData: Record<string, string | number>[] = Object.values(
    forecastCategoryRows.reduce<
      Record<string, Record<string, string | number>>
    >((acc, r) => {
      const key = r.classification ?? r.category ?? 'Others';
      const label = key === '' ? 'Others' : key;
      if (!acc[label]) acc[label] = { classification: label };
      acc[label][r.month] = Math.round(r.forecast_accuracy_pct * 100 * 10) / 10;
      return acc;
    }, {})
  );

  return (
    <Flex direction="column" minH="100vh" bg={colors.pageBg}>
      {/* Header */}
      <Box
        bg={colors.headerBg}
        borderBottom="1px solid"
        borderColor="gray.200"
        px={4}
        py={2}
        boxShadow="sm"
      >
        <Flex align="center" gap={3}>
          {/* Logo */}
          <HStack gap={2} flexShrink={0}>
            <Flex w={50} h={50} align="center" justify="center" flexShrink={0}>
              <img
                src="https://www.iblgrp.com/images/iblpvt-logo.jpeg"
                alt="IBL Logo"
                width="100%"
                height="100%"
                style={{ objectFit: 'contain', borderRadius: 4 }}
              />
            </Flex>
            <Text
              fontWeight="700"
              fontSize="sm"
              color="gray.900"
              whiteSpace="nowrap"
            >
              SupplyChain Pulse 1.0
            </Text>
          </HStack>

          {/* Tabs + toggles */}
          <HeaderActions />

          {/* Quarter label */}
          {/* <HStack flexShrink={0} gap={2}>
            <Box w="1px" h={4} bg="gray.200" />
            <Text
              fontSize="xs"
              fontWeight="600"
              color="gray.500"
              whiteSpace="nowrap"
            >
              Q1 2025 · Jan — Mar
            </Text>
          </HStack> */}
        </Flex>
      </Box>

      {/* Filter Bar */}
      <Box
        px={4}
        py={2}
        bg={colors.headerBg}
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        <FilterBar initialFilters={filters} />
      </Box>

      {/* Page content */}
      <Box flex={1} px={4} py={4} overflowY="auto">
        {mainTab === 'supplyChain' && (
          <SupplyChainTab
            salesRows={salesRows}
            salesTotal={salesTotal}
            coverDaysRows={coverDaysRows}
            tsclAccuracy={tsclAccuracy}
            tsclSalesDisplay={tsclSalesDisplay}
            forecastBarData={forecastBarData}
            forecastMonths={forecastMonths}
            iblAccuracy={iblAccuracy}
            iblSalesDisplay={iblSalesDisplay}
            iblBarData={iblBarData}
            iblMonths={iblMonths}
            isLoadingSales={isLoadingSales}
            isLoadingCoverDays={isLoadingCoverDays}
            isLoadingForecastTscl={isLoadingForecastTscl}
            isLoadingForecastIbl={isLoadingForecastIbl}
            pctSkusData={pctSkusData}
            isLoadingPctSkus={isLoadingIblVsTscl}
            skuCounts={skuCounts}
            endDate={filters.dateTo}
          />
        )}
        {mainTab === 'serviceMeasure' && (
          <ServiceMeasureTab
            inventoryDaysData={inventoryDaysData}
            skusThresholdData={skusThresholdData}
            pctSkusData={pctSkusData}
            serviceMeasureData={serviceMeasureData}
            tgtVsActualData={tgtVsActualData}
            classification={filters.classification}
            isLoadingInventoryDays={isLoadingInventoryDays}
            isLoadingServiceMeasure={isLoadingServiceMeasure}
            isLoadingTgtVsActual={isLoadingTgtVsActual}
            isLoadingThreshold={isLoadingThreshold}
            isLoadingPctSkus={isLoadingIblVsTscl}
          />
        )}
        {mainTab === 'dispatchWip' && (
          <DispatchWipTab
            dispatchVsOrderData={dispatchVsOrderData}
            wipData={wipData}
            rpmData={rpmData}
            isLoadingDispatch={isLoadingDispatch}
            isLoadingWip={isLoadingWip}
            isLoadingRpm={isLoadingRpm}
          />
        )}
      </Box>
    </Flex>
  );
}
