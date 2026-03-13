import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, useToken } from '@chakra-ui/react';
import { LuCalendar } from 'react-icons/lu';

export interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: 'outline' | 'range-start' | 'range-end';
  minDate?: string;
}

/**
 * CustomDatePicker — wraps react-datepicker inside Chakra UI's style system.
 * `value` and `onChange` still use ISO date-strings ("YYYY-MM-DD") so all
 * existing call-sites remain unchanged.
 */
export function CustomDatePicker({
  value,
  onChange,
  placeholder = 'mm/dd/yyyy',
  variant = 'outline',
  minDate,
}: DatePickerProps) {
  /* resolve a few Chakra tokens for inline use */
  const [gray200, gray600, blue500] = useToken('colors', [
    'gray.200',
    'gray.600',
    'blue.500',
  ]);

  const selected = value ? new Date(value) : null;

  const handleChange = (date: Date | null) => {
    if (!date) {
      onChange('');
      return;
    }
    // Format as YYYY-MM-DD to keep the same string contract
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
  };

  // Determine border radius based on variant
  const getBorderRadius = () => {
    if (variant === 'range-start') return '8px 0 0 8px';
    if (variant === 'range-end') return '0 8px 8px 0';
    return '8px';
  };

  return (
    <Box
      position="relative"
      display="inline-block"
      css={{
        /* ---- react-datepicker overrides ---- */
        '& .react-datepicker-wrapper': { width: '100%' },

        /* --- input field --- */
        '& .react-datepicker__input-container input': {
          width: '100%',
          fontSize: '14px',
          fontWeight: 500,
          height: '40px',
          paddingInline: '0.75rem',
          paddingRight: variant === 'range-start' ? '0.75rem' : '2rem',
          borderRadius: getBorderRadius(),
          border: '2px solid #e2e8f0', // matches colors.controlBorder
          borderRightWidth: variant === 'range-start' ? '1px' : '2px', // Thin middle separator
          borderLeftWidth: variant === 'range-end' ? '0px' : '2px', // Prevent double border
          outline: 'none',
          background: 'white',
          color: '#334155', // matches colors.bodyText
          transition: 'border-color 0.15s, box-shadow 0.15s',
          '&:focus': {
            borderColor: '#cbd5e1', // matches colors.controlBorderHover
            boxShadow: 'none',
          },
        },

        /* --- calendar popup container --- */
        '& .react-datepicker': {
          fontFamily: 'inherit',
          fontSize: '0.8rem',
          background: 'white',
          border: `1px solid ${gray200}`,
          borderRadius: '0.75rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        },
        '& .react-datepicker__triangle': { display: 'none' },

        /* --- header --- */
        '& .react-datepicker__header': {
          background: 'white',
          borderBottom: `1px solid ${gray200}`,
          paddingTop: '0.75rem',
          paddingBottom: '0.5rem',
        },
        '& .react-datepicker__current-month': {
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#1a202c',
          marginBottom: '0.4rem',
        },
        '& .react-datepicker__day-names': {
          display: 'flex',
          justifyContent: 'space-around',
        },
        '& .react-datepicker__day-name': {
          color: '#a0aec0',
          fontSize: '0.7rem',
          fontWeight: 600,
          width: '2rem',
          lineHeight: '2rem',
          textTransform: 'uppercase',
        },

        /* --- navigation arrows --- */
        '& .react-datepicker__navigation': {
          top: '0.65rem',
        },

        /* --- day cells --- */
        '& .react-datepicker__day': {
          width: '2rem',
          lineHeight: '2rem',
          margin: '0.15rem',
          borderRadius: '0.25rem',
          fontSize: '0.78rem',
          color: '#2d3748',
          transition: 'background 0.12s, color 0.12s',
        },
        '& .react-datepicker__day:hover': {
          background: '#edf2f7',
          borderRadius: '0.25rem',
        },
        '& .react-datepicker__day--selected': {
          background: `${blue500} !important`,
          color: '#ffffff !important',
          borderRadius: '0.25rem',
          fontWeight: 600,
        },
        '& .react-datepicker__day--keyboard-selected:not(.react-datepicker__day--selected)':
          {
            background: 'transparent',
            color: blue500,
          },
        '& .react-datepicker__day--today': {
          fontWeight: 700,
          color: blue500,
        },
        '& .react-datepicker__day--today.react-datepicker__day--selected': {
          background: `${blue500} !important`,
          color: '#ffffff !important',
          fontWeight: 700,
        },
        '& .react-datepicker__day--outside-month': {
          color: '#cbd5e0',
        },
        '& .react-datepicker__day--disabled': {
          color: '#cbd5e0',
          cursor: 'not-allowed',
          opacity: 0.4,
          '&:hover': {
            background: 'transparent',
          },
        },
        '& .react-datepicker__close-icon': {
          right: variant !== 'range-start' ? '28px' : '6px',
        },
        '& .react-datepicker__close-icon::after': {
          background: '#e2e8f0',
          color: '#4a5568',
          fontSize: '0.75rem',
          borderRadius: '9999px',
          padding: '0.1rem 0.35rem',
        },
      }}
    >
      <DatePicker
        selected={selected}
        onChange={handleChange}
        placeholderText={placeholder}
        dateFormat="yyyy-MM-dd"
        isClearable
        showPopperArrow={false}
        minDate={minDate ? new Date(minDate) : undefined}
      />
      {/* calendar icon positioned inside the input */}
      {variant !== 'range-start' && (
        <Box
          position="absolute"
          right="10px"
          top="50%"
          transform="translateY(-50%)"
          pointerEvents="none"
          color={gray600}
          fontSize="sm"
        >
          <LuCalendar />
        </Box>
      )}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* ORIGINAL Chakra-native DatePicker (commented out for future use)    */
/* ------------------------------------------------------------------ */
/*
import { DatePicker, Portal } from '@chakra-ui/react';
import { parseDate } from '@ark-ui/react';
import { LuCalendar } from 'react-icons/lu';

export interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CustomDatePicker({
  value,
  onChange,
  placeholder,
}: DatePickerProps) {
  const parsedValue = (() => {
    if (!value) return [];
    try {
      return [parseDate(value)];
    } catch {
      return [];
    }
  })();

  return (
    <DatePicker.Root
      value={parsedValue}
      onValueChange={(e) => onChange(e.value[0]?.toString() ?? '')}
    >
      <DatePicker.Control>
        <DatePicker.Input placeholder={placeholder} />
        <DatePicker.IndicatorGroup>
          <DatePicker.Trigger>
            <LuCalendar />
          </DatePicker.Trigger>
        </DatePicker.IndicatorGroup>
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.Header />
              <DatePicker.DayTable />
            </DatePicker.View>
            <DatePicker.View view="month">
              <DatePicker.Header />
              <DatePicker.MonthTable />
            </DatePicker.View>
            <DatePicker.View view="year">
              <DatePicker.Header />
              <DatePicker.YearTable />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  );
}
*/
