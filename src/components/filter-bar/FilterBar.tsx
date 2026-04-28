import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useGetFilterBranches, useGetFilters } from '@/api/filters';
import { DatePicker } from '@/components/date-picker';
import { Select } from '@/components/select';
import { MultiSelect } from '@/components/select/MultiSelect';
import { colors } from '@/constants/theme';
import {
  resetFilters,
  setFilter,
} from '@/features/salesDashboard/salesDashboardSlice';
import { Button, Flex, Grid } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';

interface Filters {
  classification: string;
  branch: string[];
  sku: string[];
  dateFrom: string;
  dateTo: string;
}

export interface FilterBarProps {
  initialFilters: Filters;
}

type FilterRow = {
  item_code?: string;
  item_description?: string;
  sap_code?: string;
  item_desc?: string;
  classification: string | null;
};

const CLS_LABEL: Record<string, string> = {
  A: 'A',
  B: 'B',
  C: 'C',
};

export function FilterBar({ initialFilters }: FilterBarProps) {
  const dispatch = useAppDispatch();
  const mainTab = useAppSelector((state) => state.salesDashboard.mainTab);
  const hideBranchAndSku = mainTab === 'dispatchWip';

  // All filters staged locally — only flushed to Redux on Apply
  const [localClassification, setLocalClassification] = useState(
    initialFilters.classification
  );
  const [localBranch, setLocalBranch] = useState(initialFilters.branch);
  const [localSku, setLocalSku] = useState(initialFilters.sku);
  const [localDateFrom, setLocalDateFrom] = useState(initialFilters.dateFrom);
  const [localDateTo, setLocalDateTo] = useState(initialFilters.dateTo);

  // Sync local state when Redux is reset externally (e.g. clear button)
  useEffect(() => {
    setLocalClassification(initialFilters.classification);
    setLocalBranch(initialFilters.branch);
    setLocalSku(initialFilters.sku);
    setLocalDateFrom(initialFilters.dateFrom);
    setLocalDateTo(initialFilters.dateTo);
  }, [
    initialFilters.classification,
    initialFilters.branch,
    initialFilters.sku,
    initialFilters.dateFrom,
    initialFilters.dateTo,
  ]);

  const isDirty =
    localClassification !== initialFilters.classification ||
    localDateFrom !== initialFilters.dateFrom ||
    localDateTo !== initialFilters.dateTo ||
    localBranch.join(',') !== initialFilters.branch.join(',') ||
    localSku.join(',') !== initialFilters.sku.join(',');

  const hasActiveFilters =
    !!localClassification ||
    localBranch.length > 0 ||
    localSku.length > 0 ||
    !!localDateFrom ||
    !!localDateTo;

  const handleApply = () => {
    dispatch(setFilter({ key: 'classification', value: localClassification }));
    dispatch(setFilter({ key: 'branch', value: localBranch }));
    dispatch(setFilter({ key: 'sku', value: localSku }));
    dispatch(setFilter({ key: 'dateFrom', value: localDateFrom }));
    dispatch(setFilter({ key: 'dateTo', value: localDateTo }));
  };

  const handleClear = () => {
    setLocalClassification('');
    setLocalBranch([]);
    setLocalSku([]);
    setLocalDateFrom('');
    setLocalDateTo('');
    dispatch(resetFilters());
  };

  const { data: filtersData } = useGetFilters({});
  const rows: FilterRow[] = (filtersData as { data?: FilterRow[] })?.data ?? [];

  const { data: branchesData } = useGetFilterBranches({});
  type BranchRow = {
    branch_id?: string;
    branch_desc?: string;
    sale_loc?: string;
    sale_loc_desc?: string;
  };
  const branchRows: BranchRow[] = (branchesData as { data?: BranchRow[] })?.data ?? [];

  const classificationOptions = useMemo(() => {
    const seen = new Set<string>();
    return rows
      .filter(
        (r) =>
          r.classification != null &&
          !seen.has(r.classification) &&
          seen.add(r.classification)
      )
      .sort((a, b) => (a.classification as string).localeCompare(b.classification as string))
      .map((r) => ({
        value: r.classification as string,
        label: CLS_LABEL[r.classification as string] ?? (r.classification as string),
      }));
  }, [rows]);

  const branchOptions = useMemo(
    () =>
      branchRows.map((r) => ({
        value: r.branch_id ?? r.sale_loc ?? '',
        label: r.branch_desc ?? r.sale_loc_desc ?? '',
      })),
    [branchRows]
  );

  const skuOptions = useMemo(() => {
    const seen = new Set<string>();
    return rows
      .map((r) => ({
        code: r.item_code ?? r.sap_code ?? '',
        description: r.item_description ?? r.item_desc ?? '',
        classification: r.classification,
      }))
      .filter(
        (r) =>
          r.code &&
          (!localClassification || r.classification === localClassification) &&
          !seen.has(r.code) &&
          seen.add(r.code)
      )
      .map((r) => ({ value: r.code, label: r.description }));
  }, [rows, localClassification]);

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
        flexWrap={{ base: 'wrap', xl: 'nowrap' }}
      >
        <Grid
          gap={3}
          flex={{ base: '1 0 100%', xl: 1 }}
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
        >
          {/* Classification — single select */}
          <Select
            label="Classification"
            value={localClassification}
            options={classificationOptions}
            onChange={(v) => setLocalClassification(v)}
            isClearable
            placeholder="Select..."
          />

          {!hideBranchAndSku && (
            <>
              {/* SKU — multi select */}
              <MultiSelect
                label="SKU"
                value={localSku}
                options={skuOptions}
                onChange={(v) => setLocalSku(v)}
                isClearable
                placeholder="Select..."
              />

              {/* Branches — multi select */}
              <MultiSelect
                label="Branches"
                value={localBranch}
                options={branchOptions}
                onChange={(v) => setLocalBranch(v)}
                isClearable
                placeholder="Select..."
              />
            </>
          )}
        </Grid>

        <Flex align="center" flexShrink={0}>
          <DatePicker
            value={localDateFrom}
            onChange={setLocalDateFrom}
            placeholder="From"
            variant="range-start"
          />
          <DatePicker
            value={localDateTo}
            onChange={setLocalDateTo}
            placeholder="To"
            variant="range-end"
            minDate={localDateFrom || undefined}
          />
        </Flex>

        <Flex align="center" gap={2} flexShrink={0}>
          <Button
            size="sm"
            borderRadius="md"
            bg={isDirty ? 'blue.500' : 'white'}
            color={isDirty ? 'white' : 'gray.400'}
            border="1px solid"
            borderColor={isDirty ? 'blue.500' : 'gray.300'}
            disabled={!isDirty}
            _hover={{ bg: 'blue.600', color: 'white', borderColor: 'blue.600' }}
            onClick={handleApply}
          >
            Apply
          </Button>
          <Button
            size="sm"
            borderRadius="md"
            bg="white"
            border="1px solid"
            borderColor={hasActiveFilters ? 'red.400' : 'gray.300'}
            color={hasActiveFilters ? 'red.500' : 'gray.400'}
            disabled={!hasActiveFilters}
            _hover={{ borderColor: 'red.400', color: 'red.500' }}
            onClick={handleClear}
          >
            Clear
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
