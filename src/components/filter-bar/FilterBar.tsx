import { useAppDispatch } from '@/app/hooks';
import { DatePicker } from '@/components/date-picker';
import { Select } from '@/components/select';
import { colors } from '@/constants/theme';
import {
  resetFilters,
  setFilter,
} from '@/features/salesDashboard/salesDashboardSlice';
import { Flex, Grid, IconButton } from '@chakra-ui/react';
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

const CLASSIFICATION_OPTIONS = [
  { value: 'A', label: 'A — High Velocity' },
  { value: 'B', label: 'B — Medium Velocity' },
  { value: 'C', label: 'C — Low Velocity' },
  { value: 'Unclassified', label: 'Unclassified' },
];

const BRANCH_OPTIONS: { value: string; label: string }[] = [];

const SKU_OPTIONS: { value: string; label: string }[] = [];

const SELECT_FILTERS: { label: string; key: keyof Filters }[] = [
  { label: 'Classification', key: 'classification' },
  { label: 'Branches', key: 'branch' },
  { label: 'SKU', key: 'sku' },
];

export function FilterBar({ initialFilters }: FilterBarProps) {
  const dispatch = useAppDispatch();

  const optionsMap: Record<
    'classification' | 'branch' | 'sku',
    { value: string; label: string }[]
  > = {
    classification: CLASSIFICATION_OPTIONS,
    branch: BRANCH_OPTIONS,
    sku: SKU_OPTIONS,
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
