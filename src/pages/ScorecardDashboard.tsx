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
import { Box, Flex, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
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

const SALES_SUMMARY = [
  {
    label: 'A  —  High Velocity',
    sku: 'SKU-A',
    sales: '2,450,000',
    pct: '+48.2%',
    up: true,
  },
  {
    label: 'B  —  Medium Velocity',
    sku: 'SKU-B',
    sales: '1,830,000',
    pct: '+36.1%',
    up: true,
  },
  {
    label: 'C  —  Low Velocity',
    sku: 'SKU-C',
    sales: '793,000',
    pct: '▼15.6%',
    up: false,
  },
  {
    label: '—  Unclassified',
    sku: '—',
    sales: '8,000',
    pct: '−0.2%',
    up: null,
  },
];

const COVER_DAYS = [
  {
    label: 'Total Cover Days',
    value: 54,
    inv: '54,188',
    color: '#1d4ed8',
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

const FORECAST_TSCL = [
  { classification: 'A', Jan: 84, Feb: 87, Mar: 90 },
  { classification: 'B', Jan: 78, Feb: 81, Mar: 84 },
  { classification: 'C', Jan: 71, Feb: 75, Mar: 79 },
];

const FORECAST_IBL = [
  { classification: 'A', Jan: 80, Feb: 86, Mar: 88 },
  { classification: 'B', Jan: 70, Feb: 74, Mar: 76 },
  { classification: 'C', Jan: 60, Feb: 63, Mar: 67 },
];

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

// keep for fallback static rendering only
const INV_BRANCHES = INV_API_BRANCHES.map((b) => b.label);

const INV_ROWS = [
  {
    cls: '∑',
    vals: [43, 34, 36, 45, 50, 273, 92, 129, 46, 57],
    bold: true,
    subRows: [] as { sku: string; vals: number[] }[],
  },
  {
    cls: 'A',
    vals: [34, 25, 24, 23, 39, 190, 17, 95, 34, 35],
    bold: false,
    subRows: [
      {
        sku: 'Extor 10/160 Tablet',
        vals: [46, 29, 25, 17, 41, 57, 82, 37, 56, 48],
      },
      {
        sku: 'Extor 5/160 Tablet',
        vals: [32, 28, 15, 54, 15, 14, 23, 11, 96, 35],
      },
      { sku: 'Extor 5/80 Tablet', vals: [4, 7, 6, 0, 10, 12, 4, 5, 0, 9] },
      {
        sku: 'Hydryllin 120ml Syrup',
        vals: [50, 45, 31, 65, 105, 306, 21, 218, 28, 80],
      },
      {
        sku: 'Nuberol 100s Tablet',
        vals: [63, 63, 65, 12, 65, 91, 16, 62, 46, 62],
      },
    ],
  },
  {
    cls: 'B',
    vals: [35, 24, 26, 24, 26, 235, 27, 73, 32, 38],
    bold: false,
    subRows: [
      {
        sku: 'Nuberol Forte 650mg Tab',
        vals: [39, 27, 45, 8, 49, 62, 9, 169, 37, 38],
      },
      {
        sku: 'Nuberol-P 1gm 100ml Inj.',
        vals: [330, 48, 16, 96, 43, 686, 16, 2922, 59, 80],
      },
      {
        sku: 'Peditral Orange Sachet NP',
        vals: [14, 22, 24, 10, 55, 740, 6, 130, 1, 11],
      },
      {
        sku: 'Spiromide 20mg Tablet',
        vals: [3, 11, 12, 19, 5, 10, 0, 11, 0, 0],
      },
    ],
  },
  {
    cls: 'C',
    vals: [64, 56, 59, 43, 59, 247, 103, 175, 48, 75],
    bold: false,
    subRows: [
      { sku: 'Spiromide 40mg Tablet', vals: [5, 0, 4, 50, 0, 68, 81, 0, 7, 1] },
      { sku: 'Sustac 2.6mg Tablet', vals: [7, 5, 7, 9, 5, 3, 3, 1, 0, 4] },
      {
        sku: 'Sustac 6.4mg Tablet',
        vals: [18, 28, 36, 6, 26, 73, 122, 0, 0, 4],
      },
      { sku: 'Vitrum Tablet', vals: [54, 30, 15, 40, 26, 134, 11, 79, 41, 50] },
    ],
  },
  {
    cls: 'Other',
    vals: [39, 30, 36, 91, 77, 418, 221, 171, 71, 78],
    bold: false,
    subRows: [] as { sku: string; vals: number[] }[],
  },
];

const SERVICE_MEASURE = [
  { branch: 'Bahawalpur', skuA: 47, skuB: 31, skuC: 31 },
  { branch: 'Faisalabad', skuA: 40, skuB: 31, skuC: 31 },
  { branch: 'Gujranwala', skuA: 40, skuB: 39, skuC: 38 },
  { branch: 'Hyderabad', skuA: 53, skuB: 46, skuC: 38 },
  { branch: 'Islamabad', skuA: 59, skuB: 50, skuC: 23 },
  { branch: 'Karachi', skuA: 54, skuB: 42, skuC: 40 },
  { branch: 'Korangi', skuA: 58, skuB: 40, skuC: 40 },
  { branch: 'Lahore', skuA: 53, skuB: 40, skuC: 38 },
  { branch: 'Mingora', skuA: 60, skuB: 40, skuC: 40 },
  { branch: 'Multan', skuA: 60, skuB: 40, skuC: 40 },
  { branch: 'Peshawar', skuA: 55, skuB: 38, skuC: 35 },
  { branch: 'Quetta', skuA: 60, skuB: 42, skuC: 38 },
];

const COVER_DAYS_CHART = [
  { class: 'A', tgt: 25, actual: 53 },
  { class: 'B', tgt: 25, actual: 51 },
  { class: 'C', tgt: 15, actual: 89 },
];

const DISPATCH_VS_ORDER = [
  { material: 'ADRONIL 3MG/3ML INJ 1s (PAK)', pct: '100%' },
  { material: 'ALDACTONE 100MG COATED TAB 10s (PAK)', pct: '100%' },
  { material: 'ALDACTONE A 25MG COATED TAB 100s (PAK)', pct: '100%' },
  { material: 'BACIPORE 48 AMP 10s (PAK)', pct: '100%' },
  { material: "BEMPICS 180MG TAB 10's (PAK)", pct: '100%' },
  { material: 'CALAN SR TAB 240MG 10s BLI (PAK)', pct: '100%' },
  { material: "CANDEREL 18MG TAB 10's (PAK)", pct: '98%' },
  { material: "CANDEREL 36MG SACHET 30's (PAK)", pct: '95%' },
  { material: "DEKTOP 30MG CAP 10's (PAK)", pct: '100%' },
  { material: "DEKTOP 60MG CAP 30's (PAK)", pct: '92%' },
  { material: "EMICURE 500MG TAB 14's (PAK)", pct: '100%' },
  { material: "GLUCOVANCE 500MG TAB 30's (PAK)", pct: '88%' },
  { material: 'HYDRASEC 30MG SACHET (PAK)', pct: '100%' },
  { material: "IMODIUM 2MG CAP 10's (PAK)", pct: '96%' },
  { material: "JANUVIA 100MG TAB 28's (PAK)", pct: '100%' },
  { material: "KETOVAIL 200MG TAB 30's (PAK)", pct: '100%' },
  { material: "LAMICTAL 100MG TAB 30's (PAK)", pct: '91%' },
  { material: "MOTILIUM 10MG TAB 30's (PAK)", pct: '100%' },
  { material: "NEXIUM 40MG TAB 14's (PAK)", pct: '100%' },
  { material: "OMNICEF 300MG CAP 10's (PAK)", pct: '94%' },
];

const WIP_DATA = [
  { material: 'CALAN SR 240MG TAB (BULK)', value: '4,461,420' },
  { material: 'CANDEREL 18MG TAB (BULK)', value: '3,956,748' },
  { material: 'CANDEREL 36MG SACHET (BULK)', value: '399,510' },
  { material: 'DEKTOP 30MG CAP (BULK)', value: '10,673,190' },
  { material: "DEKTOP 60MG CAP 30's (PAK)", value: '303,820' },
  { material: 'EMICURE 500MG TAB (BULK)', value: '8,214,500' },
  { material: 'GLUCOVANCE 500 (BULK)', value: '6,540,300' },
  { material: 'HYDRASEC SACHET (BULK)', value: '2,188,000' },
  { material: 'IMODIUM 2MG (BULK)', value: '1,920,450' },
  { material: 'JANUVIA 100MG (BULK)', value: '14,330,210' },
  { material: 'KETOVAIL 200MG (BULK)', value: '5,760,000' },
  { material: 'LAMICTAL 100MG (BULK)', value: '3,410,250' },
  { material: 'MOTILIUM 10MG (BULK)', value: '9,870,000' },
  { material: 'NEXIUM 40MG (BULK)', value: '22,440,000' },
  { material: 'OMNICEF 300MG (BULK)', value: '11,230,002' },
  { material: 'PANADOL 500MG (BULK)', value: '18,900,000' },
  { material: 'RISPERDAL 2MG (BULK)', value: '7,650,000' },
  { material: 'SEROQUEL 200MG (BULK)', value: '31,200,000' },
  { material: 'TEGRETOL 200MG (BULK)', value: '16,080,000' },
  { material: 'VERMOX 100MG (BULK)', value: '39,970,000' },
];

const RPM_DATA = [
  { material: 'Aluminium Foil 20 Micron', value: '8,240,000' },
  { material: 'Blister PVC 250 Micron', value: '6,190,000' },
  { material: 'Carton Box 200GSM (Small)', value: '3,920,000' },
  { material: 'Carton Box 200GSM (Large)', value: '5,460,000' },
  { material: 'Closure PP 28mm White', value: '1,230,500' },
  { material: 'Desiccant Silica Gel 1g', value: '980,000' },
  { material: 'HDPE Bottle 100ml', value: '4,320,000' },
  { material: 'Induction Seal Liner 38mm', value: '2,140,000' },
  { material: 'Label PP White Gloss', value: '3,680,000' },
  { material: 'Leaflet A4 60GSM', value: '1,560,000' },
  { material: 'Outer Shipper 5-Ply', value: '7,840,000' },
  { material: 'PET Bottle 60ml Amber', value: '5,120,000' },
  { material: 'Pillow Pouch Film 40Mic', value: '4,450,000' },
  { material: 'Sachet Laminate 3-Ply', value: '9,200,000' },
  { material: 'Shrink Wrap LDPE 40Mic', value: '2,670,000' },
  { material: 'Stretch Film 23 Micron', value: '1,840,000' },
  { material: 'Tamper Evident Band', value: '3,310,000' },
  { material: 'Tray PET 300Mic Clear', value: '6,920,000' },
  { material: 'Vial 10ml Clear Glass', value: '12,500,000' },
  { material: 'Vial Rubber Stopper 20mm', value: '4,780,000' },
];

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
          fontSize="1.7rem"
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
  salesRows: typeof SALES_SUMMARY;
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
          <SalesSummaryCard rows={salesRows} total={salesTotal} />
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
            <Grid templateColumns="1fr 1fr" gap={3} alignItems="start">
              <CoverDaysCard {...coverDaysRows[0]} />
              <Flex direction="column" gap={2}>
                {coverDaysRows.slice(1).map((c) => (
                  <CoverDaysCard key={c.label} {...c} />
                ))}
              </Flex>
            </Grid>
          </Box>
        </GridItem>
      </Grid>

      {/* Forecast Accuracy Charts */}
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <ChartCard colSpan={6} title="Forecast Accuracy TSCL" height="240px">
          <Flex h="100%" gap={0}>
            <Box
              w="160px"
              flexShrink={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <GaugeChart
                value={tsclAccuracy ?? 83}
                target={100}
                title="TSCL"
                subtitle="Total Supply Chain Level"
                color={clsColors.A}
                displayAchieved={tsclSalesDisplay?.achieved}
                displayTarget={tsclSalesDisplay?.target}
              />
            </Box>
            <Box w="1px" bg="gray.100" mx={3} flexShrink={0} />
            <Box flex={1} minW={0}>
              <BarChart
                data={forecastBarData.length ? forecastBarData : FORECAST_TSCL}
                xKey="classification"
                bars={
                  forecastMonths.length
                    ? forecastMonths.map((m, i) => ({
                        key: m,
                        label: m,
                        color:
                          (['#2563eb', '#06b6d4', '#10b981'] as string[])[i] ??
                          '#2563eb',
                      }))
                    : [
                        {
                          key: 'accuracy',
                          label: 'Forecast Accuracy',
                          color: '#2563eb',
                        },
                      ]
                }
                height={220}
                yTickFormatter={(v) => `${v}%`}
                labelFormatter={(v) => `${v}%`}
                showLabels
              />
            </Box>
          </Flex>
        </ChartCard>

        <ChartCard colSpan={6} title="Forecast Accuracy IBL" height="240px">
          <Flex h="100%" gap={0}>
            <Box
              w="160px"
              flexShrink={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <GaugeChart
                value={iblAccuracy ?? 78}
                target={100}
                title="IBL"
                subtitle="Item Branch Level"
                color={clsColors.B}
                displayAchieved={iblSalesDisplay?.achieved}
                displayTarget={iblSalesDisplay?.target}
              />
            </Box>
            <Box w="1px" bg="gray.100" mx={3} flexShrink={0} />
            <Box flex={1} minW={0}>
              <BarChart
                data={iblBarData.length ? iblBarData : FORECAST_IBL}
                xKey="classification"
                bars={
                  iblMonths.length
                    ? iblMonths.map((m, i) => ({
                        key: m,
                        label: m,
                        color:
                          (['#2563eb', '#06b6d4', '#10b981'] as string[])[i] ??
                          '#2563eb',
                      }))
                    : [
                        {
                          key: 'accuracy',
                          label: 'Forecast Accuracy',
                          color: '#2563eb',
                        },
                      ]
                }
                height={220}
                yTickFormatter={(v) => `${v}%`}
                labelFormatter={(v) => `${v}%`}
                showLabels
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
}: {
  inventoryDaysData: unknown;
  skusThresholdData: { class: string; above: number; below: number }[];
  pctSkusData: { class: string; pct: number }[];
  serviceMeasureData: unknown;
  tgtVsActualData: unknown;
  classification: string;
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

  const computedRows =
    invApiRows.length > 0
      ? [
          {
            cls: '∑',
            vals: avgVals(invApiRows),
            bold: true,
            subRows: [] as { sku: string; vals: number[] }[],
          },
          ...(['A', 'B', 'C', 'Other'] as const)
            .filter((c) => grouped[c]?.length)
            .map((cls) => ({
              cls,
              vals: avgVals(grouped[cls]),
              bold: false,
              subRows: grouped[cls].map((r) => ({
                sku: (r.item_desc as string) ?? '',
                vals: branchKeys.map((k) => Number(r[k] ?? 0)),
              })),
            })),
        ]
      : INV_ROWS;

  const tableHeaders =
    invApiRows.length > 0
      ? ['Class', ...INV_API_BRANCHES.map((b) => b.label.slice(0, 8))]
      : ['Class', ...INV_BRANCHES.map((b) => b.slice(0, 8))];

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
              return (
                <DataTableRow
                  key={row.cls}
                  cells={[row.cls, ...row.vals.map(String)]}
                  isTotal={row.bold}
                  cellColors={[clsColor]}
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
          title="Service Measure — SKU-A%, SKU-B%, SKU-C% by Branch"
          height="340px"
        >
          <LineChart
            variant="filled"
            data={
              serviceMeasureChartData.length > 0
                ? serviceMeasureChartData
                : SERVICE_MEASURE
            }
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
          // headerRight={
          //   <HStack gap={3} fontSize="10px" color="gray.500">
          //     <HStack gap={1}>
          //       <Box w={2} h={2} bg="#1d4ed8" borderRadius="sm" />
          //       Cover Days TGT
          //     </HStack>
          //     <HStack gap={1}>
          //       <Box w={2} h={2} bg="#06b6d4" borderRadius="sm" />
          //       Actual Cover Days
          //     </HStack>
          //   </HStack>
          // }
        >
          <BarChart
            data={
              coverDaysChartData.length > 0
                ? coverDaysChartData
                : COVER_DAYS_CHART
            }
            xKey="class"
            barSize={32}
            height={200}
            bars={[
              { key: 'tgt', label: 'Cover Days TGT', color: '#1d4ed8' },
              { key: 'actual', label: 'Actual Cover Days', color: '#06b6d4' },
            ]}
            showLabels
          />
        </ChartCard>

        <ChartCard
          colSpan={4}
          title="SKUs Against Threshold"
          height="220px"
          // headerRight={
          //   <HStack gap={3} fontSize="10px" color="gray.500">
          //     <HStack gap={1}>
          //       <Box w={2} h={2} bg="#1d4ed8" borderRadius="sm" />
          //       No. SKUs &gt; Threshold
          //     </HStack>
          //     <HStack gap={1}>
          //       <Box w={2} h={2} bg="#06b6d4" borderRadius="sm" />
          //       No. SKUs &lt; Threshold
          //     </HStack>
          //   </HStack>
          // }
        >
          <BarChart
            data={skusThresholdData}
            xKey="class"
            barSize={32}
            height={200}
            bars={[
              { key: 'above', label: 'No. SKUs > Threshold', color: '#1d4ed8' },
              { key: 'below', label: 'No. SKUs < Threshold', color: '#06b6d4' },
            ]}
            showLabels
          />
        </ChartCard>

        <ChartCard colSpan={4} title="% SKUs vs Threshold" height="220px">
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
}: {
  dispatchVsOrderData: unknown;
  wipData: unknown;
  rpmData: unknown;
}) {
  type DispatchRow = { material_name: string; delivery_pct: string };
  type WipRow = { 'item desc': string; Wip_total: string };
  type RpmRow = { materialname: string; total_value: string };
  const dispatchRows =
    (dispatchVsOrderData as { data?: DispatchRow[] })?.data ?? [];
  const wipRows = (wipData as { data?: WipRow[] })?.data ?? [];
  const rpmRows = (rpmData as { data?: RpmRow[] })?.data ?? [];
  // const wipTotal = wipRows.reduce(
  //   (sum, r) => sum + Number(r.Wip_total ?? 0),
  //   0
  // );

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      <DataTable
        title="Dispatch Vs Order"
        headerGradient={gradients.tableBlue}
        headers={['Material Name', '%']}
        pageSize={15}
        searchable={false}
      >
        {dispatchRows.length > 0
          ? dispatchRows.map((row) => {
              const pct = `${parseFloat(row.delivery_pct).toFixed(2)}%`;
              const isBelow100 = parseFloat(row.delivery_pct) < 100;
              return (
                <DataTableRow
                  key={row.material_name}
                  cells={[row.material_name, pct]}
                  cellColors={[
                    isBelow100 ? '#2563eb' : undefined,
                    isBelow100 ? '#dc2626' : '#059669',
                  ]}
                  cellWeights={[undefined, '700']}
                />
              );
            })
          : DISPATCH_VS_ORDER.map((row) => (
              <DataTableRow
                key={row.material}
                cells={[row.material, row.pct]}
                cellColors={[
                  row.pct !== '100%' ? '#2563eb' : undefined,
                  row.pct !== '100%' ? '#dc2626' : '#059669',
                ]}
                cellWeights={[undefined, '700']}
              />
            ))}
      </DataTable>

      {/* WIP */}
      <DataTable
        title="WIP"
        headerGradient={gradients.tableBlue}
        headers={['Material Name', 'WIP Value']}
        pageSize={15}
        searchable={false}
      >
        {wipRows.length > 0
          ? wipRows.map((row) => (
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
            ))
          : WIP_DATA.map((row) => (
              <DataTableRow
                key={row.material}
                cells={[row.material, row.value]}
                cellWeights={[undefined, '600']}
              />
            ))}
      </DataTable>

      {/* RPM */}
      <DataTable
        title="RPM"
        headerGradient={gradients.tableIndigo}
        headers={['Material Name', 'RPM Value']}
        pageSize={15}
        searchable={false}
      >
        {rpmRows.length > 0
          ? rpmRows.map((row) => (
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
            ))
          : RPM_DATA.map((row) => (
              <DataTableRow
                key={row.material}
                cells={[row.material, row.value]}
                cellWeights={[undefined, '600']}
              />
            ))}
      </DataTable>
    </Grid>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ScorecardDashboard() {
  const { mainTab, filters } = useAppSelector((state) => state.salesDashboard);

  const params = {
    ...(filters.classification && { classification: filters.classification }),
    ...(filters.branch && { branch: filters.branch }),
    ...(filters.sku && { sku: filters.sku }),
    ...(filters.dateFrom && { startDate: filters.dateFrom }),
    ...(filters.dateTo && { endDate: filters.dateTo }),
  };

  const { data: salesSummaryData } = useGetSalesSummary(params);
  const { data: coverDaysData } = useGetCoverDays(params);
  const { data: coverDaysDataA } = useGetCoverDays({
    ...params,
    classification: 'A',
  });
  const { data: coverDaysDataB } = useGetCoverDays({
    ...params,
    classification: 'B',
  });
  const { data: coverDaysDataC } = useGetCoverDays({
    ...params,
    classification: 'C',
  });
  const { data: forecastAccuracyMonthlyData } =
    useGetForecastAccuracyMonthly(params);
  const { data: forecastAccuracyCategoryMonthlyData } =
    useGetForecastAccuracyCategoryMonthly({
      ...params,
      date: new Date().toISOString().slice(0, 10),
    });

  const { data: forecastAccuracyYearlyData } = useGetForecastAccuracyYearly({
    ...params,
    date: new Date().toISOString().slice(0, 10),
  });
  const { data: forecastAccuracyCategoryYearlyData } =
    useGetForecastAccuracyCategoryYearly({
      ...params,
      date: new Date().toISOString().slice(0, 10),
    });

  const { data: inventoryDaysData } = useGetInventoryDays(params);
  const { data: aboveBelowThresholdDataA } = useGetAboveBelowThreshold({
    ...params,
    category: 'A',
  });
  const { data: aboveBelowThresholdDataB } = useGetAboveBelowThreshold({
    ...params,
    category: 'B',
  });
  const { data: aboveBelowThresholdDataC } = useGetAboveBelowThreshold({
    ...params,
    category: 'C',
  });
  const { data: iblVsTsclData } = useGetIblVsTscl(params);
  const { data: dispatchVsOrderData } = useGetDispatchVsOrder(params);

  const { data: wipData } = useGetWip(params);
  const { data: rpmData } = useGetRpm(params);
  const { data: serviceMeasureData } = useGetServiceMeasure(params);
  const { data: tgtVsActualData } = useGetTgtVsActual(params);

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
      : SALES_SUMMARY;

  const salesTotal = {
    sales: totalSales
      ? totalSales.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : '5,081,000',
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
  const extractThreshold = (d: unknown) =>
    (d as { data?: ThresholdRow[] })?.data?.[0];
  const skusThresholdData = [
    {
      class: 'A',
      above:
        extractThreshold(aboveBelowThresholdDataA)?.[
          'No Of SKUs > Threshold'
        ] ?? 0,
      below:
        extractThreshold(aboveBelowThresholdDataA)?.[
          'No Of SKUs < Threshold'
        ] ?? 0,
    },
    {
      class: 'B',
      above:
        extractThreshold(aboveBelowThresholdDataB)?.[
          'No Of SKUs > Threshold'
        ] ?? 0,
      below:
        extractThreshold(aboveBelowThresholdDataB)?.[
          'No Of SKUs < Threshold'
        ] ?? 0,
    },
    {
      class: 'C',
      above:
        extractThreshold(aboveBelowThresholdDataC)?.[
          'No Of SKUs > Threshold'
        ] ?? 0,
      below:
        extractThreshold(aboveBelowThresholdDataC)?.[
          'No Of SKUs < Threshold'
        ] ?? 0,
    },
  ].filter(
    (d) => !filters.classification || d.class === filters.classification
  );

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

  console.log('salesSummaryData', salesSummaryData);
  console.log('coverDaysData', coverDaysData);
  console.log('coverDaysDataA', coverDaysDataA);
  console.log('coverDaysDataB', coverDaysDataB);
  console.log('coverDaysDataC', coverDaysDataC);
  console.log('forecastAccuracyMonthlyData', forecastAccuracyMonthlyData);
  console.log('forecastAccuracyYearlyData', forecastAccuracyYearlyData);
  console.log('inventoryDaysData', inventoryDaysData);
  console.log('aboveBelowThresholdDataA', aboveBelowThresholdDataA);
  console.log('aboveBelowThresholdDataB', aboveBelowThresholdDataB);
  console.log('aboveBelowThresholdDataC', aboveBelowThresholdDataC);
  console.log(
    'forecastAccuracyCategoryMonthlyData',
    forecastAccuracyCategoryMonthlyData
  );
  console.log(
    'forecastAccuracyCategoryYearlyData',
    forecastAccuracyCategoryYearlyData
  );
  console.log('iblVsTsclData', iblVsTsclData);
  console.log('dispatchVsOrderData', dispatchVsOrderData);

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
            <Flex
              w={8}
              h={8}
              bg="blue.700"
              borderRadius="md"
              align="center"
              justify="center"
              flexShrink={0}
            >
              <Text color="white" fontWeight="900" fontSize="xs">
                SC
              </Text>
            </Flex>
            <Text
              fontWeight="700"
              fontSize="sm"
              color="gray.900"
              whiteSpace="nowrap"
            >
              SupplyChain Analytics
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
          />
        )}
        {mainTab === 'dispatchWip' && (
          <DispatchWipTab
            dispatchVsOrderData={dispatchVsOrderData}
            wipData={wipData}
            rpmData={rpmData}
          />
        )}
      </Box>
    </Flex>
  );
}
