import { Box, Flex, Grid, Skeleton, Text } from '@chakra-ui/react';
import { FiArchive, FiLayers, FiPackage } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { DataTable, DataTableRow } from '@/components/data-table';
import { gradients } from '@/constants/theme';

// ─── Column / box labels ────────────────────────────────────────────────────
// Read off the hand sketch — adjust these two lists to rename anything; the
// table body and the export follow them automatically.
const COLUMNS = [
  'RD Name',
  'Current Stock in Hand',
  'Previous Stock in Hand',
  'Total',
  'Previous Days Gone',
] as const;

const COL_ALIGNS: ('left' | 'right' | 'center')[] = [
  'left',
  'right',
  'right',
  'right',
  'right',
];

export interface RegionalDistributorRow {
  rdName: string;
  currentStockInHand: number | string;
  previousStockInHand: number | string;
  previousDaysGone: number | string;
}

// The two stock columns are mutually exclusive: an RD that uploaded for the
// selected period carries its qty in `currentStockInHand` (previous = 0, no
// days gone). An RD that did not upload carries its last known qty in
// `previousStockInHand`, and `previousDaysGone` is how old that upload is.
// Placeholder data so the tab reads like the real thing until the endpoint
// lands — drop this once `rows` is wired to the API.
const DUMMY_ROWS: RegionalDistributorRow[] = [
  {
    rdName: 'Al-Rehman Distributors — Karachi',
    currentStockInHand: 18450,
    previousStockInHand: 0,
    previousDaysGone: 0,
  },
  {
    rdName: 'Bilal Traders — Lahore',
    currentStockInHand: 0,
    previousStockInHand: 14110,
    previousDaysGone: 4,
  },
  {
    rdName: 'Chughtai Enterprises — Faisalabad',
    currentStockInHand: 9640,
    previousStockInHand: 0,
    previousDaysGone: 0,
  },
  {
    rdName: 'Dawn Pharma — Islamabad',
    currentStockInHand: 0,
    previousStockInHand: 9450,
    previousDaysGone: 12,
  },
  {
    rdName: 'Eastern Medico — Multan',
    currentStockInHand: 6120,
    previousStockInHand: 0,
    previousDaysGone: 0,
  },
  {
    rdName: 'Frontier Agencies — Peshawar',
    currentStockInHand: 5480,
    previousStockInHand: 0,
    previousDaysGone: 0,
  },
  {
    rdName: 'Gujranwala Medical Store',
    currentStockInHand: 0,
    previousStockInHand: 5220,
    previousDaysGone: 2,
  },
  {
    rdName: 'Hyder Distribution — Hyderabad',
    currentStockInHand: 3970,
    previousStockInHand: 0,
    previousDaysGone: 0,
  },
  {
    rdName: 'Indus Healthcare — Sukkur',
    currentStockInHand: 0,
    previousStockInHand: 3560,
    previousDaysGone: 28,
  },
  {
    rdName: 'Quetta Pharma Link',
    currentStockInHand: 1760,
    previousStockInHand: 0,
    previousDaysGone: 0,
  },
];

// Card palette — accent only carries the icon tile and the badge, so the three
// cards stay a matched set of plain white panels.
const CURRENT_ACCENT = '#2563eb';
const CURRENT_TINT = '#eff6ff';
const PREVIOUS_ACCENT = '#0891b2';
const PREVIOUS_TINT = '#ecfeff';
const TOTAL_ACCENT = '#ea580c';
const TOTAL_TINT = '#fff7ed';

const pct = (part: number, whole: number) =>
  whole > 0 ? (part / whole) * 100 : 0;

interface StatCardProps {
  label: string;
  value: string;
  caption: string;
  badge: string;
  accent: string;
  tint: string;
  icon: IconType;
  isLoading?: boolean;
}

function StatCard({
  label,
  value,
  caption,
  badge,
  accent,
  tint,
  icon: Icon,
  isLoading = false,
}: StatCardProps) {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      h="full"
      px={4}
      py={3.5}
      transition="box-shadow 0.2s"
      _hover={{ boxShadow: 'md' }}
    >
      <Flex direction="column" gap={3}>
        <Flex align="center" gap={2.5}>
          <Flex
            w="34px"
            h="34px"
            borderRadius="10px"
            bg={tint}
            color={accent}
            align="center"
            justify="center"
            fontSize="17px"
            flexShrink={0}
          >
            <Icon />
          </Flex>
          <Text
            fontSize="11px"
            fontWeight="700"
            color="gray.500"
            textTransform="uppercase"
            letterSpacing="0.06em"
            lineHeight="1.3"
          >
            {label}
          </Text>
        </Flex>

        <Flex align="flex-end" justify="space-between" gap={3}>
          {isLoading ? (
            <Skeleton height="30px" width="55%" borderRadius="sm" />
          ) : (
            <Text
              fontSize="2rem"
              fontWeight="800"
              color="gray.800"
              lineHeight="1"
              letterSpacing="-0.02em"
            >
              {value}
            </Text>
          )}
          {!isLoading && (
            <Box px={2} py="2px" borderRadius="full" bg={tint} flexShrink={0}>
              <Text fontSize="11px" fontWeight="700" color={accent}>
                {badge}
              </Text>
            </Box>
          )}
        </Flex>

        <Text fontSize="11px" fontWeight="600" color="gray.500">
          {caption}
        </Text>
      </Flex>
    </Box>
  );
}

const fmt = (v: number | string | null | undefined): string => {
  if (v === null || v === undefined || v === '') return '—';
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

// Only one of the two stock columns is populated per row, so a zero is "not
// applicable here" rather than a real quantity — show a dash instead.
const fmtOptional = (v: number | string | null | undefined): string => {
  const n = Number(v);
  if (!Number.isNaN(n) && n === 0) return '—';
  return fmt(v);
};

// Age of the carried-over upload. Green when the RD reported for this period
// (nothing gone by), amber once it starts ageing, red past a week.
const daysGoneColor = (days: number): string | undefined => {
  if (days <= 0) return undefined;
  if (days <= 7) return '#b45309';
  return '#dc2626';
};

export interface RegionalDistributorTabProps {
  rows?: RegionalDistributorRow[];
  isLoading?: boolean;
}

export function RegionalDistributorTab({
  rows = DUMMY_ROWS,
  isLoading = false,
}: RegionalDistributorTabProps) {
  const sum = (key: keyof RegionalDistributorRow) =>
    rows.reduce((acc, r) => acc + (Number(r[key]) || 0), 0);

  const totalCurrent = sum('currentStockInHand');
  const totalPrevious = sum('previousStockInHand');
  const grandTotal = totalCurrent + totalPrevious;

  // An RD sits on exactly one side: it uploaded for this period, or it is
  // still carrying its previous figure.
  const reportedCount = rows.filter(
    (r) => (Number(r.currentStockInHand) || 0) > 0
  ).length;
  const carriedCount = rows.filter(
    (r) => (Number(r.previousStockInHand) || 0) > 0
  ).length;

  const currentShare = pct(totalCurrent, grandTotal);
  const previousShare = pct(totalPrevious, grandTotal);

  return (
    <Flex direction="column" gap={4}>
      {/* ── Three summary boxes ── */}
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
        gap={4}
        alignItems="stretch"
      >
        <StatCard
          label="Total Current Stock in Hand"
          value={fmt(totalCurrent)}
          caption={`${reportedCount} RD${reportedCount === 1 ? '' : 's'} uploaded this period`}
          badge={`${currentShare.toFixed(1)}% of total`}
          accent={CURRENT_ACCENT}
          tint={CURRENT_TINT}
          icon={FiPackage}
          isLoading={isLoading}
        />
        <StatCard
          label="Total Previous Stock in Hand"
          value={fmt(totalPrevious)}
          caption={`${carriedCount} RD${carriedCount === 1 ? '' : 's'} carrying an older upload`}
          badge={`${previousShare.toFixed(1)}% of total`}
          accent={PREVIOUS_ACCENT}
          tint={PREVIOUS_TINT}
          icon={FiArchive}
          isLoading={isLoading}
        />
        <StatCard
          label="Total Stock in Hand"
          value={fmt(grandTotal)}
          caption="Current + previous stock in hand"
          badge={`${rows.length} distributor${rows.length === 1 ? '' : 's'}`}
          accent={TOTAL_ACCENT}
          tint={TOTAL_TINT}
          icon={FiLayers}
          isLoading={isLoading}
        />
      </Grid>

      {/* ── Detail table ── */}
      <DataTable
        title="RD Status"
        headerGradient={gradients.tableBlue}
        headers={[...COLUMNS]}
        colAligns={COL_ALIGNS}
        isLoading={isLoading}
        pageSize={15}
        maxHeight="calc(100vh - 420px)"
      >
        {rows.map((row, i) => {
          const current = Number(row.currentStockInHand) || 0;
          const previous = Number(row.previousStockInHand) || 0;
          const daysGone = Number(row.previousDaysGone) || 0;
          return (
            <DataTableRow
              key={i}
              cells={[
                String(row.rdName ?? '—'),
                fmtOptional(current),
                fmtOptional(previous),
                fmt(current + previous),
                daysGone > 0 ? `${fmt(daysGone)} d` : '—',
              ]}
              cellColors={[
                undefined,
                undefined,
                undefined,
                undefined,
                daysGoneColor(daysGone),
              ]}
              cellWeights={[
                undefined,
                undefined,
                undefined,
                '600',
                daysGone > 0 ? '700' : undefined,
              ]}
            />
          );
        })}
        {rows.length > 0 && (
          <DataTableRow
            isTotal
            cells={[
              'Total',
              fmt(totalCurrent),
              fmt(totalPrevious),
              fmt(grandTotal),
              '',
            ]}
          />
        )}
      </DataTable>
    </Flex>
  );
}
