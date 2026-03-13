import { useAppSelector } from '@/app/hooks';
import { ChartCard } from '@/components/chart-card';
import { BarChart } from '@/components/charts';
import { DataTable, DataTableRow } from '@/components/data-table';
import { FilterBar } from '@/components/filter-bar';
import { HeaderActions } from '@/components/header-actions';
import { colors, gradients } from '@/constants/theme';
import { Box, Flex, Grid, GridItem, HStack, Text } from '@chakra-ui/react';

// ─── Static Data ─────────────────────────────────────────────────────────────

const BENCHMARKS = [
  {
    cls: 'A',
    days: 90,
    bm: 92,
    rd: 99,
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
  {
    cls: 'B',
    days: 78,
    bm: 80,
    rd: 95,
    color: '#059669',
    bg: '#f0fdf4',
    border: '#a7f3d0',
  },
  {
    cls: 'C',
    days: 65,
    bm: 70,
    rd: 90,
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
  },
];

const SALES_SUMMARY = [
  { label: 'A  —  High Velocity', sales: '2,450,000', pct: '+48.2%', up: true },
  {
    label: 'B  —  Medium Velocity',
    sales: '1,830,000',
    pct: '+36.1%',
    up: true,
  },
  { label: 'C  —  Low Velocity', sales: '793,000', pct: '▼15.6%', up: false },
  { label: '—  Unclassified', sales: '8,000', pct: '−0.2%', up: null },
];

const COVER_DAYS = [
  {
    label: 'Total Cover Days',
    value: 54,
    inv: '54,188',
    color: '#1d4ed8',
    bg: '#eff6ff',
    dot: '=',
  },
  {
    label: 'A – Cover Days',
    value: 28,
    inv: '28,408',
    color: '#2563eb',
    bg: '#dbeafe',
    dot: '●',
  },
  {
    label: 'B – Cover Days',
    value: 18,
    inv: '13,608',
    color: '#d97706',
    bg: '#fef3c7',
    dot: '●',
  },
  {
    label: 'C – Cover Days',
    value: 8,
    inv: '7,188',
    color: '#7c3aed',
    bg: '#ede9fe',
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

const INV_BRANCHES = [
  'Bahawalpur',
  'Faisalabad',
  'Gujranwala',
  'Hyderabad',
  'Islamabad',
  'Karachi',
  'Korangi',
  'Lahore',
  'Mingora',
  'Multan',
];

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

const SKUS_THRESHOLD = [
  { class: 'A', above: 7, below: 9 },
  { class: 'B', above: 20, below: 22 },
  { class: 'C', above: 106, below: 181 },
];

const PCT_SKUS = [
  { class: 'A', pct: 100 },
  { class: 'B', pct: 100 },
  { class: 'C', pct: 100 },
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
  bm,
  rd,
  color,
  bg,
  border,
}: (typeof BENCHMARKS)[0]) {
  return (
    <Flex
      flex={1}
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="xl"
      p={2}
      align="center"
      justify="space-between"
      minW={0}
      gap={2}
    >
      <Flex
        w={8}
        h={8}
        borderRadius="full"
        bg={color}
        color="white"
        align="center"
        justify="center"
        fontWeight="900"
        fontSize="sm"
        flexShrink={0}
      >
        {cls}
      </Flex>
      <Flex grow="1" direction={'column'}>
        <Text
          fontSize="10px"
          fontWeight="700"
          color={color}
          textTransform="uppercase"
          letterSpacing="widest"
        >
          Days Benchmark
        </Text>
        <HStack gap={4} mt={1}>
          <Text fontSize="sm" fontWeight="800" color={color}>
            Days: {days}
          </Text>
          <Text fontSize="sm" fontWeight="600" color="gray.500">
            BM: {bm}
          </Text>
          <Text fontSize="sm" fontWeight="600" color="gray.500">
            RD: {rd}%
          </Text>
        </HStack>
      </Flex>
    </Flex>
  );
}

function CoverDaysCard({
  label,
  value,
  inv,
  color,
}: (typeof COVER_DAYS)[0]) {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      p={4}
      border="1px solid"
      borderColor="gray.100"
      boxShadow="sm"
      h="full"
      position="relative"
      overflow="hidden"
    >
      {/* colored top accent bar */}
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
        fontSize="10px"
        fontWeight="700"
        color="gray.400"
        textTransform="uppercase"
        letterSpacing="widest"
        mt={1}
      >
        {label}
      </Text>

      <Text fontSize="3xl" fontWeight="900" color={color} lineHeight="1.1" mt={2}>
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

function SupplyChainTab() {
  return (
    <Flex direction="column" gap={4}>
      <HStack gap={3} align="stretch">
        {BENCHMARKS.map((b) => (
          <BenchmarkBanner key={b.cls} {...b} />
        ))}
      </HStack>

      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem colSpan={{ base: 12, lg: 5 }}>
          <Grid
            templateColumns="repeat(2, 1fr)"
            templateRows="repeat(2, 1fr)"
            gap={3}
            h="full"
          >
            {COVER_DAYS.map((c) => (
              <GridItem key={c.label}>
                <CoverDaysCard {...c} />
              </GridItem>
            ))}
          </Grid>
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 7 }}>
          <DataTable
            title="Sales Summary"
            headerGradient={gradients.tableBlue}
            headers={['Classification', 'Sales (SAR)', '%']}
            searchable={false}
          >
            {SALES_SUMMARY.map((row) => (
              <DataTableRow
                key={row.label}
                cells={[row.label, row.sales, row.pct]}
                cellColors={[
                  undefined,
                  undefined,
                  row.up === true
                    ? '#059669'
                    : row.up === false
                      ? '#dc2626'
                      : '#64748b',
                ]}
                cellWeights={[undefined, '600', '700']}
              />
            ))}
            <DataTableRow
              cells={['Σ Total', '5,081,000', '▲100%']}
              isTotal
              cellColors={[undefined, undefined, '#059669']}
              cellWeights={['800', '800', '800']}
            />
          </DataTable>
        </GridItem>
      </Grid>

      {/* Forecast Accuracy Charts */}
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <ChartCard
          colSpan={6}
          title="Forecast Accuracy TSCL — By Classification"
          headerRight={
            <Text fontSize="11px" color="gray.400">
              Jan – Mar 2025
            </Text>
          }
          height="240px"
        >
          <BarChart
            data={FORECAST_TSCL}
            xKey="classification"
            bars={[
              { key: 'Jan', label: 'Jan 2025', color: '#2563eb' },
              { key: 'Feb', label: 'Feb 2025', color: '#06b6d4' },
              { key: 'Mar', label: 'Mar 2025', color: '#10b981' },
            ]}
            height={220}
            yTickFormatter={(v) => `${v}%`}
            labelFormatter={(v) => `${v}%`}
            showLabels
          />
        </ChartCard>

        <ChartCard
          colSpan={6}
          title="Forecast Accuracy IBL — By Classification"
          headerRight={
            <Text fontSize="11px" color="gray.400">
              Jan – Mar 2025
            </Text>
          }
          height="240px"
        >
          <BarChart
            data={FORECAST_IBL}
            xKey="classification"
            bars={[
              { key: 'Jan', label: 'Jan 2025', color: '#2563eb' },
              { key: 'Feb', label: 'Feb 2025', color: '#06b6d4' },
              { key: 'Mar', label: 'Mar 2025', color: '#10b981' },
            ]}
            height={220}
            yTickFormatter={(v) => `${v}%`}
            labelFormatter={(v) => `${v}%`}
            showLabels
          />
        </ChartCard>
      </Grid>
    </Flex>
  );
}

// ─── Tab: Service Measure (Inventory & Service) ────────────────────────────────

function ServiceMeasureTab() {
  return (
    <Flex direction="column" gap={4}>
      {/* Inventory Days + Service Measure Chart */}
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem colSpan={{ base: 12, lg: 6 }}>
          <DataTable
            title="Inventory Days"
            headerGradient={gradients.tableBlue}
            headers={['Class', ...INV_BRANCHES.map((b) => b.slice(0, 8))]}
            searchable={false}
            // collapsible
            rowCollapsible
            maxHeight="340px"
          >
            {INV_ROWS.map((row) => (
              <DataTableRow
                key={row.cls}
                cells={[row.cls, ...row.vals.map(String)]}
                isTotal={row.bold}
                subRows={row.subRows.map((s) => ({
                  cells: [s.sku, ...s.vals.map(String)],
                }))}
              />
            ))}
          </DataTable>
        </GridItem>

        <ChartCard
          colSpan={6}
          title="Service Measure — SKU-A%, SKU-B%, SKU-C% by Branch"
          height="340px"
        >
          <BarChart
            data={SERVICE_MEASURE}
            xKey="branch"
            bars={[
              { key: 'skuA', label: 'SKU-A%', color: '#06b6d4' },
              { key: 'skuB', label: 'SKU-B%', color: '#f59e0b' },
              { key: 'skuC', label: 'SKU-C%', color: '#10b981' },
            ]}
            // variant="stacked-bar"
            height={310}
            yTickFormatter={(v) => `${v}%`}
          />
        </ChartCard>
      </Grid>

      {/* Bottom charts row */}
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <ChartCard
          colSpan={4}
          title="Cover Days TGT vs Actual"
          height="220px"
          headerRight={
            <HStack gap={3} fontSize="10px" color="gray.500">
              <HStack gap={1}>
                <Box w={2} h={2} bg="#1d4ed8" borderRadius="sm" />
                Cover Days TGT
              </HStack>
              <HStack gap={1}>
                <Box w={2} h={2} bg="#06b6d4" borderRadius="sm" />
                Actual Cover Days
              </HStack>
            </HStack>
          }
        >
          <BarChart
            data={COVER_DAYS_CHART}
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
          headerRight={
            <HStack gap={3} fontSize="10px" color="gray.500">
              <HStack gap={1}>
                <Box w={2} h={2} bg="#1d4ed8" borderRadius="sm" />
                No. SKUs &gt; Threshold
              </HStack>
              <HStack gap={1}>
                <Box w={2} h={2} bg="#06b6d4" borderRadius="sm" />
                No. SKUs &lt; Threshold
              </HStack>
            </HStack>
          }
        >
          <BarChart
            data={SKUS_THRESHOLD}
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
            data={PCT_SKUS}
            xKey="class"
            barSize={48}
            height={200}
            bars={[
              {
                key: 'pct',
                label: '% SKUs',
                color: '#1d4ed8',
                cellColor: (e) =>
                  String(e.class) === 'A'
                    ? '#1d4ed8'
                    : String(e.class) === 'B'
                      ? '#06b6d4'
                      : '#d97706',
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

// ─── Tab: Dispatch, WIP & RPM ─────────────────────────────────────────────────

function DispatchWipTab() {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      {/* Dispatch Vs Order */}
      <DataTable
        title="Dispatch Vs Order"
        headerGradient={gradients.tableBlue}
        headers={['Material Name', '%']}
        pageSize={25}
        searchable={false}
      >
        {DISPATCH_VS_ORDER.map((row) => (
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
        pageSize={25}
        searchable={false}
      >
        {WIP_DATA.map((row) => (
          <DataTableRow
            key={row.material}
            cells={[row.material, row.value]}
            cellWeights={[undefined, '600']}
          />
        ))}
        <DataTableRow
          cells={['Total', '310,498,800']}
          isTotal
          cellWeights={['700', '700']}
        />
      </DataTable>

      {/* RPM */}
      <DataTable
        title="RPM"
        headerGradient={gradients.tableIndigo}
        headers={['Material Name', 'RPM Value']}
        pageSize={25}
        searchable={false}
      >
        {RPM_DATA.map((row) => (
          <DataTableRow
            key={row.material}
            cells={[row.material, row.value]}
            cellWeights={[undefined, '600']}
          />
        ))}
        <DataTableRow
          cells={['Total', '184,320,500']}
          isTotal
          cellWeights={['700', '700']}
        />
      </DataTable>
    </Grid>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ScorecardDashboard() {
  const { mainTab, filters } = useAppSelector((state) => state.salesDashboard);

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
          <HStack flexShrink={0} gap={2}>
            <Box w="1px" h={4} bg="gray.200" />
            <Text
              fontSize="xs"
              fontWeight="600"
              color="gray.500"
              whiteSpace="nowrap"
            >
              Q1 2025 · Jan — Mar
            </Text>
          </HStack>
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
        {mainTab === 'supplyChain' && <SupplyChainTab />}
        {mainTab === 'serviceMeasure' && <ServiceMeasureTab />}
        {mainTab === 'dispatchWip' && <DispatchWipTab />}
      </Box>
    </Flex>
  );
}
