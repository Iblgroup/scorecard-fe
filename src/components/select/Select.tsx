import { Box, Flex, Text } from '@chakra-ui/react';
import ReactSelect, {
  type Props as ReactSelectProps,
  type StylesConfig,
} from 'react-select';
import { colors } from '@/constants/theme';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<
  ReactSelectProps<SelectOption, false>,
  'value' | 'onChange' | 'options'
> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base) => ({
    ...base,
    borderWidth: '2px',
    borderColor: colors.controlBorder,
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    minHeight: '36px',
    boxShadow: 'none',
    w: '100%',
    '&:hover': { borderColor: colors.controlBorderHover },
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
  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    zIndex: 10,
  }),
};

export function Select({
  label,
  value,
  onChange,
  options,
  ...rest
}: SelectProps) {
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
      <Box flex={1} w="100%">
        <ReactSelect<SelectOption, false>
          value={options.find((o) => o.value === value) ?? null}
          onChange={(selected) => onChange(selected?.value ?? '')}
          options={options}
          styles={selectStyles}
          isSearchable
          {...rest}
        />
      </Box>
    </Flex>
  );
}
