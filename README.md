# React + Vite + Chakra UI + Redux Toolkit Boilerplate

A modern React boilerplate with Vite, Chakra UI, and Redux Toolkit.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Chakra UI** - Component library
- **Redux Toolkit** - State management
- **ESLint** - Code linting

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
react-chakra-redux/
├── public/              # Static assets
├── src/
│   ├── app/            # Redux store configuration
│   │   ├── store.ts    # Store setup
│   │   └── hooks.ts    # Typed Redux hooks
│   ├── features/       # Redux slices
│   │   └── counter/    # Example counter feature
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # App entry point
│   └── vite-env.d.ts   # Vite type definitions
└── ...config files
```

## Features

- ✅ Hot Module Replacement (HMR)
- ✅ TypeScript support
- ✅ Chakra UI with dark mode
- ✅ Redux Toolkit for state management
- ✅ Typed Redux hooks
- ✅ ESLint configuration
- ✅ Example counter slice

## Adding New Features

1. Create a new slice in `src/features/[feature-name]/[feature-name]Slice.ts`
2. Add the reducer to the store in `src/app/store.ts`
3. Use the typed hooks (`useAppDispatch`, `useAppSelector`) in your components

## Customization

### Chakra UI Theme

To customize the Chakra UI theme, create a `src/theme.ts` file and pass it to `ChakraProvider`:

```typescript
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  // your customizations
})

// In main.tsx
<ChakraProvider theme={theme}>
```

### Redux DevTools

Redux DevTools are automatically enabled in development mode.

## License

MIT
