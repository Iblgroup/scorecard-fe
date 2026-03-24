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

const BENCHMARKS = [
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

const COVER_DAYS = [
  {
    label: 'Total Cover Days',
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
];

const CHART_COLORS = ['#646ECB', '#5AC8D8', '#16476A'] as const;

const INV_API_BRANCHES = [
  { key: 'bahawalpur', label: 'Bahawalpur' },
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
  // bm,
  rd,
  color,
  isLast,
}: (typeof BENCHMARKS)[0] & { isLast?: boolean }) {
  return (
    <Flex
      pb={isLast ? 0 : 3}
      mb={isLast ? 0 : 3}
      borderBottom={isLast ? 'none' : '1px solid'}
      borderColor="gray.300"
      gap={3}
    >
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
        {cls}
      </Flex>
      <Box w="100%">
        {/* Class + days row */}
        <HStack gap={2} mb={2}>
          <Text fontSize="18px" fontWeight="900" color={color} lineHeight={1}>
            {days}
          </Text>
          <Text
            fontSize="11px"
            fontWeight="500"
            color="gray.500"
            lineHeight={1}
          >
            days
          </Text>
          <Box flex={1} />
          {/* <Box
            px={2}
            py="2px"
            borderRadius="4px"
            bg={`${color}15`}
            border="1px solid"
            borderColor={`${color}35`}
          >
            <Text fontSize="11px" fontWeight="700" color={color}>
              BM {bm}
            </Text>
          </Box> */}
        </HStack>

        {/* RD progress bar */}
        <Box>
          <HStack justify="space-between" mb="4px">
            <Text
              fontSize="11px"
              fontWeight="600"
              color="gray.500"
              letterSpacing="wide"
            >
              RD
            </Text>
            <Text fontSize="11px" fontWeight="700" color={color}>
              {rd}%
            </Text>
          </HStack>
          <Box h="6px" borderRadius="full" bg={`${color}18`} overflow="hidden">
            <Box h="100%" w={`${rd}%`} borderRadius="full" bg={color} />
          </Box>
        </Box>
      </Box>
    </Flex>
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
}: (typeof COVER_DAYS)[0]) {
  const isClassified = dot === '●';
  const letter = label.charAt(0);

  if (!isClassified) {
    // Total Cover Days — original design
    return (
      <Box
        bg="white"
        borderRadius="lg"
        p={3}
        border="1px solid"
        borderColor="gray.100"
        boxShadow="sm"
        h="full"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="3px"
          bg={color}
          borderTopRadius="xl"
        />
        <Text
          fontSize="11px"
          fontWeight="700"
          color="gray.400"
          textTransform="uppercase"
          letterSpacing="widest"
          mt={1}
        >
          {label}
        </Text>
        <Text
          fontSize="2.5rem"
          fontWeight="900"
          color={color}
          lineHeight="1.1"
          mt={2}
        >
          {value}
        </Text>
        <Box mt={2} pt={2} borderTop="1px solid" borderColor="gray.100">
          <Text fontSize="11px" color="gray.400">
            Inventory:{' '}
            <Box as="span" fontWeight="600" color="gray.600">
              {inv}
            </Box>
          </Text>
        </Box>
      </Box>
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
              fontSize="11px"
              fontWeight="600"
              color={color}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Cover Days
            </Text>
          </Flex>
          <Text fontSize="11px" color="gray.500" mt={0.5}>
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
  A: 'A  —  High Velocity',
  B: 'B  —  Medium Velocity',
  C: 'C  —  Low Velocity',
  Other: 'Other',
};

interface ForecastCategoryRow {
  category: string;
  month_label: string;
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
}: SupplyChainTabProps) {
  return (
    <Flex direction="column" gap={4}>
      {/* Benchmarks + Sales Summary */}
      <Grid templateColumns="repeat(12, 1fr)" gap={4} alignItems="stretch">
        {/* Benchmark — 3 cols */}
        <GridItem colSpan={{ base: 12, lg: 3 }}>
          <Box bg="gray.200" borderRadius="xl" p={4} boxShadow="md" h="full">
            <HStack mb={4} gap={2}>
              <Box w={1} h={5} bg="gray.700" borderRadius="full" />
              <Text
                fontSize="13px"
                fontWeight="800"
                color="gray.700"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Days Benchmark
              </Text>
            </HStack>
            <Box>
              {BENCHMARKS.map((b, i) => (
                <BenchmarkBanner
                  key={b.cls}
                  {...b}
                  isLast={i === BENCHMARKS.length - 1}
                />
              ))}
            </Box>
          </Box>
        </GridItem>

        {/* Sales Summary — 6 cols */}
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
              <Grid templateColumns="1fr 1fr" gap={3} alignItems="start">
                <Skeleton height="120px" borderRadius="lg" />
                <Flex direction="column" gap={2}>
                  <Skeleton height="52px" borderRadius="lg" />
                  <Skeleton height="52px" borderRadius="lg" />
                  <Skeleton height="52px" borderRadius="lg" />
                </Flex>
              </Grid>
            ) : (
              <Grid templateColumns="1fr 1fr" gap={3} alignItems="start">
                <CoverDaysCard {...coverDaysRows[0]} />
                <Flex direction="column" gap={2}>
                  {coverDaysRows.slice(1).map((c) => (
                    <CoverDaysCard key={c.label} {...c} />
                  ))}
                </Flex>
              </Grid>
            )}
          </Box>
        </GridItem>
      </Grid>

      {/* Forecast Accuracy Charts */}
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <ChartCard
          colSpan={6}
          title="Forecast Accuracy TSCL"
          height="280px"
          isLoading={isLoadingForecastTscl}
          variant="gauge-bar"
        >
          <Flex h="100%" gap={0}>
            <Box
              w="160px"
              flexShrink={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <GaugeChart
                value={tsclAccuracy ?? 0}
                target={100}
                title=""
                subtitle="Total Supply Chain Level"
                color={'#726A95'}
                displayAchieved={tsclSalesDisplay?.achieved}
                displayTarget={tsclSalesDisplay?.target}
                isLoading={isLoadingForecastTscl}
              />
            </Box>
            <Box w="1px" bg="gray.100" mx={3} flexShrink={0} />
            <Box flex={1} minW={0}>
              <BarChart
                data={forecastBarData}
                xKey="classification"
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
                yTickFormatter={(v) => `${Number(v).toFixed(2)}%`}
                labelFormatter={(v) => `${Number(v).toFixed(2)}%`}
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
          isLoading={isLoadingForecastIbl}
          variant="gauge-bar"
        >
          <Flex h="100%" gap={0}>
            <Box
              w="160px"
              flexShrink={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <GaugeChart
                value={iblAccuracy ?? 0}
                target={100}
                title=""
                subtitle="Item Branch Level"
                color={'#726A95'}
                displayAchieved={iblSalesDisplay?.achieved}
                displayTarget={iblSalesDisplay?.target}
                isLoading={isLoadingForecastIbl}
              />
            </Box>
            <Box w="1px" bg="gray.100" mx={3} flexShrink={0} />
            <Box flex={1} minW={0}>
              <BarChart
                data={iblBarData}
                xKey="classification"
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
                yTickFormatter={(v) => `${Number(v).toFixed(2)}%`}
                labelFormatter={(v) => `${Number(v).toFixed(2)}%`}
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
      </Grid>
    </Flex>
  );
}

function ServiceMeasureTab({
  inventoryDaysData,
  skusThresholdData,
  pctSkusData,
  serviceMeasureData,
  tgtVsActualData,
  classification,
  isLoadingInventoryDays,
  isLoadingServiceMeasure,
  isLoadingTgtVsActual,
  isLoadingThreshold,
  isLoadingPctSkus,
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
    branch_desc: string;
    'SKU-A%': string;
    'SKU-B%': string;
    'SKU-C%': string;
  };
  const serviceMeasureChartData = (
    (serviceMeasureData as { data?: ServiceRow[] })?.data ?? []
  )
    .filter(
      (r) =>
        Number(r['SKU-A%']) !== 0 ||
        Number(r['SKU-B%']) !== 0 ||
        Number(r['SKU-C%']) !== 0
    )
    .map((r) => ({
      branch: r.branch_desc,
      skuA: !isNaN(parseFloat(r['SKU-A%']))
        ? parseFloat(r['SKU-A%'])
        : undefined,
      skuB: !isNaN(parseFloat(r['SKU-B%']))
        ? parseFloat(r['SKU-B%'])
        : undefined,
      skuC: !isNaN(parseFloat(r['SKU-C%']))
        ? parseFloat(r['SKU-C%'])
        : undefined,
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
    branchKeys.map((key) => {
      const vals = rows
        .map((r) => Number(r[key] ?? 0))
        .filter((v) => !isNaN(v));
      return vals.length
        ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
        : 0;
    });

  const grouped = invApiRows.reduce<Record<string, InvApiRow[]>>((acc, row) => {
    const key = (row.category as string) || 'Other';
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
        <GridItem colSpan={{ base: 12, lg: 6 }}>
          <DataTable
            title="Inventory Days"
            headerGradient={gradients.tableBlue}
            headers={tableHeaders}
            searchable={false}
            rowCollapsible
            maxHeight="340px"
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
              return (
                <DataTableRow
                  key={row.cls}
                  cells={[row.cls, ...row.vals.map(String)]}
                  isTotal={row.bold}
                  cellColors={[clsColor]}
                  cellNodes={[clsBadge]}
                  cellWeights={['700', ...row.vals.map(() => '600')]}
                  subRows={row.subRows.map((s) => ({
                    cells: [s.sku, ...s.vals.map(String)],
                  }))}
                />
              );
            })}
          </DataTable>
        </GridItem>

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
            height={310}
            labelFormatter={(v) => `${v}%`}
          />
        </ChartCard>
      </Grid>

      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <ChartCard
          colSpan={4}
          title="Cover Days TGT vs Actual"
          height="220px"
          isLoading={isLoadingTgtVsActual}
        >
          <BarChart
            data={coverDaysChartData}
            xKey="class"
            barSize={32}
            height={200}
            bars={[
              { key: 'tgt', label: 'TGT', color: CHART_COLORS[0] },
              {
                key: 'actual',
                label: 'Actual',
                color: CHART_COLORS[1],
              },
            ]}
            showLabels
            xLabelColors={{ A: clsColors.A, B: clsColors.B, C: clsColors.C }}
          />
        </ChartCard>

        <ChartCard
          colSpan={4}
          title="SKUs Against Threshold"
          titleNode={
            <>
              SKU<span style={{ textTransform: 'lowercase' }}>s</span> VS
              Threshold
            </>
          }
          height="220px"
          isLoading={isLoadingThreshold}
        >
          <BarChart
            data={skusThresholdData}
            xKey="class"
            barSize={32}
            height={200}
            bars={[
              {
                key: 'above',
                label: 'Above',
                color: CHART_COLORS[0],
              },
              {
                key: 'below',
                label: 'Below',
                color: CHART_COLORS[1],
              },
            ]}
            showLabels
            xLabelColors={{ A: clsColors.A, B: clsColors.B, C: clsColors.C }}
          />
        </ChartCard>

        <ChartCard
          colSpan={4}
          title="IBL Vs TSCL %"
          // titleNode={
          //   <>
          //     % SKU<span style={{ textTransform: 'lowercase' }}>s</span> vs
          //     Threshold
          //   </>
          // }
          height="220px"
          isLoading={isLoadingPctSkus}
        >
          <BarChart
            data={pctSkusData}
            xKey="class"
            barSize={48}
            height={200}
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
                      : clsColors.C,
              },
            ]}
            showLabels
            yTickFormatter={(v) => `${v}%`}
            labelFormatter={(v) => `${v}%`}
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
  type RpmRow = { materialname: string; total_value: string };
  const dispatchRows =
    (dispatchVsOrderData as { data?: DispatchRow[] })?.data ?? [];
  const wipRows = (wipData as { data?: WipRow[] })?.data ?? [];
  const rpmRows = (rpmData as { data?: RpmRow[] })?.data ?? [];

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
            const pct = `${parseFloat(row.delivery_pct).toFixed(2)}%`;
            const isBelow100 = parseFloat(row.delivery_pct) < 100;
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
                  isBelow100 ? '#dc2626' : '#059669',
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
        >
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

  const { data: salesSummaryData, isFetching: isLoadingSales } =
    useGetSalesSummary(params);
  const { data: coverDaysData, isFetching: isFetchingCoverDays } =
    useGetCoverDays(params);
  const { data: coverDaysDataA, isFetching: isFetchingCoverDaysA } =
    useGetCoverDays({
      ...params,
      classification: 'A',
    });
  const { data: coverDaysDataB, isFetching: isFetchingCoverDaysB } =
    useGetCoverDays({
      ...params,
      classification: 'B',
    });
  const { data: coverDaysDataC, isFetching: isFetchingCoverDaysC } =
    useGetCoverDays({
      ...params,
      classification: 'C',
    });
  const isLoadingCoverDays =
    isFetchingCoverDays ||
    isFetchingCoverDaysA ||
    isFetchingCoverDaysB ||
    isFetchingCoverDaysC;
  const { data: forecastAccuracyMonthlyData } =
    useGetForecastAccuracyMonthly(params);
  const {
    data: forecastAccuracyCategoryMonthlyData,
    isFetching: isLoadingForecastTscl,
  } = useGetForecastAccuracyCategoryMonthly({
    ...params,
    date: new Date().toISOString().slice(0, 10),
  });

  const { data: forecastAccuracyYearlyData } = useGetForecastAccuracyYearly({
    ...params,
    date: new Date().toISOString().slice(0, 10),
  });
  const {
    data: forecastAccuracyCategoryYearlyData,
    isFetching: isLoadingForecastIbl,
  } = useGetForecastAccuracyCategoryYearly({
    ...params,
    date: new Date().toISOString().slice(0, 10),
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

  const extractCoverDay = (data: unknown) => {
    const row = (
      data as { data?: { cover_days: number; closing_inventory_ibl: string }[] }
    )?.data?.[0];
    return row
      ? {
          value: Math.round(Number(row.cover_days)),
          inv: Number(row.closing_inventory_ibl).toLocaleString('en-US', {
            maximumFractionDigits: 0,
          }),
        }
      : null;
  };

  const coverDaysRows: typeof COVER_DAYS = [
    {
      ...COVER_DAYS[0],
      ...(extractCoverDay(coverDaysData) ?? {}),
    },
    {
      ...COVER_DAYS[1],
      ...(extractCoverDay(coverDaysDataA) ?? {}),
    },
    {
      ...COVER_DAYS[2],
      ...(extractCoverDay(coverDaysDataB) ?? {}),
    },
    {
      ...COVER_DAYS[3],
      ...(extractCoverDay(coverDaysDataC) ?? {}),
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

  type IblVsTsclRow = { category: string; forecast_vs_budget_pct: number };
  const iblVsTsclRows =
    (iblVsTsclData as { data?: IblVsTsclRow[] })?.data ?? [];
  const pctSkusData = (['A', 'B', 'C'] as const)
    .filter((cls) => !filters.classification || cls === filters.classification)
    .map((cls) => {
      const row = iblVsTsclRows.find((r) => r.category === cls);
      return {
        class: cls,
        pct: row ? Math.round(row.forecast_vs_budget_pct) : 0,
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

  const iblMonths = [...new Set(iblCategoryRows.map((r) => r.month_label))];

  const iblBarData: Record<string, string | number>[] = Object.values(
    iblCategoryRows.reduce<Record<string, Record<string, string | number>>>(
      (acc, r) => {
        const key = r.category;
        if (!acc[key]) acc[key] = { classification: key };
        acc[key][r.month_label] =
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
    ...new Set(forecastCategoryRows.map((r) => r.month_label)),
  ];

  const forecastBarData: Record<string, string | number>[] = Object.values(
    forecastCategoryRows.reduce<
      Record<string, Record<string, string | number>>
    >((acc, r) => {
      const key = r.category;
      if (!acc[key]) acc[key] = { classification: key };
      acc[key][r.month_label] =
        Math.round(r.forecast_accuracy_pct * 100 * 10) / 10;
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
