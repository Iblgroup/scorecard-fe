import { Box, Dialog, Flex } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Select } from '@/components/select/Select';
import { MultiSelect } from '@/components/select/MultiSelect';
import { DataTable, DataTableRow } from '@/components/data-table/DataTable';
import { gradients } from '@/constants/theme';

const MATERIAL_TYPE_OPTIONS = [
  { value: 'TSCL -  Toll-In Bulk', label: 'TSCL -  Toll-In Bulk' },
  { value: 'HOTC - Mfg Finished Goods', label: 'HOTC - Mfg Finished Goods' },
  { value: 'TSCL - Semi Finished', label: 'TSCL - Semi Finished' },
  { value: 'TSCL - Mfg Finished Goods', label: 'TSCL - Mfg Finished Goods' },
  { value: 'TSCL - Export FG', label: 'TSCL - Export FG' },
];

export interface WipDetailRow {
  'Material Name': string;
  Quantity: number;
  'WIP Value': number;
  good_received_qty?: number;
  item_qty?: number;
  material_type_description?: string;
  order_number?: string;
  plant?: string | number;
  plnt_desc?: string;
  storage_loc?: string | number;
  storage_loc_desc?: string;
}

function fmt(val?: string | number, frac = 0) {
  return Number(val ?? 0).toLocaleString('en-US', {
    maximumFractionDigits: frac,
  });
}

const buildHeaders = (qtyLabel: string) => [
  'Material Name',
  'Material Type',
  'Order number',
  'Plant',
  'Storage Location',
  'Process Item Qty',
  'Good Received Qty',
  qtyLabel,
  'WIP Value',
];

const COL_ALIGNS: ('left' | 'right' | 'center')[] = [
  'left',
  'left',
  'left',
  'left',
  'left',
  'right',
  'right',
  'right',
  'right',
];

const COL_WIDTHS: (string | undefined)[] = [
  undefined, // Material Name
  undefined, // Material Type
  '140px',   // Order #
  undefined, // Plant
  undefined, // Storage Location
  '150px',   // Process / Item Qty
  '160px',   // Good Received Qty
  '150px',   // Variance / WIP Qty
  '150px',   // WIP Value
];

function buildCells(r: WipDetailRow): string[] {
  return [
    r['Material Name'],
    r.material_type_description ?? '-',
    r.order_number ?? '-',
    r.plnt_desc ?? String(r.plant ?? '-'),
    r.storage_loc_desc ?? String(r.storage_loc ?? '-'),
    fmt(r.item_qty),
    fmt(r.good_received_qty),
    fmt(r.Quantity),
    fmt(r['WIP Value']),
  ];
}

function buildTotalCells(data: WipDetailRow[]): string[] {
  return [
    'Total',
    '',
    '',
    '',
    '',
    fmt(data.reduce((s, r) => s + Number(r.item_qty ?? 0), 0)),
    fmt(data.reduce((s, r) => s + Number(r.good_received_qty ?? 0), 0)),
    fmt(data.reduce((s, r) => s + Number(r.Quantity ?? 0), 0)),
    fmt(data.reduce((s, r) => s + Number(r['WIP Value'] ?? 0), 0)),
  ];
}

interface WipDetailsProps {
  open: boolean;
  data: WipDetailRow[];
  onClose: () => void;
}

export function WipDetails({ open, data, onClose }: WipDetailsProps) {
  const [materialTypeFilter, setMaterialTypeFilter] = useState<string[]>([]);
  const [plantFilter, setPlantFilter] = useState<string>('All');
  const [storageFilter, setStorageFilter] = useState<string>('All');
  const [wipStatusFilter, setWipStatusFilter] = useState<string>('All');

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
      if (val) map.set(val, r.plnt_desc || val);
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
    const set = new Set<string>();
    filtered.forEach((r) => {
      const desc = r.storage_loc_desc ?? String(r.storage_loc ?? '');
      if (desc) set.add(desc);
    });
    return [
      { value: 'All', label: 'All' },
      ...[...set].sort().map((v) => ({ value: v, label: v })),
    ];
  }, [data, plantFilter]);

  const showData = open && ready;
  const filteredData = useMemo(() => {
    if (!showData) return [];
    return data.filter((r) => {
      const matchType =
        materialTypeFilter.length === 0 ||
        materialTypeFilter.includes(r.material_type_description ?? '');
      const matchPlant =
        plantFilter === 'All' || String(r.plant) === plantFilter;
      const matchStorage =
        storageFilter === 'All' ||
        (r.storage_loc_desc ?? String(r.storage_loc ?? '')) === storageFilter;
      const matchStatus =
        wipStatusFilter === 'All' ||
        (wipStatusFilter === 'PendingGR' &&
          Number(r.good_received_qty ?? 0) === 0);
      return matchType && matchPlant && matchStorage && matchStatus;
    });
  }, [
    data,
    materialTypeFilter,
    plantFilter,
    storageFilter,
    wipStatusFilter,
    showData,
  ]);

  const totalCells = useMemo(
    () => buildTotalCells(filteredData),
    [filteredData]
  );

  const headers = useMemo(
    () =>
      buildHeaders(
        wipStatusFilter === 'PendingGR' ? 'WIP Qty' : 'Variance Qty'
      ),
    [wipStatusFilter]
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
          maxH="90vh"
          minH="0"
          display="flex"
          flexDirection="column"
        >
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
                WIP Details
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

          <Box
            flex={1}
            overflow="hidden"
            display="flex"
            flexDirection="column"
            minH="90vh"
          >
            <DataTable
              title=""
              headerGradient={gradients.tableBlue}
              headers={headers}
              colAligns={COL_ALIGNS}
              colWidths={COL_WIDTHS}
              pageSize={15}
              minHeight="0"
              height="100%"
              isLoading={!ready}
              headerActions={
                <Flex gap={4} mr="auto">
                  <MultiSelect
                    label="Material Type"
                    placeholder="Select..."
                    value={materialTypeFilter}
                    options={MATERIAL_TYPE_OPTIONS}
                    onChange={setMaterialTypeFilter}
                    isClearable
                    minW="210px"
                  />
                  <Select
                    label="Plant"
                    placeholder="Plant"
                    value={plantFilter}
                    options={plantOptions}
                    onChange={(v) => {
                      setPlantFilter(v || 'All');
                      setStorageFilter('All');
                    }}
                    minW="170px"
                  />
                  <Select
                    label="Storage Location"
                    placeholder="Storage Location"
                    value={storageFilter}
                    options={storageOptions}
                    onChange={(v) => setStorageFilter(v || 'All')}
                    minW="170px"
                  />
                  <Select
                    label="WIP"
                    placeholder="WIP"
                    value={wipStatusFilter}
                    options={[
                      { value: 'All', label: 'All' },
                      { value: 'PendingGR', label: 'Good Received' },
                    ]}
                    onChange={(v) => setWipStatusFilter(v || 'All')}
                    minW="170px"
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
                <DataTableRow
                  key={`${r.order_number ?? ''}-${r['Material Name']}-${i}`}
                  cells={buildCells(r)}
                />
              ))}
            </DataTable>
          </Box>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
