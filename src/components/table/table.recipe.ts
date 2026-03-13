import { defineSlotRecipe } from '@chakra-ui/react';
import { tableAnatomy } from '@chakra-ui/react/anatomy';

export const tableSlotRecipe = defineSlotRecipe({
  className: 'chakra-table',
  slots: tableAnatomy.keys(),
  base: {
    root: {
      fontVariantNumeric: 'lining-nums tabular-nums',
      borderCollapse: 'collapse',
      width: 'full',
      textAlign: 'start',
      verticalAlign: 'top',
      overflow: 'hidden',
      borderRadius: 'lg',
    },
    row: {
      _selected: {
        bg: 'colorPalette.subtle',
      },
    },
    cell: {
      textAlign: 'start',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      '&:first-of-type': {
        fontWeight: 'bold',
      },
    },
    columnHeader: {
      fontWeight: 'medium',
      textAlign: 'start',
      color: 'fg',
      whiteSpace: 'nowrap',
    },
    caption: {
      fontWeight: 'medium',
      textStyle: 'xs',
    },
    footer: {
      fontWeight: 'medium',
    },
  },

  variants: {
    interactive: {
      true: {
        body: {
          '& tr': {
            _hover: {
              bg: 'colorPalette.subtle',
            },
          },
        },
      },
    },

    stickyHeader: {
      true: {
        header: {
          '& :where(tr)': {
            top: 'var(--table-sticky-offset, 0)',
            position: 'sticky',
            zIndex: 1,
          },
        },
      },
    },

    striped: {
      true: {
        row: {
          '&:nth-of-type(odd) td': {
            bg: 'bg.muted',
          },
        },
      },
    },

    showColumnBorder: {
      true: {
        columnHeader: {
          '&:not(:last-of-type)': {
            borderInlineEndWidth: '1px',
          },
        },
        cell: {
          '&:not(:last-of-type)': {
            borderInlineEndWidth: '1px',
          },
        },
      },
    },

    variant: {
      primary: {
        header: {
          bg: 'primary.600',
          _dark: {
            bg: 'primary.700',
          },
        },
        columnHeader: {
          bg: 'primary.600',
          _dark: {
            bg: 'primary.700',
          },
          color: 'white',
          fontWeight: 'bold',
          borderBottomWidth: '0',
        },
        cell: {
          color: 'gray.700',
          _dark: {
            borderColor: 'gray.700',
            color: 'gray.200',
          },
        },
        row: {
          borderBottomWidth: '1px',
          borderColor: 'gray.200',
          _last: {
            borderBottomWidth: 0,
          },
          _odd: {
            bg: 'white',
            _dark: {
              bg: 'gray.800',
            },
          },
          _even: {
            bg: '#f8fafc',
            _dark: {
              bg: 'gray.750',
            },
          },
          _hover: {
            bg: '#dbeafe',
            _dark: {
              bg: 'primary.900/20',
            },
          },
          transition: 'background 0.15s ease',
        },
      },
    },

    size: {
      sm: {
        root: {
          textStyle: 'sm',
        },
        columnHeader: {
          px: '2',
          py: '2',
        },
        cell: {
          px: '2',
          py: '2',
        },
      },

      md: {
        root: {
          textStyle: 'sm',
        },
        columnHeader: {
          px: '3',
          py: '3',
        },
        cell: {
          px: '3',
          py: '3',
        },
      },

      lg: {
        root: {
          textStyle: 'md',
        },
        columnHeader: {
          px: '4',
          py: '3',
        },
        cell: {
          px: '4',
          py: '3',
        },
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'sm',
  },
});
