import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useGetFilterBranches, useGetFilters } from '@/api/filters';
import {
  useGetRdStatus,
  rdStatusDate,
  type RdStatusApiRow,
} from '@/api/rdStatus';
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
  distributor: string[];
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
  const isDispatchWip = mainTab === 'dispatchWip';
  // RD Status reads a different database, so it carries its own two filters
  // (branch + distributor, both drawn from the RD list) and a single as-of
  // date rather than a range.
  const isRdStatus = mainTab === 'regionalDistributor';
  const hideBranchAndSku = isDispatchWip || isRdStatus;
  const hideClassification = isDispatchWip || isRdStatus;

  // All filters staged locally — only flushed to Redux on Apply
  const [localClassification, setLocalClassification] = useState(
    initialFilters.classification
  );
  const [localBranch, setLocalBranch] = useState(initialFilters.branch);
  const [localSku, setLocalSku] = useState(initialFilters.sku);
  const [localDistributor, setLocalDistributor] = useState(
    initialFilters.distributor
  );
  const [localDateFrom, setLocalDateFrom] = useState(initialFilters.dateFrom);
  const [localDateTo, setLocalDateTo] = useState(initialFilters.dateTo);

  // Sync local state when Redux is reset externally (e.g. clear button)
  useEffect(() => {
    setLocalClassification(initialFilters.classification);
    setLocalBranch(initialFilters.branch);
    setLocalSku(initialFilters.sku);
    setLocalDistributor(initialFilters.distributor);
    setLocalDateFrom(initialFilters.dateFrom);
    setLocalDateTo(initialFilters.dateTo);
  }, [
    initialFilters.classification,
    initialFilters.branch,
    initialFilters.sku,
    initialFilters.distributor,
    initialFilters.dateFrom,
    initialFilters.dateTo,
  ]);

  const isDirty =
    localClassification !== initialFilters.classification ||
    localDateFrom !== initialFilters.dateFrom ||
    localDateTo !== initialFilters.dateTo ||
    localBranch.join(',') !== initialFilters.branch.join(',') ||
    localSku.join(',') !== initialFilters.sku.join(',') ||
    localDistributor.join(',') !== initialFilters.distributor.join(',');

  const hasActiveFilters =
    !!localClassification ||
    localBranch.length > 0 ||
    localSku.length > 0 ||
    localDistributor.length > 0 ||
    !!localDateFrom ||
    !!localDateTo;

  const handleApply = () => {
    dispatch(setFilter({ key: 'classification', value: localClassification }));
    dispatch(setFilter({ key: 'branch', value: localBranch }));
    dispatch(setFilter({ key: 'sku', value: localSku }));
    dispatch(setFilter({ key: 'distributor', value: localDistributor }));
    dispatch(setFilter({ key: 'dateFrom', value: localDateFrom }));
    dispatch(setFilter({ key: 'dateTo', value: localDateTo }));
  };

  const handleClear = () => {
    setLocalClassification('');
    setLocalBranch([]);
    setLocalSku([]);
    setLocalDistributor([]);
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
  const branchRows: BranchRow[] =
    (branchesData as { data?: BranchRow[] })?.data ?? [];

  const classificationOptions = useMemo(() => {
    const seen = new Set<string>();
    return rows
      .filter(
        (r) =>
          r.classification != null &&
          !seen.has(r.classification) &&
          seen.add(r.classification)
      )
      .sort((a, b) =>
        (a.classification as string).localeCompare(b.classification as string)
      )
      .map((r) => ({
        value: r.classification as string,
        label:
          CLS_LABEL[r.classification as string] ?? (r.classification as string),
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

  // RD branch/distributor lists come from the RD Status response itself —
  // same query key as the tab, so both share one request.
  const { data: rdStatusData } = useGetRdStatus({
    date: rdStatusDate(initialFilters.dateTo),
  });
  const rdRows: RdStatusApiRow[] =
    (rdStatusData as { data?: RdStatusApiRow[] })?.data ?? [];

  const rdBranchOptions = useMemo(() => {
    // branch_desc is a padded char column — trim before it reaches a label.
    const seen = new Map<string, string>();
    for (const r of rdRows) {
      const code = String(r.branch_code ?? '').trim();
      if (code && !seen.has(code))
        seen.set(code, r.branch_desc?.trim() || code);
    }
    return [...seen]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [rdRows]);

  const rdDistributorOptions = useMemo(() => {
    const filtered = localBranch.length
      ? rdRows.filter((r) =>
          localBranch.includes(String(r.branch_code ?? '').trim())
        )
      : rdRows;
    return filtered
      .map((r) => ({
        value: String(r.ibl_distributor_code).trim(),
        label:
          r.distributor_desc?.trim() || String(r.ibl_distributor_code).trim(),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [rdRows, localBranch]);

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
          {!hideClassification && (
            /* Classification — single select */
            <Select
              label="Classification"
              value={localClassification}
              options={classificationOptions}
              onChange={(v) => setLocalClassification(v)}
              isClearable
              placeholder="Select..."
            />
          )}

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

          {isRdStatus && (
            <>
              {/* Branch — franchise branches from the RD list */}
              <MultiSelect
                label="Branch"
                value={localBranch}
                options={rdBranchOptions}
                onChange={(v) => {
                  setLocalBranch(v);
                  // Distributors are scoped to the chosen branches — drop any
                  // selection that no longer belongs to one.
                  setLocalDistributor((prev) =>
                    v.length === 0
                      ? prev
                      : prev.filter((code) =>
                          rdRows.some(
                            (r) =>
                              String(r.ibl_distributor_code).trim() === code &&
                              v.includes(String(r.branch_code ?? '').trim())
                          )
                        )
                  );
                }}
                isClearable
                placeholder="Select..."
              />

              {/* Distributor — multi select */}
              <MultiSelect
                label="Distributor"
                value={localDistributor}
                options={rdDistributorOptions}
                onChange={(v) => setLocalDistributor(v)}
                isClearable
                placeholder="Select..."
              />
            </>
          )}
        </Grid>

        <Flex align="center" flexShrink={0}>
          {/* RD Status is a position on one date, not a range — one picker. */}
          {!isRdStatus && (
            <DatePicker
              value={localDateFrom}
              onChange={setLocalDateFrom}
              placeholder="From"
              variant="range-start"
            />
          )}
          <DatePicker
            value={localDateTo}
            onChange={setLocalDateTo}
            placeholder={isRdStatus ? 'As of' : 'To'}
            variant={isRdStatus ? 'outline' : 'range-end'}
            minDate={isRdStatus ? undefined : localDateFrom || undefined}
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
