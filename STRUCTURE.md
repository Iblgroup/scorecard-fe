# Project Structure

## 📁 Complete Architecture

```
src/
├── pages/                   # Page Components (lazy loaded)
│   ├── HomePage.tsx        # Main home page (/)
│   ├── NotFoundPage.tsx    # 404 page
│   └── ErrorPage.tsx       # Error page
│
├── components/              # UI Components (with co-located styles)
│   ├── button/
│   │   ├── Button.tsx
│   │   ├── button.recipe.ts
│   │   └── index.ts
│   ├── input/
│   │   ├── Input.tsx
│   │   ├── input.recipe.ts
│   │   └── index.ts
│   ├── table/
│   │   ├── Table.tsx
│   │   ├── table.recipe.ts
│   │   └── index.ts
│   └── ErrorBoundary.tsx    # Error boundary component
│
├── theme/                   # Global Theme Configuration
│   ├── colors.ts
│   ├── color-mode.tsx
│   └── theme.ts
│
├── providers/               # Provider Components
│   └── chakra-provider.tsx
│
├── app/                     # Redux Store
│   ├── hooks.ts
│   └── store.ts
│
├── features/                # Redux Features
│   └── counter/
│       └── counterSlice.ts
│
├── App.tsx                  # Router setup
└── main.tsx                 # Entry point
```

## 🎯 Pages Architecture

### Pages Folder
All page components live in `src/pages/`:
- **HomePage.tsx** - Main landing page (/)
- **NotFoundPage.tsx** - 404 error page
- **ErrorPage.tsx** - Generic error page

### Lazy Loading
Pages are lazy loaded using `React.lazy()` for better performance:
```tsx
const HomePage = lazy(() => import('@/pages/HomePage'))
```

### Error Handling
Two layers of error handling:
1. **ErrorBoundary** - Catches React component errors
2. **ErrorPage** - Handles router-level errors

## 🚀 Routing

### React Router v7
Using `createBrowserRouter` for advanced routing:

```tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
```

### Features
✅ Lazy loading for all pages
✅ Loading fallback with spinner
✅ 404 error handling
✅ Error boundary for React errors
✅ Router error element

## 📝 Import Patterns

### Pages
```tsx
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
```

### Components
```tsx
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Table } from '@/components/table'
```

### Theme & Providers
```tsx
import { useColorMode } from '@/theme/color-mode'
import { Provider } from '@/providers/chakra-provider'
```

## 🎨 Component Recipe Pattern

Each UI component has its own recipe file:
- Co-located with component
- Uses `defineRecipe` from Chakra UI v3
- Type-safe styling

This structure provides:
✅ Clean separation of concerns
✅ Performance optimization (lazy loading)
✅ Robust error handling
✅ Scalable routing architecture
