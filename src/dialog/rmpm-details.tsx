import { Box, Dialog, Flex } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Select } from '@/components/select/Select';
import { DataTable, DataTableRow } from '@/components/data-table/DataTable';
import { gradients } from '@/constants/theme';

export interface RpmRow {
  materialname: string;
  producttype?: string;
  location_type?: 'Plant' | 'Storage Location';
  plant?: string | number;
  plantname?: string;
  storagelocation?: string | number;
  storagelocationname?: string;
  unrestricted_qty?: string;
  unrestricted_val?: string;
  restricted_qty?: string;
  restricted_val?: string;
  qualityinspection_qty?: string;
  quality_inspection_val?: string;
  blocked_qty?: string;
  blocked_val?: string;
  gr_blocked_val?: string;
  return_qty?: string;
  returns_val?: string;
  stockintransit_qty?: string;
  stock_in_transit_val?: string;
  stocktransferplant_qty?: string;
  stock_transfer_plant_val?: string;
  stocktransferstoragelocation_qty?: string;
  storage_location_val?: string;
  tiedempties_qty?: string;
  tied_empties_val?: string;
  total_qty?: string;
  total_val?: string;
}

type ViewMode = 'Unit' | 'Value';
type ProductFilter = 'All' | 'TPKG' | 'TRAW';

const COL_DEFS: {
  label: string;
  qty: keyof RpmRow | null;
  val: keyof RpmRow | null;
}[] = [
  { label: 'Unrestricted', qty: 'unrestricted_qty', val: 'unrestricted_val' },
  { label: 'Restricted', qty: 'restricted_qty', val: 'restricted_val' },
  {
    label: 'Quality Inspection',
    qty: 'qualityinspection_qty',
    val: 'quality_inspection_val',
  },
  { label: 'Blocked', qty: 'blocked_qty', val: 'blocked_val' },
  { label: 'GR Blocked', qty: null, val: 'gr_blocked_val' },
  { label: 'Returns', qty: 'return_qty', val: 'returns_val' },
  {
    label: 'Stock In Transit',
    qty: 'stockintransit_qty',
    val: 'stock_in_transit_val',
  },
  {
    label: 'Stock Transfer Plant',
    qty: 'stocktransferplant_qty',
    val: 'stock_transfer_plant_val',
  },
  {
    label: 'Stock Transfer Stor. Loc.',
    qty: 'stocktransferstoragelocation_qty',
    val: null,
  },
  { label: 'Storage Location', qty: null, val: 'storage_location_val' },
  { label: 'Tied Empties', qty: 'tiedempties_qty', val: 'tied_empties_val' },
  { label: 'Total', qty: 'total_qty', val: 'total_val' },
];

function fmt(val?: string | number) {
  return Number(val ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function buildHeaders(mode: ViewMode): string[] {
  const dynamic: string[] = [];
  for (const col of COL_DEFS) {
    if (mode === 'Unit' && col.qty) dynamic.push(col.label);
    if (mode === 'Value' && col.val) dynamic.push(col.label);
  }
  return ['Material Name', ...dynamic];
}

function buildCells(r: RpmRow, mode: ViewMode): string[] {
  const dynamic: string[] = [];
  for (const col of COL_DEFS) {
    if (mode === 'Unit' && col.qty) dynamic.push(fmt(r[col.qty] as string));
    if (mode === 'Value' && col.val) dynamic.push(fmt(r[col.val] as string));
  }
  return [r.materialname, ...dynamic];
}

function buildTotalCells(data: RpmRow[], mode: ViewMode): string[] {
  const dynamic: string[] = [];
  for (const col of COL_DEFS) {
    if (mode === 'Unit' && col.qty)
      dynamic.push(fmt(data.reduce((s, r) => s + Number(r[col.qty!] ?? 0), 0)));
    if (mode === 'Value' && col.val)
      dynamic.push(fmt(data.reduce((s, r) => s + Number(r[col.val!] ?? 0), 0)));
  }
  return ['Total', ...dynamic];
}

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <Box display="inline-flex" h="36px" flexShrink={0}>
      {options.map(({ label, value: v }, idx) => (
        <Box
          key={v}
          as="button"
          px={3}
          h="36px"
          cursor="pointer"
          fontSize="12px"
          fontWeight="700"
          bg={value === v ? 'blue.600' : 'white'}
          color={value === v ? 'white' : 'gray.600'}
          _hover={{ bg: value === v ? 'blue.600' : 'gray.50' }}
          onClick={() => onChange(v)}
          border="1px solid"
          borderColor={value === v ? 'blue.600' : 'gray.200'}
          borderLeftRadius={idx === 0 ? 'md' : 0}
          borderRightRadius={idx === options.length - 1 ? 'md' : 0}
          ml={idx > 0 ? '-1px' : 0}
          zIndex={value === v ? 1 : 0}
          position="relative"
          transition="background 0.15s, border-color 0.15s"
        >
          {label}
        </Box>
      ))}
    </Box>
  );
}

interface RmpmDetailsProps {
  open: boolean;
  data: RpmRow[];
  onClose: () => void;
}

export function RmpmDetails({ open, data, onClose }: RmpmDetailsProps) {
  const [mode, setMode] = useState<ViewMode>('Unit');
  const [productFilter, setProductFilter] = useState<ProductFilter>('All');
  const [plantFilter, setPlantFilter] = useState<string>('All');
  const [storageFilter, setStorageFilter] = useState<string>('All');

  // Defer heavy table rendering so the dialog shell paints instantly
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setReady(true));
      return () => cancelAnimationFrame(id);
    }
    setReady(false);
  }, [open]);

  const plantOptions = useMemo(() => {
    const map = new Map<string, string>();
    data.forEach((r) => {
      const val = String(r.plant ?? '');
      if (val) map.set(val, r.plantname || val);
    });
    return [
      { value: 'All', label: 'All' },
      ...[...map.entries()].map(([v, l]) => ({ value: v, label: l })),
    ];
  }, [data]);

  const storageOptions = useMemo(() => {
    const filtered =
      plantFilter === 'All'
        ? data
        : data.filter((r) => String(r.plant) === plantFilter);
    const map = new Map<string, string>();
    filtered.forEach((r) => {
      const val = String(r.storagelocation ?? '');
      if (val) map.set(val, r.storagelocationname || val);
    });
    return [
      { value: 'All', label: 'All' },
      ...[...map.entries()].map(([v, l]) => ({ value: v, label: l })),
    ];
  }, [data, plantFilter]);

  const showData = open && ready;
  const filteredData = useMemo(() => {
    if (!showData) return [];
    return data.filter((r) => {
      const matchProduct =
        productFilter === 'All' || r.producttype === productFilter;
      const matchPlant =
        plantFilter === 'All' || String(r.plant) === plantFilter;
      const matchStorage =
        storageFilter === 'All' || String(r.storagelocation) === storageFilter;
      return matchProduct && matchPlant && matchStorage;
    });
  }, [data, productFilter, plantFilter, storageFilter, showData]);

  const headers = useMemo(() => buildHeaders(mode), [mode]);
  const colAligns = useMemo(
    () =>
      headers.map((_, i) => (i === 0 ? 'left' : 'right')) as (
        | 'left'
        | 'right'
      )[],
    [headers]
  );
  const totalCells = useMemo(
    () => buildTotalCells(filteredData, mode),
    [filteredData, mode]
  );

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(d) => {
        if (!d.open) onClose();
      }}
      size="full"
      lazyMount
    >
      <Dialog.Backdrop />
      <Dialog.Positioner p={6}>
        <Dialog.Content
          borderRadius="xl"
          overflow="hidden"
          maxW="95vw"
          maxH="92vh"
          minH="0"
          display="flex"
          flexDirection="column"
        >
          {/* Header */}
          <Dialog.Header
            px={5}
            py={4}
            bg="white"
            borderBottom="1px solid"
            borderColor="gray.100"
            flexShrink={0}
          >
            <Flex align="center" justify="space-between" w="100%" gap={4}>
              <Dialog.Title
                color="gray.800"
                fontSize="16px"
                fontWeight="700"
                lineHeight="1.3"
              >
                RMPM Details
              </Dialog.Title>
              <Dialog.CloseTrigger position="relative" inset={0} asChild>
                <Box
                  as="button"
                  color="gray.500"
                  _hover={{ color: 'gray.800', bg: 'gray.100' }}
                  p={1}
                  borderRadius="md"
                  flexShrink={0}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                >
                  <FiX size={20} />
                </Box>
              </Dialog.CloseTrigger>
            </Flex>
          </Dialog.Header>
          {/* Table */}
          <Box
            flex={1}
            overflow="hidden"
            display="flex"
            flexDirection="column"
            minH="90vh"
          >
            <DataTable
              title=""
              headerGradient={gradients.tableIndigo}
              headers={headers}
              colAligns={colAligns}
              pageSize={16}
              minHeight="0"
              height="100%"
              isLoading={!ready}
              headerActions={
                <Flex gap={4} mr={'auto'}>
                  <Select
                    label="Plant"
                    placeholder="Plant"
                    value={plantFilter}
                    options={plantOptions}
                    onChange={(v) => {
                      setPlantFilter(v || 'All');
                      setStorageFilter('All');
                    }}
                    minW="150px"
                  />
                  <Select
                    label="Storage Location"
                    placeholder="Storage Location"
                    value={storageFilter}
                    options={storageOptions}
                    onChange={(v) => setStorageFilter(v || 'All')}
                    minW="150px"
                  />
                  <ToggleGroup
                    options={[
                      { label: 'All', value: 'All' },
                      { label: 'PM', value: 'TPKG' },
                      { label: 'RM', value: 'TRAW' },
                    ]}
                    value={productFilter}
                    onChange={setProductFilter}
                  />
                  <ToggleGroup
                    options={[
                      { label: 'Quantity', value: 'Unit' },
                      { label: 'Value', value: 'Value' },
                    ]}
                    value={mode}
                    onChange={setMode}
                  />
                </Flex>
              }
            >
              <DataTableRow
                pinnedTop
                cells={totalCells}
                cellWeights={Array(headers.length).fill('700')}
              />
              {filteredData.map((r, i) => (
                <DataTableRow key={i} cells={buildCells(r, mode)} />
              ))}
            </DataTable>
          </Box>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
