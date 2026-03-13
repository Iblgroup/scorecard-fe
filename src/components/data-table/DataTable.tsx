import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Skeleton,
  Table,
  Text,
} from '@chakra-ui/react';
import { Children, cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from 'react';
import { FiArrowDown, FiArrowUp, FiChevronDown, FiChevronUp, FiDownload, FiMinus, FiPlus } from 'react-icons/fi';
import { colors, gradients } from '@/constants/theme';
import { TablePagination } from '@/components/pagination';
import * as XLSX from 'xlsx';

export interface SubRowData {
  cells: string[];
  cellColors?: (string | undefined)[];
  cellWeights?: (string | undefined)[];
}

export interface DataTableProps {
  title?: string;
  headerGradient: string;
  headers: string[];
  children: ReactNode;
  pageSize?: number;
  searchable?: boolean;
  isLoading?: boolean;
  collapsible?: boolean;
  rowCollapsible?: boolean;
  maxHeight?: string;
}

function getCellValue(child: ReactNode, col: number): string {
  if (isValidElement(child)) {
    const cells = (child.props as { cells?: string[] }).cells;
    return cells?.[col] ?? '';
  }
  return '';
}

function compareValues(a: string, b: string): number {
  const numA = Number(a.replace(/[^0-9.-]/g, ''));
  const numB = Number(b.replace(/[^0-9.-]/g, ''));
  if (!isNaN(numA) && !isNaN(numB) && a !== '' && b !== '') {
    return numA - numB;
  }
  return a.localeCompare(b);
}

export function DataTable({
  title,
  headerGradient,
  headers,
  children,
  pageSize = 15,
  searchable = true,
  isLoading = false,
  collapsible = false,
  rowCollapsible = false,
  maxHeight,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  let allRows = Children.toArray(children);

  if (searchable && searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    allRows = allRows.filter((row) =>
      headers.some((_, col) => getCellValue(row, col).toLowerCase().includes(q))
    );
  }

  if (sortCol !== null) {
    allRows = [...allRows].sort((a, b) => {
      const valA = getCellValue(a, sortCol);
      const valB = getCellValue(b, sortCol);
      const cmp = compareValues(valA, valB);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }

  const handleSort = (col: number) => {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
    setCurrentPage(1);
  };

  const totalCount = allRows.length;
  const startIndex = (currentPage - 1) * pageSize;
  const pageRows = allRows.slice(startIndex, startIndex + pageSize);
  const showPagination = totalCount > pageSize;

  // Inject showToggleCol into each DataTableRow when rowCollapsible is enabled
  const renderedRows = rowCollapsible
    ? pageRows.map((row, i) =>
        isValidElement(row)
          ? cloneElement(row as ReactElement<DataTableRowProps>, { showToggleCol: true, key: i })
          : row
      )
    : pageRows;

  const handleExport = () => {
    const data = allRows.map((row) =>
      Object.fromEntries(headers.map((h, col) => [h, getCellValue(row, col)]))
    );
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${title ?? 'export'}.xlsx`);
  };

  return (
    <Box
      bg={colors.cardBg}
      backdropFilter="blur(10px)"
      borderRadius="lg"
      boxShadow="md"
    >
      {(title || searchable || collapsible) && (
        <Flex align="center" justify="space-between" px={3} py={2} gap={3}>
          <HStack gap={2} flexShrink={0}>
            {collapsible && (
              <Button
                size="xs"
                variant="ghost"
                px={1}
                color="gray.500"
                _hover={{ color: 'gray.800', bg: 'gray.100' }}
                onClick={() => setIsCollapsed((c) => !c)}
                aria-label={isCollapsed ? 'Expand rows' : 'Collapse rows'}
                title={isCollapsed ? 'Expand rows' : 'Collapse rows'}
              >
                {isCollapsed ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
              </Button>
            )}
            {title && (
              <Text
                fontSize="md"
                fontWeight="black"
                color="gray.800"
                textTransform="uppercase"
                flexShrink={0}
              >
                {title}
              </Text>
            )}
          </HStack>
          <HStack gap={2} ml="auto">
            {searchable && (
              <Input
                size="sm"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                maxW="240px"
                borderRadius="md"
              />
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleExport}
              flexShrink={0}
            >
              <FiDownload /> Export
            </Button>
          </HStack>
        </Flex>
      )}
      <Box
        overflowX="auto"
        overflowY={maxHeight ? 'auto' : undefined}
        maxH={maxHeight}
        css={
          maxHeight
            ? {
                '& thead tr th': {
                  position: 'sticky',
                  top: 0,
                  zIndex: 2,
                  background: headerGradient,
                },
              }
            : undefined
        }
      >
        <Table.Root size="sm" w="full" borderTopRadius="none">
          <Table.Header>
            <Table.Row style={{ background: headerGradient }}>
              {/* Toggle column header — no label, not sortable */}
              {rowCollapsible && <Table.ColumnHeader w="32px" />}
              {headers.map((h, i) => (
                <Table.ColumnHeader
                  key={i}
                  onClick={() => handleSort(i)}
                  cursor="pointer"
                  userSelect="none"
                  _hover={{ opacity: 0.8 }}
                >
                  <HStack gap={1} display="inline-flex">
                    <span>{h}</span>
                    {sortCol === i ? (
                      sortDir === 'asc' ? (
                        <FiArrowUp size={12} />
                      ) : (
                        <FiArrowDown size={12} />
                      )
                    ) : (
                      <Box
                        display="flex"
                        flexDirection="column"
                        opacity={0.35}
                        lineHeight={1}
                      >
                        <FiArrowUp size={9} />
                        <FiArrowDown size={9} />
                      </Box>
                    )}
                  </HStack>
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          {!isCollapsed && (
            <Table.Body>
              {isLoading
                ? Array.from({ length: 10 }).map((_, rowIdx) => (
                    <Table.Row key={rowIdx} opacity={1 - rowIdx * 0.07}>
                      {rowCollapsible && <Table.Cell w="32px" />}
                      {headers.map((_, colIdx) => (
                        <Table.Cell key={colIdx} py={2}>
                          <Skeleton
                            height="12px"
                            width={`${65 + ((rowIdx * 13 + colIdx * 17) % 30)}%`}
                            borderRadius="sm"
                          />
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))
                : renderedRows}
            </Table.Body>
          )}
        </Table.Root>
      </Box>

      {!isCollapsed && showPagination && (
        <HStack
          justify="space-between"
          align="center"
          px={3}
          py={2}
          borderTop="1px solid"
          borderColor="gray.100"
          flexWrap="wrap"
          gap={2}
        >
          <Text fontSize="xs" color="gray.500">
            {startIndex + 1}–{Math.min(startIndex + pageSize, totalCount)} of{' '}
            {totalCount} rows
          </Text>
          <TablePagination
            count={totalCount}
            pageSize={pageSize}
            page={currentPage}
            onPageChange={setCurrentPage}
          />
          <Text fontSize="xs" color="gray.500"></Text>
        </HStack>
      )}
    </Box>
  );
}

export interface DataTableRowProps {
  cells: string[];
  isTotal?: boolean;
  cellColors?: (string | undefined)[];
  cellWeights?: (string | undefined)[];
  subRows?: SubRowData[];
  /** Injected by DataTable when rowCollapsible={true} */
  showToggleCol?: boolean;
}

export function DataTableRow({
  cells,
  isTotal = false,
  cellColors,
  cellWeights,
  subRows,
  showToggleCol = false,
}: DataTableRowProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasSubRows = showToggleCol && subRows && subRows.length > 0;

  return (
    <>
      <Table.Row
        bg={isTotal ? gradients.totalRow : undefined}
        fontWeight={isTotal ? 'bold' : undefined}
        _odd={isTotal ? { bg: gradients.totalRow } : undefined}
        _even={isTotal ? { bg: gradients.totalRow } : undefined}
        _hover={isTotal ? { bg: gradients.totalRow } : undefined}
      >
        {showToggleCol && (
          <Table.Cell w="32px" px={1} py={0} verticalAlign="middle">
            {hasSubRows && (
              <button
                onClick={() => setIsExpanded((e) => !e)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '18px',
                  height: '18px',
                  borderRadius: '3px',
                  border: '1px solid #cbd5e1',
                  background: isExpanded ? '#dbeafe' : '#f8fafc',
                  cursor: 'pointer',
                  color: '#2563eb',
                  flexShrink: 0,
                }}
              >
                {isExpanded ? <FiMinus size={10} /> : <FiPlus size={10} />}
              </button>
            )}
          </Table.Cell>
        )}
        {cells.map((cell, i) => (
          <Table.Cell
            key={i}
            color={cellColors?.[i]}
            fontWeight={cellWeights?.[i]}
          >
            {cell}
          </Table.Cell>
        ))}
      </Table.Row>

      {hasSubRows && isExpanded &&
        subRows!.map((sub, i) => (
          <Table.Row key={i} bg="gray.50" _hover={{ bg: 'gray.100' }}>
            {/* indent spacer */}
            <Table.Cell w="32px" px={1} />
            {sub.cells.map((cell, j) => (
              <Table.Cell
                key={j}
                fontSize="xs"
                color={sub.cellColors?.[j] ?? 'gray.500'}
                fontWeight={sub.cellWeights?.[j]}
                py={1}
                pl={j === 0 ? 4 : undefined}
              >
                {cell}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
    </>
  );
}
