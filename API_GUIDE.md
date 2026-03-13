# API Configuration

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Folder Structure

```
src/
├── api/                    # API hooks and functions
│   ├── sales.ts           # Sales API hooks
│   └── endpoints.ts       # API endpoint definitions
├── config/                 # Configuration files
│   └── axios.ts           # Axios instance with interceptors
├── utils/                  # Utility files
│   └── enum.ts            # Enums for API keys and status
└── providers/              # Provider components
    └── query-provider.tsx # React Query provider
```

## Usage Examples

### Fetching Data

```tsx
import { useGetSales } from '@/api/sales'

function SalesPage() {
  const { data, isLoading, error } = useGetSales({ 
    page: 1, 
    limit: 10 
  })
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading sales</div>
  
  return (
    <div>
      {data?.data.map(sale => (
        <div key={sale.id}>{sale.productName}</div>
      ))}
    </div>
  )
}
```

### Creating Data

```tsx
import { useCreateSale } from '@/api/sales'

function CreateSale() {
  const { mutate, isPending } = useCreateSale()
  
  const handleSubmit = () => {
    mutate({
      productName: "New Product",
      amount: 100,
      status: "pending"
    })
  }
  
  return (
    <button onClick={handleSubmit} disabled={isPending}>
      {isPending ? 'Creating...' : 'Create Sale'}
    </button>
  )
}
```

## Features

✅ Axios interceptors for request/response handling
✅ Automatic auth token injection
✅ Error handling with status code checks
✅ React Query hooks for all CRUD operations
✅ TypeScript types for all API responses
✅ Query caching and invalidation
✅ React Query DevTools integration
✅ Environment variable configuration
