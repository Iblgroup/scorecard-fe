import { Box, Flex, Text, Tooltip } from '@chakra-ui/react';
import ReactSelect, {
  components,
  type ValueContainerProps,
  type StylesConfig,
  type Props as ReactSelectProps,
} from 'react-select';
import { colors } from '@/constants/theme';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps extends Omit<
  ReactSelectProps<SelectOption, true>,
  'value' | 'onChange' | 'options'
> {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectOption[];
}

const BADGE_WIDTH = 44; // approximate width of "+N" badge
const INPUT_MIN = 24; // minimum width to keep the input usable
const CHIP_GAP = 4; // gap between chips

function OverflowValueContainer(
  props: ValueContainerProps<SelectOption, true>
) {
  const [visibleCount, setVisibleCount] = useState<number>(
    Number.MAX_SAFE_INTEGER
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLElement | null)[]>([]);

  const childArray = React.Children.toArray(props.children);
  const input = childArray[childArray.length - 1]; // always last
  const allChips = childArray.slice(0, childArray.length - 1);

  const showCount = Math.min(visibleCount, allChips.length);
  const overflowCount = allChips.length - showCount;

  const hiddenLabels = allChips
    .slice(showCount)
    .map(
      (c) =>
        (c as React.ReactElement<{ data?: SelectOption }>).props?.data?.label
    )
    .filter(Boolean)
    .join(', ');

  const calculate = useCallback(() => {
    const container = containerRef.current;
    if (!container || allChips.length === 0) return;

    const containerW = container.offsetWidth;
    let used = INPUT_MIN;
    let count = 0;

    for (let i = 0; i < allChips.length; i++) {
      const el = chipRefs.current[i];
      if (!el) break;

      const chipW = el.offsetWidth + CHIP_GAP;
      // Reserve badge space unless this is the very last chip
      const reserve = i < allChips.length - 1 ? BADGE_WIDTH : 0;

      if (used + chipW + reserve > containerW) break;
      used += chipW;
      count++;
    }

    const next = Math.max(1, count);
    setVisibleCount((prev) => (prev === next ? prev : next));
  }, [allChips.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    calculate();
    const ro = new ResizeObserver(calculate);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [calculate]);

  return (
    <components.ValueContainer {...props}>
      {/*
        Wrapper measured by ResizeObserver.
        All chips are always rendered here so chipRefs stay stable.
        Overflow chips are rendered absolute+invisible so we can measure
        their width without affecting the visible layout.
      */}
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          // overflow: 'hidden',
          position: 'relative',
          minWidth: 0,
        }}
      >
        {allChips.map((chip, i) => (
          <div
            key={i}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
            style={
              i >= showCount
                ? {
                    position: 'absolute',
                    visibility: 'hidden',
                    pointerEvents: 'none',
                  }
                : { flexShrink: 0 }
            }
          >
            {chip}
          </div>
        ))}

        {overflowCount > 0 && (
          <Tooltip.Root positioning={{ placement: 'top' }}>
            <Tooltip.Trigger asChild>
              <Box
                display="inline-flex"
                alignItems="center"
                px="6px"
                py="5px"
                borderRadius="4px"
                bg={`${colors.selectActive}18`}
                border="1px solid"
                borderColor={`${colors.selectActive}30`}
                cursor="default"
                flexShrink={0}
                mx="2px"
              >
                <Text
                  fontSize="12px"
                  fontWeight="700"
                  color={colors.selectActive}
                  lineHeight={1}
                >
                  +{overflowCount}
                </Text>
              </Box>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content
                bg="gray.100"
                color="gray.800"
                borderRadius="6px"
                px="10px"
                py="6px"
                fontSize="12px"
                fontWeight="500"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.200"
              >
                {hiddenLabels}
              </Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
        )}

        {input}
      </div>
    </components.ValueContainer>
  );
}

const multiSelectStyles: StylesConfig<SelectOption, true> = {
  control: (base) => ({
    ...base,
    borderWidth: '2px',
    borderColor: colors.controlBorder,
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    minHeight: '36px',
    boxShadow: 'none',
    flexWrap: 'nowrap',
    '&:hover': { borderColor: colors.controlBorderHover },
  }),
  valueContainer: (base) => ({
    ...base,
    flexWrap: 'nowrap',
    overflow: 'visible',
  }),
  option: (base, state) => ({
    ...base,
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor: state.isSelected ? colors.selectActive : 'white',
    color: state.isSelected ? 'white' : colors.bodyText,
    '&:hover': {
      backgroundColor: state.isSelected
        ? colors.selectActive
        : colors.selectOptionHover,
    },
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: `${colors.selectActive}18`,
    borderRadius: '4px',
    flexShrink: 0,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: colors.selectActive,
    fontSize: '12px',
    fontWeight: 600,
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: colors.selectActive,
    '&:hover': {
      backgroundColor: `${colors.selectActive}30`,
      color: colors.selectActive,
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    zIndex: 10,
  }),
};

const customComponents = { ValueContainer: OverflowValueContainer };

export function MultiSelect({
  label,
  value,
  onChange,
  options,
  ...rest
}: MultiSelectProps) {
  return (
    <Flex direction="row" gap={3} alignItems="center">
      {label && (
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="gray.500"
          textTransform="uppercase"
          whiteSpace="nowrap"
        >
          {label}
        </Text>
      )}
      <Box flex={1} w="100%" minW={0}>
        <ReactSelect<SelectOption, true>
          isMulti
          value={options.filter((o) => value.includes(o.value))}
          onChange={(selected) =>
            onChange(selected ? selected.map((o) => o.value) : [])
          }
          options={options}
          styles={multiSelectStyles}
          components={customComponents}
          isSearchable
          closeMenuOnSelect={false}
          {...rest}
        />
      </Box>
    </Flex>
  );
}
