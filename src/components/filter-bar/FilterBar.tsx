import { useAppDispatch } from '@/app/hooks';
import { useGetFilters } from '@/api/filters';
import { DatePicker } from '@/components/date-picker';
import { Select } from '@/components/select';
import { colors } from '@/constants/theme';
import {
  resetFilters,
  setFilter,
} from '@/features/salesDashboard/salesDashboardSlice';
import { Flex, Grid, IconButton } from '@chakra-ui/react';
import { useMemo } from 'react';
import { FiX } from 'react-icons/fi';

interface Filters {
  classification: string;
  branch: string;
  sku: string;
  dateFrom: string;
  dateTo: string;
}

export interface FilterBarProps {
  initialFilters: Filters;
}

type FilterRow = {
  branch_desc: string;
  branch_code: string;
  classification: string;
  sku: string;
  sap_mapping_code: number;
};

const CLS_LABEL: Record<string, string> = {
  A: 'A — High Velocity',
  B: 'B — Medium Velocity',
  C: 'C — Low Velocity',
};

const SELECT_FILTERS: { label: string; key: keyof Filters }[] = [
  { label: 'Classification', key: 'classification' },
  { label: 'Branches', key: 'branch' },
  { label: 'SKU', key: 'sku' },
];

export function FilterBar({ initialFilters }: FilterBarProps) {
  const dispatch = useAppDispatch();
  const { data: filtersData } = useGetFilters({
    ...(initialFilters.classification && { classification: initialFilters.classification }),
    ...(initialFilters.sku && { sku: initialFilters.sku }),
  });
  const rows: FilterRow[] = (filtersData as { data?: FilterRow[] })?.data ?? [];

  const classificationOptions = useMemo(() => {
    const seen = new Set<string>();
    return rows
      .filter((r) => r.classification && !seen.has(r.classification) && seen.add(r.classification))
      .sort((a, b) => a.classification.localeCompare(b.classification))
      .map((r) => ({ value: r.classification, label: CLS_LABEL[r.classification] ?? r.classification }));
  }, [rows]);

  const branchOptions = useMemo(() => {
    const seen = new Set<string>();
    return rows
      .filter((r) => r.branch_code && !seen.has(r.branch_code) && seen.add(r.branch_code))
      .map((r) => ({ value: r.branch_code, label: r.branch_desc }));
  }, [rows]);

  const skuOptions = useMemo(() => {
    const seen = new Set<number>();
    return rows
      .filter((r) => r.sap_mapping_code && !seen.has(r.sap_mapping_code) && seen.add(r.sap_mapping_code))
      .map((r) => ({ value: String(r.sap_mapping_code), label: r.sku }));
  }, [rows]);

  const optionsMap: Record<
    'classification' | 'branch' | 'sku',
    { value: string; label: string }[]
  > = {
    classification: classificationOptions,
    branch: branchOptions,
    sku: skuOptions,
  };

  const hasActiveFilters = Object.values(initialFilters).some(Boolean);

  return (
    <Flex align="center" gap={2} w="100%">
      <Flex
        position="relative"
        bg={colors.filterBarBg}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        align="center"
        w="100%"
        py={1}
        px={2}
        zIndex={10}
        gap={3}
      >
        {/* Select filters */}
        <Grid gap={3} flex={1} templateColumns="repeat(3, 1fr)">
          {SELECT_FILTERS.map((filter) => (
            <Select
              key={filter.key}
              label={filter.label}
              value={
                initialFilters[
                  filter.key as 'classification' | 'branch' | 'sku'
                ]
              }
              options={
                optionsMap[filter.key as 'classification' | 'branch' | 'sku']
              }
              onChange={(v) =>
                dispatch(setFilter({ key: filter.key, value: v }))
              }
              isClearable
              placeholder="Select..."
            />
          ))}
        </Grid>

        {/* Date range */}
        <Flex align="center" flexShrink={0}>
          <DatePicker
            value={initialFilters.dateFrom}
            onChange={(v) => dispatch(setFilter({ key: 'dateFrom', value: v }))}
            placeholder="From"
            variant="range-start"
          />
          <DatePicker
            value={initialFilters.dateTo}
            onChange={(v) => dispatch(setFilter({ key: 'dateTo', value: v }))}
            placeholder="To"
            variant="range-end"
            minDate={initialFilters.dateFrom || undefined}
          />
        </Flex>

        {/* Clear button */}
        <IconButton
          aria-label="Clear filters"
          title="Clear all filters"
          size="sm"
          borderRadius="md"
          flexShrink={0}
          bg="white"
          border="1px solid"
          borderColor="gray.300"
          color={hasActiveFilters ? 'red.500' : 'gray.400'}
          disabled={!hasActiveFilters}
          _hover={{ borderColor: 'red.400', color: 'red.500' }}
          onClick={() => dispatch(resetFilters())}
        >
          <FiX />
        </IconButton>
      </Flex>
    </Flex>
  );
}
