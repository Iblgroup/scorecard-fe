import { createSystem, defaultConfig } from '@chakra-ui/react';
import { colors } from './colors';
import { tableSlotRecipe } from '@/components/table/table.recipe';
import { inputRecipe } from '@/components/input';
import { buttonRecipe } from '@/components/button';
import { paginationSlotRecipe } from '@/components/pagination';

const customConfig = {
  theme: {
    tokens: {
      colors,
      fonts: {
        heading: {
          value: `'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
        },
        body: {
          value: `'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
        },
        mono: {
          value: `'Roboto Mono', 'Fira Code', 'Consolas', 'Monaco', monospace`,
        },
      },
    },
    recipes: {
      input: inputRecipe,
      button: buttonRecipe,
    },
    slotRecipes: {
      table: tableSlotRecipe,
      pagination: paginationSlotRecipe,
    },
  },
};

export const system = createSystem(defaultConfig, customConfig);
